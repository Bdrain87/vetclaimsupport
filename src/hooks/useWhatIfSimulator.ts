import { useState, useMemo, useCallback } from 'react';
import useAppStore from '@/store/useAppStore';

interface SimulatedCondition {
  id: string;
  name: string;
  currentRating: number;
  simulatedRating: number;
  bodyPart?: string;
}

interface SimulationResult {
  currentCombined: number;
  simulatedCombined: number;
  difference: number;
}

function combineVARatings(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sorted = [...ratings].sort((a, b) => b - a);
  let combined = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const remaining = 100 - combined;
    combined = combined + (remaining * sorted[i]) / 100;
  }
  return Math.round(combined / 10) * 10;
}

export function useWhatIfSimulator() {
  const approvedConditions = useAppStore((s) => s.approvedConditions);
  const userConditions = useAppStore((s) => s.userConditions);

  const baseConditions: SimulatedCondition[] = useMemo(() => {
    const fromApproved = approvedConditions.map((c) => ({
      id: c.id,
      name: c.name,
      currentRating: c.rating,
      simulatedRating: c.rating,
      bodyPart: c.bodyPart,
    }));

    const fromUser = userConditions
      .filter((c) => c.rating && c.rating > 0)
      .filter((c) => !approvedConditions.some((a) => a.id === c.id))
      .map((c) => ({
        id: c.id,
        name: c.conditionId,
        currentRating: c.rating!,
        simulatedRating: c.rating!,
        bodyPart: c.bodyPart,
      }));

    return [...fromApproved, ...fromUser];
  }, [approvedConditions, userConditions]);

  const [conditions, setConditions] = useState<SimulatedCondition[]>(baseConditions);
  const [additionalConditions, setAdditionalConditions] = useState<SimulatedCondition[]>([]);

  const updateSimulatedRating = useCallback((id: string, rating: number) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, simulatedRating: rating } : c)),
    );
  }, []);

  const addSimulatedCondition = useCallback((name: string, rating: number, bodyPart?: string) => {
    setAdditionalConditions((prev) => [
      ...prev,
      {
        id: `sim-${Date.now()}`,
        name,
        currentRating: 0,
        simulatedRating: rating,
        bodyPart,
      },
    ]);
  }, []);

  const removeSimulatedCondition = useCallback((id: string) => {
    setAdditionalConditions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const resetSimulation = useCallback(() => {
    setConditions(baseConditions);
    setAdditionalConditions([]);
  }, [baseConditions]);

  const result: SimulationResult = useMemo(() => {
    const currentRatings = conditions
      .map((c) => c.currentRating)
      .filter((r) => r > 0);
    const simulatedRatings = [
      ...conditions.map((c) => c.simulatedRating),
      ...additionalConditions.map((c) => c.simulatedRating),
    ].filter((r) => r > 0);

    const currentCombined = combineVARatings(currentRatings);
    const simulatedCombined = combineVARatings(simulatedRatings);

    return {
      currentCombined,
      simulatedCombined,
      difference: simulatedCombined - currentCombined,
    };
  }, [conditions, additionalConditions]);

  return {
    conditions,
    additionalConditions,
    updateSimulatedRating,
    addSimulatedCondition,
    removeSimulatedCondition,
    resetSimulation,
    result,
  };
}
