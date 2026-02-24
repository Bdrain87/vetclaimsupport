import { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useProfileStore } from '@/store/useProfileStore';
import {
  enableEncryption,
  verifyPassword,
  isEncryptionEnabled,
  validatePasswordStrength,
} from '@/utils/encryption';
import { setSessionPassword } from '@/lib/encryptedStorage';

export function VaultPasscode() {
  const { toast } = useToast();
  const profile = useProfileStore();
  const isEnabled = isEncryptionEnabled();

  const [mode, setMode] = useState<'idle' | 'set' | 'change' | 'remove'>('idle');
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const strength = newPasscode ? validatePasswordStrength(newPasscode) : null;

  const resetForm = () => {
    setMode('idle');
    setCurrentPasscode('');
    setNewPasscode('');
    setConfirmPasscode('');
    setShowCurrent(false);
    setShowNew(false);
  };

  const handleSetPasscode = async () => {
    if (newPasscode !== confirmPasscode) {
      toast({ title: 'Mismatch', description: 'Passcodes do not match.', variant: 'destructive' });
      return;
    }
    if (!strength?.isValid) {
      toast({ title: 'Weak Passcode', description: 'Please use a stronger passcode.', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    try {
      await enableEncryption(newPasscode);
      setSessionPassword(newPasscode);
      profile.setVaultPasscodeSet(true);
      toast({ title: 'Vault Enabled', description: 'Your data is now encrypted.' });
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to enable encryption.', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangePasscode = async () => {
    if (!currentPasscode) {
      toast({ title: 'Required', description: 'Enter your current passcode.', variant: 'destructive' });
      return;
    }
    const valid = await verifyPassword(currentPasscode);
    if (!valid) {
      toast({ title: 'Incorrect', description: 'Current passcode is wrong.', variant: 'destructive' });
      return;
    }
    if (newPasscode !== confirmPasscode) {
      toast({ title: 'Mismatch', description: 'Passcodes do not match.', variant: 'destructive' });
      return;
    }
    if (!strength?.isValid) {
      toast({ title: 'Weak Passcode', description: 'Please use a stronger passcode.', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    try {
      await enableEncryption(newPasscode);
      setSessionPassword(newPasscode);
      toast({ title: 'Passcode Changed', description: 'Your vault passcode has been updated.' });
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to change passcode.', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePasscode = async () => {
    if (!currentPasscode) {
      toast({ title: 'Required', description: 'Enter your current passcode.', variant: 'destructive' });
      return;
    }
    const valid = await verifyPassword(currentPasscode);
    if (!valid) {
      toast({ title: 'Incorrect', description: 'Current passcode is wrong.', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    try {
      // Remove the Layer 2 passcode hash but keep the password-hash key
      // cleared.  Base-layer encryption (Layer 1) remains always on.
      localStorage.removeItem('vet-claim-password-hash');
      profile.setVaultPasscodeSet(false);
      toast({ title: 'Passcode Removed', description: 'Your additional passcode has been removed. Your data remains automatically encrypted.' });
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to remove passcode.', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Vault Passcode
        </CardTitle>
        <CardDescription>
          {isEnabled
            ? 'Your data is automatically encrypted. An additional vault passcode is active for extra protection.'
            : 'Your data is automatically encrypted. Set an additional passcode for extra protection.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === 'idle' && (
          <div className="flex flex-col gap-2">
            {!isEnabled ? (
              <Button onClick={() => setMode('set')} className="w-full">
                <Lock className="mr-2 h-4 w-4" />
                Set Vault Passcode
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setMode('change')} className="w-full">
                  <Lock className="mr-2 h-4 w-4" />
                  Change Passcode
                </Button>
                <Button variant="outline" onClick={() => setMode('remove')} className="w-full text-destructive hover:text-destructive">
                  <Unlock className="mr-2 h-4 w-4" />
                  Remove Passcode
                </Button>
              </>
            )}
          </div>
        )}

        {mode === 'set' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="new-passcode">New Passcode</Label>
              <div className="relative">
                <Input
                  id="new-passcode"
                  type={showNew ? 'text' : 'password'}
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  placeholder="Enter a strong passcode"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  aria-label={showNew ? 'Hide passcode' : 'Show passcode'}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {strength && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < strength.score
                            ? strength.score >= 4 ? 'bg-emerald-500' : strength.score >= 2 ? 'bg-gold' : 'bg-red-500'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  {strength.feedback.length > 0 && (
                    <p className="text-xs text-muted-foreground">{strength.feedback[0]}</p>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-passcode">Confirm Passcode</Label>
              <Input
                id="confirm-passcode"
                type="password"
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                placeholder="Confirm passcode"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm} className="flex-1">Cancel</Button>
              <Button onClick={handleSetPasscode} disabled={isProcessing} className="flex-1">
                {isProcessing ? 'Encrypting...' : 'Enable Encryption'}
              </Button>
            </div>
          </div>
        )}

        {mode === 'change' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="current-passcode-change">Current Passcode</Label>
              <div className="relative">
                <Input
                  id="current-passcode-change"
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPasscode}
                  onChange={(e) => setCurrentPasscode(e.target.value)}
                  placeholder="Enter current passcode"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  aria-label={showCurrent ? 'Hide passcode' : 'Show passcode'}
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-passcode-change">New Passcode</Label>
              <div className="relative">
                <Input
                  id="new-passcode-change"
                  type={showNew ? 'text' : 'password'}
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  placeholder="Enter new passcode"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  aria-label={showNew ? 'Hide passcode' : 'Show passcode'}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {strength && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < strength.score
                            ? strength.score >= 4 ? 'bg-emerald-500' : strength.score >= 2 ? 'bg-gold' : 'bg-red-500'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  {strength.feedback.length > 0 && (
                    <p className="text-xs text-muted-foreground">{strength.feedback[0]}</p>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-passcode-change">Confirm New Passcode</Label>
              <Input
                id="confirm-passcode-change"
                type="password"
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                placeholder="Confirm new passcode"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm} className="flex-1">Cancel</Button>
              <Button onClick={handleChangePasscode} disabled={isProcessing} className="flex-1">
                {isProcessing ? 'Updating...' : 'Change Passcode'}
              </Button>
            </div>
          </div>
        )}

        {mode === 'remove' && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 space-y-2">
              <p className="text-sm text-destructive font-medium">
                This is a security action.
              </p>
              <p className="text-xs text-muted-foreground">
                Removing the additional passcode will remove the extra protection layer.
                Your data will remain automatically encrypted (Layer 1). Your device is still
                protected by iOS passcode/Face ID.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="current-passcode-remove">Current Passcode</Label>
              <div className="relative">
                <Input
                  id="current-passcode-remove"
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPasscode}
                  onChange={(e) => setCurrentPasscode(e.target.value)}
                  placeholder="Enter current passcode"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  aria-label={showCurrent ? 'Hide passcode' : 'Show passcode'}
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm} className="flex-1">Cancel</Button>
              <Button variant="destructive" onClick={handleRemovePasscode} disabled={isProcessing} className="flex-1">
                {isProcessing ? 'Removing...' : 'Remove Passcode'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
