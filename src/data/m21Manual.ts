export interface M21Rule {
  id: string;
  section: string;
  category: string;
  title: string;
  rule: string;
  practicalImplication: string;
  commonRaterErrors?: string;
  legalBasis?: string;
}

export const m21Rules: M21Rule[] = [
  // ============================================================
  // 1. SERVICE CONNECTION
  // ============================================================
  {
    id: "sc-001",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section A",
    category: "Service Connection",
    title: "Three Elements of Direct Service Connection",
    rule: "Direct service connection requires three elements: (1) a current disability shown by medical evidence, (2) an in-service event, injury, or disease documented in service records or established by credible evidence, and (3) a medical nexus linking the current disability to the in-service event. All three elements must be satisfied, but the standard of proof is benefit of the doubt, not beyond a reasonable doubt.",
    practicalImplication: "If any one of these three elements is missing from your claim file, the claim will be denied. Focus on ensuring all three are clearly documented before filing.",
    commonRaterErrors: "Denying claims when there is a current diagnosis and in-service event but the rater fails to order a nexus examination. The duty to assist requires VA to provide an exam when there is an indication the disability may be related to service.",
    legalBasis: "38 CFR 3.303(a); Shedden v. Principi, 381 F.3d 1163 (Fed. Cir. 2004)"
  },
  {
    id: "sc-002",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section A",
    category: "Service Connection",
    title: "In-Service Event Documentation",
    rule: "An in-service event can be established through service treatment records, personnel records, buddy statements, or the veteran's own credible testimony. The event does not need to be a single traumatic incident; it can be repetitive activities, environmental exposures, or chronic conditions noted during service. The absence of treatment records does not automatically mean the event did not occur.",
    practicalImplication: "Do not assume your claim will fail because there is no medical record of the in-service event. Buddy statements, service records showing duty assignments, and your own credible lay testimony can establish the in-service element.",
    commonRaterErrors: "Requiring documented medical treatment for every claimed in-service event, particularly for conditions like hearing loss, joint pain, or toxic exposures where service members commonly did not seek treatment.",
    legalBasis: "38 CFR 3.303(a); Buchanan v. Nicholson, 451 F.3d 1331 (Fed. Cir. 2006)"
  },
  {
    id: "sc-003",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section A",
    category: "Service Connection",
    title: "Nexus Requirement and Medical Opinions",
    rule: "The nexus element requires competent medical evidence showing that the current disability is at least as likely as not related to the in-service event. A nexus opinion must include a rationale explaining the medical reasoning. Conclusory statements like 'it is not related' without explanation are inadequate. The opinion must consider the veteran's full history, including lay statements about symptom onset and continuity.",
    practicalImplication: "If a C&P examiner provides a negative nexus opinion without meaningful rationale or ignores your reported history of symptoms since service, the opinion is inadequate and can be challenged.",
    commonRaterErrors: "Accepting negative nexus opinions that lack adequate rationale or that dismiss lay evidence of continuous symptoms without explanation.",
    legalBasis: "Nieves-Rodriguez v. Peake, 22 Vet. App. 295 (2008)"
  },
  {
    id: "sc-004",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section B",
    category: "Service Connection",
    title: "Secondary Service Connection by Causation",
    rule: "A disability is secondarily service-connected if it is caused by or the result of an already service-connected condition. The veteran must show (1) a current disability, (2) an already service-connected disability, and (3) medical evidence that the service-connected disability caused the claimed condition. The same benefit-of-the-doubt standard applies.",
    practicalImplication: "If you have a service-connected condition that has caused or led to additional health problems, those secondary conditions can also be service-connected. For example, service-connected knee injury causing hip or back problems due to altered gait.",
    commonRaterErrors: "Failing to consider secondary service connection when the evidence reasonably raises the theory, even if the veteran did not explicitly claim it on that basis.",
    legalBasis: "38 CFR 3.310(a); Allen v. Brown, 7 Vet. App. 439 (1995)"
  },
  {
    id: "sc-005",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section B",
    category: "Service Connection",
    title: "Secondary Service Connection by Aggravation",
    rule: "A disability may be secondarily service-connected if a service-connected condition aggravated (permanently worsened beyond its natural progression) a non-service-connected condition. The baseline level of the non-service-connected condition must be established before the aggravation, and the veteran is compensated only for the degree of worsening above that baseline.",
    practicalImplication: "Even if your service-connected disability did not cause a new condition, if it made an existing condition permanently worse, you may receive compensation for the amount of additional disability caused by that aggravation.",
    commonRaterErrors: "Failing to obtain a medical opinion that addresses aggravation when the evidence suggests a service-connected condition may be worsening a non-service-connected condition. Raters sometimes only address direct causation and ignore aggravation.",
    legalBasis: "38 CFR 3.310(b); Allen v. Brown, 7 Vet. App. 439 (1995)"
  },
  {
    id: "sc-006",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section B",
    category: "Service Connection",
    title: "Aggravation Baseline Requirement",
    rule: "When service connection is granted on an aggravation basis, the rater must establish a baseline level of disability prior to aggravation and subtract that from the current level to determine the compensable degree. The baseline should be established using medical evidence from before the aggravation began. If a baseline cannot be determined, the benefit of the doubt applies in favor of the veteran.",
    practicalImplication: "If VA grants secondary service connection by aggravation, ensure the baseline is set fairly. If VA cannot determine a clear baseline, you should receive the benefit of the doubt, potentially resulting in a higher rating.",
    commonRaterErrors: "Setting the baseline too high without adequate evidence, which reduces the compensable rating. Also, failing to apply benefit of the doubt when the baseline is genuinely unclear.",
    legalBasis: "38 CFR 3.310(b); Allen v. Brown, 7 Vet. App. 439 (1995)"
  },
  {
    id: "sc-007",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section C",
    category: "Service Connection",
    title: "Presumptive Service Connection for Chronic Diseases",
    rule: "Certain chronic diseases listed under 38 CFR 3.309(a) are presumptively service-connected if they manifest to a compensable degree within one year of separation from active service. The veteran does not need to show a direct nexus. The chronic disease must be diagnosed or established by competent evidence within the presumptive period. If a chronic disease is shown in service and at any time after service, service connection is established regardless of the one-year period.",
    practicalImplication: "If you were diagnosed with a listed chronic disease (arthritis, diabetes, hypertension, sensorineural hearing loss, etc.) within one year of discharge, you do not need a nexus opinion linking it to a specific in-service event.",
    commonRaterErrors: "Not considering the chronic disease presumption when evidence shows diagnosis within one year of separation, instead requiring a direct nexus opinion.",
    legalBasis: "38 CFR 3.307, 3.309(a); Walker v. Shinseki, 708 F.3d 1331 (Fed. Cir. 2013)"
  },
  {
    id: "sc-008",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section C",
    category: "Service Connection",
    title: "Continuity of Symptomatology for Chronic Diseases",
    rule: "For chronic diseases listed under 38 CFR 3.309(a), service connection can also be established through continuity of symptomatology under 38 CFR 3.303(b). If the disease was noted in service and the veteran shows continuous symptoms from service to the present, a medical nexus opinion is not required. This pathway is available only for the diseases specifically listed in 38 CFR 3.309(a).",
    practicalImplication: "If you have experienced continuous symptoms of a listed chronic disease since service, your consistent lay testimony about ongoing symptoms can establish service connection without a medical nexus opinion.",
    commonRaterErrors: "Requiring a formal nexus opinion for listed chronic diseases when the veteran has credibly established continuity of symptomatology since service.",
    legalBasis: "38 CFR 3.303(b), 3.309(a); Walker v. Shinseki, 708 F.3d 1331 (Fed. Cir. 2013)"
  },
  {
    id: "sc-009",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section C",
    category: "Service Connection",
    title: "Presumptive Conditions for POWs",
    rule: "Former prisoners of war who were detained for 30 days or more are entitled to presumptive service connection for a specific list of conditions including atherosclerotic heart disease, hypertensive vascular disease, osteoporosis, and certain nutritional deficiency-related conditions. For POWs detained for any period, certain psychosis and anxiety disorders are presumptive. No nexus opinion is required.",
    practicalImplication: "If you are a former POW, check the full list of presumptive conditions in 38 CFR 3.309(c). Many conditions that develop years after captivity are automatically service-connected without needing to prove a direct link.",
    commonRaterErrors: "Not verifying POW status through appropriate channels or failing to apply the expanded presumptive list for POWs detained 30 or more days.",
    legalBasis: "38 CFR 3.307(a)(5), 3.309(c)"
  },
  {
    id: "sc-010",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section C",
    category: "Service Connection",
    title: "PACT Act Burn Pit Presumptives",
    rule: "The PACT Act of 2022 established presumptive service connection for veterans with toxic exposure during military service, including burn pit exposure in Southwest Asia and other locations. Covered veterans with qualifying service who develop conditions on the presumptive list do not need to prove a direct nexus to burn pit exposure. The concession period for Southwest Asia service was extended through 2026 and beyond.",
    practicalImplication: "If you served in a covered location and have been diagnosed with a condition on the PACT Act presumptive list (including many cancers, respiratory conditions, and constrictive bronchiolitis), file immediately. You do not need to independently prove your condition was caused by toxic exposure.",
    commonRaterErrors: "Not applying the expanded presumptive framework to eligible veterans, or requiring additional nexus evidence for conditions that are now presumptive under the PACT Act.",
    legalBasis: "Sgt. First Class Heath Robinson Honoring Our Promise to Address Comprehensive Toxics Act of 2022 (PACT Act); 38 USC 1116B"
  },
  {
    id: "sc-011",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section C",
    category: "Service Connection",
    title: "Agent Orange Presumptive Conditions",
    rule: "Veterans who served in Vietnam, Thailand (certain Royal Thai Air Force bases), or other designated locations with herbicide agent exposure are entitled to presumptive service connection for conditions on the Agent Orange presumptive list. The PACT Act expanded this list to include hypertension, monoclonal gammopathy of undetermined significance (MGUS), and additional conditions. No nexus opinion is required; the veteran only needs to establish qualifying service and a listed diagnosis.",
    practicalImplication: "If you served in a location with confirmed herbicide exposure and have a listed condition, service connection should be granted without a nexus exam. The list has expanded significantly, so check even for conditions you might not expect to be covered.",
    commonRaterErrors: "Not conceding herbicide exposure for veterans who served at qualifying Thailand bases or in other less commonly known exposure locations.",
    legalBasis: "38 CFR 3.307(a)(6), 3.309(e); PACT Act Section 401"
  },
  {
    id: "sc-012",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section C",
    category: "Service Connection",
    title: "Gulf War Undiagnosed Illness",
    rule: "Veterans who served in the Southwest Asia theater of operations may receive service connection for a qualifying chronic disability resulting from an undiagnosed illness or a medically unexplained chronic multisymptom illness. The condition must have manifested to a 10% or greater degree and cannot be attributed to any known clinical diagnosis. Signs or symptoms can include fatigue, headaches, joint pain, neurological symptoms, sleep disturbances, gastrointestinal symptoms, cardiovascular symptoms, and skin conditions.",
    practicalImplication: "If you served in the Gulf War theater and have chronic symptoms that doctors cannot fully explain or diagnose, you may qualify for service connection under the undiagnosed illness framework without needing a specific diagnosis.",
    commonRaterErrors: "Attributing symptoms to a known diagnosis without adequate basis, thereby circumventing the undiagnosed illness provisions. Also, failing to consider medically unexplained chronic multisymptom illness (like fibromyalgia, chronic fatigue syndrome, or IBS) under this framework.",
    legalBasis: "38 USC 1117; 38 CFR 3.317"
  },
  {
    id: "sc-013",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section A",
    category: "Service Connection",
    title: "Combat Veteran Presumption (Section 1154(b))",
    rule: "For veterans who engaged in combat with the enemy, VA must accept satisfactory lay or other evidence of an in-service event consistent with the circumstances, conditions, or hardships of combat service, even in the absence of official records. This relaxed evidentiary standard applies to establishing the in-service event or injury. It does not eliminate the need for a current diagnosis and nexus, but the in-service element is presumed if consistent with combat service.",
    practicalImplication: "If you are a combat veteran, you do not need official documentation of every injury or event that occurred during combat. Your credible testimony about combat injuries is sufficient to establish the in-service element.",
    commonRaterErrors: "Requiring documentary proof of specific combat injuries when the veteran's testimony is consistent with the nature of their combat service. Also, misapplying 1154(b) to think it establishes the full nexus rather than just the in-service event.",
    legalBasis: "38 USC 1154(b); Collette v. Brown, 82 F.3d 389 (Fed. Cir. 1996)"
  },
  {
    id: "sc-014",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section C",
    category: "Service Connection",
    title: "Radiation Exposure Presumptive Conditions",
    rule: "Veterans who participated in a radiation-risk activity (atmospheric nuclear testing, Hiroshima/Nagasaki occupation, certain other activities) are entitled to presumptive service connection for listed radiogenic diseases including various cancers. For conditions not on the presumptive list but still considered radiogenic, dose estimate procedures under 38 CFR 3.311 apply. The PACT Act expanded coverage for radiation-exposed veterans.",
    practicalImplication: "If you participated in nuclear testing, cleanup operations, or served in areas with confirmed radiation exposure, many cancers and diseases are presumptively service-connected. Even conditions not on the presumptive list may qualify through the dose-estimate process.",
    commonRaterErrors: "Not referring non-presumptive radiogenic disease claims to the Under Secretary for Health for dose estimate review under 38 CFR 3.311.",
    legalBasis: "38 CFR 3.309(d), 3.311; PACT Act Section 601"
  },
  {
    id: "sc-015",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section A",
    category: "Service Connection",
    title: "Service Connection for Disabilities Manifesting After Service",
    rule: "Service connection is not precluded for a disability first diagnosed after service if all the evidence, including lay evidence, establishes that the disease was incurred in service. The fact that a condition was not diagnosed during service does not mean it cannot be service-connected. Post-service medical records, statements from treating physicians, and lay evidence of symptoms during and after service can establish the required elements.",
    practicalImplication: "Do not give up on a claim simply because you were not diagnosed during service. Many conditions take years to manifest or be diagnosed. Medical evidence linking current symptoms to in-service exposures, injuries, or events can support your claim.",
    commonRaterErrors: "Denying claims solely because the condition was not diagnosed during service, without considering post-service evidence and lay testimony regarding onset of symptoms.",
    legalBasis: "38 CFR 3.303(d)"
  },
  {
    id: "sc-016",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section A",
    category: "Service Connection",
    title: "Preexisting Condition Aggravation in Service",
    rule: "A veteran is presumed to be in sound condition when entering service unless a condition is noted at the entrance examination. To rebut the presumption of soundness, VA must show by clear and unmistakable evidence both that the condition preexisted service and that it was not aggravated by service. If VA cannot meet this high burden on both prongs, the veteran is presumed sound and the claim is evaluated as direct service connection.",
    practicalImplication: "If a condition was not documented on your entrance physical, VA must meet an extremely high evidentiary burden to claim it preexisted service. Even if a condition did preexist, VA must also prove it was clearly and unmistakably not worsened by service.",
    commonRaterErrors: "Applying the wrong burden of proof, requiring the veteran to prove the condition did not preexist rather than requiring VA to clearly and unmistakably prove both prongs.",
    legalBasis: "38 USC 1111; Wagner v. Principi, 370 F.3d 1089 (Fed. Cir. 2004)"
  },

  // ============================================================
  // 2. DUTY TO ASSIST
  // ============================================================
  {
    id: "dta-001",
    section: "M21-1, Part III, Subpart iii, Chapter 1, Section A",
    category: "Duty to Assist",
    title: "Obligation to Obtain Federal Records",
    rule: "VA must make as many requests as necessary to obtain relevant records from a Federal department or agency, including service treatment records, VA treatment records, and Social Security Administration records. VA may only end efforts to obtain these records if it concludes the records do not exist or that further efforts to obtain them would be futile. VA must provide formal finding of unavailability if records cannot be obtained.",
    practicalImplication: "VA cannot simply give up on obtaining your federal records after one failed attempt. If VA claims your records are unavailable, demand the formal finding of unavailability and verify that adequate search efforts were made.",
    commonRaterErrors: "Making insufficient attempts to obtain federal records and proceeding with adjudication without issuing a formal finding of unavailability.",
    legalBasis: "38 USC 5103A(b)(3); 38 CFR 3.159(c)(2)"
  },
  {
    id: "dta-002",
    section: "M21-1, Part III, Subpart iii, Chapter 1, Section A",
    category: "Duty to Assist",
    title: "Obligation to Obtain Non-Federal Records",
    rule: "VA must make reasonable efforts to obtain relevant non-Federal records, including private medical records identified by the veteran. VA should make an initial request and at least one follow-up request. VA must notify the veteran if it is unable to obtain the records so the veteran can submit them independently. VA must provide the veteran an opportunity to submit the records before making a decision.",
    practicalImplication: "If you identify private medical records that support your claim, VA is required to help you obtain them. If VA cannot get them, you must be notified and given time to get them yourself.",
    commonRaterErrors: "Failing to make follow-up requests for private records or deciding the claim without notifying the veteran that records could not be obtained.",
    legalBasis: "38 USC 5103A(b); 38 CFR 3.159(c)(1)"
  },
  {
    id: "dta-003",
    section: "M21-1, Part III, Subpart iii, Chapter 1, Section D",
    category: "Duty to Assist",
    title: "When a Medical Examination is Required",
    rule: "VA must provide a medical examination when there is (1) competent evidence of a current disability or persistent or recurrent symptoms of disability, (2) evidence establishing an in-service event, injury, or disease, and (3) an indication that the disability or symptoms may be associated with service. The threshold for the third element is low, requiring only that the evidence 'indicates' a possible association.",
    practicalImplication: "The bar for triggering VA's duty to provide a C&P exam is intentionally low. If you have current symptoms and any indication they may be related to service, VA should provide an exam. A denial without an exam when these elements are met is a duty-to-assist error.",
    commonRaterErrors: "Setting the threshold for ordering an exam too high, requiring the veteran to essentially prove the claim before ordering the examination that would help prove it.",
    legalBasis: "38 USC 5103A(d); McLendon v. Nicholson, 20 Vet. App. 79 (2006)"
  },
  {
    id: "dta-004",
    section: "M21-1, Part III, Subpart iii, Chapter 1, Section D",
    category: "Duty to Assist",
    title: "Adequate Medical Examination Requirements",
    rule: "A medical examination is adequate when the examiner reviews the claims file, considers the veteran's reported history and symptoms, performs appropriate testing, provides a clear diagnosis (or explains why one cannot be made), and offers a medical opinion supported by a reasoned rationale. An opinion that is conclusory, fails to address relevant evidence, or does not consider the veteran's lay statements is inadequate.",
    practicalImplication: "If the C&P examiner did not review your records, dismissed your symptom history without explanation, or gave an opinion without meaningful rationale, the exam may be inadequate and you can challenge it.",
    commonRaterErrors: "Relying on inadequate examinations that contain conclusory opinions or fail to address the veteran's lay testimony about symptom history.",
    legalBasis: "Barr v. Nicholson, 21 Vet. App. 303 (2007); Stefl v. Nicholson, 21 Vet. App. 120 (2007)"
  },
  {
    id: "dta-005",
    section: "M21-1, Part III, Subpart iii, Chapter 1, Section D",
    category: "Duty to Assist",
    title: "Medical Opinion Must Address All Theories",
    rule: "When evidence raises multiple theories of service connection (direct, secondary, aggravation, presumptive), VA must ensure the medical examination and opinion address all reasonably raised theories. An examination that only addresses direct service connection when the evidence also suggests secondary service connection or aggravation is inadequate.",
    practicalImplication: "If VA only obtained an opinion on whether your condition is directly related to service but the evidence also suggests it could be secondary to or aggravated by a service-connected condition, the opinion is incomplete.",
    commonRaterErrors: "Only requesting opinions on one theory of entitlement when the evidence reasonably raises multiple theories.",
    legalBasis: "Robinson v. Peake, 21 Vet. App. 545 (2008)"
  },
  {
    id: "dta-006",
    section: "M21-1, Part I, Chapter 5, Section C",
    category: "Duty to Assist",
    title: "Stegall Compliance on Remand",
    rule: "When a claim is remanded by the Board of Veterans' Appeals or a higher court, the remand instructions constitute binding directives that must be substantially complied with. A remand by the Board confers on the veteran the right to compliance with the remand orders. If the remand directs a new exam, specific records development, or a particular analysis, those steps must be completed before the claim is readjudicated.",
    practicalImplication: "If your claim was remanded with specific instructions and VA did not follow them, you have the right to insist on compliance. Check every remand instruction against what VA actually did before accepting a new decision.",
    commonRaterErrors: "Not fully complying with all remand directives before issuing a new decision, requiring further remand and delay.",
    legalBasis: "Stegall v. West, 11 Vet. App. 268 (1998)"
  },
  {
    id: "dta-007",
    section: "M21-1, Part I, Chapter 1, Section B",
    category: "Duty to Assist",
    title: "VCAA Notice Requirements",
    rule: "Before deciding a claim, VA must provide the veteran with notice of the information and evidence needed to substantiate the claim, what evidence VA will obtain, and what evidence the veteran is expected to provide. This notice must also include information about how VA assigns disability ratings and effective dates. The notice should be provided before the initial decision on the claim.",
    practicalImplication: "If VA decided your claim without first sending you proper notice of what evidence was needed and how to submit it, this is a procedural error that can be raised on appeal.",
    commonRaterErrors: "Sending generic notice letters that do not address the specific evidentiary requirements for the particular type of claim being adjudicated.",
    legalBasis: "38 USC 5103; Dingess v. Nicholson, 19 Vet. App. 473 (2006)"
  },
  {
    id: "dta-008",
    section: "M21-1, Part III, Subpart iii, Chapter 1, Section A",
    category: "Duty to Assist",
    title: "Heightened Duty When Records Are Lost",
    rule: "When a veteran's service records have been lost or destroyed through no fault of the veteran (such as the 1973 National Personnel Records Center fire), VA has a heightened obligation to assist the veteran and to consider alternative sources of evidence. VA must advise the veteran of alternative evidence sources and must provide a heightened duty to explain findings and conclusions.",
    practicalImplication: "If your service records were destroyed in the 1973 NPRC fire or are otherwise unavailable, VA owes you extra help in developing your claim and must be more thorough in explaining its decision.",
    commonRaterErrors: "Not acknowledging the heightened duty when records are lost, and not advising the veteran of alternative evidence that could support the claim.",
    legalBasis: "O'Hare v. Derwinski, 1 Vet. App. 365 (1991); Washington v. Nicholson, 19 Vet. App. 362 (2005)"
  },
  {
    id: "dta-009",
    section: "M21-1, Part III, Subpart iii, Chapter 1, Section A",
    category: "Duty to Assist",
    title: "Duty to Obtain Social Security Administration Records",
    rule: "VA must obtain relevant Social Security Administration disability records when the veteran has applied for or is receiving SSA disability benefits. SSA records often contain medical evidence, examination reports, and functional assessments that may be relevant to the VA claim. VA must make reasonable efforts to obtain these records unless VA determines they are not relevant to the claim.",
    practicalImplication: "If you have applied for or receive SSA disability benefits, make sure VA obtains those records. They often contain medical evidence and functional assessments that can support higher VA ratings.",
    commonRaterErrors: "Failing to request SSA records when the claims file indicates the veteran has applied for or is receiving SSA benefits, or determining records are irrelevant without adequate justification.",
    legalBasis: "38 USC 5103A(c)(3); Golz v. Shinseki, 590 F.3d 1317 (Fed. Cir. 2010)"
  },
  {
    id: "dta-010",
    section: "M21-1, Part III, Subpart iii, Chapter 1, Section D",
    category: "Duty to Assist",
    title: "Examiner Qualifications",
    rule: "The examiner conducting a C&P examination must be qualified to provide the opinion requested. For complex medical questions, the examiner should have relevant expertise. A nurse practitioner can conduct general medical exams, but specialized questions may require a specialist. The veteran or representative can challenge the qualifications of the examiner if the opinion falls outside the examiner's area of competence.",
    practicalImplication: "If a complex specialty question was addressed by a general practitioner rather than a specialist, or if the examiner lacked relevant expertise, this can be grounds to challenge the examination's adequacy.",
    commonRaterErrors: "Assigning complex medical questions to examiners who lack relevant specialization, and then relying on those opinions to deny claims.",
    legalBasis: "38 CFR 3.159(a)(1); Cox v. Nicholson, 20 Vet. App. 563 (2007)"
  },
  {
    id: "dta-011",
    section: "M21-1, Part III, Subpart iii, Chapter 1, Section D",
    category: "Duty to Assist",
    title: "Independent Medical Opinion Requests",
    rule: "When there is a complex or controversial medical question and the existing medical evidence is insufficient or conflicting, VA may obtain an independent medical opinion (IMO) from a physician who is not affiliated with VA. The veteran or representative can also request an IMO. Advisory medical opinions from VHA specialists can also be requested for complex questions.",
    practicalImplication: "If there are conflicting medical opinions in your file or the medical question is complex, you or your representative can request that VA obtain an independent medical opinion from an outside specialist.",
    commonRaterErrors: "Not obtaining an independent medical opinion when existing opinions are conflicting or the medical question is genuinely complex, instead simply picking the opinion that supports denial.",
    legalBasis: "38 USC 5109; 38 CFR 3.328, 20.901"
  },

  // ============================================================
  // 3. BENEFIT OF THE DOUBT
  // ============================================================
  {
    id: "bod-001",
    section: "M21-1, Part III, Subpart iv, Chapter 5, Section A",
    category: "Benefit of the Doubt",
    title: "Benefit of the Doubt Standard",
    rule: "When there is an approximate balance of positive and negative evidence regarding any material issue, the benefit of the doubt is given to the veteran. This means if the evidence is roughly equal for and against the claim, the claim must be granted. The standard is not preponderance of the evidence; VA uses a lower, veteran-friendly standard. The doubt must be material and substantial, not merely speculative.",
    practicalImplication: "If the evidence is close to 50/50 on whether your condition is service-connected or warrants a higher rating, VA must resolve that doubt in your favor. You do not need to prove your case by a preponderance.",
    commonRaterErrors: "Applying a preponderance-of-the-evidence standard rather than the benefit-of-the-doubt standard, effectively requiring the veteran to prove the case by more than 50%.",
    legalBasis: "38 USC 5107(b); Gilbert v. Derwinski, 1 Vet. App. 49 (1990)"
  },
  {
    id: "bod-002",
    section: "M21-1, Part III, Subpart iv, Chapter 5, Section A",
    category: "Benefit of the Doubt",
    title: "At Least As Likely As Not Standard",
    rule: "The phrase 'at least as likely as not' means a 50% or greater probability. If a medical examiner states that it is at least as likely as not that a condition is related to service, this meets the nexus requirement. A finding of 'at least as likely as not' combined with the benefit of the doubt doctrine means the veteran prevails. An opinion stating 'less likely than not' means the probability is below 50%.",
    practicalImplication: "When a medical opinion uses the phrase 'at least as likely as not,' this is a favorable opinion. Combined with benefit of the doubt, 50/50 odds always go in your favor.",
    commonRaterErrors: "Treating 'at least as likely as not' as insufficient or requiring a higher degree of medical certainty than the law requires.",
    legalBasis: "38 USC 5107(b); 38 CFR 3.102"
  },
  {
    id: "bod-003",
    section: "M21-1, Part III, Subpart iv, Chapter 5, Section A",
    category: "Benefit of the Doubt",
    title: "Credibility of Lay Evidence",
    rule: "Lay evidence from the veteran, family members, and fellow service members must be considered and cannot be dismissed solely because it is not corroborated by medical records. Credibility determinations consider internal consistency, consistency with other evidence, and any evidence of interest or bias. A lay witness is presumed credible for the purpose of determining whether evidence is new and material.",
    practicalImplication: "Your own testimony and statements from family and friends are legitimate evidence that VA must consider. VA cannot dismiss your statements simply because a doctor did not document the same information.",
    commonRaterErrors: "Discounting lay evidence without providing adequate reasons, or requiring corroboration by medical evidence for statements about observable symptoms.",
    legalBasis: "Layno v. Brown, 6 Vet. App. 465 (1994); Caluza v. Brown, 7 Vet. App. 498 (1995)"
  },
  {
    id: "bod-004",
    section: "M21-1, Part III, Subpart iv, Chapter 5, Section A",
    category: "Benefit of the Doubt",
    title: "Competency vs Credibility Distinction",
    rule: "Competency refers to whether a witness is capable of making a particular observation or statement. Credibility refers to whether the statement is believable. Lay persons are competent to report observable symptoms (pain, ringing in ears, limited movement) but generally not competent to diagnose complex medical conditions requiring specialized testing. A witness can be competent but not credible, or credible but not competent on a particular issue.",
    practicalImplication: "You are always competent to describe what you feel and experience (pain, numbness, ringing, difficulty breathing). VA cannot dismiss your symptom reports as 'not competent.' Whether VA finds you credible is a separate question.",
    commonRaterErrors: "Conflating competency with credibility, or finding lay evidence not competent when the veteran is reporting observable symptoms well within lay observation capability.",
    legalBasis: "Jandreau v. Nicholson, 492 F.3d 1372 (Fed. Cir. 2007)"
  },
  {
    id: "bod-005",
    section: "M21-1, Part III, Subpart iv, Chapter 5, Section A",
    category: "Benefit of the Doubt",
    title: "Reasonable Doubt Resolution",
    rule: "Reasonable doubt exists when the evidence is in relative equipoise. It is not mere speculation or remote possibility. When after careful consideration of all evidence, a reasonable doubt arises, that doubt will be resolved in favor of the claimant. The benefit-of-the-doubt rule applies to all material issues, including service connection, rating level, and effective date determinations.",
    practicalImplication: "The benefit of the doubt applies not only to whether your condition is service-connected, but also to what rating you should receive and what your effective date should be. If the evidence is close on any of these issues, you should receive the benefit.",
    commonRaterErrors: "Only applying benefit of the doubt to the service connection question but not to the rating percentage or effective date determination.",
    legalBasis: "38 CFR 3.102; Alemany v. Brown, 9 Vet. App. 518 (1996)"
  },
  {
    id: "bod-006",
    section: "M21-1, Part III, Subpart iv, Chapter 5, Section A",
    category: "Benefit of the Doubt",
    title: "Weighing Competing Medical Opinions",
    rule: "When there are competing medical opinions, VA must weigh each opinion based on the qualifications of the examiner, the thoroughness of the examination, the adequacy of the rationale, and whether the examiner considered all relevant evidence. Greater weight may be given to an opinion that includes a more detailed rationale and demonstrates review of the full record. No opinion is automatically given more weight simply because it comes from a VA examiner versus a private physician.",
    practicalImplication: "A private medical opinion that is well-reasoned and based on a thorough review of your records carries equal or greater weight than a VA exam opinion. The quality of the rationale matters more than who the examiner works for.",
    commonRaterErrors: "Automatically giving more weight to VA examiner opinions over private medical opinions without adequately explaining why, or dismissing private opinions without addressing their rationale.",
    legalBasis: "Nieves-Rodriguez v. Peake, 22 Vet. App. 295 (2008); White v. Principi, 243 F.3d 1378 (Fed. Cir. 2001)"
  },

  // ============================================================
  // 4. RATING PROCEDURES
  // ============================================================
  {
    id: "rp-001",
    section: "M21-1, Part III, Subpart iv, Chapter 6",
    category: "Rating Procedures",
    title: "Staged Ratings",
    rule: "When evidence shows distinct time periods during which a service-connected disability exhibited varying levels of severity, different disability ratings may be assigned for different time periods. This is known as staged ratings. The rater must consider the entire period from the effective date of service connection and assign staged ratings where the evidence supports varying levels of disability over time.",
    practicalImplication: "If your condition was more severe at certain times than others since service connection, you may be entitled to higher ratings during those periods. Review your rating decision to ensure VA considered whether your disability warranted different ratings at different times.",
    commonRaterErrors: "Assigning a single rating for the entire period when evidence shows the disability worsened or improved at identifiable points, warranting staged ratings.",
    legalBasis: "Fenderson v. West, 12 Vet. App. 119 (1999); Hart v. Mansfield, 21 Vet. App. 505 (2007)"
  },
  {
    id: "rp-002",
    section: "M21-1, Part III, Subpart iv, Chapter 6, Section B",
    category: "Rating Procedures",
    title: "Effective Date for Original Claims",
    rule: "The effective date for an original claim for service connection is the date VA received the claim or the date entitlement arose, whichever is later. For claims filed within one year of separation from service, the effective date is the day after separation. The date entitlement arose is when the evidence first shows all the elements for service connection were met.",
    practicalImplication: "File your claim as soon as possible after separation. If you file within one year, your effective date goes back to the day after discharge. Every day you delay filing beyond one year can cost you retroactive benefits.",
    commonRaterErrors: "Not assigning an effective date of the day after separation when the claim was filed within one year of discharge and the evidence shows the disability existed at that time.",
    legalBasis: "38 USC 5110(a), (b)(1); 38 CFR 3.400"
  },
  {
    id: "rp-003",
    section: "M21-1, Part III, Subpart iv, Chapter 6, Section B",
    category: "Rating Procedures",
    title: "Effective Date for Increased Rating Claims",
    rule: "For increased rating claims, the effective date is the date VA received the claim or the date entitlement arose, whichever is later. However, the effective date may be up to one year prior to the date the claim was received if it is factually ascertainable that the increase in disability occurred within that one-year look-back period.",
    practicalImplication: "When filing for an increase, gather medical evidence from the prior year showing the worsening. If you can show the increase happened up to one year before you filed, your effective date can go back to the date of that increase.",
    commonRaterErrors: "Not applying the one-year look-back period for increased ratings when medical evidence shows the increase was factually ascertainable within that period.",
    legalBasis: "38 USC 5110(b)(3); 38 CFR 3.400(o)(2); Hazan v. Gober, 10 Vet. App. 511 (1997)"
  },
  {
    id: "rp-004",
    section: "M21-1, Part III, Subpart iv, Chapter 8, Section A",
    category: "Rating Procedures",
    title: "Five-Year Rating Reduction Protection",
    rule: "A disability rating that has been in effect for five or more years cannot be reduced unless sustained improvement under the ordinary conditions of life is demonstrated. A single examination showing improvement is not sufficient. The rater must consider the entire record, including whether improvement was demonstrated on multiple examinations and reflected in the veteran's daily activities. The rating can only be reduced if the evidence clearly shows sustained improvement.",
    practicalImplication: "If your rating has been in effect for five or more years, VA cannot reduce it based on a single exam showing improvement. Demand that VA demonstrate sustained improvement across multiple evaluations.",
    commonRaterErrors: "Proposing reduction of a rating in effect for five or more years based on a single examination without demonstrating sustained improvement.",
    legalBasis: "38 CFR 3.344(a); Brown v. Brown, 5 Vet. App. 413 (1993)"
  },
  {
    id: "rp-005",
    section: "M21-1, Part III, Subpart iv, Chapter 8, Section A",
    category: "Rating Procedures",
    title: "Ten-Year Service Connection Protection",
    rule: "Service connection that has been in effect for 10 or more years cannot be severed except upon a showing that the original grant was based on fraud or that the veteran did not have the qualifying service required. Clear and unmistakable error in the original decision is not sufficient grounds for severance after 10 years unless the original decision involved fraud.",
    practicalImplication: "If you have been service-connected for a condition for 10 or more years, VA cannot sever that service connection absent fraud. This is a powerful protection that locks in your service-connected status.",
    commonRaterErrors: "Attempting to sever service connection after 10 years based on CUE rather than fraud, which exceeds VA's authority under the 10-year protection.",
    legalBasis: "38 USC 1159; 38 CFR 3.957"
  },
  {
    id: "rp-006",
    section: "M21-1, Part III, Subpart iv, Chapter 8, Section A",
    category: "Rating Procedures",
    title: "Twenty-Year Rating Level Protection",
    rule: "A disability rating that has been continuously in effect for 20 or more years cannot be reduced below that level except upon a showing of fraud. This means the specific percentage cannot be reduced, even if current evidence might suggest the disability has improved. VA may assign a higher rating, but cannot go below the 20-year protected level.",
    practicalImplication: "If you have held a 70% rating for 20 or more years, for example, VA cannot reduce it below 70% unless they prove fraud. This is an absolute floor on your rating.",
    commonRaterErrors: "Proposing to reduce a rating below the level that has been in effect for 20 or more years without a fraud finding.",
    legalBasis: "38 USC 110; 38 CFR 3.951(b)"
  },
  {
    id: "rp-007",
    section: "M21-1, Part III, Subpart iv, Chapter 8, Section A",
    category: "Rating Procedures",
    title: "Proposed Reduction Procedural Requirements",
    rule: "Before reducing a disability rating, VA must issue a proposed rating reduction that gives the veteran at least 60 days to submit evidence and request a predetermination hearing. The veteran must be notified of the proposed reduction, the evidence relied upon, and the right to submit additional evidence. If the veteran requests a hearing, the reduction cannot be finalized until after the hearing is conducted and considered.",
    practicalImplication: "If VA proposes to reduce your rating, you have 60 days to fight it. Submit additional medical evidence, request a predetermination hearing, and argue why the reduction is improper. The reduction cannot take effect during this period.",
    commonRaterErrors: "Finalizing a rating reduction without providing the required 60-day notice period or without conducting a requested predetermination hearing.",
    legalBasis: "38 CFR 3.105(e), (i)"
  },
  {
    id: "rp-008",
    section: "M21-1, Part III, Subpart iv, Chapter 8, Section A",
    category: "Rating Procedures",
    title: "Sustained Improvement Required for Reduction",
    rule: "A rating reduction is not warranted unless there is evidence of actual improvement in the veteran's ability to function under the ordinary conditions of life and work. Improvement on a single examination is insufficient. The rater must consider the complete medical history, compare the current condition with past examinations, and determine whether improvement is likely to be maintained. Temporary improvement during remission of a chronic condition does not justify reduction.",
    practicalImplication: "If your condition has good days and bad days, a single good exam does not justify a reduction. VA must show that improvement is sustained and reflected in your daily functioning, not just a momentary snapshot.",
    commonRaterErrors: "Reducing ratings based on a single favorable examination without comparing it to the entire medical history and without considering whether improvement is sustained.",
    legalBasis: "38 CFR 3.344; Schafrath v. Derwinski, 1 Vet. App. 589 (1991)"
  },
  {
    id: "rp-009",
    section: "M21-1, Part III, Subpart iv, Chapter 6, Section A",
    category: "Rating Procedures",
    title: "Combined Ratings Calculation (VA Math)",
    rule: "Multiple disability ratings are combined using the Combined Ratings Table, not simple addition. Each additional disability rating is applied to the remaining efficiency, not the original 100%. For example, a 50% and a 30% disability do not equal 80%; instead, the 30% is applied to the remaining 50% of efficiency (50% + 15% = 65%, rounded to 70%). The combined rating is rounded to the nearest 10%.",
    practicalImplication: "Understand that VA math means your combined rating will always be less than the simple sum of your individual ratings. Use a combined ratings calculator to understand your potential total before filing.",
    commonRaterErrors: "Errors in combined ratings calculation are rare but do occur. Verify the math in any rating decision that combines multiple disabilities.",
    legalBasis: "38 CFR 4.25"
  },
  {
    id: "rp-010",
    section: "M21-1, Part III, Subpart iv, Chapter 6, Section A",
    category: "Rating Procedures",
    title: "Bilateral Factor",
    rule: "When a veteran has disabilities affecting paired extremities (both arms, both legs, or paired skeletal muscles), an additional 10% is added to the combined value of those bilateral disabilities before combining them with other disabilities. This bilateral factor recognizes the additional impairment from having paired extremities affected. The 10% is added to the combined bilateral value, not to each individual rating.",
    practicalImplication: "If you have service-connected conditions affecting both legs or both arms, you receive a bilateral factor boost to your combined rating. Ensure VA has correctly identified and applied the bilateral factor.",
    commonRaterErrors: "Failing to apply the bilateral factor when the veteran has compensable disabilities affecting both upper or both lower extremities.",
    legalBasis: "38 CFR 4.26"
  },
  {
    id: "rp-011",
    section: "M21-1, Part III, Subpart iv, Chapter 6, Section A",
    category: "Rating Procedures",
    title: "Pyramiding Prohibition",
    rule: "The same disability or the same manifestation of a disability cannot be rated under more than one diagnostic code. This prohibition against pyramiding prevents double compensation for the same symptoms. However, different symptoms from the same condition can be rated under separate diagnostic codes if they do not overlap. The key is whether the same symptom or functional impairment is being compensated twice.",
    practicalImplication: "While VA cannot rate the same symptoms twice, you can receive separate ratings for different symptoms even if they stem from the same underlying condition. For example, a knee injury can be separately rated for instability and limitation of motion.",
    commonRaterErrors: "Overly broad application of the pyramiding rule to deny separate ratings for distinct symptoms of the same condition, when the symptoms do not actually overlap.",
    legalBasis: "38 CFR 4.14; Esteban v. Brown, 6 Vet. App. 259 (1994)"
  },
  {
    id: "rp-012",
    section: "M21-1, Part III, Subpart iv, Chapter 6, Section A",
    category: "Rating Procedures",
    title: "Analogous Ratings",
    rule: "When a condition is not specifically listed in the VA Rating Schedule, it should be rated by analogy under a closely related diagnostic code where the affected functions, anatomical localization, and symptomatology are most closely analogous. The rater should identify the most appropriate diagnostic code and explain why that code was chosen. The analogous rating should reflect the actual functional impairment.",
    practicalImplication: "Even if your specific condition does not have its own diagnostic code, VA must rate it under the most similar code. If the code chosen does not capture your actual functional limitations, you can argue for a more appropriate analogous code.",
    commonRaterErrors: "Selecting an analogous diagnostic code that does not adequately capture the veteran's functional impairment, or not explaining why a particular code was chosen.",
    legalBasis: "38 CFR 4.20"
  },
  {
    id: "rp-013",
    section: "M21-1, Part III, Subpart iv, Chapter 6, Section A",
    category: "Rating Procedures",
    title: "Higher of Two Ratings When Between Criteria",
    rule: "When the disability picture more nearly approximates the criteria for a higher rating, the higher evaluation should be assigned. The veteran does not need to meet every criterion for the higher rating; the overall disability picture must more closely resemble the higher level than the lower level. This requires a holistic assessment of the veteran's symptoms and functional limitations.",
    practicalImplication: "If your symptoms fall between two rating levels, and your overall disability picture is closer to the higher level, you should receive the higher rating. You do not need to check every single box for the higher criteria.",
    commonRaterErrors: "Requiring the veteran to meet every criterion for a higher rating rather than conducting a holistic assessment of whether the disability picture more nearly approximates the higher level.",
    legalBasis: "38 CFR 4.7"
  },
  {
    id: "rp-014",
    section: "M21-1, Part III, Subpart iv, Chapter 6",
    category: "Rating Procedures",
    title: "Extraschedular Rating Referral",
    rule: "When a veteran's disability picture is not adequately captured by the schedular rating criteria, the case may be referred for extraschedular consideration. The threshold question is whether the schedular criteria reasonably describe the veteran's disability level and symptomatology. If the criteria do not, the case should be referred to the Director of Compensation Service for extraschedular evaluation.",
    practicalImplication: "If your condition causes impairment that the standard rating criteria do not address (such as unique symptoms or an exceptional disability picture), you can request extraschedular consideration for a higher rating.",
    commonRaterErrors: "Not referring cases for extraschedular consideration when the veteran's symptoms clearly exceed what the schedular criteria contemplate.",
    legalBasis: "38 CFR 3.321(b)(1); Thun v. Peake, 22 Vet. App. 111 (2008)"
  },
  {
    id: "rp-015",
    section: "M21-1, Part III, Subpart iv, Chapter 6, Section B",
    category: "Rating Procedures",
    title: "Effective Date After Reopened Claim with New and Material Evidence",
    rule: "When a previously denied claim is reopened based on new and material evidence, the effective date is the date VA received the claim to reopen, or the date entitlement arose, whichever is later. However, if new service department records (such as previously missing service treatment records) are the basis for the grant, the effective date can go back to the date of the original claim.",
    practicalImplication: "If VA later finds service records that were not in the file when your original claim was denied, your effective date can be set back to the original claim date. This can result in substantial retroactive benefits.",
    commonRaterErrors: "Not applying the earlier effective date when service department records are received after the original denial, instead using the reopened claim date.",
    legalBasis: "38 CFR 3.156(c), 3.400(q)"
  },
  {
    id: "rp-016",
    section: "M21-1, Part III, Subpart iv, Chapter 6, Section A",
    category: "Rating Procedures",
    title: "Reasonable Doubt in Rating Determinations",
    rule: "When there is a question as to which of two evaluations shall be applied, and the evidence is in approximate balance, the higher evaluation will be assigned. This is the application of the benefit-of-the-doubt doctrine to rating level determinations. If the disability picture more nearly approximates the criteria for the higher rating, the higher rating is warranted.",
    practicalImplication: "Benefit of the doubt applies to your rating percentage, not just service connection. If your symptoms are borderline between two ratings, the higher one should be assigned.",
    commonRaterErrors: "Defaulting to the lower rating when the evidence is genuinely in equipoise between two rating levels.",
    legalBasis: "38 CFR 4.3, 4.7"
  },

  // ============================================================
  // 5. EVIDENCE RULES
  // ============================================================
  {
    id: "ev-001",
    section: "M21-1, Part III, Subpart iv, Chapter 5, Section A",
    category: "Evidence Rules",
    title: "Favorable Findings Preservation",
    rule: "Once VA has made a favorable finding relating to a claim, that finding is binding on all subsequent adjudicators unless the finding is clearly erroneous. A favorable finding includes any determination that is favorable to the veteran, such as a finding of service connection, a finding of a particular in-service event, or a determination regarding the credibility of evidence. Subsequent adjudicators cannot simply disregard or reverse a prior favorable finding.",
    practicalImplication: "If a previous VA decision acknowledged a favorable fact (such as an in-service event or a particular symptom), that finding should carry forward. Watch for later decisions that contradict previously established favorable findings.",
    commonRaterErrors: "Ignoring or contradicting prior favorable findings without a determination that the original finding was clearly erroneous.",
    legalBasis: "38 CFR 3.104(c)"
  },
  {
    id: "ev-002",
    section: "M21-1, Part III, Subpart iv, Chapter 5, Section A",
    category: "Evidence Rules",
    title: "Competent Medical Evidence Requirements",
    rule: "Competent medical evidence is evidence provided by a person who is qualified through education, training, or experience to offer medical diagnoses, statements, or opinions. Medical opinions must be based on sufficient facts or data, use reliable principles and methods, and apply those principles and methods reliably to the facts of the case. A medical opinion that is speculative or not supported by clinical data has limited probative value.",
    practicalImplication: "Ensure any medical opinion you submit comes from a qualified provider who explains their reasoning clearly and bases it on your actual medical records and history.",
    commonRaterErrors: "Giving probative weight to speculative or poorly reasoned medical opinions while dismissing well-reasoned opinions from qualified private providers.",
    legalBasis: "38 CFR 3.159(a)(1)"
  },
  {
    id: "ev-003",
    section: "M21-1, Part III, Subpart iv, Chapter 5, Section A",
    category: "Evidence Rules",
    title: "Lay Evidence Competency (Jandreau Standard)",
    rule: "Lay persons are competent to report on matters observed through their senses (what they see, hear, feel). This includes testimony about symptom onset, continuity, and observable manifestations of a condition. Lay persons may also be competent to testify about simple medical conditions that are capable of lay observation, such as a broken leg or varicose veins. For complex medical diagnoses requiring specialized knowledge, medical evidence is generally required.",
    practicalImplication: "You are competent to describe your symptoms, when they started, and how they have progressed. Family members are competent to describe changes they have observed in you. This lay testimony must be weighed alongside medical evidence.",
    commonRaterErrors: "Dismissing lay testimony about clearly observable symptoms because it lacks medical corroboration, when the testimony is within lay competence.",
    legalBasis: "Jandreau v. Nicholson, 492 F.3d 1372 (Fed. Cir. 2007)"
  },
  {
    id: "ev-004",
    section: "M21-1, Part III, Subpart iv, Chapter 5, Section A",
    category: "Evidence Rules",
    title: "Buddy and Lay Statement Weight",
    rule: "Buddy statements and lay statements from fellow service members, family members, friends, and coworkers are competent evidence that must be considered by VA. These statements can corroborate the veteran's account of in-service events, describe observable symptoms and functional limitations, and provide evidence of continuity of symptoms. The weight given depends on specificity, consistency with other evidence, and credibility.",
    practicalImplication: "Obtain detailed buddy statements from people who served with you or who can describe your symptoms and limitations. Specific, detailed statements carry more weight than vague, generic ones.",
    commonRaterErrors: "Dismissing buddy statements without adequate explanation or failing to discuss them in the reasons and bases of the decision.",
    legalBasis: "38 CFR 3.303(a); Buchanan v. Nicholson, 451 F.3d 1331 (Fed. Cir. 2006)"
  },
  {
    id: "ev-005",
    section: "M21-1, Part III, Subpart iv, Chapter 5, Section A",
    category: "Evidence Rules",
    title: "Private vs VA Medical Opinions",
    rule: "Private medical opinions and VA medical opinions are to be given equal initial weight. Neither source of medical evidence is inherently more probative than the other. The probative value depends on the thoroughness of the examination, the adequacy of the rationale, whether the examiner reviewed the full record, and the qualifications of the examiner. A well-reasoned private opinion outweighs a poorly reasoned VA opinion, and vice versa.",
    practicalImplication: "A strong private medical opinion from your treating physician can overcome a negative VA exam opinion if it provides a thorough rationale. Consider obtaining private opinions, especially from specialists familiar with your condition.",
    commonRaterErrors: "Automatically giving greater weight to VA examination opinions over private opinions without adequately explaining the reasoning based on the quality and thoroughness of each opinion.",
    legalBasis: "White v. Principi, 243 F.3d 1378 (Fed. Cir. 2001)"
  },
  {
    id: "ev-006",
    section: "M21-1, Part III, Subpart iv, Chapter 5, Section A",
    category: "Evidence Rules",
    title: "Adequate Reasons and Bases Requirement",
    rule: "Every VA decision must include adequate reasons and bases for its findings and conclusions. The decision must address all material evidence favorable to the veteran, explain why it was not persuasive, and provide enough detail for the veteran and any reviewing court to understand the reasoning. A decision that ignores favorable evidence or fails to explain its reasoning is legally inadequate.",
    practicalImplication: "If your denial letter does not address favorable evidence you submitted, or does not explain why it was not persuasive, the decision is inadequate. This is grounds for appeal.",
    commonRaterErrors: "Failing to address favorable evidence in the record, providing only boilerplate denials, or not explaining why favorable medical opinions or lay evidence was not persuasive.",
    legalBasis: "38 USC 7104(d)(1); Gilbert v. Derwinski, 1 Vet. App. 49 (1990)"
  },
  {
    id: "ev-007",
    section: "M21-1, Part III, Subpart iv, Chapter 5, Section A",
    category: "Evidence Rules",
    title: "Treating Physician's Opinion",
    rule: "While a treating physician's opinion is not entitled to automatic greater weight, the treating physician's familiarity with the veteran's medical history and ongoing condition is a factor to consider. A treating physician who has followed the veteran's condition over time may provide more detailed and nuanced opinions than an examiner who sees the veteran only once for a brief evaluation.",
    practicalImplication: "Opinions from your regular treating physician, who knows your history well, can carry significant weight. When obtaining opinions, emphasize the treating relationship and the physician's familiarity with your complete medical history.",
    commonRaterErrors: "Dismissing a treating physician's opinion in favor of a C&P examiner who spent less time and had less familiarity with the veteran's medical history, without adequately explaining why.",
    legalBasis: "White v. Principi, 243 F.3d 1378 (Fed. Cir. 2001); Guerrieri v. Brown, 4 Vet. App. 467 (1993)"
  },
  {
    id: "ev-008",
    section: "M21-1, Part III, Subpart iv, Chapter 5",
    category: "Evidence Rules",
    title: "Medical Treatise Evidence",
    rule: "Medical treatise evidence, including articles, studies, and textbook excerpts, can be used to support a claim. Such evidence is most useful when it is combined with a medical opinion that applies the general principles in the treatise to the specific facts of the veteran's case. Standing alone, treatise evidence that speaks only in general terms is typically insufficient to establish the required nexus, but it can contribute when combined with other evidence.",
    practicalImplication: "Medical research articles can strengthen your claim when used alongside a medical opinion that explains how the research applies to your specific situation. They are most helpful for establishing known medical links between exposures and conditions.",
    commonRaterErrors: "Dismissing relevant medical treatise evidence entirely rather than considering it as part of the totality of evidence.",
    legalBasis: "Sacks v. West, 11 Vet. App. 314 (1998); Wallin v. West, 11 Vet. App. 509 (1998)"
  },
  {
    id: "ev-009",
    section: "M21-1, Part III, Subpart iv, Chapter 5, Section A",
    category: "Evidence Rules",
    title: "Negative Evidence and Silence of Records",
    rule: "The absence of evidence is not necessarily negative evidence. The fact that service treatment records do not document a condition does not automatically disprove that it occurred. However, the silence of the record can be considered as evidence if the condition is one that would normally be recorded if present. The weight given to the absence of records depends on the circumstances and the nature of the claimed condition.",
    practicalImplication: "A lack of medical records during service does not prove your condition did not exist. Many service members avoid seeking treatment due to mission requirements, stigma, or limited access. Explain why you did not seek treatment.",
    commonRaterErrors: "Treating the absence of service treatment records as affirmative evidence against the claim, particularly for conditions like mental health, chronic pain, or tinnitus where service members commonly do not seek treatment.",
    legalBasis: "Buchanan v. Nicholson, 451 F.3d 1331 (Fed. Cir. 2006); Kahana v. Shinseki, 24 Vet. App. 428 (2011)"
  },
  {
    id: "ev-010",
    section: "M21-1, Part III, Subpart iv, Chapter 5, Section A",
    category: "Evidence Rules",
    title: "Duty to Consider All Evidence",
    rule: "VA must consider all evidence of record, both favorable and unfavorable, before making a determination. Cherry-picking evidence that supports denial while ignoring favorable evidence is legally impermissible. Every piece of relevant evidence must be addressed in the reasons and bases of the decision. If favorable evidence is ultimately given less weight, the decision must explain why.",
    practicalImplication: "Review your rating decision carefully. If it does not mention key evidence you submitted, VA may not have considered it. Cite specific evidence that was ignored as a basis for your appeal.",
    commonRaterErrors: "Selectively citing unfavorable evidence while not addressing favorable evidence in the record.",
    legalBasis: "Gabrielson v. Brown, 7 Vet. App. 36 (1994)"
  },

  // ============================================================
  // 6. TDIU
  // ============================================================
  {
    id: "tdiu-001",
    section: "M21-1, Part III, Subpart iv, Chapter 7, Section A",
    category: "TDIU",
    title: "Schedular TDIU Requirements",
    rule: "A total disability rating based on individual unemployability (TDIU) may be assigned when the veteran has one service-connected disability rated at 60% or more, or two or more disabilities with a combined rating of 70% or more (with at least one disability rated at 40% or more), and the veteran is unable to secure or follow a substantially gainful occupation as a result of service-connected disabilities.",
    practicalImplication: "If you meet the schedular thresholds and cannot work due to your service-connected conditions, you should file for TDIU. This grants compensation at the 100% rate even if your combined schedular rating is less than 100%.",
    commonRaterErrors: "Not considering TDIU when the evidence raises the issue, even if the veteran did not explicitly file for it. Rice v. Shinseki requires TDIU consideration when reasonably raised.",
    legalBasis: "38 CFR 4.16(a); Rice v. Shinseki, 22 Vet. App. 447 (2009)"
  },
  {
    id: "tdiu-002",
    section: "M21-1, Part III, Subpart iv, Chapter 7, Section A",
    category: "TDIU",
    title: "Extraschedular TDIU Referral",
    rule: "When a veteran does not meet the schedular percentage requirements for TDIU but there is evidence that service-connected disabilities prevent substantially gainful employment, the case must be referred to the Director of Compensation Service for extraschedular TDIU consideration. The rater cannot deny extraschedular TDIU without this referral if the evidence raises unemployability.",
    practicalImplication: "Even if you do not meet the schedular thresholds (one at 60% or combined 70%), you can still receive TDIU if VA refers your case for extraschedular consideration. VA must make this referral if the evidence shows you cannot work.",
    commonRaterErrors: "Denying TDIU outright when the veteran does not meet schedular requirements instead of referring the case for extraschedular consideration when the evidence suggests unemployability.",
    legalBasis: "38 CFR 4.16(b)"
  },
  {
    id: "tdiu-003",
    section: "M21-1, Part III, Subpart iv, Chapter 7, Section A",
    category: "TDIU",
    title: "Marginal Employment Definition",
    rule: "Marginal employment is not considered substantially gainful employment. Marginal employment generally exists when the veteran's annual income does not exceed the poverty threshold for a single person. Employment in a protected environment (family business, sheltered workshop) may also be considered marginal employment regardless of income. The ability to work part-time or sporadically does not defeat a TDIU claim.",
    practicalImplication: "Working part-time below the poverty line or in a protected environment (such as a family business that accommodates your disabilities) does not disqualify you from TDIU. Document any workplace accommodations.",
    commonRaterErrors: "Denying TDIU because the veteran performs some work, without analyzing whether it constitutes marginal employment or is in a protected environment.",
    legalBasis: "38 CFR 4.16(a)"
  },
  {
    id: "tdiu-004",
    section: "M21-1, Part III, Subpart iv, Chapter 7, Section A",
    category: "TDIU",
    title: "Protected Work Environments",
    rule: "Employment in a protected work environment may be considered marginal employment even if the veteran's income exceeds the poverty threshold. A protected work environment is one where the veteran receives special accommodations from family members or employers that would not be available in a competitive job market. Evidence of such accommodations includes reduced hours, modified duties, tolerance of absences, and lighter workload.",
    practicalImplication: "If you work for a family member or employer who makes special allowances for your disabilities, document these accommodations. This can demonstrate that your employment is not truly competitive and supports TDIU.",
    commonRaterErrors: "Not considering whether the veteran's current employment is in a protected environment, instead focusing solely on whether the veteran earns above the poverty line.",
    legalBasis: "38 CFR 4.16(a); Ortiz-Valles v. McDonald, 28 Vet. App. 65 (2016)"
  },
  {
    id: "tdiu-005",
    section: "M21-1, Part III, Subpart iv, Chapter 7, Section A",
    category: "TDIU",
    title: "Age Cannot Be Considered in TDIU",
    rule: "Advancing age may not be considered as a factor in determining whether a veteran is unable to secure or follow substantially gainful employment for TDIU purposes. The analysis must focus solely on the functional impairment caused by service-connected disabilities. Non-service-connected disabilities and the natural effects of aging are excluded from the TDIU analysis.",
    practicalImplication: "VA cannot deny TDIU by attributing your inability to work to your age. The focus must be entirely on how your service-connected disabilities affect your ability to work.",
    commonRaterErrors: "Attributing the veteran's unemployability partly to age or non-service-connected conditions rather than focusing exclusively on the impact of service-connected disabilities.",
    legalBasis: "38 CFR 4.19"
  },
  {
    id: "tdiu-006",
    section: "M21-1, Part III, Subpart iv, Chapter 7, Section A",
    category: "TDIU",
    title: "Education and Work History in TDIU",
    rule: "VA must consider the veteran's education, training, and work history in determining whether TDIU is warranted. A veteran whose only work experience is manual labor may be unable to transition to sedentary work due to limited education. The analysis considers the veteran's specific employment capabilities in light of their service-connected disabilities, not abstract job possibilities that may not be realistic given the veteran's background.",
    practicalImplication: "Your specific work history matters. If you have worked in physical jobs your whole career and your service-connected conditions prevent physical work, the fact that sedentary jobs exist in the economy does not defeat your TDIU claim if your education and experience do not support sedentary employment.",
    commonRaterErrors: "Suggesting the veteran could perform sedentary employment without adequately considering whether the veteran's education, training, and experience make sedentary work a realistic option.",
    legalBasis: "38 CFR 4.16(a); Pederson v. McDonald, 27 Vet. App. 276 (2015)"
  },
  {
    id: "tdiu-007",
    section: "M21-1, Part III, Subpart iv, Chapter 7, Section A",
    category: "TDIU",
    title: "TDIU with Special Monthly Compensation Interaction",
    rule: "Under Bradley v. Peake, a veteran who is in receipt of TDIU based on one disability or group of disabilities and also has additional service-connected disabilities independently rated at 60% or more (or meeting housebound criteria) may be entitled to Special Monthly Compensation at the housebound rate under 38 USC 1114(s). TDIU can serve as the total rating for SMC(s) purposes.",
    practicalImplication: "If you receive TDIU and have other service-connected conditions rated separately at 60% or more, you may be entitled to additional SMC at the housebound rate. This is often overlooked and can result in significant additional compensation.",
    commonRaterErrors: "Failing to consider SMC(s) entitlement when a veteran has TDIU based on one disability plus additional disabilities rated at 60% or more.",
    legalBasis: "38 USC 1114(s); Bradley v. Peake, 22 Vet. App. 280 (2008)"
  },
  {
    id: "tdiu-008",
    section: "M21-1, Part III, Subpart iv, Chapter 7, Section A",
    category: "TDIU",
    title: "TDIU and Substantially Gainful Employment Standard",
    rule: "Substantially gainful employment means employment that provides annual income exceeding the poverty threshold and is not marginal. The inability to maintain employment due to service-connected disabilities is as relevant as the inability to obtain it. Frequent job loss, inability to maintain attendance, or inability to perform essential job functions due to service-connected disabilities supports TDIU even if the veteran has periods of employment.",
    practicalImplication: "If you keep losing jobs because of your service-connected conditions, this supports TDIU even if you can occasionally find work. Document your job history, reasons for leaving, and any performance issues related to your disabilities.",
    commonRaterErrors: "Denying TDIU based on the veteran's ability to temporarily obtain employment without considering the inability to maintain that employment.",
    legalBasis: "38 CFR 4.16(a); Moore v. Derwinski, 1 Vet. App. 356 (1991)"
  },

  // ============================================================
  // 7. SPECIAL MONTHLY COMPENSATION
  // ============================================================
  {
    id: "smc-001",
    section: "M21-1, Part III, Subpart iv, Chapter 7, Section B",
    category: "Special Monthly Compensation",
    title: "SMC(k) Loss of Use Criteria",
    rule: "SMC(k) is payable for each anatomical loss or loss of use of a creative organ, one hand, one foot, both buttocks, or one or more paired organs (eyes, kidneys, etc.). Loss of use means that the remaining function of the extremity is no more than what would exist with amputation with a suitable prosthesis. SMC(k) is also payable for loss of use of a creative organ, which includes erectile dysfunction.",
    practicalImplication: "If your service-connected condition has resulted in loss of use of a hand, foot, eye, or creative organ, you are entitled to SMC(k) in addition to your regular compensation. Each qualifying loss of use results in a separate SMC(k) payment.",
    commonRaterErrors: "Not awarding SMC(k) for loss of use of a creative organ when the veteran's service-connected conditions or medications cause erectile dysfunction.",
    legalBasis: "38 USC 1114(k); 38 CFR 3.350(a)"
  },
  {
    id: "smc-002",
    section: "M21-1, Part III, Subpart iv, Chapter 7, Section B",
    category: "Special Monthly Compensation",
    title: "SMC(l) Aid and Attendance",
    rule: "SMC(l) is payable when the veteran requires the regular aid and attendance of another person due to service-connected disabilities. This includes inability to dress, undress, keep clean, attend to the needs of nature, or protect oneself from the hazards of daily living without regular personal assistance. It also applies when the veteran is bedridden or has a single service-connected disability rated 100% plus an additional disability independently rated at 60% or more.",
    practicalImplication: "If you need someone to help you with daily activities like bathing, dressing, eating, or keeping safe due to service-connected conditions, you may qualify for Aid and Attendance, which provides a significantly higher monthly compensation.",
    commonRaterErrors: "Not considering SMC(l) eligibility when the evidence shows the veteran requires regular personal assistance with activities of daily living due to service-connected conditions.",
    legalBasis: "38 USC 1114(l); 38 CFR 3.350(b), 3.352(a)"
  },
  {
    id: "smc-003",
    section: "M21-1, Part III, Subpart iv, Chapter 7, Section B",
    category: "Special Monthly Compensation",
    title: "SMC(s) Housebound",
    rule: "SMC(s) housebound is payable when the veteran has a single service-connected disability rated at 100% and additional service-connected disabilities independently rated at 60% or more, or when the veteran is permanently housebound by reason of service-connected disability. Being housebound means substantially confined to the dwelling and immediate premises due to service-connected disabilities. TDIU can serve as the 100% rating for this purpose under Bradley v. Peake.",
    practicalImplication: "You may qualify for SMC(s) if you have a 100% rating (or TDIU) for one condition plus 60% or more in additional conditions. This is one of the most commonly overlooked VA benefits.",
    commonRaterErrors: "Not considering SMC(s) when the veteran has TDIU plus additional ratings meeting the 60% threshold, failing to apply Bradley v. Peake.",
    legalBasis: "38 USC 1114(s); 38 CFR 3.350(i); Bradley v. Peake, 22 Vet. App. 280 (2008)"
  },
  {
    id: "smc-004",
    section: "M21-1, Part III, Subpart iv, Chapter 7, Section B",
    category: "Special Monthly Compensation",
    title: "SMC(t) Aid and Attendance for TBI",
    rule: "SMC(t) provides compensation for veterans who require aid and attendance for residuals of traumatic brain injury. SMC(t) is specifically for TBI-related needs and can be combined with other SMC rates. It applies when the veteran needs regular aid and attendance due to TBI residuals but might not otherwise qualify for SMC(l) or higher based on other disabilities alone. The assessment considers cognitive and physical impairments from TBI.",
    practicalImplication: "If you have a service-connected TBI that requires someone to assist with daily living, medical management, or safety supervision, you may qualify for this additional compensation specifically designed for TBI veterans.",
    commonRaterErrors: "Not evaluating for SMC(t) in TBI cases where the veteran needs supervision or assistance with daily activities due to cognitive impairment from TBI.",
    legalBasis: "38 USC 1114(t); 38 CFR 3.350(j)"
  },
  {
    id: "smc-005",
    section: "M21-1, Part III, Subpart iv, Chapter 7, Section B",
    category: "Special Monthly Compensation",
    title: "Bradley v. Peake - TDIU as Basis for SMC(s)",
    rule: "Under Bradley v. Peake, TDIU can satisfy the requirement for a single disability rated at 100% for purposes of SMC(s) eligibility. When TDIU is based on one disability or group of disabilities and the veteran has additional disabilities independently rated at 60% or more, SMC(s) is warranted. The additional disabilities must be separate from those forming the basis of TDIU.",
    practicalImplication: "If you receive TDIU based on one condition (such as PTSD) and have separate conditions totaling 60% or more (such as orthopedic disabilities), you should be receiving SMC(s). This is frequently missed and worth reviewing.",
    commonRaterErrors: "Not considering TDIU as a total rating for SMC(s) purposes, or combining all disabilities for TDIU and then finding no additional disabilities meet the 60% threshold.",
    legalBasis: "Bradley v. Peake, 22 Vet. App. 280 (2008)"
  },
  {
    id: "smc-006",
    section: "M21-1, Part III, Subpart iv, Chapter 7, Section B",
    category: "Special Monthly Compensation",
    title: "Akles - Highest Applicable SMC Rate",
    rule: "Under Akles v. Derwinski, VA must consider and grant the highest level of SMC supported by the evidence. The rater must affirmatively evaluate all potentially applicable levels of SMC and not stop at the first qualifying level. If the evidence supports entitlement to multiple SMC levels, the veteran is entitled to the highest rate.",
    practicalImplication: "If you qualify for SMC, verify that VA considered all applicable levels and granted the highest one supported by your evidence. Many veterans are undercompensated because raters stop evaluating at a lower SMC level.",
    commonRaterErrors: "Granting SMC at a lower level without evaluating whether the veteran qualifies for a higher level of SMC.",
    legalBasis: "Akles v. Derwinski, 1 Vet. App. 118 (1991)"
  },
  {
    id: "smc-007",
    section: "M21-1, Part III, Subpart iv, Chapter 7, Section B",
    category: "Special Monthly Compensation",
    title: "SMC and Statutory Housebound Criteria",
    rule: "Statutory housebound under SMC(s) does not require that the veteran actually be confined to the home. It requires either (1) a single 100%-rated disability plus additional disabilities combining to 60% or more, or (2) that the veteran is substantially confined to the dwelling by service-connected disabilities. The first prong is purely mathematical and does not require actual housebound status.",
    practicalImplication: "You do not need to prove you are actually housebound to receive statutory SMC(s) under the first prong. If you have the required rating combination (100% plus 60%), the benefit is automatic.",
    commonRaterErrors: "Requiring evidence of actual housebound status when the veteran meets the statutory (mathematical) criteria for SMC(s), which does not require proof of actual confinement.",
    legalBasis: "38 USC 1114(s); 38 CFR 3.350(i)"
  },
  {
    id: "smc-008",
    section: "M21-1, Part III, Subpart iv, Chapter 7, Section B",
    category: "Special Monthly Compensation",
    title: "Multiple SMC(k) Awards",
    rule: "A veteran may receive multiple SMC(k) awards for separate qualifying losses. For example, a veteran with loss of use of a creative organ and loss of use of one foot would receive two SMC(k) payments. Each anatomical loss or loss of use is independently compensable. There is no limit to the number of SMC(k) awards, though total compensation rates are subject to statutory caps at certain combined levels.",
    practicalImplication: "If you have multiple qualifying losses of use, each one should result in a separate SMC(k) payment. Verify that every qualifying loss has been identified and compensated.",
    commonRaterErrors: "Only awarding one SMC(k) when the veteran has multiple qualifying losses of use.",
    legalBasis: "38 USC 1114(k); 38 CFR 3.350(a)"
  },

  // ============================================================
  // 8. MENTAL HEALTH CLAIMS
  // ============================================================
  {
    id: "mh-001",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section H",
    category: "Mental Health Claims",
    title: "General Rating Formula for Mental Disorders",
    rule: "All mental health conditions (except eating disorders) are rated under the General Rating Formula for Mental Disorders, which evaluates occupational and social impairment on a scale from 0% to 100%. The rating criteria describe levels of impairment at each percentage level. The formula considers symptoms, their frequency, severity, and duration, and their overall effect on occupational and social functioning.",
    practicalImplication: "Your mental health rating should reflect your overall level of occupational and social impairment, not just a checklist of symptoms. Focus on documenting how your condition affects your ability to work and maintain relationships.",
    commonRaterErrors: "Rigidly applying the symptom lists at each rating level as a checklist rather than evaluating overall occupational and social impairment as required by Mauerhan.",
    legalBasis: "38 CFR 4.130, Diagnostic Codes 9201-9440"
  },
  {
    id: "mh-002",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section H",
    category: "Mental Health Claims",
    title: "Mauerhan - Symptoms List Not Exhaustive",
    rule: "The symptoms listed at each rating level in the General Rating Formula are examples, not an exhaustive list of requirements. A veteran does not need to demonstrate every symptom listed for a particular rating level. Conversely, the presence of certain symptoms does not automatically entitle the veteran to a particular rating. The critical inquiry is the level of occupational and social impairment caused by the veteran's mental health symptoms overall.",
    practicalImplication: "Even if you do not experience every symptom listed for a higher rating level, you may still qualify if your overall impairment matches that level. Document all of your symptoms, even those not specifically listed in the rating criteria.",
    commonRaterErrors: "Denying a higher rating because the veteran does not exhibit specific listed symptoms, without considering whether the veteran's actual symptoms produce equivalent occupational and social impairment.",
    legalBasis: "Mauerhan v. Principi, 16 Vet. App. 436 (2002)"
  },
  {
    id: "mh-003",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section H",
    category: "Mental Health Claims",
    title: "Vazquez-Claudio - Frequency, Severity, Duration",
    rule: "When evaluating mental health disability ratings, the rater must consider the frequency, severity, and duration of psychiatric symptoms, the length of remissions, and the veteran's capacity for adjustment during periods of remission. The level of occupational and social impairment is determined by looking at the totality of these factors, not a single point-in-time snapshot. A veteran who functions well on some days but has frequent severe episodes may warrant a higher rating.",
    practicalImplication: "If your symptoms fluctuate, document the worst episodes alongside the better periods. The rating should reflect the overall pattern, including how frequent and severe your worst episodes are.",
    commonRaterErrors: "Basing the rating on a single examination day where the veteran presented well, without considering the frequency and severity of symptoms over time.",
    legalBasis: "Vazquez-Claudio v. Shinseki, 713 F.3d 112 (Fed. Cir. 2013)"
  },
  {
    id: "mh-004",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section H",
    category: "Mental Health Claims",
    title: "Social vs Occupational Impairment",
    rule: "The General Rating Formula considers both social and occupational impairment. A veteran may have severe occupational impairment but moderate social impairment, or vice versa. The rater must assess both dimensions and assign a rating that reflects the overall disability picture. At the 100% level, total occupational and social impairment is required. At the 70% level, deficiencies in most areas (work, school, family, judgment, thinking, mood) are required.",
    practicalImplication: "Document both how your condition affects your ability to work and how it impacts your relationships, social activities, and daily functioning. Both dimensions matter for your rating.",
    commonRaterErrors: "Focusing exclusively on occupational impairment or exclusively on social impairment rather than assessing both dimensions to determine the overall level of disability.",
    legalBasis: "38 CFR 4.130"
  },
  {
    id: "mh-005",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section H",
    category: "Mental Health Claims",
    title: "GAF Scores - Historical Context",
    rule: "Global Assessment of Functioning (GAF) scores, while no longer required or part of the current DSM-5, may still appear in older medical records and were previously used to assess overall psychological functioning. GAF scores can still be considered as evidence of severity for historical periods. However, a GAF score alone is not determinative; it must be considered alongside the full clinical picture. The absence of a GAF score does not affect the validity of a mental health evaluation.",
    practicalImplication: "If older records contain GAF scores indicating severe impairment, those scores can support a higher rating for that period. However, your rating should not be limited by a GAF score if your actual symptoms and functional impairment are more severe.",
    commonRaterErrors: "Over-relying on a single GAF score to assign a rating rather than conducting a full analysis of the veteran's symptoms and functional impairment.",
    legalBasis: "38 CFR 4.130; Carpenter v. Brown, 8 Vet. App. 240 (1995)"
  },
  {
    id: "mh-006",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section H",
    category: "Mental Health Claims",
    title: "PTSD Stressor Verification - Combat Veterans",
    rule: "For PTSD claims from combat veterans, if the claimed stressor is consistent with the places, types, and circumstances of the veteran's service, the veteran's lay testimony alone is sufficient to establish the stressor, even without official documentation of the specific event. The stressor does not need to be verified through unit records or other official sources if it is related to combat.",
    practicalImplication: "If you served in combat and your PTSD stressor is related to your combat service, your own testimony is sufficient. You do not need to find official documentation of the specific event.",
    commonRaterErrors: "Requiring corroboration of combat-related PTSD stressors when the claimed stressor is consistent with the veteran's combat service.",
    legalBasis: "38 CFR 3.304(f)(2); 38 USC 1154(b)"
  },
  {
    id: "mh-007",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section H",
    category: "Mental Health Claims",
    title: "PTSD Stressor Verification - Fear of Hostile Military Activity",
    rule: "A PTSD stressor may be conceded without corroboration if it is related to the veteran's fear of hostile military or terrorist activity, and a VA or VA-contracted psychiatrist or psychologist confirms that the claimed stressor is adequate to support a PTSD diagnosis and the symptoms are related to the stressor. The stressor must be consistent with the places, types, and circumstances of the veteran's service.",
    practicalImplication: "Even if you did not engage in direct combat, if your PTSD is related to fear of hostile military activity during service (such as rocket attacks, IED threats, or hostile fire zones), your stressor can be conceded based on your testimony and a confirming mental health diagnosis.",
    commonRaterErrors: "Not applying the relaxed stressor verification standard for fear of hostile military activity, instead requiring specific stressor corroboration.",
    legalBasis: "38 CFR 3.304(f)(3)"
  },
  {
    id: "mh-008",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section H",
    category: "Mental Health Claims",
    title: "PTSD Stressor Verification - Military Sexual Trauma",
    rule: "For PTSD claims based on military sexual trauma (MST), VA recognizes that these events are often unreported and uses relaxed evidentiary standards. Evidence of behavior changes following the claimed assault may be considered as corroboration. This includes requests for transfer, deterioration in work performance, substance abuse, episodes of depression or anxiety, increased visits to medical clinics, and pregnancy tests or STD testing. Buddy statements and counseling records are also relevant.",
    practicalImplication: "If your PTSD is related to MST, VA must look for behavioral markers of the assault rather than requiring direct documentation of the event. Gather any evidence showing changes in your behavior, performance, or health around the time of the event.",
    commonRaterErrors: "Requiring direct documentation of the assault event, or failing to look for behavioral markers and alternative evidence sources as required for MST-related PTSD claims.",
    legalBasis: "38 CFR 3.304(f)(5); Menegassi v. Shinseki, 638 F.3d 1379 (Fed. Cir. 2011)"
  },
  {
    id: "mh-009",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section H",
    category: "Mental Health Claims",
    title: "Competency Determinations",
    rule: "A competency determination relates to whether the veteran is capable of managing their own financial affairs, not whether the disability exists or its severity. A finding of incompetency triggers the appointment of a fiduciary to manage VA benefits. The veteran must be notified of a proposed incompetency determination and given 60 days to submit evidence and request a hearing. A mental health diagnosis alone does not establish incompetency.",
    practicalImplication: "If VA proposes to find you incompetent to manage your finances, this is separate from your disability rating. You have 60 days to contest this determination and should submit evidence of your ability to handle financial matters.",
    commonRaterErrors: "Conflating a severe mental health rating with incompetency. A 100% mental health rating does not automatically mean the veteran is incompetent to manage financial affairs.",
    legalBasis: "38 CFR 3.353"
  },
  {
    id: "mh-010",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section H",
    category: "Mental Health Claims",
    title: "Separate Ratings for Co-Occurring Mental Health and Physical Symptoms",
    rule: "When a mental health condition produces physical symptoms (such as headaches, gastrointestinal distress, or chronic pain), those symptoms are generally considered part of the mental health rating and cannot be separately rated. However, if a veteran has a separately diagnosed physical condition that produces overlapping symptoms, careful analysis is required to avoid both pyramiding and undercompensation. Sleep impairment, for example, cannot be rated separately if it is already contemplated in the mental health rating criteria.",
    practicalImplication: "Be aware that some physical symptoms may already be captured in your mental health rating. However, if you have independently diagnosed physical conditions, they should be rated separately if the symptoms are distinct and do not overlap.",
    commonRaterErrors: "Either double-counting symptoms (pyramiding) or failing to separately rate genuinely distinct conditions because of superficial symptom overlap.",
    legalBasis: "38 CFR 4.14; Amberman v. Shinseki, 570 F.3d 1377 (Fed. Cir. 2009)"
  },

  // ============================================================
  // 9. EXAM PROCEDURES
  // ============================================================
  {
    id: "ep-001",
    section: "M21-1, Part III, Subpart iii, Chapter 1, Section D",
    category: "Exam Procedures",
    title: "When C&P Exam is Required",
    rule: "A compensation and pension examination must be scheduled when (1) there is competent evidence of a current disability or persistent symptoms, (2) evidence of an in-service event or injury, and (3) an indication that the disability may be associated with service, but (4) the existing evidence is insufficient to decide the claim. The threshold for ordering an exam is low and is met when the evidence 'indicates' a possible association with service.",
    practicalImplication: "If VA denies your claim without ordering a C&P exam, check whether all four elements were present. The 'indication' element has an intentionally low threshold, and failure to order an exam when these elements are met is a duty-to-assist error.",
    commonRaterErrors: "Requiring the veteran to essentially prove the claim before ordering the exam, rather than ordering the exam to help develop the necessary evidence.",
    legalBasis: "38 USC 5103A(d); McLendon v. Nicholson, 20 Vet. App. 79 (2006)"
  },
  {
    id: "ep-002",
    section: "M21-1, Part III, Subpart iii, Chapter 1, Section D",
    category: "Exam Procedures",
    title: "DBQ Completion Requirements",
    rule: "Disability Benefits Questionnaires (DBQs) must be fully completed with all relevant sections filled out. An incomplete DBQ that omits required findings (such as range of motion measurements, functional impact, or flare-up assessment) is an inadequate examination. The examiner must address all questions on the DBQ and provide explanations when findings are abnormal or when the veteran reports symptoms inconsistent with objective findings.",
    practicalImplication: "After your C&P exam, request a copy of the completed DBQ. Check that all sections are filled in, especially sections about functional impact, flare-ups, and occupational effects. Incomplete DBQs can be challenged.",
    commonRaterErrors: "Relying on incomplete DBQs where critical sections are left blank, particularly functional impact and flare-up assessments.",
    legalBasis: "38 CFR 4.2; Barr v. Nicholson, 21 Vet. App. 303 (2007)"
  },
  {
    id: "ep-003",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section E",
    category: "Exam Procedures",
    title: "Flare-Up Consideration - Sharp v. Shulkin",
    rule: "When a veteran reports flare-ups of a musculoskeletal condition, the C&P examiner must provide an opinion on the additional functional loss during flare-ups. If the examiner cannot provide the opinion without resorting to speculation, the examiner must explain why and what additional information would be needed. Simply stating that the opinion would be speculative without further explanation is inadequate. The examiner should attempt to elicit sufficient information about the flare-ups to form an opinion.",
    practicalImplication: "If you experience flare-ups, describe them in detail to the examiner: how often they occur, how long they last, what triggers them, and how much worse your function becomes. If the examiner says they cannot opine on flare-ups, they must explain why.",
    commonRaterErrors: "Accepting examiner statements that flare-up opinions would be speculative without requiring the examiner to explain why and what information would be needed.",
    legalBasis: "Sharp v. Shulkin, 29 Vet. App. 26 (2017)"
  },
  {
    id: "ep-004",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section E",
    category: "Exam Procedures",
    title: "DeLuca Factors - Functional Loss Assessment",
    rule: "For musculoskeletal disabilities, the C&P examination must assess functional loss due to pain, weakened movement, excess fatigability, incoordination, and flare-ups. The examiner must express any additional functional loss in terms of additional degrees of limitation of motion, if feasible. Pain alone, without functional loss, does not warrant a higher rating, but pain that results in additional limitation of motion must be accounted for.",
    practicalImplication: "Ensure the C&P examiner documents not just your range of motion but also the additional functional loss from pain, fatigue, and flare-ups expressed in additional degrees of lost motion. This can support a higher rating.",
    commonRaterErrors: "Ignoring the DeLuca factors and rating solely on range of motion measurements without considering additional functional loss from pain and other factors.",
    legalBasis: "DeLuca v. Brown, 8 Vet. App. 202 (1995); Mitchell v. Shinseki, 25 Vet. App. 32 (2011)"
  },
  {
    id: "ep-005",
    section: "M21-1, Part III, Subpart iv, Chapter 4, Section E",
    category: "Exam Procedures",
    title: "Adequate Range of Motion Testing",
    rule: "Range of motion testing for musculoskeletal conditions must include both active and passive range of motion, weight-bearing and non-weight-bearing testing where applicable, and testing of the opposite undamaged joint for comparison where applicable. If the examiner does not perform all required testing, they must explain why. Failure to perform all required testing renders the examination inadequate.",
    practicalImplication: "Check that your C&P exam included active and passive motion testing and, where applicable, weight-bearing testing and comparison with the opposite joint. If any of these were omitted without explanation, the exam is inadequate.",
    commonRaterErrors: "Relying on examinations that only tested active range of motion without passive testing, or that did not include weight-bearing testing when applicable.",
    legalBasis: "Correia v. McDonald, 28 Vet. App. 158 (2016); 38 CFR 4.59"
  },
  {
    id: "ep-006",
    section: "M21-1, Part III, Subpart iii, Chapter 1, Section D",
    category: "Exam Procedures",
    title: "Inadequate Exam Indicators",
    rule: "An examination is inadequate when the examiner: (1) does not review the claims file, (2) provides a conclusory opinion without rationale, (3) fails to address the veteran's lay statements, (4) does not consider all relevant theories of entitlement, (5) omits required testing, (6) dismisses flare-ups without adequate explanation, or (7) relies on the absence of treatment records as the sole basis for a negative opinion. An inadequate exam triggers VA's duty to obtain a new one.",
    practicalImplication: "Review your C&P exam results for these red flags. If any are present, file a request for a new examination or submit a private medical opinion addressing the deficiencies.",
    commonRaterErrors: "Relying on examinations that exhibit one or more indicators of inadequacy without returning the exam for correction or obtaining a new examination.",
    legalBasis: "Barr v. Nicholson, 21 Vet. App. 303 (2007); Stefl v. Nicholson, 21 Vet. App. 120 (2007)"
  },
  {
    id: "ep-007",
    section: "M21-1, Part III, Subpart iii, Chapter 1, Section D",
    category: "Exam Procedures",
    title: "Examination During Active Period of Disease",
    rule: "For conditions that are episodic or cyclical (such as skin conditions, migraines, or certain joint conditions), the examination should ideally be conducted during an active period of the disease to accurately assess the severity. If the examination is conducted during a quiescent period, the examiner must consider the veteran's description of the condition during active phases and the medical record evidence of active disease.",
    practicalImplication: "If your condition flares up periodically, try to schedule your C&P exam during an active period. If that is not possible, describe your active symptoms in detail and provide photos, treatment records, or buddy statements from active periods.",
    commonRaterErrors: "Rating a cyclical condition based solely on examination during a quiescent period without considering evidence of symptoms during active periods.",
    legalBasis: "Ardison v. Brown, 6 Vet. App. 405 (1994)"
  },
  {
    id: "ep-008",
    section: "M21-1, Part III, Subpart iii, Chapter 1, Section D",
    category: "Exam Procedures",
    title: "Examination Must Assess Functional Impact on Employment",
    rule: "Every C&P examination must include an assessment of the functional impact of the disability on the veteran's ability to work. The examiner should describe how the condition affects the veteran's ability to perform occupational tasks, including both physical and sedentary employment where relevant. A failure to address functional impact on employment is a deficiency that can render the examination inadequate for rating purposes.",
    practicalImplication: "Make sure the examiner records how your condition affects your ability to work. Describe specific work tasks you cannot perform, attendance problems, and any workplace accommodations needed. This information is critical for TDIU consideration.",
    commonRaterErrors: "Not addressing the functional impact on employment in the examination report, or providing only a generic statement without describing specific occupational limitations.",
    legalBasis: "38 CFR 4.10; Friscia v. Brown, 7 Vet. App. 294 (1994)"
  },

  // ============================================================
  // 10. APPEAL PROCEDURES
  // ============================================================
  {
    id: "ap-001",
    section: "M21-1, Part I, Chapter 5",
    category: "Appeal Procedures",
    title: "AMA Supplemental Claim Lane",
    rule: "Under the Appeals Modernization Act (AMA), a veteran may file a Supplemental Claim (VA Form 20-0995) to have the claim readjudicated with new and relevant evidence. New and relevant evidence is evidence not previously part of the record that tends to prove or disprove a matter at issue. If the Supplemental Claim is filed within one year of the original decision, the effective date may be preserved. The duty to assist applies in the Supplemental Claim lane.",
    practicalImplication: "If your claim was denied and you have new evidence to submit, the Supplemental Claim is the best option. File within one year to protect your effective date. VA has a duty to help you develop evidence in this lane.",
    commonRaterErrors: "Not properly applying the duty to assist in the Supplemental Claim lane, or setting the wrong effective date when a Supplemental Claim is filed within one year of the prior decision.",
    legalBasis: "38 CFR 3.2501; AMA (Public Law 115-55)"
  },
  {
    id: "ap-002",
    section: "M21-1, Part I, Chapter 5",
    category: "Appeal Procedures",
    title: "AMA Higher-Level Review Lane",
    rule: "A Higher-Level Review (HLR) (VA Form 20-0996) is a review by a more senior claims adjudicator of the same evidence that was before the original decision maker. No new evidence may be submitted in this lane. The HLR reviewer can identify errors of fact or law in the prior decision, including duty-to-assist errors. If a duty-to-assist error is identified, the claim is returned for correction. An informal conference with the reviewer may be requested.",
    practicalImplication: "If you believe VA made an error in evaluating the existing evidence (wrong rating criteria applied, evidence ignored, incorrect standard used), an HLR may be the fastest path. Request the informal conference to explain the error directly to the reviewer.",
    commonRaterErrors: "Not identifying clear errors in the prior decision during HLR, or not returning claims for duty-to-assist error correction when identified.",
    legalBasis: "38 CFR 3.2601; AMA (Public Law 115-55)"
  },
  {
    id: "ap-003",
    section: "M21-1, Part I, Chapter 5",
    category: "Appeal Procedures",
    title: "Board of Veterans' Appeals Review",
    rule: "A veteran may appeal to the Board of Veterans' Appeals (BVA) by filing VA Form 10182. Three dockets are available: (1) Direct Review (no new evidence, no hearing), (2) Evidence Submission (new evidence may be submitted within 90 days), and (3) Hearing (live hearing with a Veterans Law Judge, with additional evidence submission). The Board issues a decision that can be appealed to the Court of Appeals for Veterans Claims.",
    practicalImplication: "If you need to present testimony, submit new evidence, and have a judge review your case, the Board appeal with a hearing is the most thorough option. It takes longer but allows for the most complete presentation of your case.",
    commonRaterErrors: "N/A - Board decisions are made by Veterans Law Judges, not raters. However, raters must comply with Board remand instructions.",
    legalBasis: "38 USC 7104, 7105; 38 CFR 20.200"
  },
  {
    id: "ap-004",
    section: "M21-1, Part I, Chapter 5",
    category: "Appeal Procedures",
    title: "New and Material Evidence Standard",
    rule: "For Supplemental Claims, new and relevant evidence must be submitted. 'New' means evidence not previously part of the record. 'Relevant' means evidence that tends to prove or disprove a matter at issue. This is a lower standard than the former 'new and material' standard used in the Legacy system. Evidence is presumed credible for purposes of determining whether it is new and relevant.",
    practicalImplication: "Under the AMA system, the threshold for reopening a claim through a Supplemental Claim is lower than it was under the old system. Even a new medical opinion, updated treatment records, or a new buddy statement may qualify.",
    commonRaterErrors: "Applying the higher Legacy 'new and material' evidence standard rather than the AMA 'new and relevant' standard for Supplemental Claims.",
    legalBasis: "38 CFR 3.2501"
  },
  {
    id: "ap-005",
    section: "M21-1, Part I, Chapter 5",
    category: "Appeal Procedures",
    title: "Clear and Unmistakable Error (CUE) Claims",
    rule: "A CUE claim challenges a final VA decision based on an undebatable error of fact or law that, had it not been made, would have manifestly changed the outcome. CUE requires that the correct facts, as they were known at the time, were not before the adjudicator, or that the statutory or regulatory provisions in effect at the time were incorrectly applied. A change in interpretation of law or a disagreement with how evidence was weighed is not CUE.",
    practicalImplication: "CUE is a very high bar. It requires showing an obvious error in a past decision that clearly would have changed the result. It is not about new evidence or rearguing the case - it is about an undeniable mistake in the original decision.",
    commonRaterErrors: "Improperly denying CUE motions by characterizing clear errors as mere 'disagreements with how the evidence was weighed' when the error was actually an incorrect application of law or failure to consider evidence that was in the record.",
    legalBasis: "38 USC 5109A; 38 CFR 3.105(a); Russell v. Principi, 3 Vet. App. 310 (1992)"
  },
  {
    id: "ap-006",
    section: "M21-1, Part I, Chapter 5",
    category: "Appeal Procedures",
    title: "CAVC Appeal Timeline",
    rule: "A veteran has 120 days from the date the Board of Veterans' Appeals mails its decision to file a Notice of Appeal with the Court of Appeals for Veterans Claims (CAVC). This is a jurisdictional deadline that generally cannot be extended. The CAVC reviews Board decisions for legal error and can affirm, reverse, or remand. The CAVC cannot make factual findings but can determine whether the Board's factual findings are clearly erroneous.",
    practicalImplication: "The 120-day deadline to appeal a Board decision to the CAVC is absolute. Mark the date your Board decision was mailed and count 120 days. If you are considering a CAVC appeal, consult a veterans law attorney immediately.",
    commonRaterErrors: "N/A - This applies to veteran actions, not rater errors. However, veterans should be aware that missing this deadline forfeits CAVC review rights.",
    legalBasis: "38 USC 7266"
  },
  {
    id: "ap-007",
    section: "M21-1, Part I, Chapter 5",
    category: "Appeal Procedures",
    title: "Equitable Tolling of Appeal Deadlines",
    rule: "In extraordinary circumstances, the deadline for filing an appeal may be equitably tolled. Equitable tolling may apply when the veteran was prevented from filing due to circumstances beyond their control, such as serious illness, mental incapacity, or VA's own misleading actions. The veteran must demonstrate that they were diligent in pursuing their rights and that extraordinary circumstances prevented timely filing.",
    practicalImplication: "If you missed an appeal deadline due to serious illness, hospitalization, mental health crisis, or misleading information from VA, equitable tolling may save your appeal. Document the circumstances that prevented you from filing on time.",
    commonRaterErrors: "N/A - Equitable tolling is determined by courts, not raters. However, VA decisions should accurately state appeal deadlines and not provide misleading information.",
    legalBasis: "Henderson v. Shinseki, 562 U.S. 428 (2011); Hunt v. Nicholson, 20 Vet. App. 519 (2006)"
  },
  {
    id: "ap-008",
    section: "M21-1, Part I, Chapter 5",
    category: "Appeal Procedures",
    title: "Duty to Assist Errors in Appeals",
    rule: "Duty to assist errors identified during appeal may serve as a basis for remand. If VA failed to obtain relevant records, failed to provide an adequate examination, or failed to comply with notice requirements, the appeal can be remanded for correction. Under the AMA, duty-to-assist errors identified during Higher-Level Review result in the claim being returned to the regional office for correction.",
    practicalImplication: "If you identify a duty-to-assist error (missing records, no exam, inadequate exam), raise it specifically in your appeal. These errors often result in remands that give you another chance to develop your claim.",
    commonRaterErrors: "Not correcting duty-to-assist errors identified on remand, leading to further remands and delays.",
    legalBasis: "38 USC 5103A; Stegall v. West, 11 Vet. App. 268 (1998)"
  },
  {
    id: "ap-009",
    section: "M21-1, Part I, Chapter 5",
    category: "Appeal Procedures",
    title: "Lane Switching in AMA",
    rule: "Under the AMA, a veteran can switch between appeal lanes after receiving a decision in one lane. For example, after receiving an HLR decision, the veteran can file a Supplemental Claim with new evidence or appeal to the Board. After a Board decision, the veteran can file a Supplemental Claim, request an HLR of a new regional office decision, or appeal to the CAVC. Each lane switch preserves the effective date if filed within the applicable time period.",
    practicalImplication: "You are not locked into one appeal path. If an HLR is denied, you can file a Supplemental Claim with new evidence. Understanding lane switching gives you multiple opportunities to develop and present your case while protecting your effective date.",
    commonRaterErrors: "Not properly preserving the effective date when a veteran switches lanes within the applicable time period.",
    legalBasis: "38 CFR 3.2500; AMA (Public Law 115-55)"
  },
  {
    id: "ap-010",
    section: "M21-1, Part I, Chapter 5",
    category: "Appeal Procedures",
    title: "Legacy vs AMA System",
    rule: "Claims and appeals in the Legacy system (filed before February 19, 2019, and not opted into AMA) follow different procedural rules, including the Statement of the Case and Substantive Appeal process. Veterans in the Legacy system can opt into the AMA system. Claims filed on or after February 19, 2019, are processed under the AMA. Each system has different evidence submission rules, hearing procedures, and effective date protections.",
    practicalImplication: "If you have an appeal in the Legacy system, consider whether opting into the AMA might benefit you. The AMA generally offers faster processing and more flexible appeal paths, but consult with a representative before switching.",
    commonRaterErrors: "Applying AMA procedures to Legacy appeals or vice versa, which can result in procedural errors.",
    legalBasis: "AMA (Public Law 115-55); 38 CFR 19.5"
  },
  {
    id: "ap-011",
    section: "M21-1, Part I, Chapter 5",
    category: "Appeal Procedures",
    title: "Preserved Effective Date Through Continuous Pursuit",
    rule: "Under the AMA, a veteran preserves the effective date of the original claim by continuously pursuing the claim through timely filed appeals or Supplemental Claims. Each step must be filed within one year of the most recent decision (or within the applicable time period for Board appeals). Breaking the chain of continuous pursuit resets the effective date to the date of the new claim.",
    practicalImplication: "Never let a decision sit for more than one year without taking action if you disagree. Filing a timely appeal or Supplemental Claim within one year preserves your original effective date, which can mean significant retroactive benefits.",
    commonRaterErrors: "Not assigning the earliest possible effective date when the veteran has continuously pursued the claim through timely appeals.",
    legalBasis: "38 CFR 3.2500(c)"
  },

  // ============================================================
  // 11. DEFERRED RATINGS
  // ============================================================
  {
    id: "dr-001",
    section: "M21-1, Part III, Subpart iv, Chapter 6, Section B",
    category: "Deferred Ratings",
    title: "When Deferral is Required",
    rule: "A rating decision must be deferred when a decision on one claim would directly affect or is dependent on the outcome of another pending claim. Deferral is also required when additional development is needed that could affect the rating of the condition being evaluated, such as pending medical records, outstanding examinations, or unresolved jurisdictional issues. The rater must identify the reason for deferral and the development needed.",
    practicalImplication: "If VA decides some of your claims but defers others, review the deferral notice to understand what development is pending. Follow up on any outstanding examinations or records requests to prevent unnecessary delays.",
    commonRaterErrors: "Not deferring claims that are inextricably intertwined with pending claims, leading to decisions that may need to be revised when the related claim is decided.",
    legalBasis: "Harris v. Derwinski, 1 Vet. App. 180 (1991)"
  },
  {
    id: "dr-002",
    section: "M21-1, Part III, Subpart iv, Chapter 6, Section B",
    category: "Deferred Ratings",
    title: "Inextricably Intertwined Claims",
    rule: "Claims are inextricably intertwined when the outcome of one claim could have a significant impact on the outcome of another. For example, a claim for TDIU may be inextricably intertwined with a pending claim for increased rating of the underlying disability. Similarly, a claim for SMC may depend on the outcome of a pending service connection claim. Intertwined claims must be adjudicated together or the dependent claim must be deferred.",
    practicalImplication: "If VA decides your TDIU claim before resolving a pending increased rating claim that could affect TDIU eligibility, the premature decision may be in error. Ensure intertwined claims are resolved in the proper order.",
    commonRaterErrors: "Deciding one claim without recognizing that it is inextricably intertwined with another pending claim, leading to potential errors and inconsistencies.",
    legalBasis: "Harris v. Derwinski, 1 Vet. App. 180 (1991)"
  },
  {
    id: "dr-003",
    section: "M21-1, Part III, Subpart iv, Chapter 6, Section B",
    category: "Deferred Ratings",
    title: "Entitlement to Interim Benefits During Deferral",
    rule: "While a claim is deferred, the veteran continues to receive any benefits already in payment. If a partial decision has been made that increases the veteran's combined rating, those benefits should begin immediately even while other claims remain deferred. The veteran should not be penalized by the deferral of one claim when other claims have been decided favorably.",
    practicalImplication: "If some of your claims are decided favorably while others are deferred, you should begin receiving the increased benefits from the decided claims immediately. Do not wait for all deferred claims to be resolved.",
    commonRaterErrors: "Delaying implementation of decided claims while waiting for deferred claims to be resolved, causing the veteran to miss out on benefits they are already entitled to.",
    legalBasis: "38 CFR 3.105"
  },
  {
    id: "dr-004",
    section: "M21-1, Part III, Subpart iv, Chapter 6",
    category: "Deferred Ratings",
    title: "Timeframe for Resolving Deferred Claims",
    rule: "VA has an obligation to resolve deferred claims with reasonable promptness. While there is no specific regulatory timeframe for resolving deferred claims, unreasonable delay violates the veteran's right to timely adjudication. If a deferred claim has been pending for an unreasonable period, the veteran can contact VA, file a complaint with the VA Inspector General, or seek congressional intervention.",
    practicalImplication: "Track your deferred claims. If months pass without resolution, contact VA for a status update. You have multiple avenues to escalate unreasonable delays, including your congressional representative and the VA Inspector General.",
    commonRaterErrors: "Allowing deferred claims to languish without active development, resulting in unreasonable delays that prejudice veterans.",
    legalBasis: "38 USC 5101(a)"
  },
  {
    id: "dr-005",
    section: "M21-1, Part III, Subpart iv, Chapter 6",
    category: "Deferred Ratings",
    title: "Communication Requirements for Deferred Claims",
    rule: "When a claim is deferred, VA must notify the veteran of the deferral, the reason for the deferral, and what additional development is needed. The notification should include what evidence or action is outstanding and, if applicable, what the veteran can do to help resolve the deferral. The veteran should not be left in the dark about the status of deferred claims.",
    practicalImplication: "If VA deferred one of your claims, you should have received a notice explaining why and what is needed. If you did not receive clear communication, contact VA to determine the status and what actions you can take to move the claim forward.",
    commonRaterErrors: "Not providing adequate notification to the veteran about the reason for deferral and the development needed to resolve the deferred claim.",
    legalBasis: "38 USC 5103"
  }
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getM21RulesByCategory(category: string): M21Rule[] {
  return m21Rules.filter(
    (rule) => rule.category.toLowerCase() === category.toLowerCase()
  );
}

export function searchM21Rules(query: string): M21Rule[] {
  const lowerQuery = query.toLowerCase();
  const queryTerms = lowerQuery.split(/\s+/).filter((term) => term.length > 2);

  return m21Rules
    .map((rule) => {
      const searchableText = [
        rule.title,
        rule.rule,
        rule.practicalImplication,
        rule.commonRaterErrors || "",
        rule.legalBasis || "",
        rule.section,
        rule.category,
      ]
        .join(" ")
        .toLowerCase();

      const matchCount = queryTerms.reduce(
        (count, term) => count + (searchableText.includes(term) ? 1 : 0),
        0
      );

      return { rule, matchCount };
    })
    .filter((item) => item.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .map((item) => item.rule);
}
