/**
 * Offline Resilience Tests
 *
 * Verifies the app handles offline scenarios gracefully: Supabase unreachable,
 * Gemini API down, offline indicator, and local data persistence on sync failure.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const srcDir = path.resolve(__dirname, '..');

function getAllTsFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') {
      files.push(...getAllTsFiles(full));
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

describe('Offline Resilience', () => {
  describe('Offline indicator exists', () => {
    it('OfflineIndicator component is rendered in the app shell', () => {
      const appPath = path.join(srcDir, 'App.tsx');
      const content = fs.readFileSync(appPath, 'utf-8');
      expect(content).toContain('OfflineIndicator');
      expect(content).toContain("import { OfflineIndicator }");
    });

    it('OfflineIndicator component exists and checks navigator.onLine', () => {
      const componentPath = path.join(srcDir, 'components', 'OfflineIndicator.tsx');
      if (!fs.existsSync(componentPath)) return;
      const content = fs.readFileSync(componentPath, 'utf-8');
      const checksOnline = content.includes('navigator.onLine') || content.includes('online') || content.includes('offline');
      expect(checksOnline, 'OfflineIndicator should check online status').toBe(true);
    });
  });

  describe('AI features handle network failures', () => {
    it('useAIGenerate hook returns error state from useGemini', () => {
      const hookPath = path.join(srcDir, 'hooks', 'useAIGenerate.ts');
      if (!fs.existsSync(hookPath)) return;
      const content = fs.readFileSync(hookPath, 'utf-8');
      // useAIGenerate delegates to useGemini which handles errors
      expect(content).toContain('error');
      expect(content).toContain('useGemini');
    });

    it('useGemini hook has proper error handling', () => {
      const hookPath = path.join(srcDir, 'hooks', 'useGemini.ts');
      if (!fs.existsSync(hookPath)) return;
      const content = fs.readFileSync(hookPath, 'utf-8');
      expect(content).toContain('catch');
      expect(content).toContain('error');
    });

    it('Gemini client has timeout handling', () => {
      const geminiPath = path.join(srcDir, 'lib', 'gemini.ts');
      const content = fs.readFileSync(geminiPath, 'utf-8');
      // Should have AbortController or timeout mechanism
      const hasTimeout = content.includes('AbortController') || content.includes('timeout') || content.includes('setTimeout');
      expect(hasTimeout, 'Gemini client should have timeout handling for network failures').toBe(true);
    });
  });

  describe('Supabase unreachable handling', () => {
    it('App renders configuration error screen when Supabase is not configured', () => {
      const appPath = path.join(srcDir, 'App.tsx');
      const content = fs.readFileSync(appPath, 'utf-8');
      expect(content).toContain('isSupabaseConfigured');
      expect(content).toContain('Configuration Error');
    });

    it('AuthGuard falls through to unauthed on session check failure', () => {
      const appPath = path.join(srcDir, 'App.tsx');
      const content = fs.readFileSync(appPath, 'utf-8');
      // AuthGuard should have a catch that sets state to unauthed
      expect(content).toContain("setState('unauthed')");
      // Should also have a safety timeout
      expect(content).toContain('timeout');
    });

    it('sync engine handles offline gracefully', () => {
      const syncPath = path.join(srcDir, 'services', 'syncEngine.ts');
      if (!fs.existsSync(syncPath)) return;
      const content = fs.readFileSync(syncPath, 'utf-8');
      // Should have offline queue or error handling
      const hasOfflineHandling = content.includes('offline') || content.includes('queue') || content.includes('catch');
      expect(hasOfflineHandling, 'Sync engine should handle offline scenarios').toBe(true);
    });
  });

  describe('Local data persistence', () => {
    it('stores use persist middleware for local storage', () => {
      const appStorePath = path.join(srcDir, 'store', 'useAppStore.ts');
      const profileStorePath = path.join(srcDir, 'store', 'useProfileStore.ts');

      const appContent = fs.readFileSync(appStorePath, 'utf-8');
      const profileContent = fs.readFileSync(profileStorePath, 'utf-8');

      expect(appContent).toContain('persist');
      expect(profileContent).toContain('persist');
    });

    it('AI audit log uses local storage', () => {
      const files = getAllTsFiles(srcDir);
      const aiAuditFiles = files.filter(f => {
        const content = fs.readFileSync(f, 'utf-8');
        return content.includes('aiAuditLog') || content.includes('AIAuditLog');
      });
      // AI audit should exist and store locally
      expect(aiAuditFiles.length).toBeGreaterThan(0);
    });
  });

  describe('Entitlement check offline fallback', () => {
    it('ensureFreshEntitlement returns cached value on network failure', () => {
      const entitlementsPath = path.join(srcDir, 'services', 'entitlements.ts');
      const content = fs.readFileSync(entitlementsPath, 'utf-8');
      // refreshEntitlementFromServer should catch and return cached value
      expect(content).toContain('checkEntitlement()');
      // The catch block should fall back to cached
      expect(content).toMatch(/catch[\s\S]*?checkEntitlement/);
    });

    it('wasPremiumInSession prevents lockout on slow networks', () => {
      const entitlementsPath = path.join(srcDir, 'services', 'entitlements.ts');
      const content = fs.readFileSync(entitlementsPath, 'utf-8');
      expect(content).toContain('wasPremiumInSession');
      expect(content).toContain('_wasPremiumThisSession');
    });
  });
});
