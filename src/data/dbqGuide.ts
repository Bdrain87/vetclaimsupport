export interface DBQTip {
  section: string;
  focus: string;
  insiderSecret: string;
}

export const DBQ_GUIDE_DATA: DBQTip[] = [
  {
    section: "Section I: Diagnosis",
    focus: "ICD Code Alignment",
    insiderSecret: "The rater cannot grant service connection without a formal diagnosis. If your DBQ doesn't have a checkmark next to a specific diagnosis, the rest of the form is ignored. Verify this before you leave the exam."
  },
  {
    section: "Section III: ROM (Range of Motion)",
    focus: "Functional Loss",
    insiderSecret: "Raters look for the point where pain begins, not just how far you can push through it. Stop moving the moment you feel 'objective' pain. This is the measurement that determines the rating percentage."
  },
  {
    section: "Section IV: Flare-ups",
    focus: "The 'De Luca' Factor",
    insiderSecret: "VA law (De Luca v. Brown) requires examiners to estimate your functional loss during a flare-up. If the examiner doesn't ask, you must volunteer how your mobility changes on your 'worst days,' not just how you feel in the office."
  }
];
