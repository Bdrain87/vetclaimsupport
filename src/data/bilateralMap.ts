/**
 * 38 CFR § 4.26 Bilateral Mapping
 * Defines IDs that, when paired, trigger the 10% Bilateral Factor.
 */
export const BILATERAL_PAIRS = [
  {
    name: "Knees",
    ids: ["knee-left", "knee-right"],
    type: "Lower Extremity"
  },
  {
    name: "Shoulders",
    ids: ["shoulder-left", "shoulder-right"],
    type: "Upper Extremity"
  },
  {
    name: "Ankles",
    ids: ["ankle-left", "ankle-right"],
    type: "Lower Extremity"
  },
  {
    name: "Hips",
    ids: ["hip-left", "hip-right"],
    type: "Lower Extremity"
  },
  {
    name: "Radiculopathy (Lower)",
    ids: ["sciatic-nerve-left", "sciatic-nerve-right"],
    type: "Lower Extremity"
  }
];
