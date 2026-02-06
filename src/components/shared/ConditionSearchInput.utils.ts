import { vaDisabilitiesBySystem } from '@/data/vaDisabilities';

// Helper to get diagnostic code for a condition name
export function getDiagnosticCodeForCondition(conditionName: string): { code: string; name: string } | null {
  const lower = conditionName.toLowerCase();

  for (const system of vaDisabilitiesBySystem) {
    for (const condition of system.conditions) {
      if (condition.name.toLowerCase() === lower) {
        return { code: condition.diagnosticCode, name: condition.name };
      }
    }
  }

  // Fuzzy match
  for (const system of vaDisabilitiesBySystem) {
    for (const condition of system.conditions) {
      if (condition.name.toLowerCase().includes(lower) || lower.includes(condition.name.toLowerCase())) {
        return { code: condition.diagnosticCode, name: condition.name };
      }
    }
  }

  return null;
}
