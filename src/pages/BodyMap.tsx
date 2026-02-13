import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Check,
  X,
  Activity,
  Info,
  Brain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useAppStore from '@/store/useAppStore';
import { PageContainer } from '@/components/PageContainer';
import type { UserCondition } from '@/store/useAppStore';

// ---------------------------------------------------------------------------
// Body region data: each region maps to a label and a curated list of common
// VA-ratable conditions
// ---------------------------------------------------------------------------

interface BodyRegion {
  id: string;
  label: string;
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
    conditions: [
      { id: 'tbi', name: 'Traumatic Brain Injury (TBI)', diagnosticCode: '8045', description: 'Residuals of a traumatic brain injury sustained during service' },
      { id: 'migraines', name: 'Migraine Headaches', diagnosticCode: '8100', description: 'Chronic or prostrating migraine headaches' },
    ],
  },
  {
    id: 'mental',
    label: 'Mental Health',
    conditions: [
      { id: 'ptsd', name: 'PTSD', diagnosticCode: '9411', description: 'Post-traumatic stress disorder from in-service stressor events' },
      { id: 'anxiety', name: 'Generalized Anxiety Disorder', diagnosticCode: '9400', description: 'Persistent anxiety linked to military service' },
      { id: 'depression', name: 'Major Depressive Disorder', diagnosticCode: '9434', description: 'Depressive disorder connected to service experiences' },
    ],
  },
  {
    id: 'face-jaw',
    label: 'Face & Jaw',
    conditions: [
      { id: 'tmj', name: 'TMJ (Temporomandibular Joint) Disorder', diagnosticCode: '9905', description: 'Jaw pain or dysfunction from injury or stress' },
      { id: 'facial-scarring', name: 'Facial Scarring', diagnosticCode: '7800', description: 'Disfigurement from service-related injuries' },
    ],
  },
  {
    id: 'eyes',
    label: 'Eyes',
    conditions: [
      { id: 'vision-loss', name: 'Vision Impairment', diagnosticCode: '6061', description: 'Reduced visual acuity from service injury or disease' },
      { id: 'dry-eye', name: 'Dry Eye Syndrome', diagnosticCode: '6025', description: 'Chronic eye dryness and irritation' },
    ],
  },
  {
    id: 'ears',
    label: 'Ears',
    conditions: [
      { id: 'tinnitus', name: 'Tinnitus', diagnosticCode: '6260', description: 'Persistent ringing or buzzing in the ears from noise exposure' },
      { id: 'hearing-loss', name: 'Hearing Loss', diagnosticCode: '6100', description: 'Service-connected hearing impairment' },
    ],
  },
  {
    id: 'neck',
    label: 'Neck',
    conditions: [
      { id: 'cervical-strain', name: 'Cervical Spine Strain', diagnosticCode: '5237', description: 'Neck strain or degenerative changes from service duties' },
      { id: 'cervical-radiculopathy', name: 'Cervical Radiculopathy', diagnosticCode: '8510', description: 'Nerve compression in the cervical spine causing pain/numbness' },
      { id: 'herniated-disc-cervical', name: 'Cervical Disc Disease', diagnosticCode: '5243', description: 'Intervertebral disc degeneration in the cervical spine' },
    ],
  },
  {
    id: 'left-shoulder',
    label: 'Left Shoulder',
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
    conditions: [
      { id: 'shoulder-impingement', name: 'Shoulder Impingement Syndrome', diagnosticCode: '5201', description: 'Limited arm motion due to shoulder impingement' },
      { id: 'rotator-cuff', name: 'Rotator Cuff Tear/Tendinitis', diagnosticCode: '5304', description: 'Injury or degeneration of rotator cuff muscles/tendons' },
      { id: 'shoulder-instability', name: 'Shoulder Instability', diagnosticCode: '5202', description: 'Recurrent dislocation or subluxation of the shoulder' },
      { id: 'shoulder-arthritis', name: 'Shoulder Arthritis', diagnosticCode: '5003', description: 'Degenerative joint disease of the shoulder' },
    ],
  },
  {
    id: 'left-upper-arm',
    label: 'Left Upper Arm',
    conditions: [
      { id: 'bicep-tendinitis', name: 'Bicep Tendinitis', diagnosticCode: '5305', description: 'Inflammation of the bicep tendon from overuse' },
    ],
  },
  {
    id: 'right-upper-arm',
    label: 'Right Upper Arm',
    conditions: [
      { id: 'bicep-tendinitis', name: 'Bicep Tendinitis', diagnosticCode: '5305', description: 'Inflammation of the bicep tendon from overuse' },
    ],
  },
  {
    id: 'left-forearm',
    label: 'Left Forearm / Elbow',
    conditions: [
      { id: 'tennis-elbow', name: 'Elbow Strain / Tendinitis', diagnosticCode: '5206', description: 'Lateral or medial epicondylitis from repetitive use' },
      { id: 'elbow-arthritis', name: 'Elbow Arthritis', diagnosticCode: '5003', description: 'Degenerative joint disease of the elbow' },
      { id: 'cubital-tunnel-syndrome', name: 'Cubital Tunnel Syndrome', diagnosticCode: '8516', description: 'Ulnar nerve entrapment at the elbow' },
    ],
  },
  {
    id: 'right-forearm',
    label: 'Right Forearm / Elbow',
    conditions: [
      { id: 'tennis-elbow', name: 'Elbow Strain / Tendinitis', diagnosticCode: '5206', description: 'Lateral or medial epicondylitis from repetitive use' },
      { id: 'elbow-arthritis', name: 'Elbow Arthritis', diagnosticCode: '5003', description: 'Degenerative joint disease of the elbow' },
      { id: 'cubital-tunnel-syndrome', name: 'Cubital Tunnel Syndrome', diagnosticCode: '8516', description: 'Ulnar nerve entrapment at the elbow' },
    ],
  },
  {
    id: 'left-hand',
    label: 'Left Hand / Wrist',
    conditions: [
      { id: 'carpal-tunnel', name: 'Carpal Tunnel Syndrome', diagnosticCode: '8515', description: 'Median nerve compression causing numbness and weakness in the hand' },
      { id: 'wrist-tendonitis', name: 'Wrist Tendinitis / Strain', diagnosticCode: '5215', description: 'Chronic wrist pain from repetitive motion or injury' },
      { id: 'trigger-finger', name: 'Trigger Finger', diagnosticCode: '5228', description: 'Locking or catching of finger tendons' },
    ],
  },
  {
    id: 'right-hand',
    label: 'Right Hand / Wrist',
    conditions: [
      { id: 'carpal-tunnel', name: 'Carpal Tunnel Syndrome', diagnosticCode: '8515', description: 'Median nerve compression causing numbness and weakness in the hand' },
      { id: 'wrist-tendonitis', name: 'Wrist Tendinitis / Strain', diagnosticCode: '5215', description: 'Chronic wrist pain from repetitive motion or injury' },
      { id: 'trigger-finger', name: 'Trigger Finger', diagnosticCode: '5228', description: 'Locking or catching of finger tendons' },
    ],
  },
  {
    id: 'chest',
    label: 'Chest',
    conditions: [
      { id: 'asthma', name: 'Asthma', diagnosticCode: '6602', description: 'Bronchial asthma from environmental or occupational exposures' },
      { id: 'sleep-apnea', name: 'Obstructive Sleep Apnea', diagnosticCode: '6847', description: 'Breathing interruptions during sleep requiring CPAP or treatment' },
      { id: 'costochondritis', name: 'Costochondritis', diagnosticCode: '5321', description: 'Inflammation of rib cartilage causing chest pain' },
      { id: 'hypertension', name: 'Hypertension', diagnosticCode: '7101', description: 'High blood pressure connected to service or secondary to other conditions' },
      { id: 'heart-disease', name: 'Ischemic Heart Disease', diagnosticCode: '7005', description: 'Heart disease, often presumptive for Agent Orange-exposed veterans' },
    ],
  },
  {
    id: 'upper-back',
    label: 'Upper Back',
    conditions: [
      { id: 'thoracic-ddd', name: 'Thoracic Spine Strain', diagnosticCode: '5237', description: 'Upper/mid-back strain from carrying heavy gear or repetitive duties' },
      { id: 'herniated-disc-thoracic', name: 'Thoracic Disc Disease', diagnosticCode: '5243', description: 'Disc degeneration in the thoracic spine' },
      { id: 'scoliosis', name: 'Scoliosis (Aggravation)', diagnosticCode: '5237', description: 'Curvature of the spine aggravated by military service' },
    ],
  },
  {
    id: 'abdomen',
    label: 'Abdomen',
    conditions: [
      { id: 'gerd', name: 'GERD', diagnosticCode: '7346', description: 'Gastroesophageal reflux disease, often secondary to medication use or PTSD' },
      { id: 'ibs', name: 'Irritable Bowel Syndrome (IBS)', diagnosticCode: '7319', description: 'Chronic digestive condition linked to stress or service exposures' },
      { id: 'hiatal-hernia', name: 'Hiatal Hernia', diagnosticCode: '7346', description: 'Herniation of the stomach through the diaphragm' },
      { id: 'diabetes', name: 'Type II Diabetes Mellitus', diagnosticCode: '7913', description: 'Presumptive for Agent Orange exposure; also secondary to obesity/medications' },
    ],
  },
  {
    id: 'lower-back',
    label: 'Lower Back',
    conditions: [
      { id: 'lumbar-strain', name: 'Lumbosacral Strain', diagnosticCode: '5237', description: 'Lower back strain or degenerative disc disease from service' },
      { id: 'herniated-disc-lumbar', name: 'Lumbar Disc Disease', diagnosticCode: '5243', description: 'Herniated or degenerated discs in the lumbar spine' },
      { id: 'sciatica', name: 'Sciatica / Radiculopathy', diagnosticCode: '8520', description: 'Sciatic nerve pain radiating from the lower back into the leg' },
    ],
  },
  {
    id: 'left-hip',
    label: 'Left Hip',
    conditions: [
      { id: 'hip-strain', name: 'Hip Strain / Arthritis', diagnosticCode: '5252', description: 'Hip joint degeneration or injury from running, rucking, or parachuting' },
      { id: 'sacroiliac-dysfunction', name: 'SI Joint Dysfunction', diagnosticCode: '5236', description: 'Sacroiliac joint instability or inflammation' },
    ],
  },
  {
    id: 'right-hip',
    label: 'Right Hip',
    conditions: [
      { id: 'hip-strain', name: 'Hip Strain / Arthritis', diagnosticCode: '5252', description: 'Hip joint degeneration or injury from running, rucking, or parachuting' },
      { id: 'sacroiliac-dysfunction', name: 'SI Joint Dysfunction', diagnosticCode: '5236', description: 'Sacroiliac joint instability or inflammation' },
    ],
  },
  {
    id: 'left-upper-leg',
    label: 'Left Upper Leg',
    conditions: [
      { id: 'hamstring-strain', name: 'Hamstring Strain', diagnosticCode: '5312', description: 'Muscle tear or strain from training or service activities' },
    ],
  },
  {
    id: 'right-upper-leg',
    label: 'Right Upper Leg',
    conditions: [
      { id: 'hamstring-strain', name: 'Hamstring Strain', diagnosticCode: '5312', description: 'Muscle tear or strain from training or service activities' },
    ],
  },
  {
    id: 'left-knee',
    label: 'Left Knee',
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
    conditions: [
      { id: 'knee-strain', name: 'Knee Strain / Instability', diagnosticCode: '5257', description: 'Recurrent subluxation or lateral instability of the knee' },
      { id: 'knee-arthritis', name: 'Knee Arthritis', diagnosticCode: '5003', description: 'Degenerative joint disease of the knee' },
      { id: 'meniscus-tear', name: 'Meniscus Tear', diagnosticCode: '5258', description: 'Dislocated semilunar cartilage with locking and effusion' },
      { id: 'patellofemoral-syndrome', name: 'Patellofemoral Pain Syndrome', diagnosticCode: '5260', description: 'Pain around the kneecap from overuse during service' },
    ],
  },
  {
    id: 'left-lower-leg',
    label: 'Left Lower Leg / Shin',
    conditions: [
      { id: 'shin-splints', name: 'Shin Splints (Tibial Stress)', diagnosticCode: '5262', description: 'Chronic anterior tibial pain from marching and running' },
      { id: 'peripheral-neuropathy', name: 'Peripheral Neuropathy', diagnosticCode: '8520', description: 'Nerve damage causing numbness, tingling, or weakness in the legs' },
      { id: 'varicose-veins', name: 'Varicose Veins', diagnosticCode: '7120', description: 'Enlarged veins in the lower extremities from prolonged standing' },
    ],
  },
  {
    id: 'right-lower-leg',
    label: 'Right Lower Leg / Shin',
    conditions: [
      { id: 'shin-splints', name: 'Shin Splints (Tibial Stress)', diagnosticCode: '5262', description: 'Chronic anterior tibial pain from marching and running' },
      { id: 'peripheral-neuropathy', name: 'Peripheral Neuropathy', diagnosticCode: '8520', description: 'Nerve damage causing numbness, tingling, or weakness in the legs' },
      { id: 'varicose-veins', name: 'Varicose Veins', diagnosticCode: '7120', description: 'Enlarged veins in the lower extremities from prolonged standing' },
    ],
  },
  {
    id: 'left-foot',
    label: 'Left Foot / Ankle',
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
            <div className="p-2.5 rounded-xl bg-[rgba(197,164,66,0.1)] border border-[rgba(197,164,66,0.2)]">
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

        {/* Summary Badge */}
        {totalSelected > 0 && (
          <div className="flex items-center gap-2">
            <Badge className="bg-[rgba(197,164,66,0.2)] text-gold border border-[rgba(197,164,66,0.3)] hover:bg-[rgba(197,164,66,0.3)]">
              {totalSelected} condition{totalSelected !== 1 ? 's' : ''} selected
            </Badge>
          </div>
        )}

        {/* Main layout: body diagram + condition panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SVG Body Diagram */}
          <Card className="bg-[rgba(197,164,66,0.08)] border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">
                Front View
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center pb-6">
              <svg
                viewBox="0 0 400 800"
                className="w-full max-w-[400px] h-auto select-none"
                role="application"
                aria-label="Interactive body diagram — use Tab to navigate regions"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))' }}
              >
                <defs>
                  {/* Gold gradient for active regions */}
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C5A442" />
                    <stop offset="100%" stopColor="#E8D48B" />
                  </linearGradient>

                  {/* Pulse animation */}
                  <style>
                    {`
                      @keyframes gentle-pulse {
                        0%, 100% { opacity: 0.8; }
                        50% { opacity: 1; }
                      }
                      .selected-region {
                        animation: gentle-pulse 2s ease-in-out infinite;
                      }
                      .body-region {
                        transition: fill 200ms ease, stroke 200ms ease, filter 200ms ease;
                      }
                      .body-region:hover {
                        cursor: pointer;
                        filter: brightness(1.2);
                      }
                    `}
                  </style>
                </defs>

                {/* Body silhouette - filled paths */}
                <g>
                  {/* HEAD */}
                  <path
                    id="region-head"
                    className={`body-region ${selectedRegion === 'head' ? 'selected-region' : ''}`}
                    d="M 200 50 C 200 30, 215 20, 230 25 C 240 28, 245 40, 245 60 C 245 75, 240 85, 230 88 C 215 92, 185 92, 170 88 C 160 85, 155 75, 155 60 C 155 40, 160 28, 170 25 C 185 20, 200 30, 200 50 Z"
                    fill={
                      selectedRegion === 'head'
                        ? 'url(#goldGradient)'
                        : regionCounts['head']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'head'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'head' || regionCounts['head']
                        ? '#C5A442'
                        : hoveredRegion === 'head'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'head' || regionCounts['head'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'head' ? null : 'head')}
                    onMouseEnter={() => setHoveredRegion('head')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Head${regionCounts['head'] ? `, ${regionCounts['head']} condition(s)` : ''}`}
                  />

                  {/* MENTAL (brain icon overlay on head) */}
                  <g
                    id="region-mental"
                    className={selectedRegion === 'mental' ? 'selected-region' : ''}
                    onClick={() => setSelectedRegion(selectedRegion === 'mental' ? null : 'mental')}
                    onMouseEnter={() => setHoveredRegion('mental')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Mental Health${regionCounts['mental'] ? `, ${regionCounts['mental']} condition(s)` : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx="200"
                      cy="45"
                      r="18"
                      fill={
                        selectedRegion === 'mental'
                          ? 'url(#goldGradient)'
                          : regionCounts['mental']
                            ? 'rgba(197,164,66,0.4)'
                            : hoveredRegion === 'mental'
                              ? 'rgba(197,164,66,0.25)'
                              : 'rgba(148,163,184,0.1)'
                      }
                      stroke={
                        selectedRegion === 'mental' || regionCounts['mental']
                          ? '#C5A442'
                          : hoveredRegion === 'mental'
                            ? '#C5A442'
                            : 'rgba(148,163,184,0.3)'
                      }
                      strokeWidth={selectedRegion === 'mental' || regionCounts['mental'] ? 2 : 1}
                      className="body-region"
                    />
                    <text
                      x="200"
                      y="50"
                      textAnchor="middle"
                      fill={selectedRegion === 'mental' || hoveredRegion === 'mental' ? '#C5A442' : '#94A3B8'}
                      fontSize="20"
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      🧠
                    </text>
                  </g>

                  {/* FACE & JAW */}
                  <path
                    id="region-face-jaw"
                    className={`body-region ${selectedRegion === 'face-jaw' ? 'selected-region' : ''}`}
                    d="M 170 70 Q 155 75, 155 85 L 155 95 Q 160 105, 180 105 L 220 105 Q 240 105, 245 95 L 245 85 Q 245 75, 230 70 Z"
                    fill={
                      selectedRegion === 'face-jaw'
                        ? 'url(#goldGradient)'
                        : regionCounts['face-jaw']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'face-jaw'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'face-jaw' || regionCounts['face-jaw']
                        ? '#C5A442'
                        : hoveredRegion === 'face-jaw'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'face-jaw' || regionCounts['face-jaw'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'face-jaw' ? null : 'face-jaw')}
                    onMouseEnter={() => setHoveredRegion('face-jaw')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Face & Jaw${regionCounts['face-jaw'] ? `, ${regionCounts['face-jaw']} condition(s)` : ''}`}
                  />

                  {/* EYES */}
                  <ellipse
                    id="region-eyes"
                    className={`body-region ${selectedRegion === 'eyes' ? 'selected-region' : ''}`}
                    cx="200"
                    cy="55"
                    rx="30"
                    ry="8"
                    fill={
                      selectedRegion === 'eyes'
                        ? 'url(#goldGradient)'
                        : regionCounts['eyes']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'eyes'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'eyes' || regionCounts['eyes']
                        ? '#C5A442'
                        : hoveredRegion === 'eyes'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'eyes' || regionCounts['eyes'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'eyes' ? null : 'eyes')}
                    onMouseEnter={() => setHoveredRegion('eyes')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Eyes${regionCounts['eyes'] ? `, ${regionCounts['eyes']} condition(s)` : ''}`}
                  />

                  {/* EARS */}
                  <g
                    id="region-ears"
                    className={`body-region ${selectedRegion === 'ears' ? 'selected-region' : ''}`}
                    onClick={() => setSelectedRegion(selectedRegion === 'ears' ? null : 'ears')}
                    onMouseEnter={() => setHoveredRegion('ears')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Ears${regionCounts['ears'] ? `, ${regionCounts['ears']} condition(s)` : ''}`}
                  >
                    <ellipse
                      cx="150"
                      cy="55"
                      rx="8"
                      ry="15"
                      fill={
                        selectedRegion === 'ears'
                          ? 'url(#goldGradient)'
                          : regionCounts['ears']
                            ? 'rgba(197,164,66,0.4)'
                            : hoveredRegion === 'ears'
                              ? 'rgba(197,164,66,0.25)'
                              : ''
                      }
                      stroke={
                        selectedRegion === 'ears' || regionCounts['ears']
                          ? '#C5A442'
                          : hoveredRegion === 'ears'
                            ? '#C5A442'
                            : ''
                      }
                      strokeWidth={selectedRegion === 'ears' || regionCounts['ears'] ? 2 : 0}
                    />
                    <ellipse
                      cx="250"
                      cy="55"
                      rx="8"
                      ry="15"
                      fill={
                        selectedRegion === 'ears'
                          ? 'url(#goldGradient)'
                          : regionCounts['ears']
                            ? 'rgba(197,164,66,0.4)'
                            : hoveredRegion === 'ears'
                              ? 'rgba(197,164,66,0.25)'
                              : ''
                      }
                      stroke={
                        selectedRegion === 'ears' || regionCounts['ears']
                          ? '#C5A442'
                          : hoveredRegion === 'ears'
                            ? '#C5A442'
                            : ''
                      }
                      strokeWidth={selectedRegion === 'ears' || regionCounts['ears'] ? 2 : 0}
                    />
                  </g>

                  {/* NECK */}
                  <path
                    id="region-neck"
                    className={`body-region ${selectedRegion === 'neck' ? 'selected-region' : ''}`}
                    d="M 180 105 Q 185 110, 185 125 L 185 145 L 215 145 L 215 125 Q 215 110, 220 105 L 180 105 Z"
                    fill={
                      selectedRegion === 'neck'
                        ? 'url(#goldGradient)'
                        : regionCounts['neck']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'neck'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'neck' || regionCounts['neck']
                        ? '#C5A442'
                        : hoveredRegion === 'neck'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'neck' || regionCounts['neck'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'neck' ? null : 'neck')}
                    onMouseEnter={() => setHoveredRegion('neck')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Neck${regionCounts['neck'] ? `, ${regionCounts['neck']} condition(s)` : ''}`}
                  />

                  {/* LEFT SHOULDER */}
                  <path
                    id="region-left-shoulder"
                    className={`body-region ${selectedRegion === 'left-shoulder' ? 'selected-region' : ''}`}
                    d="M 145 145 Q 120 150, 110 165 Q 105 175, 108 185 Q 112 195, 125 195 Q 140 195, 150 185 L 160 170 L 185 145 Z"
                    fill={
                      selectedRegion === 'left-shoulder'
                        ? 'url(#goldGradient)'
                        : regionCounts['left-shoulder']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'left-shoulder'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'left-shoulder' || regionCounts['left-shoulder']
                        ? '#C5A442'
                        : hoveredRegion === 'left-shoulder'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'left-shoulder' || regionCounts['left-shoulder'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'left-shoulder' ? null : 'left-shoulder')}
                    onMouseEnter={() => setHoveredRegion('left-shoulder')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Left Shoulder${regionCounts['left-shoulder'] ? `, ${regionCounts['left-shoulder']} condition(s)` : ''}`}
                  />

                  {/* RIGHT SHOULDER */}
                  <path
                    id="region-right-shoulder"
                    className={`body-region ${selectedRegion === 'right-shoulder' ? 'selected-region' : ''}`}
                    d="M 255 145 Q 280 150, 290 165 Q 295 175, 292 185 Q 288 195, 275 195 Q 260 195, 250 185 L 240 170 L 215 145 Z"
                    fill={
                      selectedRegion === 'right-shoulder'
                        ? 'url(#goldGradient)'
                        : regionCounts['right-shoulder']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'right-shoulder'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'right-shoulder' || regionCounts['right-shoulder']
                        ? '#C5A442'
                        : hoveredRegion === 'right-shoulder'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'right-shoulder' || regionCounts['right-shoulder'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'right-shoulder' ? null : 'right-shoulder')}
                    onMouseEnter={() => setHoveredRegion('right-shoulder')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Right Shoulder${regionCounts['right-shoulder'] ? `, ${regionCounts['right-shoulder']} condition(s)` : ''}`}
                  />

                  {/* CHEST */}
                  <path
                    id="region-chest"
                    className={`body-region ${selectedRegion === 'chest' ? 'selected-region' : ''}`}
                    d="M 160 170 Q 155 180, 155 200 L 155 250 Q 155 265, 165 270 L 235 270 Q 245 265, 245 250 L 245 200 Q 245 180, 240 170 L 215 145 L 185 145 Z"
                    fill={
                      selectedRegion === 'chest'
                        ? 'url(#goldGradient)'
                        : regionCounts['chest']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'chest'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'chest' || regionCounts['chest']
                        ? '#C5A442'
                        : hoveredRegion === 'chest'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'chest' || regionCounts['chest'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'chest' ? null : 'chest')}
                    onMouseEnter={() => setHoveredRegion('chest')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Chest${regionCounts['chest'] ? `, ${regionCounts['chest']} condition(s)` : ''}`}
                  />

                  {/* UPPER BACK */}
                  <path
                    id="region-upper-back"
                    className={`body-region ${selectedRegion === 'upper-back' ? 'selected-region' : ''}`}
                    d="M 165 270 Q 160 280, 160 295 L 160 330 L 240 330 L 240 295 Q 240 280, 235 270 Z"
                    fill={
                      selectedRegion === 'upper-back'
                        ? 'url(#goldGradient)'
                        : regionCounts['upper-back']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'upper-back'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'upper-back' || regionCounts['upper-back']
                        ? '#C5A442'
                        : hoveredRegion === 'upper-back'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'upper-back' || regionCounts['upper-back'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'upper-back' ? null : 'upper-back')}
                    onMouseEnter={() => setHoveredRegion('upper-back')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Upper Back${regionCounts['upper-back'] ? `, ${regionCounts['upper-back']} condition(s)` : ''}`}
                  />

                  {/* ABDOMEN */}
                  <path
                    id="region-abdomen"
                    className={`body-region ${selectedRegion === 'abdomen' ? 'selected-region' : ''}`}
                    d="M 160 330 Q 155 345, 155 365 L 155 390 Q 158 405, 170 410 L 230 410 Q 242 405, 245 390 L 245 365 Q 245 345, 240 330 Z"
                    fill={
                      selectedRegion === 'abdomen'
                        ? 'url(#goldGradient)'
                        : regionCounts['abdomen']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'abdomen'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'abdomen' || regionCounts['abdomen']
                        ? '#C5A442'
                        : hoveredRegion === 'abdomen'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'abdomen' || regionCounts['abdomen'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'abdomen' ? null : 'abdomen')}
                    onMouseEnter={() => setHoveredRegion('abdomen')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Abdomen${regionCounts['abdomen'] ? `, ${regionCounts['abdomen']} condition(s)` : ''}`}
                  />

                  {/* LOWER BACK */}
                  <path
                    id="region-lower-back"
                    className={`body-region ${selectedRegion === 'lower-back' ? 'selected-region' : ''}`}
                    d="M 170 410 Q 165 420, 165 435 L 165 455 L 235 455 L 235 435 Q 235 420, 230 410 Z"
                    fill={
                      selectedRegion === 'lower-back'
                        ? 'url(#goldGradient)'
                        : regionCounts['lower-back']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'lower-back'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'lower-back' || regionCounts['lower-back']
                        ? '#C5A442'
                        : hoveredRegion === 'lower-back'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'lower-back' || regionCounts['lower-back'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'lower-back' ? null : 'lower-back')}
                    onMouseEnter={() => setHoveredRegion('lower-back')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Lower Back${regionCounts['lower-back'] ? `, ${regionCounts['lower-back']} condition(s)` : ''}`}
                  />

                  {/* LEFT UPPER ARM */}
                  <path
                    id="region-left-upper-arm"
                    className={`body-region ${selectedRegion === 'left-upper-arm' ? 'selected-region' : ''}`}
                    d="M 125 195 Q 115 205, 108 220 L 95 260 L 102 265 L 118 225 Q 125 210, 135 200 Z"
                    fill={
                      selectedRegion === 'left-upper-arm'
                        ? 'url(#goldGradient)'
                        : regionCounts['left-upper-arm']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'left-upper-arm'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'left-upper-arm' || regionCounts['left-upper-arm']
                        ? '#C5A442'
                        : hoveredRegion === 'left-upper-arm'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'left-upper-arm' || regionCounts['left-upper-arm'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'left-upper-arm' ? null : 'left-upper-arm')}
                    onMouseEnter={() => setHoveredRegion('left-upper-arm')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Left Upper Arm${regionCounts['left-upper-arm'] ? `, ${regionCounts['left-upper-arm']} condition(s)` : ''}`}
                  />

                  {/* RIGHT UPPER ARM */}
                  <path
                    id="region-right-upper-arm"
                    className={`body-region ${selectedRegion === 'right-upper-arm' ? 'selected-region' : ''}`}
                    d="M 275 195 Q 285 205, 292 220 L 305 260 L 298 265 L 282 225 Q 275 210, 265 200 Z"
                    fill={
                      selectedRegion === 'right-upper-arm'
                        ? 'url(#goldGradient)'
                        : regionCounts['right-upper-arm']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'right-upper-arm'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'right-upper-arm' || regionCounts['right-upper-arm']
                        ? '#C5A442'
                        : hoveredRegion === 'right-upper-arm'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'right-upper-arm' || regionCounts['right-upper-arm'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'right-upper-arm' ? null : 'right-upper-arm')}
                    onMouseEnter={() => setHoveredRegion('right-upper-arm')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Right Upper Arm${regionCounts['right-upper-arm'] ? `, ${regionCounts['right-upper-arm']} condition(s)` : ''}`}
                  />

                  {/* LEFT FOREARM */}
                  <path
                    id="region-left-forearm"
                    className={`body-region ${selectedRegion === 'left-forearm' ? 'selected-region' : ''}`}
                    d="M 95 260 Q 88 280, 82 305 L 72 350 L 80 352 L 90 308 Q 95 285, 102 265 Z"
                    fill={
                      selectedRegion === 'left-forearm'
                        ? 'url(#goldGradient)'
                        : regionCounts['left-forearm']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'left-forearm'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'left-forearm' || regionCounts['left-forearm']
                        ? '#C5A442'
                        : hoveredRegion === 'left-forearm'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'left-forearm' || regionCounts['left-forearm'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'left-forearm' ? null : 'left-forearm')}
                    onMouseEnter={() => setHoveredRegion('left-forearm')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Left Forearm${regionCounts['left-forearm'] ? `, ${regionCounts['left-forearm']} condition(s)` : ''}`}
                  />

                  {/* RIGHT FOREARM */}
                  <path
                    id="region-right-forearm"
                    className={`body-region ${selectedRegion === 'right-forearm' ? 'selected-region' : ''}`}
                    d="M 305 260 Q 312 280, 318 305 L 328 350 L 320 352 L 310 308 Q 305 285, 298 265 Z"
                    fill={
                      selectedRegion === 'right-forearm'
                        ? 'url(#goldGradient)'
                        : regionCounts['right-forearm']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'right-forearm'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'right-forearm' || regionCounts['right-forearm']
                        ? '#C5A442'
                        : hoveredRegion === 'right-forearm'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'right-forearm' || regionCounts['right-forearm'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'right-forearm' ? null : 'right-forearm')}
                    onMouseEnter={() => setHoveredRegion('right-forearm')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Right Forearm${regionCounts['right-forearm'] ? `, ${regionCounts['right-forearm']} condition(s)` : ''}`}
                  />

                  {/* LEFT HAND */}
                  <ellipse
                    id="region-left-hand"
                    className={`body-region ${selectedRegion === 'left-hand' ? 'selected-region' : ''}`}
                    cx="72"
                    cy="365"
                    rx="12"
                    ry="20"
                    fill={
                      selectedRegion === 'left-hand'
                        ? 'url(#goldGradient)'
                        : regionCounts['left-hand']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'left-hand'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'left-hand' || regionCounts['left-hand']
                        ? '#C5A442'
                        : hoveredRegion === 'left-hand'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'left-hand' || regionCounts['left-hand'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'left-hand' ? null : 'left-hand')}
                    onMouseEnter={() => setHoveredRegion('left-hand')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Left Hand${regionCounts['left-hand'] ? `, ${regionCounts['left-hand']} condition(s)` : ''}`}
                  />

                  {/* RIGHT HAND */}
                  <ellipse
                    id="region-right-hand"
                    className={`body-region ${selectedRegion === 'right-hand' ? 'selected-region' : ''}`}
                    cx="328"
                    cy="365"
                    rx="12"
                    ry="20"
                    fill={
                      selectedRegion === 'right-hand'
                        ? 'url(#goldGradient)'
                        : regionCounts['right-hand']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'right-hand'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'right-hand' || regionCounts['right-hand']
                        ? '#C5A442'
                        : hoveredRegion === 'right-hand'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'right-hand' || regionCounts['right-hand'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'right-hand' ? null : 'right-hand')}
                    onMouseEnter={() => setHoveredRegion('right-hand')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Right Hand${regionCounts['right-hand'] ? `, ${regionCounts['right-hand']} condition(s)` : ''}`}
                  />

                  {/* LEFT HIP */}
                  <path
                    id="region-left-hip"
                    className={`body-region ${selectedRegion === 'left-hip' ? 'selected-region' : ''}`}
                    d="M 165 455 Q 160 465, 158 480 L 155 505 L 175 505 L 178 480 Q 180 465, 185 455 Z"
                    fill={
                      selectedRegion === 'left-hip'
                        ? 'url(#goldGradient)'
                        : regionCounts['left-hip']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'left-hip'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'left-hip' || regionCounts['left-hip']
                        ? '#C5A442'
                        : hoveredRegion === 'left-hip'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'left-hip' || regionCounts['left-hip'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'left-hip' ? null : 'left-hip')}
                    onMouseEnter={() => setHoveredRegion('left-hip')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Left Hip${regionCounts['left-hip'] ? `, ${regionCounts['left-hip']} condition(s)` : ''}`}
                  />

                  {/* RIGHT HIP */}
                  <path
                    id="region-right-hip"
                    className={`body-region ${selectedRegion === 'right-hip' ? 'selected-region' : ''}`}
                    d="M 235 455 Q 240 465, 242 480 L 245 505 L 225 505 L 222 480 Q 220 465, 215 455 Z"
                    fill={
                      selectedRegion === 'right-hip'
                        ? 'url(#goldGradient)'
                        : regionCounts['right-hip']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'right-hip'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'right-hip' || regionCounts['right-hip']
                        ? '#C5A442'
                        : hoveredRegion === 'right-hip'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'right-hip' || regionCounts['right-hip'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'right-hip' ? null : 'right-hip')}
                    onMouseEnter={() => setHoveredRegion('right-hip')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Right Hip${regionCounts['right-hip'] ? `, ${regionCounts['right-hip']} condition(s)` : ''}`}
                  />

                  {/* LEFT UPPER LEG */}
                  <path
                    id="region-left-upper-leg"
                    className={`body-region ${selectedRegion === 'left-upper-leg' ? 'selected-region' : ''}`}
                    d="M 155 505 Q 150 525, 148 550 L 145 585 L 168 585 L 172 550 Q 174 525, 175 505 Z"
                    fill={
                      selectedRegion === 'left-upper-leg'
                        ? 'url(#goldGradient)'
                        : regionCounts['left-upper-leg']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'left-upper-leg'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'left-upper-leg' || regionCounts['left-upper-leg']
                        ? '#C5A442'
                        : hoveredRegion === 'left-upper-leg'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'left-upper-leg' || regionCounts['left-upper-leg'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'left-upper-leg' ? null : 'left-upper-leg')}
                    onMouseEnter={() => setHoveredRegion('left-upper-leg')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Left Upper Leg${regionCounts['left-upper-leg'] ? `, ${regionCounts['left-upper-leg']} condition(s)` : ''}`}
                  />

                  {/* RIGHT UPPER LEG */}
                  <path
                    id="region-right-upper-leg"
                    className={`body-region ${selectedRegion === 'right-upper-leg' ? 'selected-region' : ''}`}
                    d="M 245 505 Q 250 525, 252 550 L 255 585 L 232 585 L 228 550 Q 226 525, 225 505 Z"
                    fill={
                      selectedRegion === 'right-upper-leg'
                        ? 'url(#goldGradient)'
                        : regionCounts['right-upper-leg']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'right-upper-leg'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'right-upper-leg' || regionCounts['right-upper-leg']
                        ? '#C5A442'
                        : hoveredRegion === 'right-upper-leg'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'right-upper-leg' || regionCounts['right-upper-leg'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'right-upper-leg' ? null : 'right-upper-leg')}
                    onMouseEnter={() => setHoveredRegion('right-upper-leg')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Right Upper Leg${regionCounts['right-upper-leg'] ? `, ${regionCounts['right-upper-leg']} condition(s)` : ''}`}
                  />

                  {/* LEFT KNEE */}
                  <ellipse
                    id="region-left-knee"
                    className={`body-region ${selectedRegion === 'left-knee' ? 'selected-region' : ''}`}
                    cx="156"
                    cy="600"
                    rx="18"
                    ry="22"
                    fill={
                      selectedRegion === 'left-knee'
                        ? 'url(#goldGradient)'
                        : regionCounts['left-knee']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'left-knee'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'left-knee' || regionCounts['left-knee']
                        ? '#C5A442'
                        : hoveredRegion === 'left-knee'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'left-knee' || regionCounts['left-knee'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'left-knee' ? null : 'left-knee')}
                    onMouseEnter={() => setHoveredRegion('left-knee')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Left Knee${regionCounts['left-knee'] ? `, ${regionCounts['left-knee']} condition(s)` : ''}`}
                  />

                  {/* RIGHT KNEE */}
                  <ellipse
                    id="region-right-knee"
                    className={`body-region ${selectedRegion === 'right-knee' ? 'selected-region' : ''}`}
                    cx="244"
                    cy="600"
                    rx="18"
                    ry="22"
                    fill={
                      selectedRegion === 'right-knee'
                        ? 'url(#goldGradient)'
                        : regionCounts['right-knee']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'right-knee'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'right-knee' || regionCounts['right-knee']
                        ? '#C5A442'
                        : hoveredRegion === 'right-knee'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'right-knee' || regionCounts['right-knee'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'right-knee' ? null : 'right-knee')}
                    onMouseEnter={() => setHoveredRegion('right-knee')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Right Knee${regionCounts['right-knee'] ? `, ${regionCounts['right-knee']} condition(s)` : ''}`}
                  />

                  {/* LEFT LOWER LEG */}
                  <path
                    id="region-left-lower-leg"
                    className={`body-region ${selectedRegion === 'left-lower-leg' ? 'selected-region' : ''}`}
                    d="M 145 620 Q 142 645, 140 675 L 138 710 L 158 710 L 160 675 Q 162 645, 165 620 Z"
                    fill={
                      selectedRegion === 'left-lower-leg'
                        ? 'url(#goldGradient)'
                        : regionCounts['left-lower-leg']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'left-lower-leg'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'left-lower-leg' || regionCounts['left-lower-leg']
                        ? '#C5A442'
                        : hoveredRegion === 'left-lower-leg'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'left-lower-leg' || regionCounts['left-lower-leg'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'left-lower-leg' ? null : 'left-lower-leg')}
                    onMouseEnter={() => setHoveredRegion('left-lower-leg')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Left Lower Leg${regionCounts['left-lower-leg'] ? `, ${regionCounts['left-lower-leg']} condition(s)` : ''}`}
                  />

                  {/* RIGHT LOWER LEG */}
                  <path
                    id="region-right-lower-leg"
                    className={`body-region ${selectedRegion === 'right-lower-leg' ? 'selected-region' : ''}`}
                    d="M 255 620 Q 258 645, 260 675 L 262 710 L 242 710 L 240 675 Q 238 645, 235 620 Z"
                    fill={
                      selectedRegion === 'right-lower-leg'
                        ? 'url(#goldGradient)'
                        : regionCounts['right-lower-leg']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'right-lower-leg'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'right-lower-leg' || regionCounts['right-lower-leg']
                        ? '#C5A442'
                        : hoveredRegion === 'right-lower-leg'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'right-lower-leg' || regionCounts['right-lower-leg'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'right-lower-leg' ? null : 'right-lower-leg')}
                    onMouseEnter={() => setHoveredRegion('right-lower-leg')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Right Lower Leg${regionCounts['right-lower-leg'] ? `, ${regionCounts['right-lower-leg']} condition(s)` : ''}`}
                  />

                  {/* LEFT FOOT */}
                  <ellipse
                    id="region-left-foot"
                    className={`body-region ${selectedRegion === 'left-foot' ? 'selected-region' : ''}`}
                    cx="142"
                    cy="740"
                    rx="18"
                    ry="25"
                    transform="rotate(-10 142 740)"
                    fill={
                      selectedRegion === 'left-foot'
                        ? 'url(#goldGradient)'
                        : regionCounts['left-foot']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'left-foot'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'left-foot' || regionCounts['left-foot']
                        ? '#C5A442'
                        : hoveredRegion === 'left-foot'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'left-foot' || regionCounts['left-foot'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'left-foot' ? null : 'left-foot')}
                    onMouseEnter={() => setHoveredRegion('left-foot')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Left Foot${regionCounts['left-foot'] ? `, ${regionCounts['left-foot']} condition(s)` : ''}`}
                  />

                  {/* RIGHT FOOT */}
                  <ellipse
                    id="region-right-foot"
                    className={`body-region ${selectedRegion === 'right-foot' ? 'selected-region' : ''}`}
                    cx="258"
                    cy="740"
                    rx="18"
                    ry="25"
                    transform="rotate(10 258 740)"
                    fill={
                      selectedRegion === 'right-foot'
                        ? 'url(#goldGradient)'
                        : regionCounts['right-foot']
                          ? 'rgba(197,164,66,0.4)'
                          : hoveredRegion === 'right-foot'
                            ? 'rgba(197,164,66,0.25)'
                            : ''
                    }
                    stroke={
                      selectedRegion === 'right-foot' || regionCounts['right-foot']
                        ? '#C5A442'
                        : hoveredRegion === 'right-foot'
                          ? '#C5A442'
                          : ''
                    }
                    strokeWidth={selectedRegion === 'right-foot' || regionCounts['right-foot'] ? 2 : 0}
                    onClick={() => setSelectedRegion(selectedRegion === 'right-foot' ? null : 'right-foot')}
                    onMouseEnter={() => setHoveredRegion('right-foot')}
                    onMouseLeave={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Right Foot${regionCounts['right-foot'] ? `, ${regionCounts['right-foot']} condition(s)` : ''}`}
                  />
                </g>

                {/* Body outline for context (dark/light mode aware) */}
                <g
                  fill="none"
                  stroke="currentColor"
                  className="text-border dark:text-[#1A1A2E] text-[#D0D0D0]"
                  strokeWidth="1"
                  pointerEvents="none"
                >
                  {/* Outer silhouette outline */}
                  <path d="M 200 25 C 185 20, 160 25, 155 50 Q 150 55, 145 60 L 110 165 Q 105 180, 95 220 L 72 350 Q 60 365, 60 380 L 155 505 L 145 585 Q 138 620, 132 710 L 120 760 M 200 25 C 215 20, 240 25, 245 50 Q 250 55, 255 60 L 290 165 Q 295 180, 305 220 L 328 350 Q 340 365, 340 380 L 245 505 L 255 585 Q 262 620, 268 710 L 280 760" />
                </g>

                {/* Count badges */}
                {BODY_REGIONS.map((region) => {
                  const count = regionCounts[region.id] || 0;
                  if (count === 0) return null;

                  // Position badges based on region
                  const badgePositions: Record<string, { x: number; y: number }> = {
                    head: { x: 230, y: 35 },
                    mental: { x: 218, y: 35 },
                    'face-jaw': { x: 235, y: 90 },
                    eyes: { x: 225, y: 50 },
                    ears: { x: 260, y: 50 },
                    neck: { x: 225, y: 120 },
                    'left-shoulder': { x: 110, y: 175 },
                    'right-shoulder': { x: 290, y: 175 },
                    chest: { x: 240, y: 210 },
                    'upper-back': { x: 245, y: 300 },
                    abdomen: { x: 250, y: 365 },
                    'lower-back': { x: 240, y: 430 },
                    'left-upper-arm': { x: 95, y: 230 },
                    'right-upper-arm': { x: 305, y: 230 },
                    'left-forearm': { x: 75, y: 305 },
                    'right-forearm': { x: 325, y: 305 },
                    'left-hand': { x: 60, y: 360 },
                    'right-hand': { x: 340, y: 360 },
                    'left-hip': { x: 155, y: 470 },
                    'right-hip': { x: 245, y: 470 },
                    'left-upper-leg': { x: 148, y: 545 },
                    'right-upper-leg': { x: 252, y: 545 },
                    'left-knee': { x: 140, y: 595 },
                    'right-knee': { x: 260, y: 595 },
                    'left-lower-leg': { x: 138, y: 665 },
                    'right-lower-leg': { x: 262, y: 665 },
                    'left-foot': { x: 130, y: 730 },
                    'right-foot': { x: 270, y: 730 },
                  };

                  const pos = badgePositions[region.id] || { x: 200, y: 200 };

                  return (
                    <g key={`badge-${region.id}`}>
                      <circle cx={pos.x} cy={pos.y} r="10" fill="#C5A442" />
                      <text
                        x={pos.x}
                        y={pos.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="white"
                        fontSize="11"
                        fontWeight="bold"
                        pointerEvents="none"
                      >
                        {count}
                      </text>
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
                <Card className="bg-[rgba(197,164,66,0.08)] border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-foreground flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-gold" />
                        {activeRegion.label}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRegion(null)}
                        className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
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
                              ? 'bg-[rgba(197,164,66,0.15)] border-[rgba(197,164,66,0.4)] hover:bg-[rgba(197,164,66,0.2)]'
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
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
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
              <Card className="bg-[rgba(197,164,66,0.08)] border-border">
                <CardContent className="py-16">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-14 h-14 rounded-full bg-[rgba(197,164,66,0.1)] border border-[rgba(197,164,66,0.2)] flex items-center justify-center">
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
              <Card className="bg-[rgba(197,164,66,0.08)] border-border">
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
                        const regionLabel = region?.label || uc.bodyPart;

                        return (
                          <Badge
                            key={uc.id}
                            className="bg-[rgba(197,164,66,0.15)] text-gold-hl border border-[rgba(197,164,66,0.3)] hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 cursor-pointer transition-colors gap-1 pr-1.5"
                            onClick={() => removeUserCondition(uc.id)}
                            title={`${label} (${regionLabel}) — click to remove`}
                          >
                            <span className="max-w-[180px] truncate">
                              {label}
                            </span>
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
    </div>
  );
}
