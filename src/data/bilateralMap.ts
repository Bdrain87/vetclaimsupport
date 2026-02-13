/**
 * 38 CFR § 4.26 Bilateral Mapping
 * Defines IDs that, when paired, trigger the 10% Bilateral Factor.
 *
 * The bilateral factor applies when a veteran has compensable disabilities
 * affecting both paired extremities (e.g., both knees, both shoulders).
 * The combined value of the bilateral group is increased by 10%.
 *
 * Reference: https://www.law.cornell.edu/cfr/text/38/4.26
 */

export interface BilateralPair {
  name: string;
  ids: [string, string];
  type: 'Upper Extremity' | 'Lower Extremity' | 'Sensory';
  diagnosticCodes?: string[];
  description?: string;
}

export const BILATERAL_PAIRS: BilateralPair[] = [
  // ============ LOWER EXTREMITY ============
  {
    name: "Knees",
    ids: ["knee-left", "knee-right"],
    type: "Lower Extremity",
    diagnosticCodes: ["5003", "5010", "5256", "5257", "5258", "5259", "5260", "5261"],
    description: "Includes degenerative arthritis, instability, limitation of flexion/extension, meniscal conditions"
  },
  {
    name: "Ankles",
    ids: ["ankle-left", "ankle-right"],
    type: "Lower Extremity",
    diagnosticCodes: ["5003", "5270", "5271"],
    description: "Includes ankylosis, limited motion, degenerative arthritis"
  },
  {
    name: "Hips",
    ids: ["hip-left", "hip-right"],
    type: "Lower Extremity",
    diagnosticCodes: ["5003", "5250", "5251", "5252", "5253", "5254", "5255"],
    description: "Includes ankylosis, limitation of extension/flexion, flail joint, impairment of femur"
  },
  {
    name: "Feet / Plantar Fasciitis",
    ids: ["foot-left", "foot-right"],
    type: "Lower Extremity",
    diagnosticCodes: ["5276", "5277", "5278", "5279", "5280", "5281", "5282", "5283", "5284"],
    description: "Includes plantar fasciitis, pes planus (flat feet), pes cavus, hallux valgus, hammer toes, metatarsalgia"
  },
  {
    name: "Radiculopathy (Lower Extremity)",
    ids: ["sciatic-nerve-left", "sciatic-nerve-right"],
    type: "Lower Extremity",
    diagnosticCodes: ["8520", "8521", "8524", "8525", "8526"],
    description: "Sciatic, external popliteal, internal popliteal, posterior tibial, anterior tibial nerve impairment"
  },

  // ============ UPPER EXTREMITY ============
  {
    name: "Shoulders",
    ids: ["shoulder-left", "shoulder-right"],
    type: "Upper Extremity",
    diagnosticCodes: ["5003", "5200", "5201", "5202", "5203"],
    description: "Includes ankylosis, limitation of motion, impairment of humerus/clavicle/scapula"
  },
  {
    name: "Elbows",
    ids: ["elbow-left", "elbow-right"],
    type: "Upper Extremity",
    diagnosticCodes: ["5003", "5205", "5206", "5207", "5208", "5209", "5210", "5211", "5212", "5213"],
    description: "Includes ankylosis, limitation of flexion/extension, forearm impairment"
  },
  {
    name: "Wrists",
    ids: ["wrist-left", "wrist-right"],
    type: "Upper Extremity",
    diagnosticCodes: ["5003", "5214", "5215"],
    description: "Includes ankylosis, limitation of motion, degenerative arthritis"
  },
  {
    name: "Hands / Carpal Tunnel Syndrome",
    ids: ["hand-left", "hand-right"],
    type: "Upper Extremity",
    diagnosticCodes: ["5003", "8515", "8516", "5216", "5217", "5218", "5219", "5220", "5221", "5222", "5223", "5224", "5225", "5226", "5227", "5228", "5229"],
    description: "Includes carpal tunnel (median/ulnar nerve), finger ankylosis, limitation of finger motion"
  },
  {
    name: "Radiculopathy (Upper Extremity)",
    ids: ["upper-radiculopathy-left", "upper-radiculopathy-right"],
    type: "Upper Extremity",
    diagnosticCodes: ["8510", "8511", "8512", "8513", "8514", "8515", "8516"],
    description: "Upper/middle/lower radicular nerve group, musculospiral, median, ulnar nerve impairment"
  },

  // ============ SENSORY ORGANS (Paired) ============
  // NOTE: Eye ratings use the special combined vision table under 38 CFR 4.79,
  // NOT the standard 10% bilateral factor from 38 CFR 4.26.
  {
    name: "Eyes (Visual Acuity)",
    ids: ["eye-left", "eye-right"],
    type: "Sensory",
    diagnosticCodes: ["6061", "6062", "6063", "6064", "6065", "6066", "6070", "6071", "6072", "6073", "6074", "6075", "6076", "6077", "6078", "6079"],
    description: "Bilateral visual impairment rated under 38 CFR 4.79; note: eye ratings use a special combined table, not standard bilateral factor"
  },
  {
    name: "Ears / Hearing Loss",
    ids: ["ear-left", "ear-right"],
    type: "Sensory",
    diagnosticCodes: ["6100", "6101", "6102", "6103", "6104", "6105", "6106", "6107", "6108", "6109", "6110", "6260"],
    description: "Bilateral hearing loss rated under 38 CFR 4.85-4.86; tinnitus (DC 6260) is typically rated as a single disability"
  }
];
