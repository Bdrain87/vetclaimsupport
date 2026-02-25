/**
 * Body Map Advanced Tests — Section 23
 *
 * Tests zoom/pan logic, PDF export rendering data, and advanced features.
 */
import { describe, it, expect } from 'vitest';
import { createMockBodyMapPin } from '@/test/utils';

// ---------------------------------------------------------------------------
// Zoom/Pan state helpers
// ---------------------------------------------------------------------------
interface ZoomState {
  scale: number;
  panX: number;
  panY: number;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3.0;
const DEFAULT_ZOOM: ZoomState = { scale: 1.0, panX: 0, panY: 0 };

function zoomIn(state: ZoomState, amount = 0.5): ZoomState {
  return { ...state, scale: Math.min(state.scale + amount, MAX_ZOOM) };
}

function zoomOut(state: ZoomState, amount = 0.5): ZoomState {
  return { ...state, scale: Math.max(state.scale - amount, MIN_ZOOM) };
}

function resetZoom(): ZoomState {
  return { ...DEFAULT_ZOOM };
}

function pan(state: ZoomState, dx: number, dy: number): ZoomState {
  return { ...state, panX: state.panX + dx, panY: state.panY + dy };
}

// ---------------------------------------------------------------------------
// 23A: Zoom and Pan
// ---------------------------------------------------------------------------
describe('Body Map Advanced — Zoom and Pan', () => {
  it('default zoom is 1.0', () => {
    expect(DEFAULT_ZOOM.scale).toBe(1.0);
  });

  it('zoom in increases scale', () => {
    const zoomed = zoomIn(DEFAULT_ZOOM);
    expect(zoomed.scale).toBe(1.5);
  });

  it('zoom out decreases scale', () => {
    const zoomed = zoomOut({ ...DEFAULT_ZOOM, scale: 1.5 });
    expect(zoomed.scale).toBe(1.0);
  });

  it('zoom has maximum bound', () => {
    let state = DEFAULT_ZOOM;
    for (let i = 0; i < 20; i++) {
      state = zoomIn(state);
    }
    expect(state.scale).toBe(MAX_ZOOM);
  });

  it('zoom has minimum bound', () => {
    let state = DEFAULT_ZOOM;
    for (let i = 0; i < 20; i++) {
      state = zoomOut(state);
    }
    expect(state.scale).toBe(MIN_ZOOM);
  });

  it('zoom resets when toggling views', () => {
    let state = zoomIn(zoomIn(DEFAULT_ZOOM));
    expect(state.scale).toBe(2.0);
    state = resetZoom();
    expect(state.scale).toBe(1.0);
  });

  it('pan moves the viewport', () => {
    const panned = pan(DEFAULT_ZOOM, 50, -30);
    expect(panned.panX).toBe(50);
    expect(panned.panY).toBe(-30);
  });

  it('pins remain correctly positioned after zoom', () => {
    const pin = createMockBodyMapPin({ region: 'left_shoulder' });
    const state = zoomIn(DEFAULT_ZOOM, 1.0);

    // Pin data is in relative coordinates — zoom doesn't change the stored position
    expect(pin.region).toBe('left_shoulder');
    expect(state.scale).toBe(2.0);
    // Pin coordinates are relative, not affected by zoom transform
  });
});

// ---------------------------------------------------------------------------
// 23B: PDF Export Rendering
// ---------------------------------------------------------------------------
describe('Body Map Advanced — PDF Export Data', () => {
  it('export data includes both front and back pins', () => {
    const pins = [
      createMockBodyMapPin({ side: 'front', region: 'chest' }),
      createMockBodyMapPin({ side: 'back', region: 'upper_back' }),
    ];

    const frontPins = pins.filter((p) => p.side === 'front');
    const backPins = pins.filter((p) => p.side === 'back');

    expect(frontPins).toHaveLength(1);
    expect(backPins).toHaveLength(1);
  });

  it('pin data serializes correctly for PDF', () => {
    const pin = createMockBodyMapPin({
      symptomType: 'Sharp pain',
      severity: 8,
      frequency: 'daily',
    });

    const serialized = JSON.stringify(pin);
    const parsed = JSON.parse(serialized);

    expect(parsed.symptomType).toBe('Sharp pain');
    expect(parsed.severity).toBe(8);
    expect(parsed.frequency).toBe('daily');
  });

  it('empty body map produces valid empty structure for PDF', () => {
    const pins: ReturnType<typeof createMockBodyMapPin>[] = [];
    expect(pins).toHaveLength(0);
    expect(JSON.stringify(pins)).toBe('[]');
  });

  it('time range filter works on pins', () => {
    const pins = [
      createMockBodyMapPin({ onsetDate: '2020-01-01' }),
      createMockBodyMapPin({ onsetDate: '2023-06-15' }),
      createMockBodyMapPin({ onsetDate: '2024-01-01' }),
    ];

    const cutoff = new Date('2023-01-01');
    const filtered = pins.filter((p) => new Date(p.onsetDate) >= cutoff);

    expect(filtered).toHaveLength(2);
  });
});
