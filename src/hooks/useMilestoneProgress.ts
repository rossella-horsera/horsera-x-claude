/**
 * useMilestoneProgress
 *
 * Stores milestone progress overrides in localStorage so that skill rings
 * update after video upload or trainer feedback — without a backend.
 *
 * Once real Supabase data is connected, replace localStorage reads/writes
 * with Supabase queries and this hook becomes a thin wrapper.
 */

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'horsera_milestone_progress';

interface MilestoneOverride {
  ridesConsistent: number;
  lastUpdated: string; // ISO date
}

type ProgressMap = Record<string, MilestoneOverride>;

function readOverrides(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeOverrides(map: ProgressMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

export function useMilestoneProgress() {
  const [overrides, setOverrides] = useState<ProgressMap>(readOverrides);

  /**
   * Increment ridesConsistent for a milestone, capped at ridesRequired.
   * Does not decrement. Only increases.
   */
  const incrementProgress = useCallback((milestoneId: string, currentConsistent: number, required: number) => {
    const next = Math.min(currentConsistent + 1, required);
    const updated: ProgressMap = {
      ...readOverrides(),
      [milestoneId]: { ridesConsistent: next, lastUpdated: new Date().toISOString() },
    };
    writeOverrides(updated);
    setOverrides(updated);
    return next;
  }, []);

  /**
   * Get the effective ridesConsistent for a milestone.
   * Returns the stored override if it's higher than the mock value.
   */
  const getEffectiveProgress = useCallback((milestoneId: string, mockConsistent: number): number => {
    const override = overrides[milestoneId];
    if (!override) return mockConsistent;
    return Math.max(override.ridesConsistent, mockConsistent);
  }, [overrides]);

  return { incrementProgress, getEffectiveProgress, overrides };
}
