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

  // Helper to get fill/stroke for regions
  const getRegionFill = (regionId: string) => {
    if (selectedRegion === regionId) return 'url(#goldGradient)';
    if (regionCounts[regionId]) return 'rgba(197,164,66,0.4)';
    if (hoveredRegion === regionId) return 'rgba(197,164,66,0.25)';
    return '#9CA3AF';
  };

  const getRegionStroke = (regionId: string) => {
    if (selectedRegion === regionId || regionCounts[regionId] || hoveredRegion === regionId) {
      return '#C5A442';
    }
    return '#6B7280';
  };

  const getRegionStrokeWidth = (regionId: string) => {
    return selectedRegion === regionId || regionCounts[regionId] ? 2.5 : 1;
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
          {/* Body Diagram with PNG Image */}
          <Card className="bg-[rgba(197,164,66,0.08)] border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">
                Front View
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center pb-6">
              <div
                className="relative w-full max-w-[300px] select-none"
                style={{
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))',
                  aspectRatio: '1 / 2.5',
                }}
                role="application"
                aria-label="Interactive body diagram — tap regions to view conditions"
              >
                {/* Professional body silhouette PNG */}
                <img
                  src="/body-silhouette.png"
                  alt="Body map"
                  className="w-full h-auto"
                  style={{ display: 'block' }}
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
                      background: #C5A442;
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
                  `}
                </style>

                {/* HEAD */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'head' ? 'selected' : ''}`}
                  style={{
                    top: '1%',
                    left: '39%',
                    width: '22%',
                    height: '11%',
                    backgroundColor: selectedRegion === 'head' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['head'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'head' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'head' || regionCounts['head'] || hoveredRegion === 'head') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'head' ? null : 'head')}
                  onMouseEnter={() => setHoveredRegion('head')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Head${regionCounts['head'] ? `, ${regionCounts['head']} condition(s)` : ''}`}
                />

                {/* MENTAL HEALTH (brain icon on head) */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'mental' ? 'selected' : ''}`}
                  style={{
                    top: '3%',
                    left: '43%',
                    width: '14%',
                    height: '6%',
                    backgroundColor: selectedRegion === 'mental' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['mental'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'mental' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'mental' || regionCounts['mental'] || hoveredRegion === 'mental') ? '#C5A442' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'mental' ? null : 'mental')}
                  onMouseEnter={() => setHoveredRegion('mental')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Mental Health${regionCounts['mental'] ? `, ${regionCounts['mental']} condition(s)` : ''}`}
                >
                  🧠
                </div>

                {/* FACE & JAW */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'face-jaw' ? 'selected' : ''}`}
                  style={{
                    top: '9%',
                    left: '40%',
                    width: '20%',
                    height: '6%',
                    backgroundColor: selectedRegion === 'face-jaw' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['face-jaw'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'face-jaw' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'face-jaw' || regionCounts['face-jaw'] || hoveredRegion === 'face-jaw') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'face-jaw' ? null : 'face-jaw')}
                  onMouseEnter={() => setHoveredRegion('face-jaw')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Face & Jaw${regionCounts['face-jaw'] ? `, ${regionCounts['face-jaw']} condition(s)` : ''}`}
                />

                {/* EYES */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'eyes' ? 'selected' : ''}`}
                  style={{
                    top: '5%',
                    left: '40%',
                    width: '20%',
                    height: '3%',
                    backgroundColor: selectedRegion === 'eyes' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['eyes'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'eyes' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'eyes' || regionCounts['eyes'] || hoveredRegion === 'eyes') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'eyes' ? null : 'eyes')}
                  onMouseEnter={() => setHoveredRegion('eyes')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Eyes${regionCounts['eyes'] ? `, ${regionCounts['eyes']} condition(s)` : ''}`}
                />

                {/* EARS (left and right combined) */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'ears' ? 'selected' : ''}`}
                  style={{
                    top: '4%',
                    left: '34%',
                    width: '7%',
                    height: '5%',
                    backgroundColor: selectedRegion === 'ears' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['ears'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'ears' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'ears' || regionCounts['ears'] || hoveredRegion === 'ears') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'ears' ? null : 'ears')}
                  onMouseEnter={() => setHoveredRegion('ears')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ears${regionCounts['ears'] ? `, ${regionCounts['ears']} condition(s)` : ''}`}
                />
                <div
                  className={`body-region-overlay ${selectedRegion === 'ears' ? 'selected' : ''}`}
                  style={{
                    top: '4%',
                    left: '59%',
                    width: '7%',
                    height: '5%',
                    backgroundColor: selectedRegion === 'ears' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['ears'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'ears' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'ears' || regionCounts['ears'] || hoveredRegion === 'ears') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'ears' ? null : 'ears')}
                  onMouseEnter={() => setHoveredRegion('ears')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label="Ears (right)"
                />

                {/* NECK */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'neck' ? 'selected' : ''}`}
                  style={{
                    top: '12%',
                    left: '42%',
                    width: '16%',
                    height: '6%',
                    backgroundColor: selectedRegion === 'neck' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['neck'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'neck' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'neck' || regionCounts['neck'] || hoveredRegion === 'neck') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'neck' ? null : 'neck')}
                  onMouseEnter={() => setHoveredRegion('neck')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Neck${regionCounts['neck'] ? `, ${regionCounts['neck']} condition(s)` : ''}`}
                />

                {/* LEFT SHOULDER */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'left-shoulder' ? 'selected' : ''}`}
                  style={{
                    top: '17%',
                    left: '27%',
                    width: '14%',
                    height: '8%',
                    backgroundColor: selectedRegion === 'left-shoulder' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['left-shoulder'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'left-shoulder' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'left-shoulder' || regionCounts['left-shoulder'] || hoveredRegion === 'left-shoulder') ? '#C5A442' : 'transparent',
                    borderRadius: '50%',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'left-shoulder' ? null : 'left-shoulder')}
                  onMouseEnter={() => setHoveredRegion('left-shoulder')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Left Shoulder${regionCounts['left-shoulder'] ? `, ${regionCounts['left-shoulder']} condition(s)` : ''}`}
                />

                {/* RIGHT SHOULDER */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'right-shoulder' ? 'selected' : ''}`}
                  style={{
                    top: '17%',
                    left: '59%',
                    width: '14%',
                    height: '8%',
                    backgroundColor: selectedRegion === 'right-shoulder' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['right-shoulder'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'right-shoulder' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'right-shoulder' || regionCounts['right-shoulder'] || hoveredRegion === 'right-shoulder') ? '#C5A442' : 'transparent',
                    borderRadius: '50%',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'right-shoulder' ? null : 'right-shoulder')}
                  onMouseEnter={() => setHoveredRegion('right-shoulder')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Right Shoulder${regionCounts['right-shoulder'] ? `, ${regionCounts['right-shoulder']} condition(s)` : ''}`}
                />

                {/* CHEST */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'chest' ? 'selected' : ''}`}
                  style={{
                    top: '20%',
                    left: '39%',
                    width: '22%',
                    height: '14%',
                    backgroundColor: selectedRegion === 'chest' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['chest'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'chest' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'chest' || regionCounts['chest'] || hoveredRegion === 'chest') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'chest' ? null : 'chest')}
                  onMouseEnter={() => setHoveredRegion('chest')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Chest${regionCounts['chest'] ? `, ${regionCounts['chest']} condition(s)` : ''}`}
                />

                {/* UPPER BACK */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'upper-back' ? 'selected' : ''}`}
                  style={{
                    top: '32%',
                    left: '39%',
                    width: '22%',
                    height: '10%',
                    backgroundColor: selectedRegion === 'upper-back' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['upper-back'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'upper-back' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'upper-back' || regionCounts['upper-back'] || hoveredRegion === 'upper-back') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'upper-back' ? null : 'upper-back')}
                  onMouseEnter={() => setHoveredRegion('upper-back')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Upper Back${regionCounts['upper-back'] ? `, ${regionCounts['upper-back']} condition(s)` : ''}`}
                />

                {/* ABDOMEN */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'abdomen' ? 'selected' : ''}`}
                  style={{
                    top: '38%',
                    left: '39%',
                    width: '22%',
                    height: '10%',
                    backgroundColor: selectedRegion === 'abdomen' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['abdomen'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'abdomen' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'abdomen' || regionCounts['abdomen'] || hoveredRegion === 'abdomen') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'abdomen' ? null : 'abdomen')}
                  onMouseEnter={() => setHoveredRegion('abdomen')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Abdomen${regionCounts['abdomen'] ? `, ${regionCounts['abdomen']} condition(s)` : ''}`}
                />

                {/* LOWER BACK */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'lower-back' ? 'selected' : ''}`}
                  style={{
                    top: '46%',
                    left: '40%',
                    width: '20%',
                    height: '7%',
                    backgroundColor: selectedRegion === 'lower-back' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['lower-back'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'lower-back' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'lower-back' || regionCounts['lower-back'] || hoveredRegion === 'lower-back') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'lower-back' ? null : 'lower-back')}
                  onMouseEnter={() => setHoveredRegion('lower-back')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Lower Back${regionCounts['lower-back'] ? `, ${regionCounts['lower-back']} condition(s)` : ''}`}
                />

                {/* LEFT UPPER ARM */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'left-upper-arm' ? 'selected' : ''}`}
                  style={{
                    top: '22%',
                    left: '25%',
                    width: '10%',
                    height: '12%',
                    backgroundColor: selectedRegion === 'left-upper-arm' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['left-upper-arm'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'left-upper-arm' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'left-upper-arm' || regionCounts['left-upper-arm'] || hoveredRegion === 'left-upper-arm') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'left-upper-arm' ? null : 'left-upper-arm')}
                  onMouseEnter={() => setHoveredRegion('left-upper-arm')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Left Upper Arm${regionCounts['left-upper-arm'] ? `, ${regionCounts['left-upper-arm']} condition(s)` : ''}`}
                />

                {/* RIGHT UPPER ARM */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'right-upper-arm' ? 'selected' : ''}`}
                  style={{
                    top: '22%',
                    left: '65%',
                    width: '10%',
                    height: '12%',
                    backgroundColor: selectedRegion === 'right-upper-arm' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['right-upper-arm'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'right-upper-arm' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'right-upper-arm' || regionCounts['right-upper-arm'] || hoveredRegion === 'right-upper-arm') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'right-upper-arm' ? null : 'right-upper-arm')}
                  onMouseEnter={() => setHoveredRegion('right-upper-arm')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Right Upper Arm${regionCounts['right-upper-arm'] ? `, ${regionCounts['right-upper-arm']} condition(s)` : ''}`}
                />

                {/* LEFT FOREARM */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'left-forearm' ? 'selected' : ''}`}
                  style={{
                    top: '32%',
                    left: '22%',
                    width: '9%',
                    height: '14%',
                    backgroundColor: selectedRegion === 'left-forearm' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['left-forearm'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'left-forearm' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'left-forearm' || regionCounts['left-forearm'] || hoveredRegion === 'left-forearm') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'left-forearm' ? null : 'left-forearm')}
                  onMouseEnter={() => setHoveredRegion('left-forearm')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Left Forearm / Elbow${regionCounts['left-forearm'] ? `, ${regionCounts['left-forearm']} condition(s)` : ''}`}
                />

                {/* RIGHT FOREARM */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'right-forearm' ? 'selected' : ''}`}
                  style={{
                    top: '32%',
                    left: '69%',
                    width: '9%',
                    height: '14%',
                    backgroundColor: selectedRegion === 'right-forearm' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['right-forearm'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'right-forearm' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'right-forearm' || regionCounts['right-forearm'] || hoveredRegion === 'right-forearm') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'right-forearm' ? null : 'right-forearm')}
                  onMouseEnter={() => setHoveredRegion('right-forearm')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Right Forearm / Elbow${regionCounts['right-forearm'] ? `, ${regionCounts['right-forearm']} condition(s)` : ''}`}
                />

                {/* LEFT HAND */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'left-hand' ? 'selected' : ''}`}
                  style={{
                    top: '44%',
                    left: '20%',
                    width: '10%',
                    height: '7%',
                    backgroundColor: selectedRegion === 'left-hand' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['left-hand'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'left-hand' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'left-hand' || regionCounts['left-hand'] || hoveredRegion === 'left-hand') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'left-hand' ? null : 'left-hand')}
                  onMouseEnter={() => setHoveredRegion('left-hand')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Left Hand / Wrist${regionCounts['left-hand'] ? `, ${regionCounts['left-hand']} condition(s)` : ''}`}
                />

                {/* RIGHT HAND */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'right-hand' ? 'selected' : ''}`}
                  style={{
                    top: '44%',
                    left: '70%',
                    width: '10%',
                    height: '7%',
                    backgroundColor: selectedRegion === 'right-hand' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['right-hand'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'right-hand' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'right-hand' || regionCounts['right-hand'] || hoveredRegion === 'right-hand') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'right-hand' ? null : 'right-hand')}
                  onMouseEnter={() => setHoveredRegion('right-hand')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Right Hand / Wrist${regionCounts['right-hand'] ? `, ${regionCounts['right-hand']} condition(s)` : ''}`}
                />

                {/* LEFT HIP */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'left-hip' ? 'selected' : ''}`}
                  style={{
                    top: '51%',
                    left: '38%',
                    width: '12%',
                    height: '7%',
                    backgroundColor: selectedRegion === 'left-hip' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['left-hip'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'left-hip' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'left-hip' || regionCounts['left-hip'] || hoveredRegion === 'left-hip') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'left-hip' ? null : 'left-hip')}
                  onMouseEnter={() => setHoveredRegion('left-hip')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Left Hip${regionCounts['left-hip'] ? `, ${regionCounts['left-hip']} condition(s)` : ''}`}
                />

                {/* RIGHT HIP */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'right-hip' ? 'selected' : ''}`}
                  style={{
                    top: '51%',
                    left: '50%',
                    width: '12%',
                    height: '7%',
                    backgroundColor: selectedRegion === 'right-hip' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['right-hip'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'right-hip' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'right-hip' || regionCounts['right-hip'] || hoveredRegion === 'right-hip') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'right-hip' ? null : 'right-hip')}
                  onMouseEnter={() => setHoveredRegion('right-hip')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Right Hip${regionCounts['right-hip'] ? `, ${regionCounts['right-hip']} condition(s)` : ''}`}
                />

                {/* LEFT UPPER LEG */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'left-upper-leg' ? 'selected' : ''}`}
                  style={{
                    top: '56%',
                    left: '39%',
                    width: '10%',
                    height: '16%',
                    backgroundColor: selectedRegion === 'left-upper-leg' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['left-upper-leg'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'left-upper-leg' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'left-upper-leg' || regionCounts['left-upper-leg'] || hoveredRegion === 'left-upper-leg') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'left-upper-leg' ? null : 'left-upper-leg')}
                  onMouseEnter={() => setHoveredRegion('left-upper-leg')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Left Upper Leg${regionCounts['left-upper-leg'] ? `, ${regionCounts['left-upper-leg']} condition(s)` : ''}`}
                />

                {/* RIGHT UPPER LEG */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'right-upper-leg' ? 'selected' : ''}`}
                  style={{
                    top: '56%',
                    left: '51%',
                    width: '10%',
                    height: '16%',
                    backgroundColor: selectedRegion === 'right-upper-leg' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['right-upper-leg'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'right-upper-leg' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'right-upper-leg' || regionCounts['right-upper-leg'] || hoveredRegion === 'right-upper-leg') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'right-upper-leg' ? null : 'right-upper-leg')}
                  onMouseEnter={() => setHoveredRegion('right-upper-leg')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Right Upper Leg${regionCounts['right-upper-leg'] ? `, ${regionCounts['right-upper-leg']} condition(s)` : ''}`}
                />

                {/* LEFT KNEE */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'left-knee' ? 'selected' : ''}`}
                  style={{
                    top: '70%',
                    left: '38.5%',
                    width: '11%',
                    height: '6%',
                    backgroundColor: selectedRegion === 'left-knee' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['left-knee'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'left-knee' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'left-knee' || regionCounts['left-knee'] || hoveredRegion === 'left-knee') ? '#C5A442' : 'transparent',
                    borderRadius: '50%',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'left-knee' ? null : 'left-knee')}
                  onMouseEnter={() => setHoveredRegion('left-knee')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Left Knee${regionCounts['left-knee'] ? `, ${regionCounts['left-knee']} condition(s)` : ''}`}
                />

                {/* RIGHT KNEE */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'right-knee' ? 'selected' : ''}`}
                  style={{
                    top: '70%',
                    left: '50.5%',
                    width: '11%',
                    height: '6%',
                    backgroundColor: selectedRegion === 'right-knee' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['right-knee'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'right-knee' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'right-knee' || regionCounts['right-knee'] || hoveredRegion === 'right-knee') ? '#C5A442' : 'transparent',
                    borderRadius: '50%',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'right-knee' ? null : 'right-knee')}
                  onMouseEnter={() => setHoveredRegion('right-knee')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Right Knee${regionCounts['right-knee'] ? `, ${regionCounts['right-knee']} condition(s)` : ''}`}
                />

                {/* LEFT LOWER LEG */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'left-lower-leg' ? 'selected' : ''}`}
                  style={{
                    top: '74%',
                    left: '39%',
                    width: '10%',
                    height: '16%',
                    backgroundColor: selectedRegion === 'left-lower-leg' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['left-lower-leg'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'left-lower-leg' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'left-lower-leg' || regionCounts['left-lower-leg'] || hoveredRegion === 'left-lower-leg') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'left-lower-leg' ? null : 'left-lower-leg')}
                  onMouseEnter={() => setHoveredRegion('left-lower-leg')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Left Lower Leg / Shin${regionCounts['left-lower-leg'] ? `, ${regionCounts['left-lower-leg']} condition(s)` : ''}`}
                />

                {/* RIGHT LOWER LEG */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'right-lower-leg' ? 'selected' : ''}`}
                  style={{
                    top: '74%',
                    left: '51%',
                    width: '10%',
                    height: '16%',
                    backgroundColor: selectedRegion === 'right-lower-leg' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['right-lower-leg'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'right-lower-leg' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'right-lower-leg' || regionCounts['right-lower-leg'] || hoveredRegion === 'right-lower-leg') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'right-lower-leg' ? null : 'right-lower-leg')}
                  onMouseEnter={() => setHoveredRegion('right-lower-leg')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Right Lower Leg / Shin${regionCounts['right-lower-leg'] ? `, ${regionCounts['right-lower-leg']} condition(s)` : ''}`}
                />

                {/* LEFT FOOT */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'left-foot' ? 'selected' : ''}`}
                  style={{
                    top: '88%',
                    left: '37%',
                    width: '11%',
                    height: '8%',
                    backgroundColor: selectedRegion === 'left-foot' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['left-foot'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'left-foot' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'left-foot' || regionCounts['left-foot'] || hoveredRegion === 'left-foot') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'left-foot' ? null : 'left-foot')}
                  onMouseEnter={() => setHoveredRegion('left-foot')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Left Foot / Ankle${regionCounts['left-foot'] ? `, ${regionCounts['left-foot']} condition(s)` : ''}`}
                />

                {/* RIGHT FOOT */}
                <div
                  className={`body-region-overlay ${selectedRegion === 'right-foot' ? 'selected' : ''}`}
                  style={{
                    top: '88%',
                    left: '52%',
                    width: '11%',
                    height: '8%',
                    backgroundColor: selectedRegion === 'right-foot' ? 'rgba(197,164,66,0.4)' :
                                    regionCounts['right-foot'] ? 'rgba(197,164,66,0.3)' :
                                    hoveredRegion === 'right-foot' ? 'rgba(197,164,66,0.25)' : 'transparent',
                    borderColor: (selectedRegion === 'right-foot' || regionCounts['right-foot'] || hoveredRegion === 'right-foot') ? '#C5A442' : 'transparent',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === 'right-foot' ? null : 'right-foot')}
                  onMouseEnter={() => setHoveredRegion('right-foot')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Right Foot / Ankle${regionCounts['right-foot'] ? `, ${regionCounts['right-foot']} condition(s)` : ''}`}
                />

                {/* Count badges */}
                {BODY_REGIONS.map((region) => {
                  const count = regionCounts[region.id] || 0;
                  if (count === 0) return null;

                  // Badge positions - percentage-based to match overlays
                  const badgePositions: Record<string, { top: string; left: string }> = {
                    head: { top: '5%', left: '63%' },
                    mental: { top: '3%', left: '58%' },
                    'face-jaw': { top: '11%', left: '62%' },
                    eyes: { top: '5.5%', left: '62%' },
                    ears: { top: '6%', left: '68%' },
                    neck: { top: '15%', left: '60%' },
                    'left-shoulder': { top: '19%', left: '26%' },
                    'right-shoulder': { top: '19%', left: '74%' },
                    chest: { top: '27%', left: '62%' },
                    'upper-back': { top: '36%', left: '62%' },
                    abdomen: { top: '43%', left: '62%' },
                    'lower-back': { top: '49%', left: '62%' },
                    'left-upper-arm': { top: '27%', left: '22%' },
                    'right-upper-arm': { top: '27%', left: '78%' },
                    'left-forearm': { top: '38%', left: '19%' },
                    'right-forearm': { top: '38%', left: '81%' },
                    'left-hand': { top: '47%', left: '17%' },
                    'right-hand': { top: '47%', left: '83%' },
                    'left-hip': { top: '54%', left: '43%' },
                    'right-hip': { top: '54%', left: '57%' },
                    'left-upper-leg': { top: '64%', left: '43%' },
                    'right-upper-leg': { top: '64%', left: '57%' },
                    'left-knee': { top: '72%', left: '42%' },
                    'right-knee': { top: '72%', left: '58%' },
                    'left-lower-leg': { top: '82%', left: '43%' },
                    'right-lower-leg': { top: '82%', left: '57%' },
                    'left-foot': { top: '91%', left: '41%' },
                    'right-foot': { top: '91%', left: '59%' },
                  };

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
