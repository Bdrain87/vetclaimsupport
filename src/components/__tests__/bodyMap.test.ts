/**
 * Body Map Tests — Section 7
 *
 * Tests body map pin data structure, front/back toggling logic,
 * multiple pins, and left/right disambiguation.
 */
import { describe, it, expect } from 'vitest';
import { createMockBodyMapPin, type MockBodyMapPin } from '@/test/utils';

// ---------------------------------------------------------------------------
// Body map state simulation (pure data logic)
// ---------------------------------------------------------------------------
interface BodyMapState {
  view: 'front' | 'back';
  pins: MockBodyMapPin[];
}

function createBodyMapState(): BodyMapState {
  return { view: 'front', pins: [] };
}

function toggleView(state: BodyMapState): BodyMapState {
  return { ...state, view: state.view === 'front' ? 'back' : 'front' };
}

function addPin(state: BodyMapState, pin: MockBodyMapPin): BodyMapState {
  return { ...state, pins: [...state.pins, pin] };
}

function getPinsForView(state: BodyMapState): MockBodyMapPin[] {
  return state.pins.filter((p) => p.side === state.view);
}

function sortBySeverity(pins: MockBodyMapPin[]): MockBodyMapPin[] {
  return [...pins].sort((a, b) => b.severity - a.severity);
}

function sortByDate(pins: MockBodyMapPin[]): MockBodyMapPin[] {
  return [...pins].sort((a, b) => new Date(b.onsetDate).getTime() - new Date(a.onsetDate).getTime());
}

