import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Check,
  X,
  Activity,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useAppStore from '@/store/useAppStore';
import { PageContainer } from '@/components/PageContainer';
import type { UserCondition } from '@/store/useAppStore';

// ---------------------------------------------------------------------------
// Body region data: each region maps to a label, SVG position, and a curated
// list of common VA-ratable conditions (id matches vaConditions.ts where
// practical, but the body map uses its own condition catalog so it works
// independently).
// ---------------------------------------------------------------------------

interface BodyRegion {
  id: string;
  label: string;
  /** Center X/Y within the 200x440 SVG viewBox */
  cx: number;
  cy: number;
  /** Hotspot radius */
  r: number;
  conditions: RegionCondition[];
}

interface RegionCondition {
  id: string;
  name: string;
  diagnosticCode?: string;
  description: string;
}

const BODY_REGIONS: BodyRegion[] = [
  {
    id: 'head',
    label: 'Head',
    cx: 100,
    cy: 32,
    r: 22,
    conditions: [
      { id: 'tbi', name: 'Traumatic Brain Injury (TBI)', diagnosticCode: '8045', description: 'Residuals of a traumatic brain injury sustained during service' },
      { id: 'migraines', name: 'Migraine Headaches', diagnosticCode: '8100', description: 'Chronic or prostrating migraine headaches' },
      { id: 'ptsd', name: 'PTSD', diagnosticCode: '9411', description: 'Post-traumatic stress disorder from in-service stressor events' },
      { id: 'anxiety', name: 'Generalized Anxiety Disorder', diagnosticCode: '9400', description: 'Persistent anxiety linked to military service' },
      { id: 'depression', name: 'Major Depressive Disorder', diagnosticCode: '9434', description: 'Depressive disorder connected to service experiences' },
      { id: 'tinnitus', name: 'Tinnitus', diagnosticCode: '6260', description: 'Persistent ringing or buzzing in the ears from noise exposure' },
    ],
  },
  {
    id: 'neck',
    label: 'Neck',
    cx: 100,
    cy: 68,
    r: 14,
    conditions: [
      { id: 'cervical-strain', name: 'Cervical Spine Strain', diagnosticCode: '5237', description: 'Neck strain or degenerative changes from service duties' },
      { id: 'cervical-radiculopathy', name: 'Cervical Radiculopathy', diagnosticCode: '8510', description: 'Nerve compression in the cervical spine causing pain/numbness' },
      { id: 'herniated-disc-cervical', name: 'Cervical Disc Disease', diagnosticCode: '5243', description: 'Intervertebral disc degeneration in the cervical spine' },
    ],
  },
  {
    id: 'left-shoulder',
    label: 'Left Shoulder',
    cx: 55,
    cy: 100,
    r: 16,
    conditions: [
      { id: 'shoulder-impingement', name: 'Shoulder Impingement Syndrome', diagnosticCode: '5201', description: 'Limited arm motion due to shoulder impingement' },
      { id: 'rotator-cuff', name: 'Rotator Cuff Tear/Tendinitis', diagnosticCode: '5304', description: 'Injury or degeneration of rotator cuff muscles/tendons' },
      { id: 'shoulder-instability', name: 'Shoulder Instability', diagnosticCode: '5202', description: 'Recurrent dislocation or subluxation of the shoulder' },
      { id: 'shoulder-arthritis', name: 'Shoulder Arthritis', diagnosticCode: '5003', description: 'Degenerative joint disease of the shoulder' },
    ],
  },
  {
    id: 'right-shoulder',
    label: 'Right Shoulder',
    cx: 145,
    cy: 100,
    r: 16,
    conditions: [
      { id: 'shoulder-impingement', name: 'Shoulder Impingement Syndrome', diagnosticCode: '5201', description: 'Limited arm motion due to shoulder impingement' },
      { id: 'rotator-cuff', name: 'Rotator Cuff Tear/Tendinitis', diagnosticCode: '5304', description: 'Injury or degeneration of rotator cuff muscles/tendons' },
      { id: 'shoulder-instability', name: 'Shoulder Instability', diagnosticCode: '5202', description: 'Recurrent dislocation or subluxation of the shoulder' },
      { id: 'shoulder-arthritis', name: 'Shoulder Arthritis', diagnosticCode: '5003', description: 'Degenerative joint disease of the shoulder' },
    ],
  },
  {
    id: 'left-arm',
    label: 'Left Arm / Elbow',
    cx: 38,
    cy: 160,
    r: 16,
    conditions: [
      { id: 'tennis-elbow', name: 'Elbow Strain / Tendinitis', diagnosticCode: '5206', description: 'Lateral or medial epicondylitis from repetitive use' },
      { id: 'elbow-arthritis', name: 'Elbow Arthritis', diagnosticCode: '5003', description: 'Degenerative joint disease of the elbow' },
      { id: 'cubital-tunnel-syndrome', name: 'Cubital Tunnel Syndrome', diagnosticCode: '8516', description: 'Ulnar nerve entrapment at the elbow' },
    ],
  },
  {
    id: 'right-arm',
    label: 'Right Arm / Elbow',
    cx: 162,
    cy: 160,
    r: 16,
    conditions: [
      { id: 'tennis-elbow', name: 'Elbow Strain / Tendinitis', diagnosticCode: '5206', description: 'Lateral or medial epicondylitis from repetitive use' },
      { id: 'elbow-arthritis', name: 'Elbow Arthritis', diagnosticCode: '5003', description: 'Degenerative joint disease of the elbow' },
      { id: 'cubital-tunnel-syndrome', name: 'Cubital Tunnel Syndrome', diagnosticCode: '8516', description: 'Ulnar nerve entrapment at the elbow' },
    ],
  },
  {
    id: 'left-hand',
    label: 'Left Hand / Wrist',
    cx: 24,
    cy: 222,
    r: 14,
    conditions: [
      { id: 'carpal-tunnel', name: 'Carpal Tunnel Syndrome', diagnosticCode: '8515', description: 'Median nerve compression causing numbness and weakness in the hand' },
      { id: 'wrist-tendonitis', name: 'Wrist Tendinitis / Strain', diagnosticCode: '5215', description: 'Chronic wrist pain from repetitive motion or injury' },
      { id: 'trigger-finger', name: 'Trigger Finger', diagnosticCode: '5228', description: 'Locking or catching of finger tendons' },
    ],
  },
  {
    id: 'right-hand',
    label: 'Right Hand / Wrist',
    cx: 176,
    cy: 222,
    r: 14,
    conditions: [
      { id: 'carpal-tunnel', name: 'Carpal Tunnel Syndrome', diagnosticCode: '8515', description: 'Median nerve compression causing numbness and weakness in the hand' },
      { id: 'wrist-tendonitis', name: 'Wrist Tendinitis / Strain', diagnosticCode: '5215', description: 'Chronic wrist pain from repetitive motion or injury' },
      { id: 'trigger-finger', name: 'Trigger Finger', diagnosticCode: '5228', description: 'Locking or catching of finger tendons' },
    ],
  },
  {
    id: 'chest',
    label: 'Chest',
    cx: 100,
    cy: 128,
    r: 20,
    conditions: [
      { id: 'asthma', name: 'Asthma', diagnosticCode: '6602', description: 'Bronchial asthma from environmental or occupational exposures' },
      { id: 'sleep-apnea', name: 'Obstructive Sleep Apnea', diagnosticCode: '6847', description: 'Breathing interruptions during sleep requiring CPAP or treatment' },
      { id: 'costochondritis', name: 'Costochondritis', diagnosticCode: '5321', description: 'Inflammation of rib cartilage causing chest pain' },
      { id: 'hypertension', name: 'Hypertension', diagnosticCode: '7101', description: 'High blood pressure connected to service or secondary to other conditions' },
      { id: 'heart-disease', name: 'Ischemic Heart Disease', diagnosticCode: '7005', description: 'Heart disease, often presumptive for Agent Orange-exposed veterans' },
    ],
  },
  {
    id: 'back',
    label: 'Upper / Mid Back',
    cx: 100,
    cy: 155,
    r: 18,
    conditions: [
      { id: 'thoracic-ddd', name: 'Thoracic Spine Strain', diagnosticCode: '5237', description: 'Upper/mid-back strain from carrying heavy gear or repetitive duties' },
      { id: 'herniated-disc-thoracic', name: 'Thoracic Disc Disease', diagnosticCode: '5243', description: 'Disc degeneration in the thoracic spine' },
      { id: 'scoliosis', name: 'Scoliosis (Aggravation)', diagnosticCode: '5237', description: 'Curvature of the spine aggravated by military service' },
    ],
  },
  {
    id: 'abdomen',
    label: 'Abdomen',
    cx: 100,
    cy: 188,
    r: 18,
    conditions: [
      { id: 'gerd', name: 'GERD', diagnosticCode: '7346', description: 'Gastroesophageal reflux disease, often secondary to medication use or PTSD' },
      { id: 'ibs', name: 'Irritable Bowel Syndrome (IBS)', diagnosticCode: '7319', description: 'Chronic digestive condition linked to stress or service exposures' },
      { id: 'hiatal-hernia', name: 'Hiatal Hernia', diagnosticCode: '7346', description: 'Herniation of the stomach through the diaphragm' },
      { id: 'diabetes', name: 'Type II Diabetes Mellitus', diagnosticCode: '7913', description: 'Presumptive for Agent Orange exposure; also secondary to obesity/medications' },
    ],
  },
  {
    id: 'hips',
    label: 'Hips / Lower Back',
    cx: 100,
    cy: 228,
    r: 20,
    conditions: [
      { id: 'lumbar-strain', name: 'Lumbosacral Strain', diagnosticCode: '5237', description: 'Lower back strain or degenerative disc disease from service' },
      { id: 'herniated-disc-lumbar', name: 'Lumbar Disc Disease', diagnosticCode: '5243', description: 'Herniated or degenerated discs in the lumbar spine' },
      { id: 'sciatica', name: 'Sciatica / Radiculopathy', diagnosticCode: '8520', description: 'Sciatic nerve pain radiating from the lower back into the leg' },
      { id: 'hip-strain', name: 'Hip Strain / Arthritis', diagnosticCode: '5252', description: 'Hip joint degeneration or injury from running, rucking, or parachuting' },
      { id: 'sacroiliac-dysfunction', name: 'SI Joint Dysfunction', diagnosticCode: '5236', description: 'Sacroiliac joint instability or inflammation' },
    ],
  },
  {
    id: 'left-knee',
    label: 'Left Knee',
    cx: 78,
    cy: 305,
    r: 16,
    conditions: [
      { id: 'knee-strain', name: 'Knee Strain / Instability', diagnosticCode: '5257', description: 'Recurrent subluxation or lateral instability of the knee' },
      { id: 'knee-arthritis', name: 'Knee Arthritis', diagnosticCode: '5003', description: 'Degenerative joint disease of the knee' },
      { id: 'meniscus-tear', name: 'Meniscus Tear', diagnosticCode: '5258', description: 'Dislocated semilunar cartilage with locking and effusion' },
      { id: 'patellofemoral-syndrome', name: 'Patellofemoral Pain Syndrome', diagnosticCode: '5260', description: 'Pain around the kneecap from overuse during service' },
    ],
  },
  {
    id: 'right-knee',
    label: 'Right Knee',
    cx: 122,
    cy: 305,
    r: 16,
    conditions: [
      { id: 'knee-strain', name: 'Knee Strain / Instability', diagnosticCode: '5257', description: 'Recurrent subluxation or lateral instability of the knee' },
      { id: 'knee-arthritis', name: 'Knee Arthritis', diagnosticCode: '5003', description: 'Degenerative joint disease of the knee' },
      { id: 'meniscus-tear', name: 'Meniscus Tear', diagnosticCode: '5258', description: 'Dislocated semilunar cartilage with locking and effusion' },
      { id: 'patellofemoral-syndrome', name: 'Patellofemoral Pain Syndrome', diagnosticCode: '5260', description: 'Pain around the kneecap from overuse during service' },
    ],
  },
  {
    id: 'left-leg',
    label: 'Left Leg / Shin',
    cx: 76,
    cy: 350,
    r: 14,
    conditions: [
      { id: 'shin-splints', name: 'Shin Splints (Tibial Stress)', diagnosticCode: '5262', description: 'Chronic anterior tibial pain from marching and running' },
      { id: 'peripheral-neuropathy', name: 'Peripheral Neuropathy', diagnosticCode: '8520', description: 'Nerve damage causing numbness, tingling, or weakness in the legs' },
      { id: 'varicose-veins', name: 'Varicose Veins', diagnosticCode: '7120', description: 'Enlarged veins in the lower extremities from prolonged standing' },
    ],
  },
  {
    id: 'right-leg',
    label: 'Right Leg / Shin',
    cx: 124,
    cy: 350,
    r: 14,
    conditions: [
      { id: 'shin-splints', name: 'Shin Splints (Tibial Stress)', diagnosticCode: '5262', description: 'Chronic anterior tibial pain from marching and running' },
      { id: 'peripheral-neuropathy', name: 'Peripheral Neuropathy', diagnosticCode: '8520', description: 'Nerve damage causing numbness, tingling, or weakness in the legs' },
      { id: 'varicose-veins', name: 'Varicose Veins', diagnosticCode: '7120', description: 'Enlarged veins in the lower extremities from prolonged standing' },
    ],
  },
  {
    id: 'left-foot',
    label: 'Left Foot / Ankle',
    cx: 74,
    cy: 408,
    r: 14,
    conditions: [
      { id: 'plantar-fasciitis', name: 'Plantar Fasciitis', diagnosticCode: '5276', description: 'Heel/foot pain from overuse during military service' },
      { id: 'flat-feet', name: 'Pes Planus (Flat Feet)', diagnosticCode: '5276', description: 'Acquired or aggravated flat feet from prolonged standing/marching' },
      { id: 'ankle-strain', name: 'Ankle Strain / Instability', diagnosticCode: '5271', description: 'Chronic ankle instability from sprains during service' },
      { id: 'bunion', name: 'Hallux Valgus (Bunion)', diagnosticCode: '5280', description: 'Bunion deformity aggravated by ill-fitting military boots' },
    ],
  },
  {
    id: 'right-foot',
    label: 'Right Foot / Ankle',
    cx: 126,
    cy: 408,
    r: 14,
    conditions: [
      { id: 'plantar-fasciitis', name: 'Plantar Fasciitis', diagnosticCode: '5276', description: 'Heel/foot pain from overuse during military service' },
      { id: 'flat-feet', name: 'Pes Planus (Flat Feet)', diagnosticCode: '5276', description: 'Acquired or aggravated flat feet from prolonged standing/marching' },
      { id: 'ankle-strain', name: 'Ankle Strain / Instability', diagnosticCode: '5271', description: 'Chronic ankle instability from sprains during service' },
      { id: 'bunion', name: 'Hallux Valgus (Bunion)', diagnosticCode: '5280', description: 'Bunion deformity aggravated by ill-fitting military boots' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helper: build a unique condition key that accounts for bilateral regions
// ---------------------------------------------------------------------------

function conditionKey(regionId: string, conditionId: string): string {
  return `${regionId}::${conditionId}`;
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

  // Count of selections per region (for the dot badge on the body map)
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const uc of userConditions) {
      if (uc.bodyPart) {
        counts[uc.bodyPart] = (counts[uc.bodyPart] || 0) + 1;
      }
    }
    return counts;
  }, [userConditions]);

  // Currently active region data
  const activeRegion = useMemo(() => {
    if (!selectedRegion) return null;
    return BODY_REGIONS.find((r) => r.id === selectedRegion) ?? null;
  }, [selectedRegion]);

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

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-background">
      <PageContainer className="py-6 space-y-6">
        {/* Back + Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/claims')}
            className="mb-2 -ml-2 text-slate-400 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Claims
          </Button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Activity className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Body Map</h1>
              <p className="text-slate-400 text-sm">
                Tap a body region to view and select VA-ratable conditions
              </p>
            </div>
          </div>
        </div>

        {/* Summary Badge */}
        {totalSelected > 0 && (
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30">
              {totalSelected} condition{totalSelected !== 1 ? 's' : ''} selected
            </Badge>
          </div>
        )}

        {/* Main layout: body diagram + condition panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SVG Body Diagram */}
          <Card className="bg-blue-900/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-slate-300">
                Front View
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center pb-6">
              <svg
                viewBox="0 0 200 440"
                className="w-full max-w-[280px] h-auto select-none"
                role="img"
                aria-label="Interactive body diagram"
              >
                {/* Body silhouette outline */}
                <g fill="none" stroke="currentColor" className="text-slate-600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {/* Head */}
                  <ellipse cx="100" cy="32" rx="18" ry="22" />
                  {/* Neck */}
                  <line x1="93" y1="54" x2="93" y2="70" />
                  <line x1="107" y1="54" x2="107" y2="70" />
                  {/* Torso */}
                  <path d="M 70 70 Q 60 80 55 100 L 52 140 Q 50 170 55 200 L 60 230 Q 65 245 75 248 L 80 248" />
                  <path d="M 130 70 Q 140 80 145 100 L 148 140 Q 150 170 145 200 L 140 230 Q 135 245 125 248 L 120 248" />
                  {/* Shoulders to arms */}
                  <path d="M 70 70 Q 55 72 45 85 L 35 120 Q 30 140 28 160 L 22 200 Q 20 215 22 225" />
                  <path d="M 130 70 Q 145 72 155 85 L 165 120 Q 170 140 172 160 L 178 200 Q 180 215 178 225" />
                  {/* Waist to legs */}
                  <path d="M 80 248 Q 85 260 85 275 L 82 310 Q 80 330 78 355 L 76 390 Q 74 405 72 420 Q 70 430 78 435" />
                  <path d="M 120 248 Q 115 260 115 275 L 118 310 Q 120 330 122 355 L 124 390 Q 126 405 128 420 Q 130 430 122 435" />
                  {/* Inner legs */}
                  <path d="M 95 248 Q 97 265 97 280 L 94 315 Q 92 340 90 360 L 88 395 Q 87 415 85 425" />
                  <path d="M 105 248 Q 103 265 103 280 L 106 315 Q 108 340 110 360 L 112 395 Q 113 415 115 425" />
                  {/* Hands (small ovals) */}
                  <ellipse cx="22" cy="230" rx="6" ry="10" />
                  <ellipse cx="178" cy="230" rx="6" ry="10" />
                  {/* Feet */}
                  <ellipse cx="80" cy="435" rx="10" ry="5" />
                  <ellipse cx="120" cy="435" rx="10" ry="5" />
                </g>

                {/* Clickable hotspot regions */}
                {BODY_REGIONS.map((region) => {
                  const isSelected = selectedRegion === region.id;
                  const isHovered = hoveredRegion === region.id;
                  const count = regionCounts[region.id] || 0;
                  const hasConditions = count > 0;

                  return (
                    <g key={region.id}>
                      {/* Pulse ring for regions with conditions */}
                      {hasConditions && (
                        <circle
                          cx={region.cx}
                          cy={region.cy}
                          r={region.r + 4}
                          fill="none"
                          stroke="rgb(96, 165, 250)"
                          strokeWidth="1"
                          opacity="0.4"
                          className="animate-ping"
                          style={{ transformOrigin: `${region.cx}px ${region.cy}px`, animationDuration: '2s' }}
                        />
                      )}

                      {/* Main hotspot */}
                      <circle
                        cx={region.cx}
                        cy={region.cy}
                        r={region.r}
                        fill={
                          isSelected
                            ? 'rgba(59, 130, 246, 0.35)'
                            : hasConditions
                              ? 'rgba(59, 130, 246, 0.2)'
                              : isHovered
                                ? 'rgba(148, 163, 184, 0.15)'
                                : 'rgba(148, 163, 184, 0.06)'
                        }
                        stroke={
                          isSelected
                            ? 'rgb(96, 165, 250)'
                            : hasConditions
                              ? 'rgb(96, 165, 250)'
                              : isHovered
                                ? 'rgb(148, 163, 184)'
                                : 'rgba(148, 163, 184, 0.3)'
                        }
                        strokeWidth={isSelected || hasConditions ? 2 : 1}
                        className="cursor-pointer transition-all duration-200"
                        onClick={() =>
                          setSelectedRegion(isSelected ? null : region.id)
                        }
                        onMouseEnter={() => setHoveredRegion(region.id)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${region.label}${count > 0 ? `, ${count} condition${count !== 1 ? 's' : ''} selected` : ''}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedRegion(isSelected ? null : region.id);
                          }
                        }}
                      />

                      {/* Count badge for regions with selected conditions */}
                      {hasConditions && (
                        <>
                          <circle
                            cx={region.cx + region.r - 2}
                            cy={region.cy - region.r + 2}
                            r={6}
                            fill="rgb(59, 130, 246)"
                          />
                          <text
                            x={region.cx + region.r - 2}
                            y={region.cy - region.r + 2}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="white"
                            fontSize="8"
                            fontWeight="bold"
                            className="pointer-events-none"
                          >
                            {count}
                          </text>
                        </>
                      )}

                      {/* Label (visible on hover or selection) */}
                      {(isSelected || isHovered) && (
                        <text
                          x={region.cx}
                          y={region.cy + region.r + 12}
                          textAnchor="middle"
                          fill="rgb(148, 163, 184)"
                          fontSize="9"
                          fontWeight="500"
                          className="pointer-events-none select-none"
                        >
                          {region.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </CardContent>
          </Card>

          {/* Condition Selection Panel */}
          <div className="space-y-4">
            {activeRegion ? (
              <>
                {/* Region header */}
                <Card className="bg-blue-900/30 border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                        {activeRegion.label}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRegion(null)}
                        className="text-slate-400 hover:text-white h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-slate-400">
                      Select conditions that apply to your claim
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {activeRegion.conditions.map((condition) => {
                      const key = conditionKey(activeRegion.id, condition.id);
                      const isAdded = addedConditionKeys.has(key);

                      return (
                        <button
                          key={condition.id}
                          type="button"
                          onClick={() =>
                            toggleCondition(activeRegion, condition)
                          }
                          className={`w-full text-left rounded-lg border p-3 transition-all duration-200 ${
                            isAdded
                              ? 'bg-blue-500/15 border-blue-500/40 hover:bg-blue-500/20'
                              : 'bg-white/[0.02] border-border hover:bg-white/[0.05] hover:border-slate-500/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isAdded
                                  ? 'bg-blue-500 border-blue-500'
                                  : 'border-slate-500'
                              }`}
                            >
                              {isAdded && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`font-medium text-sm ${
                                    isAdded ? 'text-blue-300' : 'text-slate-200'
                                  }`}
                                >
                                  {condition.name}
                                </span>
                                {condition.diagnosticCode && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 h-4 border-slate-600 text-slate-400"
                                  >
                                    DC {condition.diagnosticCode}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                {condition.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Empty state when no region is selected */
              <Card className="bg-blue-900/30 border-border">
                <CardContent className="py-16">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Info className="h-7 w-7 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        Select a Body Region
                      </h3>
                      <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                        Tap any highlighted area on the body diagram to see
                        common VA-ratable conditions for that region.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selected conditions summary */}
            {totalSelected > 0 && (
              <Card className="bg-blue-900/30 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-slate-300 flex items-center gap-2">
                    <Plus className="h-4 w-4 text-blue-400" />
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
                        const regionLabel = region?.label || uc.bodyPart;

                        return (
                          <Badge
                            key={uc.id}
                            className="bg-blue-500/15 text-blue-300 border border-blue-500/30 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 cursor-pointer transition-colors gap-1 pr-1.5"
                            onClick={() => removeUserCondition(uc.id)}
                          >
                            <span className="max-w-[180px] truncate">
                              {label}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-0.5">
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
    </div>
  );
}
