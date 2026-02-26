export interface BodyRegion {
  id: string;
  label: string;
  conditions: RegionCondition[];
}

export interface RegionCondition {
  id: string;
  name: string;
  diagnosticCode?: string;
  description: string;
}

export const BODY_REGIONS: BodyRegion[] = [
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
      { id: 'tmj-disorder', name: 'TMJ (Temporomandibular Joint) Disorder', diagnosticCode: '9905', description: 'Jaw pain or dysfunction from injury or stress' },
      { id: 'scar-disfigurement', name: 'Facial Scarring / Disfigurement', diagnosticCode: '7800', description: 'Disfigurement from service-related injuries' },
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
      { id: 'rotator-cuff', name: 'Rotator Cuff Tear/Tendinitis', diagnosticCode: '5201', description: 'Injury or degeneration of rotator cuff muscles/tendons' },
      { id: 'shoulder-instability', name: 'Shoulder Instability', diagnosticCode: '5202', description: 'Recurrent dislocation or subluxation of the shoulder' },
      { id: 'shoulder-arthritis', name: 'Shoulder Arthritis', diagnosticCode: '5003', description: 'Degenerative joint disease of the shoulder' },
    ],
  },
  {
    id: 'right-shoulder',
    label: 'Right Shoulder',
    conditions: [
      { id: 'shoulder-impingement', name: 'Shoulder Impingement Syndrome', diagnosticCode: '5201', description: 'Limited arm motion due to shoulder impingement' },
      { id: 'rotator-cuff', name: 'Rotator Cuff Tear/Tendinitis', diagnosticCode: '5201', description: 'Injury or degeneration of rotator cuff muscles/tendons' },
      { id: 'shoulder-instability', name: 'Shoulder Instability', diagnosticCode: '5202', description: 'Recurrent dislocation or subluxation of the shoulder' },
      { id: 'shoulder-arthritis', name: 'Shoulder Arthritis', diagnosticCode: '5003', description: 'Degenerative joint disease of the shoulder' },
    ],
  },
  {
    id: 'left-upper-arm',
    label: 'Left Upper Arm',
    conditions: [
      { id: 'bicep-tendonitis', name: 'Bicep Tendonitis', diagnosticCode: '5305', description: 'Inflammation of the bicep tendon from overuse' },
    ],
  },
  {
    id: 'right-upper-arm',
    label: 'Right Upper Arm',
    conditions: [
      { id: 'bicep-tendonitis', name: 'Bicep Tendonitis', diagnosticCode: '5305', description: 'Inflammation of the bicep tendon from overuse' },
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
      { id: 'trigger-finger', name: 'Trigger Finger', diagnosticCode: '5024', description: 'Locking or catching of finger tendons' },
    ],
  },
  {
    id: 'right-hand',
    label: 'Right Hand / Wrist',
    conditions: [
      { id: 'carpal-tunnel', name: 'Carpal Tunnel Syndrome', diagnosticCode: '8515', description: 'Median nerve compression causing numbness and weakness in the hand' },
      { id: 'wrist-tendonitis', name: 'Wrist Tendinitis / Strain', diagnosticCode: '5215', description: 'Chronic wrist pain from repetitive motion or injury' },
      { id: 'trigger-finger', name: 'Trigger Finger', diagnosticCode: '5024', description: 'Locking or catching of finger tendons' },
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
      { id: 'hamstring-injury', name: 'Hamstring Injury', diagnosticCode: '5313', description: 'Muscle tear or strain from training or service activities' },
    ],
  },
  {
    id: 'right-upper-leg',
    label: 'Right Upper Leg',
    conditions: [
      { id: 'hamstring-injury', name: 'Hamstring Injury', diagnosticCode: '5313', description: 'Muscle tear or strain from training or service activities' },
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