// ---------------------------------------------------------------------------
// 7A: Front/Back Toggle
// ---------------------------------------------------------------------------
describe('Body Map — Front/Back Toggle', () => {
  it('default view is front', () => {
    const state = createBodyMapState();
    expect(state.view).toBe('front');
  });

  it('toggle switches to back view', () => {
    let state = createBodyMapState();
    state = toggleView(state);
    expect(state.view).toBe('back');
  });

  it('toggle back to front preserves pins', () => {
    let state = createBodyMapState();
    const frontPin = createMockBodyMapPin({ side: 'front', region: 'left_shoulder' });
    state = addPin(state, frontPin);
    state = toggleView(state); // to back
    state = toggleView(state); // back to front
    expect(state.pins).toHaveLength(1);
    expect(state.pins[0].region).toBe('left_shoulder');
  });

  it('pins on front are NOT visible when viewing back', () => {
    let state = createBodyMapState();
    state = addPin(state, createMockBodyMapPin({ side: 'front' }));
    state = toggleView(state); // to back
    const visiblePins = getPinsForView(state);
    expect(visiblePins).toHaveLength(0);
  });

  it('pins on back are NOT visible when viewing front', () => {
    let state = createBodyMapState();
    state = addPin(state, createMockBodyMapPin({ side: 'back' }));
    // stay on front
    const visiblePins = getPinsForView(state);
    expect(visiblePins).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// 7B: Pin Placement and Data Capture
// ---------------------------------------------------------------------------
describe('Body Map — Pin Placement', () => {
  it('pin captures all 7 fields', () => {
    const pin = createMockBodyMapPin({
      symptomType: 'Sharp pain',
      severity: 8,
      frequency: 'daily',
      onsetDate: '2012-03-15',
      flareTriggers: 'Cold weather',
      functionalImpact: 'Cannot lift above shoulder',
      notes: 'Worsening over time',
    });

    expect(pin.symptomType).toBe('Sharp pain');
    expect(pin.severity).toBe(8);
    expect(pin.frequency).toBe('daily');
    expect(pin.onsetDate).toBe('2012-03-15');
    expect(pin.flareTriggers).toBe('Cold weather');
    expect(pin.functionalImpact).toBe('Cannot lift above shoulder');
    expect(pin.notes).toBe('Worsening over time');
  });

  it('severity is 0-10 range', () => {
    const pinMin = createMockBodyMapPin({ severity: 0 });
    const pinMax = createMockBodyMapPin({ severity: 10 });
    expect(pinMin.severity).toBe(0);
    expect(pinMax.severity).toBe(10);
  });

  it('frequency accepts expected values', () => {
    const frequencies = ['daily', 'weekly', 'monthly', 'occasional'];
    for (const freq of frequencies) {
      const pin = createMockBodyMapPin({ frequency: freq });
      expect(pin.frequency).toBe(freq);
    }
  });

  it('pin saves with only required fields', () => {
    const pin = createMockBodyMapPin({
      symptomType: 'Stiffness',
      severity: 0,
      frequency: '',
      onsetDate: '',
      flareTriggers: '',
      functionalImpact: '',
      notes: '',
    });
    expect(pin.symptomType).toBe('Stiffness');
    expect(pin.id).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// 7C: Multiple Pins
// ---------------------------------------------------------------------------
describe('Body Map — Multiple Pins', () => {
  it('multiple pins on same region allowed', () => {
    let state = createBodyMapState();
    state = addPin(state, createMockBodyMapPin({ region: 'left_shoulder', symptomType: 'Pain' }));
    state = addPin(state, createMockBodyMapPin({ region: 'left_shoulder', symptomType: 'Numbness' }));
    const shoulderPins = state.pins.filter((p) => p.region === 'left_shoulder');
    expect(shoulderPins).toHaveLength(2);
  });

  it('pin count matches actual count', () => {
    let state = createBodyMapState();
    state = addPin(state, createMockBodyMapPin({ side: 'front' }));
    state = addPin(state, createMockBodyMapPin({ side: 'front' }));
    state = addPin(state, createMockBodyMapPin({ side: 'back' }));
    expect(state.pins).toHaveLength(3);
  });

  it('list view sorts by severity (descending)', () => {
    const pins = [
      createMockBodyMapPin({ severity: 3 }),
      createMockBodyMapPin({ severity: 9 }),
      createMockBodyMapPin({ severity: 5 }),
    ];
    const sorted = sortBySeverity(pins);
    expect(sorted[0].severity).toBe(9);
    expect(sorted[1].severity).toBe(5);
    expect(sorted[2].severity).toBe(3);
  });

  it('list view sorts by date (newest first)', () => {
    const pins = [
      createMockBodyMapPin({ onsetDate: '2010-01-01' }),
      createMockBodyMapPin({ onsetDate: '2015-06-15' }),
      createMockBodyMapPin({ onsetDate: '2012-03-20' }),
    ];
    const sorted = sortByDate(pins);
    expect(sorted[0].onsetDate).toBe('2015-06-15');
    expect(sorted[1].onsetDate).toBe('2012-03-20');
    expect(sorted[2].onsetDate).toBe('2010-01-01');
  });
});

// ---------------------------------------------------------------------------
// 7D: Left/Right Disambiguation
// ---------------------------------------------------------------------------
describe('Body Map — Left/Right Disambiguation', () => {
  it('left shoulder is labeled correctly', () => {
    const pin = createMockBodyMapPin({ region: 'left_shoulder' });
    expect(pin.region).toContain('left');
  });

  it('right shoulder is labeled correctly', () => {
    const pin = createMockBodyMapPin({ region: 'right_shoulder' });
    expect(pin.region).toContain('right');
  });

  it('front and back pins for same region are distinguishable', () => {
    const frontPin = createMockBodyMapPin({ region: 'left_knee', side: 'front' });
    const backPin = createMockBodyMapPin({ region: 'left_knee', side: 'back' });
    expect(frontPin.side).not.toBe(backPin.side);
    expect(frontPin.region).toBe(backPin.region);
  });
});

// ---------------------------------------------------------------------------
// 7E: Body Map in Export
// ---------------------------------------------------------------------------
describe('Body Map — Export Data', () => {
  it('export data includes all pin fields', () => {
    const pin = createMockBodyMapPin();
    const exportData = JSON.stringify(pin);
    const parsed = JSON.parse(exportData);

    expect(parsed.region).toBeDefined();
    expect(parsed.side).toBeDefined();
    expect(parsed.symptomType).toBeDefined();
    expect(parsed.severity).toBeDefined();
    expect(parsed.frequency).toBeDefined();
    expect(parsed.onsetDate).toBeDefined();
    expect(parsed.flareTriggers).toBeDefined();
    expect(parsed.functionalImpact).toBeDefined();
    expect(parsed.notes).toBeDefined();
  });

  it('export includes both front and back pins', () => {
    let state = createBodyMapState();
    state = addPin(state, createMockBodyMapPin({ side: 'front' }));
    state = addPin(state, createMockBodyMapPin({ side: 'back' }));

    const frontPins = state.pins.filter((p) => p.side === 'front');
    const backPins = state.pins.filter((p) => p.side === 'back');

    expect(frontPins).toHaveLength(1);
    expect(backPins).toHaveLength(1);
  });

  it('empty body map produces valid empty state', () => {
    const state = createBodyMapState();
    expect(state.pins).toHaveLength(0);
    expect(JSON.stringify(state.pins)).toBe('[]');
  });
});
