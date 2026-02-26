import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Check,
  X,
  Activity,
  Info,
  Flame,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Calendar,
  ListOrdered,
  ArrowUpDown,
  Trash2,
  Edit3,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useAppStore from '@/store/useAppStore';
import { PageContainer } from '@/components/PageContainer';
import type { UserCondition } from '@/store/useAppStore';
import { BODY_REGIONS } from '@/data/bodyRegions';
import type { BodyRegion, RegionCondition } from '@/data/bodyRegions';
import { useFeatureFlag } from '@/store/useFeatureFlagStore';

// ---------------------------------------------------------------------------
// Pin interface for Phase 8A
// ---------------------------------------------------------------------------

interface BodyMapPin {
  id: string;
  regionId: string;
  symptomType: string;
  severity: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
  onsetDate: string;
  flareTriggers: string;
  functionalImpact: string;
  notes: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// View mode: front / back
// ---------------------------------------------------------------------------

type BodyMapView = 'front' | 'back';

// Mapping each region to the side(s) it should appear on.
// "both" means it shows in both front and back views.
const REGION_SIDE: Record<string, 'front' | 'back' | 'both'> = {
  head: 'both',
  mental: 'both',
  'face-jaw': 'front',
  eyes: 'front',
  ears: 'both',
  neck: 'both',
  'left-shoulder': 'both',
  'right-shoulder': 'both',
  chest: 'front',
  'upper-back': 'back',
  abdomen: 'front',
  'lower-back': 'back',
  'left-upper-arm': 'both',
  'right-upper-arm': 'both',
  'left-forearm': 'both',
  'right-forearm': 'both',
  'left-hand': 'both',
  'right-hand': 'both',
  'left-hip': 'both',
  'right-hip': 'both',
  'left-upper-leg': 'both',
  'right-upper-leg': 'both',
  'left-knee': 'both',
  'right-knee': 'both',
  'left-lower-leg': 'both',
  'right-lower-leg': 'both',
  'left-foot': 'both',
  'right-foot': 'both',
};

function regionVisibleInView(regionId: string, view: BodyMapView): boolean {
  const side = REGION_SIDE[regionId] ?? 'both';
  return side === 'both' || side === view;
}

// ---------------------------------------------------------------------------
// Pin sort options
// ---------------------------------------------------------------------------

type PinSortKey = 'date' | 'severity';

// ---------------------------------------------------------------------------
// localStorage helpers for pins
// ---------------------------------------------------------------------------

const PINS_STORAGE_KEY = 'vcs-body-map-pins';

function loadPins(): BodyMapPin[] {
  try {
    const raw = localStorage.getItem(PINS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePins(pins: BodyMapPin[]) {
  try {
    localStorage.setItem(PINS_STORAGE_KEY, JSON.stringify(pins));
  } catch { /* storage full */ }
}

// ---------------------------------------------------------------------------
// Default pin form state
// ---------------------------------------------------------------------------

function defaultPinForm(regionId: string): Omit<BodyMapPin, 'id' | 'createdAt'> {
  return {
    regionId,
    symptomType: '',
    severity: 5,
    frequency: 'daily',
    onsetDate: '',
    flareTriggers: '',
    functionalImpact: '',
    notes: '',
  };
}

// ---------------------------------------------------------------------------
// Helper: build a unique condition key that accounts for bilateral regions
// ---------------------------------------------------------------------------

function conditionKey(regionId: string, conditionId: string): string {
  return `${regionId}::${conditionId}`;
}

// ---------------------------------------------------------------------------
// Bilateral label helper — adds "Left" / "Right" disambiguation
// ---------------------------------------------------------------------------

const BILATERAL_PREFIXES = ['left-', 'right-'];

function disambiguatedLabel(region: BodyRegion): string {
  const id = region.id;
  if (id.startsWith('left-')) {
    return `Left ${region.label.replace(/^Left\s*/i, '')}`;
  }
  if (id.startsWith('right-')) {
    return `Right ${region.label.replace(/^Right\s*/i, '')}`;
  }
  return region.label;
}

function isBilateral(regionId: string): boolean {
  return BILATERAL_PREFIXES.some((p) => regionId.startsWith(p));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BodyMap() {
  const navigate = useNavigate();

  // Store
  const userConditions = useAppStore((s) => s.userConditions);
  const addUserCondition = useAppStore((s) => s.addUserCondition);
  const removeUserCondition = useAppStore((s) => s.removeUserCondition);

  // UI state
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const showPainTracking = useFeatureFlag('bodyMapLinking');

  // Phase 8A: View toggle
  const [viewMode, setViewMode] = useState<BodyMapView>('front');

  // Phase 8A: Zoom + pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Phase 8A: Pins
  const [pins, setPins] = useState<BodyMapPin[]>(loadPins);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pinDialogRegion, setPinDialogRegion] = useState<string | null>(null);
  const [editingPin, setEditingPin] = useState<BodyMapPin | null>(null);
  const [pinForm, setPinForm] = useState<Omit<BodyMapPin, 'id' | 'createdAt'>>(defaultPinForm(''));
  const [showPinList, setShowPinList] = useState(false);
  const [pinSortKey, setPinSortKey] = useState<PinSortKey>('date');

  // Persist pins to localStorage
  useEffect(() => {
    savePins(pins);
  }, [pins]);

  // Pain intensity tracking (persisted to localStorage)
  const [painLevels, setPainLevels] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('bodymap-pain-levels');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bodymap-pain-levels', JSON.stringify(painLevels));
    } catch { /* storage full */ }
  }, [painLevels]);

  const setPainLevel = useCallback((key: string, level: number) => {
    setPainLevels(prev => ({ ...prev, [key]: level }));
  }, []);

  // Derive which condition keys are already stored
  const addedConditionKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const uc of userConditions) {
      if (uc.bodyPart) {
        keys.add(conditionKey(uc.bodyPart, uc.conditionId));
      }
    }
    return keys;
  }, [userConditions]);

  // Count of selections per region (for the badge)
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const uc of userConditions) {
      if (uc.bodyPart) {
        counts[uc.bodyPart] = (counts[uc.bodyPart] || 0) + 1;
      }
    }
    return counts;
  }, [userConditions]);

  // Pin counts per region
  const pinCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of pins) {
      counts[p.regionId] = (counts[p.regionId] || 0) + 1;
    }
    return counts;
  }, [pins]);

  // Currently active region data
  const activeRegion = useMemo(() => {
    if (!selectedRegion) return null;
    return BODY_REGIONS.find((r) => r.id === selectedRegion) ?? null;
  }, [selectedRegion]);

  // Filter regions by view mode
  const visibleRegions = useMemo(() => {
    return BODY_REGIONS.filter((r) => regionVisibleInView(r.id, viewMode));
  }, [viewMode]);

  // Sorted pins
  const sortedPins = useMemo(() => {
    const sorted = [...pins];
    if (pinSortKey === 'date') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      sorted.sort((a, b) => b.severity - a.severity);
    }
    return sorted;
  }, [pins, pinSortKey]);

  // Pins for active region
  const activeRegionPins = useMemo(() => {
    if (!selectedRegion) return [];
    return pins.filter((p) => p.regionId === selectedRegion);
  }, [pins, selectedRegion]);

  // Toggle a condition for the active region
  const toggleCondition = useCallback(
    (region: BodyRegion, condition: RegionCondition) => {
      const key = conditionKey(region.id, condition.id);
      if (addedConditionKeys.has(key)) {
        // Remove it
        const existing = userConditions.find(
          (uc) => uc.bodyPart === region.id && uc.conditionId === condition.id,
        );
        if (existing) {
          removeUserCondition(existing.id);
        }
      } else {
        // Add it
        const newCondition: UserCondition = {
          id: crypto.randomUUID(),
          conditionId: condition.id,
          serviceConnected: true,
          claimStatus: 'pending',
          isPrimary: true,
          dateAdded: new Date().toISOString(),
          bodyPart: region.id,
          notes: condition.name,
        };
        addUserCondition(newCondition);
      }
    },
    [addedConditionKeys, userConditions, addUserCondition, removeUserCondition],
  );

  // Total selected conditions via body map
  const totalSelected = useMemo(() => {
    return userConditions.filter((uc) => uc.bodyPart).length;
  }, [userConditions]);

  // Helper to get fill/stroke for regions
  const _getRegionFill = (regionId: string) => {
    if (selectedRegion === regionId) return 'url(#goldGradient)';
    if (regionCounts[regionId]) return 'rgba(212,175,55,0.4)';
    if (hoveredRegion === regionId) return 'rgba(212,175,55,0.25)';
    return '#9CA3AF';
  };

  const _getRegionStroke = (regionId: string) => {
    if (selectedRegion === regionId || regionCounts[regionId] || hoveredRegion === regionId) {
      return 'var(--gold-md)';
    }
    return '#6B7280';
  };

  const _getRegionStrokeWidth = (regionId: string) => {
    return selectedRegion === regionId || regionCounts[regionId] ? 2.5 : 1;
  };

  // ----- Zoom + Pan handlers -----
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => {
      const next = Math.max(z - 0.25, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handlePanStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (zoom <= 1) return;
      e.preventDefault();
      setIsPanning(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      panStart.current = { x: clientX, y: clientY };
      panOrigin.current = { x: pan.x, y: pan.y };
    },
    [zoom, pan],
  );

  const handlePanMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isPanning) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - panStart.current.x;
      const dy = clientY - panStart.current.y;
      // Constrain panning based on zoom level
      const maxPan = (zoom - 1) * 130;
      setPan({
        x: Math.max(-maxPan, Math.min(maxPan, panOrigin.current.x + dx)),
        y: Math.max(-maxPan, Math.min(maxPan, panOrigin.current.y + dy)),
      });
    },
    [isPanning, zoom],
  );

  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  // ----- Pin dialog handlers -----
  const openPinDialog = useCallback((regionId: string) => {
    setPinDialogRegion(regionId);
    setPinForm(defaultPinForm(regionId));
    setEditingPin(null);
    setPinDialogOpen(true);
  }, []);

  const openEditPinDialog = useCallback((pin: BodyMapPin) => {
    setPinDialogRegion(pin.regionId);
    setPinForm({
      regionId: pin.regionId,
      symptomType: pin.symptomType,
      severity: pin.severity,
      frequency: pin.frequency,
      onsetDate: pin.onsetDate,
      flareTriggers: pin.flareTriggers,
      functionalImpact: pin.functionalImpact,
      notes: pin.notes,
    });
    setEditingPin(pin);
    setPinDialogOpen(true);
  }, []);

  const savePin = useCallback(() => {
    if (editingPin) {
      setPins((prev) =>
        prev.map((p) =>
          p.id === editingPin.id ? { ...p, ...pinForm } : p,
        ),
      );
    } else {
      const newPin: BodyMapPin = {
        ...pinForm,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setPins((prev) => [...prev, newPin]);
    }
    setPinDialogOpen(false);
    setEditingPin(null);
  }, [pinForm, editingPin]);

  const deletePin = useCallback((pinId: string) => {
    setPins((prev) => prev.filter((p) => p.id !== pinId));
  }, []);

  // ----- Region overlay helpers (unchanged structure, now aware of view) -----
  const getOverlayBg = (regionId: string) => {
    if (selectedRegion === regionId) return 'rgba(212,175,55,0.4)';
    if (regionCounts[regionId] || pinCounts[regionId]) return 'rgba(212,175,55,0.3)';
    if (hoveredRegion === regionId) return 'rgba(212,175,55,0.25)';
    return 'transparent';
  };

  const getOverlayBorder = (regionId: string) => {
    if (
      selectedRegion === regionId ||
      regionCounts[regionId] ||
      pinCounts[regionId] ||
      hoveredRegion === regionId
    )
      return 'var(--gold-md)';
    return 'transparent';
  };

  // Badge positions - percentage-based to match overlays
  const badgePositions: Record<string, { top: string; left: string }> = {
    head: { top: '7%', left: '64%' },
    mental: { top: '5%', left: '62%' },
    'face-jaw': { top: '12%', left: '62%' },
    eyes: { top: '8%', left: '62%' },
    ears: { top: '8%', left: '68%' },
    neck: { top: '16%', left: '62%' },
    'left-shoulder': { top: '20%', left: '24%' },
    'right-shoulder': { top: '20%', left: '76%' },
    chest: { top: '28%', left: '66%' },
    'upper-back': { top: '28%', left: '66%' },
    abdomen: { top: '40%', left: '66%' },
    'lower-back': { top: '40%', left: '66%' },
    'left-upper-arm': { top: '27%', left: '21%' },
    'right-upper-arm': { top: '27%', left: '77%' },
    'left-forearm': { top: '39%', left: '17%' },
    'right-forearm': { top: '39%', left: '81%' },
    'left-hand': { top: '51%', left: '19%' },
    'right-hand': { top: '51%', left: '80%' },
    'left-hip': { top: '47%', left: '41%' },
    'right-hip': { top: '47%', left: '59%' },
    'left-upper-leg': { top: '58%', left: '41%' },
    'right-upper-leg': { top: '58%', left: '59%' },
    'left-knee': { top: '68%', left: '40%' },
    'right-knee': { top: '68%', left: '60%' },
    'left-lower-leg': { top: '78%', left: '41%' },
    'right-lower-leg': { top: '78%', left: '59%' },
    'left-foot': { top: '91%', left: '39%' },
    'right-foot': { top: '91%', left: '61%' },
  };

  // Overlay position data for all regions — calibrated to body-silhouette.png (1024×1536)
  const overlayPositions: Record<string, React.CSSProperties> = {
    head: { top: '3.5%', left: '38%', width: '24%', height: '11%' },
    mental: {
      top: '4.5%', left: '40%', width: '20%', height: '6%',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
    },
    'face-jaw': { top: '10.5%', left: '39%', width: '22%', height: '4.5%' },
    eyes: { top: '7%', left: '40%', width: '20%', height: '3%' },
    'ears-left': { top: '6.5%', left: '34%', width: '7%', height: '5%' },
    'ears-right': { top: '6.5%', left: '59%', width: '7%', height: '5%' },
    neck: { top: '14.5%', left: '41%', width: '18%', height: '4%' },
    'left-shoulder': { top: '18%', left: '24%', width: '15%', height: '7%', borderRadius: '50%' },
    'right-shoulder': { top: '18%', left: '61%', width: '15%', height: '7%', borderRadius: '50%' },
    chest: { top: '21%', left: '34%', width: '32%', height: '13%' },
    'upper-back': { top: '21%', left: '34%', width: '32%', height: '13%' },
    abdomen: { top: '34%', left: '35%', width: '30%', height: '10%' },
    'lower-back': { top: '34%', left: '35%', width: '30%', height: '10%' },
    'left-upper-arm': { top: '21%', left: '19%', width: '10%', height: '14%' },
    'right-upper-arm': { top: '21%', left: '71%', width: '10%', height: '14%' },
    'left-forearm': { top: '34%', left: '14%', width: '10%', height: '13%' },
    'right-forearm': { top: '34%', left: '76%', width: '10%', height: '13%' },
    'left-hand': { top: '47%', left: '14%', width: '12%', height: '8%' },
    'right-hand': { top: '47%', left: '74%', width: '12%', height: '8%' },
    'left-hip': { top: '43%', left: '35%', width: '14%', height: '7%' },
    'right-hip': { top: '43%', left: '51%', width: '14%', height: '7%' },
    'left-upper-leg': { top: '49%', left: '36%', width: '12%', height: '18%' },
    'right-upper-leg': { top: '49%', left: '52%', width: '12%', height: '18%' },
    'left-knee': { top: '66%', left: '36%', width: '12%', height: '5.5%', borderRadius: '50%' },
    'right-knee': { top: '66%', left: '52%', width: '12%', height: '5.5%', borderRadius: '50%' },
    'left-lower-leg': { top: '71%', left: '37%', width: '10%', height: '17%' },
    'right-lower-leg': { top: '71%', left: '53%', width: '10%', height: '17%' },
    'left-foot': { top: '87%', left: '34%', width: '13%', height: '9%' },
    'right-foot': { top: '87%', left: '53%', width: '13%', height: '9%' },
  };

  // Render a single overlay div for a region
  const renderOverlay = (regionId: string, posKey?: string, ariaLabel?: string, children?: React.ReactNode) => {
    const positionKey = posKey || regionId;
    const style = overlayPositions[positionKey];
    if (!style) return null;
    const region = BODY_REGIONS.find((r) => r.id === regionId);
    const label = ariaLabel || (region ? disambiguatedLabel(region) : regionId);
    const count = regionCounts[regionId] || 0;
    const pCount = pinCounts[regionId] || 0;

    return (
      <div
        key={positionKey}
        className={`body-region-overlay ${selectedRegion === regionId ? 'selected' : ''}`}
        style={{
          ...style,
          backgroundColor: getOverlayBg(regionId),
          borderColor: getOverlayBorder(regionId),
        }}
        onClick={() => setSelectedRegion(selectedRegion === regionId ? null : regionId)}
        onMouseEnter={() => setHoveredRegion(regionId)}
        onMouseLeave={() => setHoveredRegion(null)}
        role="button"
        tabIndex={0}
        aria-label={`${label}${count ? `, ${count} condition(s)` : ''}${pCount ? `, ${pCount} pin(s)` : ''}`}
      >
        {children}
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="bg-background">
      <PageContainer className="py-6 space-y-6">
        {/* Back + Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/claims')}
            className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Claims
          </Button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)]">
              <Activity className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Body Map</h1>
              <p className="text-muted-foreground text-sm">
                Tap a body region to view and select VA-ratable conditions
              </p>
            </div>
          </div>
        </div>

        {/* Summary Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {totalSelected > 0 && (
            <Badge className="bg-gold/20 text-foreground border border-gold/30 hover:bg-gold/30">
              {totalSelected} condition{totalSelected !== 1 ? 's' : ''} selected
            </Badge>
          )}
          {pins.length > 0 && (
            <Badge
              className="bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 cursor-pointer gap-1"
              onClick={() => setShowPinList(!showPinList)}
            >
              <MapPin className="h-3 w-3" />
              {pins.length} pin{pins.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Front / Back toggle + Zoom controls */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* View Toggle */}
          <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1">
            <button
              type="button"
              onClick={() => { setViewMode('front'); setSelectedRegion(null); }}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === 'front'
                  ? 'bg-gold/20 text-foreground border border-gold/30 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Front View
            </button>
            <button
              type="button"
              onClick={() => { setViewMode('back'); setSelectedRegion(null); }}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === 'back'
                  ? 'bg-gold/20 text-foreground border border-gold/30 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Back View
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="h-8 w-8 p-0 border-border"
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground w-12 text-center tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="h-8 w-8 p-0 border-border"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            {zoom > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomReset}
                className="h-8 px-2 border-border text-xs"
                title="Reset zoom"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Pin List View (collapsible) */}
        <AnimatePresence>
          {showPinList && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Card className="bg-[rgba(212,175,55,0.08)] border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                      <ListOrdered className="h-4 w-4 text-gold" />
                      All Pins ({pins.length})
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPinSortKey(pinSortKey === 'date' ? 'severity' : 'date')}
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                      >
                        <ArrowUpDown className="h-3 w-3" />
                        {pinSortKey === 'date' ? 'By Date' : 'By Severity'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPinList(false)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {sortedPins.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No pins yet. Tap a body region and add a pin to get started.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {sortedPins.map((pin) => {
                        const region = BODY_REGIONS.find((r) => r.id === pin.regionId);
                        const regionLabel = region ? disambiguatedLabel(region) : pin.regionId;
                        return (
                          <div
                            key={pin.id}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              <MapPin className={`h-4 w-4 ${
                                pin.severity >= 7 ? 'text-red-400' :
                                pin.severity >= 4 ? 'text-yellow-400' :
                                'text-emerald-400'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-foreground">
                                  {pin.symptomType || 'Untitled symptom'}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 h-4 border-border text-muted-foreground"
                                >
                                  {regionLabel}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] px-1.5 py-0 h-4 gap-0.5 ${
                                    pin.severity >= 7 ? 'border-red-500/40 text-red-400' :
                                    pin.severity >= 4 ? 'border-yellow-500/40 text-yellow-400' :
                                    'border-emerald-500/40 text-emerald-400'
                                  }`}
                                >
                                  <Flame className="h-2.5 w-2.5" />
                                  {pin.severity}/10
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 h-4 border-border text-muted-foreground capitalize"
                                >
                                  {pin.frequency}
                                </Badge>
                              </div>
                              {pin.onsetDate && (
                                <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Onset: {pin.onsetDate}
                                </p>
                              )}
                              {pin.notes && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {pin.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditPinDialog(pin)}
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                title="Edit pin"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deletePin(pin.id)}
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400"
                                title="Delete pin"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main layout: body diagram + condition panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Body Diagram with PNG Image */}
          <Card className="bg-[rgba(212,175,55,0.08)] border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">
                {viewMode === 'front' ? 'Front View' : 'Back View'}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center pb-6">
              {/* Zoom/Pan container */}
              <div
                ref={mapContainerRef}
                className="relative w-full max-w-[260px] mx-auto overflow-hidden rounded-lg"
                style={{ cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
                onMouseDown={handlePanStart}
                onMouseMove={handlePanMove}
                onMouseUp={handlePanEnd}
                onMouseLeave={handlePanEnd}
                onTouchStart={handlePanStart}
                onTouchMove={handlePanMove}
                onTouchEnd={handlePanEnd}
              >
                <div
                  className="relative w-full select-none"
                  style={{
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))',
                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                    transformOrigin: 'center center',
                    transition: isPanning ? 'none' : 'transform 0.2s ease',
                  }}
                  role="application"
                  aria-label={`Interactive body diagram (${viewMode} view) — tap regions to view conditions`}
                >
                  {/* Professional body silhouette PNG */}
                  <img
                    src={viewMode === 'front' ? '/body-silhouette.png' : '/body-silhouette-back.png'}
                    alt={`Body map — ${viewMode} view`}
                    className="w-full h-auto"
                    style={{ display: 'block' }}
                    onError={(e) => {
                      // Fallback: if back image doesn't exist, reuse the front silhouette.
                      // Do NOT mirror with scaleX(-1) — the overlay positions use screen-relative
                      // left/right, so flipping the image would swap left/right incorrectly.
                      if (viewMode === 'back') {
                        (e.target as HTMLImageElement).src = '/body-silhouette.png';
                      }
                    }}
                  />

                  {/* Interactive overlay regions - percentage-based positioning */}
                  <style>
                    {`
                      @keyframes gentle-pulse {
                        0%, 100% { opacity: 0.9; }
                        50% { opacity: 1; }
                      }
                      .body-region-overlay {
                        position: absolute;
                        transition: background-color 200ms ease, border-color 200ms ease, filter 200ms ease;
                        cursor: pointer;
                        border: 2px solid transparent;
                        border-radius: 8px;
                      }
                      .body-region-overlay:hover {
                        filter: brightness(1.2);
                      }
                      .body-region-overlay.selected {
                        animation: gentle-pulse 2s ease-in-out infinite;
                      }
                      .region-badge {
                        position: absolute;
                        background: var(--gold-md);
                        color: white;
                        border-radius: 50%;
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 11px;
                        font-weight: bold;
                        pointer-events: none;
                        z-index: 10;
                      }
                      .pin-indicator {
                        position: absolute;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #3b82f6;
                        border: 2px solid white;
                        pointer-events: none;
                        z-index: 11;
                      }
                    `}
                  </style>

                  {/* HEAD */}
                  {regionVisibleInView('head', viewMode) && renderOverlay('head')}

                  {/* MENTAL HEALTH (brain icon on head) */}
                  {regionVisibleInView('mental', viewMode) &&
                    renderOverlay('mental', 'mental', undefined, <>🧠</>)
                  }

                  {/* FACE & JAW */}
                  {regionVisibleInView('face-jaw', viewMode) && renderOverlay('face-jaw')}

                  {/* EYES */}
                  {regionVisibleInView('eyes', viewMode) && renderOverlay('eyes')}

                  {/* EARS (left and right combined) */}
                  {regionVisibleInView('ears', viewMode) && (
                    <>
                      {renderOverlay('ears', 'ears-left', 'Ears (left)')}
                      {renderOverlay('ears', 'ears-right', 'Ears (right)')}
                    </>
                  )}

                  {/* NECK */}
                  {regionVisibleInView('neck', viewMode) && renderOverlay('neck')}

                  {/* LEFT SHOULDER */}
                  {regionVisibleInView('left-shoulder', viewMode) && renderOverlay('left-shoulder')}

                  {/* RIGHT SHOULDER */}
                  {regionVisibleInView('right-shoulder', viewMode) && renderOverlay('right-shoulder')}

                  {/* CHEST (front) / UPPER BACK (back) */}
                  {viewMode === 'front' && renderOverlay('chest')}
                  {viewMode === 'back' && renderOverlay('upper-back')}

                  {/* ABDOMEN (front) / LOWER BACK (back) */}
                  {viewMode === 'front' && renderOverlay('abdomen')}
                  {viewMode === 'back' && renderOverlay('lower-back')}

                  {/* LEFT UPPER ARM */}
                  {regionVisibleInView('left-upper-arm', viewMode) && renderOverlay('left-upper-arm')}

                  {/* RIGHT UPPER ARM */}
                  {regionVisibleInView('right-upper-arm', viewMode) && renderOverlay('right-upper-arm')}

                  {/* LEFT FOREARM */}
                  {regionVisibleInView('left-forearm', viewMode) && renderOverlay('left-forearm')}

                  {/* RIGHT FOREARM */}
                  {regionVisibleInView('right-forearm', viewMode) && renderOverlay('right-forearm')}

                  {/* LEFT HAND */}
                  {regionVisibleInView('left-hand', viewMode) && renderOverlay('left-hand')}

                  {/* RIGHT HAND */}
                  {regionVisibleInView('right-hand', viewMode) && renderOverlay('right-hand')}

                  {/* LEFT HIP */}
                  {regionVisibleInView('left-hip', viewMode) && renderOverlay('left-hip')}

                  {/* RIGHT HIP */}
                  {regionVisibleInView('right-hip', viewMode) && renderOverlay('right-hip')}

                  {/* LEFT UPPER LEG */}
                  {regionVisibleInView('left-upper-leg', viewMode) && renderOverlay('left-upper-leg')}

                  {/* RIGHT UPPER LEG */}
                  {regionVisibleInView('right-upper-leg', viewMode) && renderOverlay('right-upper-leg')}

                  {/* LEFT KNEE */}
                  {regionVisibleInView('left-knee', viewMode) && renderOverlay('left-knee')}

                  {/* RIGHT KNEE */}
                  {regionVisibleInView('right-knee', viewMode) && renderOverlay('right-knee')}

                  {/* LEFT LOWER LEG */}
                  {regionVisibleInView('left-lower-leg', viewMode) && renderOverlay('left-lower-leg')}

                  {/* RIGHT LOWER LEG */}
                  {regionVisibleInView('right-lower-leg', viewMode) && renderOverlay('right-lower-leg')}

                  {/* LEFT FOOT */}
                  {regionVisibleInView('left-foot', viewMode) && renderOverlay('left-foot')}

                  {/* RIGHT FOOT */}
                  {regionVisibleInView('right-foot', viewMode) && renderOverlay('right-foot')}

                  {/* Count badges */}
                  {visibleRegions.map((region) => {
                    const count = (regionCounts[region.id] || 0) + (pinCounts[region.id] || 0);
                    if (count === 0) return null;

                    const pos = badgePositions[region.id] || { top: '50%', left: '50%' };

                    return (
                      <div
                        key={`badge-${region.id}`}
                        className="region-badge"
                        style={{ top: pos.top, left: pos.left }}
                      >
                        {count}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Condition Selection Panel */}
          <div className="space-y-4">
            {activeRegion ? (
              <>
                {/* Region header */}
                <Card className="bg-[rgba(212,175,55,0.08)] border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-foreground flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-gold" />
                        {disambiguatedLabel(activeRegion)}
                        {isBilateral(activeRegion.id) && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-4 border-blue-500/30 text-blue-300"
                          >
                            {activeRegion.id.startsWith('left-') ? 'L' : 'R'}
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openPinDialog(activeRegion.id)}
                          className="text-blue-300 hover:text-blue-200 h-8 px-2 gap-1"
                          title="Add a pin to this region"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="text-xs">Pin</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRegion(null)}
                          className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Select conditions that apply to your claim
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {activeRegion.conditions.map((condition) => {
                      const key = conditionKey(activeRegion.id, condition.id);
                      const isAdded = addedConditionKeys.has(key);
                      const painLevel = painLevels[key] ?? 0;

                      return (
                        <div key={condition.id} className="space-y-0">
                          <button
                            type="button"
                            onClick={() =>
                              toggleCondition(activeRegion, condition)
                            }
                            className={`w-full text-left rounded-lg border p-3 transition-all duration-200 ${
                              isAdded
                                ? `bg-[rgba(212,175,55,0.15)] border-[rgba(212,175,55,0.4)] hover:bg-gold/20 ${showPainTracking && painLevel > 0 ? 'rounded-b-none border-b-0' : ''}`
                                : 'bg-muted/30 border-border hover:bg-muted/50 hover:border-border'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  isAdded
                                    ? 'bg-gold border-gold'
                                    : 'border-muted-foreground'
                                }`}
                              >
                                {isAdded && (
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`font-medium text-sm ${
                                      isAdded ? 'text-gold-hl' : 'text-foreground'
                                    }`}
                                  >
                                    {condition.name}
                                  </span>
                                  {condition.diagnosticCode && (
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] px-1.5 py-0 h-4 border-border text-muted-foreground"
                                    >
                                      DC {condition.diagnosticCode}
                                    </Badge>
                                  )}
                                  {isAdded && showPainTracking && painLevel > 0 && (
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] px-1.5 py-0 h-4 gap-0.5 ${
                                        painLevel >= 7 ? 'border-red-500/40 text-red-400' :
                                        painLevel >= 4 ? 'border-yellow-500/40 text-yellow-400' :
                                        'border-emerald-500/40 text-emerald-400'
                                      }`}
                                    >
                                      <Flame className="h-2.5 w-2.5" />
                                      {painLevel}/10
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                  {condition.description}
                                </p>
                              </div>
                            </div>
                          </button>
                          {/* Pain intensity scale — shown when condition is added and flag enabled */}
                          {isAdded && showPainTracking && (
                            <div
                              className="bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.4)] border-t-0 rounded-b-lg px-3 py-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center gap-2 mb-1.5">
                                <Flame className="h-3 w-3 text-muted-foreground" />
                                <span className="text-[11px] text-muted-foreground font-medium">
                                  Pain / Severity on worst days
                                </span>
                                <span className={`text-[11px] font-bold ml-auto ${
                                  painLevel >= 7 ? 'text-red-400' :
                                  painLevel >= 4 ? 'text-yellow-400' :
                                  painLevel > 0 ? 'text-emerald-400' :
                                  'text-muted-foreground'
                                }`}>
                                  {painLevel > 0 ? `${painLevel}/10` : 'Not set'}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                                  <button
                                    key={level}
                                    type="button"
                                    onClick={() => setPainLevel(key, painLevel === level ? 0 : level)}
                                    className={`flex-1 h-5 rounded-sm text-[9px] font-bold transition-all ${
                                      level <= painLevel
                                        ? level >= 7 ? 'bg-red-500/70 text-white'
                                          : level >= 4 ? 'bg-yellow-500/60 text-white'
                                          : 'bg-emerald-500/60 text-white'
                                        : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                                    }`}
                                    aria-label={`Pain level ${level}`}
                                  >
                                    {level}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Pins for this region */}
                {activeRegionPins.length > 0 && (
                  <Card className="bg-blue-500/5 border-blue-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        Pins for {disambiguatedLabel(activeRegion)} ({activeRegionPins.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {activeRegionPins.map((pin) => (
                        <div
                          key={pin.id}
                          className="flex items-start gap-3 p-2.5 rounded-lg border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-foreground">
                                {pin.symptomType || 'Untitled symptom'}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-1.5 py-0 h-4 gap-0.5 ${
                                  pin.severity >= 7 ? 'border-red-500/40 text-red-400' :
                                  pin.severity >= 4 ? 'border-yellow-500/40 text-yellow-400' :
                                  'border-emerald-500/40 text-emerald-400'
                                }`}
                              >
                                {pin.severity}/10
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 h-4 border-border text-muted-foreground capitalize"
                              >
                                {pin.frequency}
                              </Badge>
                            </div>
                            {pin.flareTriggers && (
                              <p className="text-[11px] text-muted-foreground mt-1">
                                Triggers: {pin.flareTriggers}
                              </p>
                            )}
                            {pin.functionalImpact && (
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                Impact: {pin.functionalImpact}
                              </p>
                            )}
                            {pin.notes && (
                              <p className="text-[11px] text-muted-foreground mt-0.5 italic">
                                {pin.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditPinDialog(pin)}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePin(pin.id)}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-red-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              /* Empty state when no region is selected */
              <Card className="bg-[rgba(212,175,55,0.08)] border-border">
                <CardContent className="py-16">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center">
                      <Info className="h-7 w-7 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Select a Body Region
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                        Tap any area on the body diagram to see
                        common VA-ratable conditions for that region.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selected conditions summary */}
            {totalSelected > 0 && (
              <Card className="bg-[rgba(212,175,55,0.08)] border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-foreground flex items-center gap-2">
                    <Plus className="h-4 w-4 text-gold" />
                    Selected Conditions ({totalSelected})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userConditions
                      .filter((uc) => uc.bodyPart)
                      .map((uc) => {
                        const region = BODY_REGIONS.find(
                          (r) => r.id === uc.bodyPart,
                        );
                        const condition = region?.conditions.find(
                          (c) => c.id === uc.conditionId,
                        );
                        const label =
                          condition?.name || uc.notes || uc.conditionId;
                        const regionLabel = region ? disambiguatedLabel(region) : (uc.bodyPart || '');
                        const key = uc.bodyPart ? conditionKey(uc.bodyPart, uc.conditionId) : '';
                        const pain = painLevels[key] ?? 0;

                        return (
                          <Badge
                            key={uc.id}
                            className="bg-[rgba(212,175,55,0.15)] text-gold-hl border border-gold/30 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 cursor-pointer transition-colors gap-1 pr-1.5"
                            onClick={() => removeUserCondition(uc.id)}
                            title={`${label} (${regionLabel})${showPainTracking && pain > 0 ? ` — Pain: ${pain}/10` : ''} — click to remove`}
                          >
                            <span className="max-w-[180px] truncate">
                              {label}
                            </span>
                            {showPainTracking && pain > 0 && (
                              <span className={`text-[10px] font-bold ${
                                pain >= 7 ? 'text-red-400' : pain >= 4 ? 'text-yellow-400' : 'text-emerald-400'
                              }`}>
                                {pain}/10
                              </span>
                            )}
                            <span className="text-[10px] text-muted-foreground ml-0.5">
                              ({regionLabel})
                            </span>
                            <X className="h-3 w-3 ml-0.5 flex-shrink-0" />
                          </Badge>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </PageContainer>

      {/* ----------------------------------------------------------------- */}
      {/* Pin Dialog (modal overlay) */}
      {/* ----------------------------------------------------------------- */}
      <AnimatePresence>
        {pinDialogOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setPinDialogOpen(false)}
            />

            {/* Dialog */}
            <motion.div
              className="relative bg-background border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.15 }}
            >
              <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-foreground">
                    {editingPin ? 'Edit Pin' : 'Add Pin'}
                  </h2>
                  {pinDialogRegion && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-4 border-border text-muted-foreground"
                    >
                      {(() => {
                        const r = BODY_REGIONS.find((reg) => reg.id === pinDialogRegion);
                        return r ? disambiguatedLabel(r) : pinDialogRegion;
                      })()}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPinDialogOpen(false)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* (a) Symptom Type */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="pin-symptom">
                    Symptom Type
                  </label>
                  <input
                    id="pin-symptom"
                    type="text"
                    value={pinForm.symptomType}
                    onChange={(e) => setPinForm((f) => ({ ...f, symptomType: e.target.value }))}
                    placeholder="e.g., Sharp pain, Numbness, Stiffness..."
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60"
                  />
                </div>

                {/* (b) Severity 0-10 */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="pin-severity">
                    Severity
                    <span className={`ml-2 text-sm font-bold ${
                      pinForm.severity >= 7 ? 'text-red-400' :
                      pinForm.severity >= 4 ? 'text-yellow-400' :
                      'text-emerald-400'
                    }`}>
                      {pinForm.severity}/10
                    </span>
                  </label>
                  <input
                    id="pin-severity"
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={pinForm.severity}
                    onChange={(e) => setPinForm((f) => ({ ...f, severity: Number(e.target.value) }))}
                    className="w-full accent-gold h-2 rounded-lg appearance-none cursor-pointer bg-muted/50"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
                    <span>None</span>
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                    <span>Worst</span>
                  </div>
                </div>

                {/* (c) Frequency */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="pin-frequency">
                    Frequency
                  </label>
                  <select
                    id="pin-frequency"
                    value={pinForm.frequency}
                    onChange={(e) => setPinForm((f) => ({ ...f, frequency: e.target.value as BodyMapPin['frequency'] }))}
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="occasional">Occasional</option>
                  </select>
                </div>

                {/* (d) Onset Date */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="pin-onset">
                    Onset Date
                  </label>
                  <input
                    id="pin-onset"
                    type="date"
                    value={pinForm.onsetDate}
                    onChange={(e) => setPinForm((f) => ({ ...f, onsetDate: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60"
                  />
                </div>

                {/* (e) Flare Triggers */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="pin-triggers">
                    Flare Triggers
                  </label>
                  <input
                    id="pin-triggers"
                    type="text"
                    value={pinForm.flareTriggers}
                    onChange={(e) => setPinForm((f) => ({ ...f, flareTriggers: e.target.value }))}
                    placeholder="e.g., Cold weather, Lifting, Extended standing..."
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60"
                  />
                </div>

                {/* (f) Functional Impact */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="pin-impact">
                    Functional Impact
                  </label>
                  <input
                    id="pin-impact"
                    type="text"
                    value={pinForm.functionalImpact}
                    onChange={(e) => setPinForm((f) => ({ ...f, functionalImpact: e.target.value }))}
                    placeholder="e.g., Cannot lift above shoulder, Limits walking..."
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60"
                  />
                </div>

                {/* (g) Free-text Notes */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="pin-notes">
                    Notes
                  </label>
                  <textarea
                    id="pin-notes"
                    rows={3}
                    value={pinForm.notes}
                    onChange={(e) => setPinForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Any additional details about this symptom..."
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 resize-none"
                  />
                </div>
              </div>

              {/* Dialog footer */}
              <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex items-center justify-end gap-3 rounded-b-xl">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPinDialogOpen(false)}
                  className="border-border"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={savePin}
                  className="bg-gold hover:bg-gold/90 text-primary-foreground gap-1"
                  disabled={!pinForm.symptomType.trim()}
                >
                  <Check className="h-3.5 w-3.5" />
                  {editingPin ? 'Update Pin' : 'Save Pin'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
