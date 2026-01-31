// Comprehensive list of 500+ secondary condition relationships based on VA claims patterns

export interface SecondaryConnection {
  primaryCondition: string;
  secondaryCondition: string;
  medicalConnection: string;
  category: string;
}

export const secondaryConditions: SecondaryConnection[] = [
  // ========================================
  // PTSD SECONDARIES (Comprehensive)
  // ========================================
  { primaryCondition: 'PTSD', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'PTSD causes persistent depressive symptoms through emotional dysregulation, trauma processing difficulties, and neurochemical changes', category: 'Mental Health' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Generalized Anxiety Disorder', medicalConnection: 'Hypervigilance, trauma response, and constant threat perception lead to chronic anxiety', category: 'Mental Health' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Panic Disorder', medicalConnection: 'Trauma triggers and hyperarousal cause recurrent panic attacks', category: 'Mental Health' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Social Anxiety Disorder', medicalConnection: 'Avoidance behaviors and fear of triggering situations lead to social phobia', category: 'Mental Health' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Agoraphobia', medicalConnection: 'Avoidance of places/situations associated with trauma or perceived danger', category: 'Mental Health' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Obsessive-Compulsive Disorder', medicalConnection: 'Anxiety from PTSD can manifest as obsessive thoughts and compulsive behaviors', category: 'Mental Health' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Substance Use Disorder', medicalConnection: 'Self-medication to cope with intrusive thoughts, nightmares, and hyperarousal', category: 'Mental Health' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Alcohol Use Disorder', medicalConnection: 'Alcohol used to numb symptoms, aid sleep, and reduce hypervigilance', category: 'Mental Health' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Insomnia', medicalConnection: 'Hyperarousal, nightmares, and fear of sleep disrupt normal sleep patterns', category: 'Mental Health' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Nightmare Disorder', medicalConnection: 'Trauma-related nightmares are a core PTSD symptom', category: 'Mental Health' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Sleep Apnea', medicalConnection: 'Weight gain from medications/inactivity, stress hormones affect breathing patterns', category: 'Respiratory' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Chronic Fatigue Syndrome', medicalConnection: 'Persistent hyperarousal depletes energy; poor sleep compounds fatigue', category: 'Systemic' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Migraines', medicalConnection: 'Chronic stress, muscle tension, and sleep disruption trigger migraines', category: 'Neurological' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Tension Headaches', medicalConnection: 'Chronic muscle tension from hypervigilance causes headaches', category: 'Neurological' },
  { primaryCondition: 'PTSD', secondaryCondition: 'GERD', medicalConnection: 'Chronic stress increases stomach acid; many PTSD medications contribute', category: 'Digestive' },
  { primaryCondition: 'PTSD', secondaryCondition: 'IBS', medicalConnection: 'Gut-brain axis dysfunction from chronic stress and anxiety', category: 'Digestive' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Peptic Ulcer Disease', medicalConnection: 'Stress and NSAID use for associated pain conditions', category: 'Digestive' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Functional Dyspepsia', medicalConnection: 'Stress affects stomach motility and acid production', category: 'Digestive' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Hypertension', medicalConnection: 'Chronic stress elevates cortisol and adrenaline, raising blood pressure long-term', category: 'Cardiovascular' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Coronary Artery Disease', medicalConnection: 'Chronic stress hormones accelerate atherosclerosis', category: 'Cardiovascular' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Cardiac Arrhythmias', medicalConnection: 'Stress hormones and hyperarousal affect heart rhythm', category: 'Cardiovascular' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Psychological impact, SSRIs/medications, reduced blood flow from chronic stress', category: 'Genitourinary' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Female Sexual Dysfunction', medicalConnection: 'Trauma, medications, and psychological factors affect sexual function', category: 'Gynecological' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Bruxism', medicalConnection: 'Stress and anxiety cause jaw clenching and teeth grinding', category: 'Dental' },
  { primaryCondition: 'PTSD', secondaryCondition: 'TMJ Disorder', medicalConnection: 'Chronic jaw clenching from stress damages temporomandibular joint', category: 'Dental' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Fibromyalgia', medicalConnection: 'Central sensitization and chronic stress cause widespread pain', category: 'Musculoskeletal' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Chronic Pain Syndrome', medicalConnection: 'Stress amplifies pain perception; tension causes musculoskeletal pain', category: 'Musculoskeletal' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Obesity', medicalConnection: 'Emotional eating, medication side effects, reduced physical activity', category: 'Endocrine' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Diabetes Type II', medicalConnection: 'Stress hormones affect insulin sensitivity; weight gain from medications', category: 'Endocrine' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Thyroid Disorder', medicalConnection: 'Chronic stress affects hypothalamic-pituitary-thyroid axis', category: 'Endocrine' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Psoriasis', medicalConnection: 'Stress triggers and exacerbates autoimmune skin conditions', category: 'Skin' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Eczema', medicalConnection: 'Stress worsens inflammatory skin conditions', category: 'Skin' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Alopecia', medicalConnection: 'Stress-induced hair loss', category: 'Skin' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Immune Dysfunction', medicalConnection: 'Chronic stress suppresses immune function', category: 'Immune' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Chronic Sinusitis', medicalConnection: 'Immune dysfunction and inflammation from chronic stress', category: 'Respiratory' },

  // ========================================
  // TBI SECONDARIES (Comprehensive)
  // ========================================
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'PTSD', medicalConnection: 'Trauma from injury event and coping with cognitive/physical changes', category: 'Mental Health' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Brain chemistry changes and adjustment to disability', category: 'Mental Health' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Generalized Anxiety Disorder', medicalConnection: 'Neurological changes and uncertainty about recovery cause anxiety', category: 'Mental Health' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Personality Changes', medicalConnection: 'Frontal lobe damage affects personality and impulse control', category: 'Mental Health' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Cognitive Disorder', medicalConnection: 'Direct brain damage affects memory, attention, and processing', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Memory Impairment', medicalConnection: 'Hippocampal and temporal lobe damage affects memory formation', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Post-Traumatic Headaches', medicalConnection: 'Brain injury commonly causes chronic headache disorders', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Migraines', medicalConnection: 'TBI triggers chronic migraine development in many patients', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Seizure Disorder/Epilepsy', medicalConnection: 'Brain injury increases seizure threshold and epilepsy risk', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Tinnitus', medicalConnection: 'Auditory pathway damage or inner ear injury from head trauma', category: 'Ears' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Hearing Loss', medicalConnection: 'Temporal bone fracture or auditory cortex damage', category: 'Ears' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Vertigo/Vestibular Disorder', medicalConnection: 'Vestibular system damage from head trauma', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Balance Disorder', medicalConnection: 'Cerebellar or vestibular damage affects balance', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Visual Impairment', medicalConnection: 'Optic nerve or visual cortex damage', category: 'Eyes' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Diplopia (Double Vision)', medicalConnection: 'Cranial nerve damage affects eye muscle coordination', category: 'Eyes' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Light Sensitivity', medicalConnection: 'Brain processing changes cause photophobia', category: 'Eyes' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Sleep Apnea', medicalConnection: 'Brainstem damage affects respiratory control during sleep', category: 'Respiratory' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Insomnia', medicalConnection: 'Brain injury disrupts sleep-wake cycle regulation', category: 'Mental Health' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Hypersomnia', medicalConnection: 'Brain injury can cause excessive daytime sleepiness', category: 'Mental Health' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Pituitary Dysfunction', medicalConnection: 'TBI frequently damages pituitary gland affecting multiple hormones', category: 'Endocrine' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Growth Hormone Deficiency', medicalConnection: 'Pituitary damage affects growth hormone production', category: 'Endocrine' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Hypothyroidism', medicalConnection: 'Hypothalamic-pituitary axis dysfunction', category: 'Endocrine' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Adrenal Insufficiency', medicalConnection: 'Pituitary damage affects ACTH and cortisol regulation', category: 'Endocrine' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Hypogonadism', medicalConnection: 'Pituitary dysfunction affects sex hormone production', category: 'Endocrine' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Diabetes Insipidus', medicalConnection: 'Hypothalamic damage affects ADH production', category: 'Endocrine' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Hormonal changes and neurological damage', category: 'Genitourinary' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Anosmia (Loss of Smell)', medicalConnection: 'Olfactory nerve damage from head trauma', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Ageusia (Loss of Taste)', medicalConnection: 'Cranial nerve or brain region damage', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Speech/Language Disorder', medicalConnection: 'Damage to language centers (Broca/Wernicke areas)', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Parkinsonism', medicalConnection: 'Basal ganglia damage can cause movement disorders', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Chronic Traumatic Encephalopathy', medicalConnection: 'Repeated TBIs cause progressive neurodegeneration', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Hydrocephalus', medicalConnection: 'TBI can obstruct CSF flow causing fluid buildup', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Cervical Spine Injury', medicalConnection: 'Trauma causing TBI often injures neck simultaneously', category: 'Musculoskeletal' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Facial Nerve Palsy', medicalConnection: 'Cranial nerve VII damage from skull/temporal bone injury', category: 'Neurological' },

  // ========================================
  // DIABETES SECONDARIES (Comprehensive)
  // ========================================
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Peripheral Neuropathy - Lower Extremities', medicalConnection: 'High blood sugar damages peripheral nerves in feet and legs', category: 'Neurological' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Peripheral Neuropathy - Upper Extremities', medicalConnection: 'Nerve damage extends to hands and arms as disease progresses', category: 'Neurological' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Diabetic Retinopathy', medicalConnection: 'Microvascular damage to retinal blood vessels causes vision loss', category: 'Eyes' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Diabetic Macular Edema', medicalConnection: 'Fluid leakage in macula from damaged blood vessels', category: 'Eyes' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Cataracts', medicalConnection: 'High glucose levels accelerate cataract formation', category: 'Eyes' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Glaucoma', medicalConnection: 'Diabetes increases risk of open-angle glaucoma', category: 'Eyes' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Diabetic Nephropathy', medicalConnection: 'High blood sugar damages kidney filtration units (nephrons)', category: 'Genitourinary' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Chronic Kidney Disease', medicalConnection: 'Progressive kidney damage from sustained hyperglycemia', category: 'Genitourinary' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'End-Stage Renal Disease', medicalConnection: 'Advanced diabetic nephropathy requiring dialysis', category: 'Genitourinary' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Hypertension', medicalConnection: 'Insulin resistance and kidney dysfunction affect blood pressure', category: 'Cardiovascular' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Coronary Artery Disease', medicalConnection: 'Accelerated atherosclerosis from metabolic dysfunction and inflammation', category: 'Cardiovascular' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Heart Failure', medicalConnection: 'Diabetic cardiomyopathy and coronary disease weaken heart', category: 'Cardiovascular' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Peripheral Artery Disease', medicalConnection: 'Blood vessel damage reduces circulation to extremities', category: 'Cardiovascular' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Stroke', medicalConnection: 'Accelerated atherosclerosis increases stroke risk', category: 'Cardiovascular' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Nerve damage and blood vessel damage affect sexual function', category: 'Genitourinary' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Neurogenic Bladder', medicalConnection: 'Autonomic neuropathy affects bladder control', category: 'Genitourinary' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Urinary Incontinence', medicalConnection: 'Nerve damage impairs bladder sensation and control', category: 'Genitourinary' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Gastroparesis', medicalConnection: 'Vagus nerve damage slows stomach emptying', category: 'Digestive' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Diabetic Diarrhea', medicalConnection: 'Autonomic neuropathy affects bowel motility', category: 'Digestive' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Constipation', medicalConnection: 'Autonomic dysfunction slows intestinal transit', category: 'Digestive' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Diabetic Foot Ulcers', medicalConnection: 'Neuropathy and poor circulation prevent wound healing', category: 'Skin' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Skin Infections', medicalConnection: 'High glucose impairs immune function and wound healing', category: 'Skin' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Necrobiosis Lipoidica', medicalConnection: 'Diabetic skin condition causing waxy patches', category: 'Skin' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Amputation', medicalConnection: 'Severe neuropathy and PAD can require limb amputation', category: 'Musculoskeletal' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Charcot Foot', medicalConnection: 'Neuropathy causes progressive bone/joint destruction', category: 'Musculoskeletal' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Frozen Shoulder', medicalConnection: 'Adhesive capsulitis more common in diabetics', category: 'Musculoskeletal' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Carpal Tunnel Syndrome', medicalConnection: 'Diabetic neuropathy and tissue changes compress median nerve', category: 'Neurological' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Chronic disease burden and glucose effects on brain', category: 'Mental Health' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Anxiety Disorder', medicalConnection: 'Disease management stress and fear of complications', category: 'Mental Health' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Cognitive Impairment', medicalConnection: 'Vascular damage and glucose effects on brain function', category: 'Neurological' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Hearing Loss', medicalConnection: 'Microvascular damage to inner ear blood supply', category: 'Ears' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Periodontitis', medicalConnection: 'Impaired immunity increases gum disease severity', category: 'Dental' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Non-Alcoholic Fatty Liver Disease', medicalConnection: 'Insulin resistance causes fat accumulation in liver', category: 'Digestive' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Sleep Apnea', medicalConnection: 'Obesity and metabolic factors worsen sleep apnea', category: 'Respiratory' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Hypoglycemia Unawareness', medicalConnection: 'Autonomic neuropathy reduces warning symptoms', category: 'Endocrine' },

  // ========================================
  // BACK CONDITIONS SECONDARIES (Comprehensive)
  // ========================================
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Lumbar Radiculopathy', medicalConnection: 'Disc degeneration compresses lumbar nerve roots causing radiating pain', category: 'Neurological' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Sciatica', medicalConnection: 'Disc herniation or stenosis impinges sciatic nerve', category: 'Neurological' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Lumbar Spinal Stenosis', medicalConnection: 'Degeneration causes narrowing of spinal canal', category: 'Musculoskeletal' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Neurogenic Claudication', medicalConnection: 'Spinal stenosis causes leg pain with walking', category: 'Neurological' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Hip Condition', medicalConnection: 'Altered gait and compensatory mechanics stress hip joints', category: 'Musculoskeletal' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Bilateral Hip Arthritis', medicalConnection: 'Years of abnormal gait damages both hip joints', category: 'Musculoskeletal' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Knee Condition', medicalConnection: 'Compensatory movement patterns stress knee joints', category: 'Musculoskeletal' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Bilateral Knee Condition', medicalConnection: 'Altered gait affects both knees', category: 'Musculoskeletal' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Ankle/Foot Condition', medicalConnection: 'Gait changes stress ankle and foot joints', category: 'Musculoskeletal' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Sacroiliac Joint Dysfunction', medicalConnection: 'Lumbar dysfunction transfers stress to SI joints', category: 'Musculoskeletal' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Thoracic Spine Condition', medicalConnection: 'Compensatory changes in adjacent spine segments', category: 'Musculoskeletal' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Chronic pain frequently causes clinical depression', category: 'Mental Health' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Anxiety Disorder', medicalConnection: 'Fear of pain, movement anxiety, and disability concerns', category: 'Mental Health' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Sleep Disorder', medicalConnection: 'Pain interferes with sleep quality and positioning', category: 'Mental Health' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Nerve damage and medications affect sexual function', category: 'Genitourinary' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Neurogenic Bladder', medicalConnection: 'Cauda equina compression affects bladder control', category: 'Genitourinary' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Bowel Dysfunction', medicalConnection: 'Nerve compression can affect bowel control', category: 'Digestive' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Obesity', medicalConnection: 'Reduced mobility leads to weight gain, worsening back condition', category: 'Endocrine' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Opioid Dependence', medicalConnection: 'Long-term pain management can lead to medication dependency', category: 'Mental Health' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Peripheral Neuropathy', medicalConnection: 'Chronic nerve root compression causes permanent nerve damage', category: 'Neurological' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Foot Drop', medicalConnection: 'L4-L5 nerve root compression causes dorsiflexion weakness', category: 'Neurological' },
  { primaryCondition: 'Lumbar Spine DDD', secondaryCondition: 'Muscle Atrophy', medicalConnection: 'Nerve damage and disuse cause leg muscle wasting', category: 'Musculoskeletal' },

  // Cervical Spine Secondaries
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Cervical Radiculopathy', medicalConnection: 'Disc degeneration compresses cervical nerve roots', category: 'Neurological' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Cervical Myelopathy', medicalConnection: 'Spinal cord compression from severe stenosis', category: 'Neurological' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Migraines', medicalConnection: 'Cervical dysfunction triggers cervicogenic headaches and migraines', category: 'Neurological' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Tension Headaches', medicalConnection: 'Chronic neck muscle tension causes headaches', category: 'Neurological' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Thoracic Outlet Syndrome', medicalConnection: 'Postural changes and muscle tension compress neurovascular bundle', category: 'Neurological' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Shoulder Condition', medicalConnection: 'Referred pain and compensatory movement affect shoulders', category: 'Musculoskeletal' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Bilateral Shoulder Condition', medicalConnection: 'Cervical dysfunction affects both shoulders', category: 'Musculoskeletal' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Carpal Tunnel Syndrome', medicalConnection: 'Cervical radiculopathy contributes to upper extremity nerve symptoms', category: 'Neurological' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Cubital Tunnel Syndrome', medicalConnection: 'Compensatory arm positioning compresses ulnar nerve', category: 'Neurological' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Upper Extremity Weakness', medicalConnection: 'Nerve root compression causes arm and hand weakness', category: 'Neurological' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Hand Numbness/Paresthesias', medicalConnection: 'Cervical nerve root compression affects hand sensation', category: 'Neurological' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Vertigo', medicalConnection: 'Cervical proprioceptive dysfunction causes dizziness', category: 'Neurological' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'TMJ Disorder', medicalConnection: 'Cervical dysfunction affects jaw alignment and function', category: 'Dental' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Lumbar Spine Condition', medicalConnection: 'Compensatory changes develop in lumbar spine', category: 'Musculoskeletal' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Depression', medicalConnection: 'Chronic neck pain causes depressive symptoms', category: 'Mental Health' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Sleep Apnea', medicalConnection: 'Neck positioning issues worsen airway obstruction', category: 'Respiratory' },

  // Thoracic Spine Secondaries
  { primaryCondition: 'Thoracic Spine DDD', secondaryCondition: 'Intercostal Neuralgia', medicalConnection: 'Thoracic nerve root irritation causes rib pain', category: 'Neurological' },
  { primaryCondition: 'Thoracic Spine DDD', secondaryCondition: 'Costochondritis', medicalConnection: 'Thoracic dysfunction affects rib-sternum joints', category: 'Musculoskeletal' },
  { primaryCondition: 'Thoracic Spine DDD', secondaryCondition: 'Postural Kyphosis', medicalConnection: 'Progressive degeneration increases thoracic curve', category: 'Musculoskeletal' },
  { primaryCondition: 'Thoracic Spine DDD', secondaryCondition: 'Cervical Spine Condition', medicalConnection: 'Compensatory changes in adjacent spine segments', category: 'Musculoskeletal' },
  { primaryCondition: 'Thoracic Spine DDD', secondaryCondition: 'Lumbar Spine Condition', medicalConnection: 'Thoracic dysfunction increases lumbar stress', category: 'Musculoskeletal' },

  // ========================================
  // SLEEP APNEA SECONDARIES
  // ========================================
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Hypertension', medicalConnection: 'Intermittent hypoxia activates sympathetic nervous system', category: 'Cardiovascular' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Coronary Artery Disease', medicalConnection: 'Chronic hypoxia and hypertension accelerate atherosclerosis', category: 'Cardiovascular' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Heart Failure', medicalConnection: 'Chronic hypoxia and pressure changes strain heart', category: 'Cardiovascular' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Atrial Fibrillation', medicalConnection: 'Hypoxia and intrathoracic pressure changes affect heart rhythm', category: 'Cardiovascular' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Stroke', medicalConnection: 'Increased risk from blood pressure spikes and hypoxia', category: 'Cardiovascular' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Pulmonary Hypertension', medicalConnection: 'Chronic hypoxia causes pulmonary vasoconstriction', category: 'Cardiovascular' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Poor sleep quality and oxygen deprivation affect mood regulation', category: 'Mental Health' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Anxiety Disorder', medicalConnection: 'Sleep disruption and oxygen changes cause anxiety', category: 'Mental Health' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Cognitive Impairment', medicalConnection: 'Chronic oxygen deprivation affects brain function', category: 'Neurological' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Memory Problems', medicalConnection: 'Sleep fragmentation impairs memory consolidation', category: 'Neurological' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'GERD', medicalConnection: 'Negative intrathoracic pressure during apneas pulls stomach acid up', category: 'Digestive' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Diabetes Type II', medicalConnection: 'Sleep disruption affects insulin sensitivity and glucose regulation', category: 'Endocrine' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Obesity', medicalConnection: 'Poor sleep affects metabolism and hunger hormones; bidirectional', category: 'Endocrine' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Reduced oxygen, hormonal changes, and fatigue', category: 'Genitourinary' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Nocturia', medicalConnection: 'Pressure changes increase urine production at night', category: 'Genitourinary' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Chronic Fatigue', medicalConnection: 'Non-restorative sleep causes persistent fatigue', category: 'Systemic' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Morning Headaches', medicalConnection: 'Hypoxia and carbon dioxide retention cause headaches', category: 'Neurological' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Dry Mouth/Throat', medicalConnection: 'Mouth breathing during episodes', category: 'Dental' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'TMJ Disorder', medicalConnection: 'Oral appliance use and jaw positioning issues', category: 'Dental' },

  // ========================================
  // TINNITUS SECONDARIES
  // ========================================
  { primaryCondition: 'Tinnitus', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Chronic tinnitus significantly impacts quality of life and causes depression', category: 'Mental Health' },
  { primaryCondition: 'Tinnitus', secondaryCondition: 'Generalized Anxiety Disorder', medicalConnection: 'Constant ringing causes psychological distress and anxiety', category: 'Mental Health' },
  { primaryCondition: 'Tinnitus', secondaryCondition: 'Panic Disorder', medicalConnection: 'Severe tinnitus can trigger panic attacks', category: 'Mental Health' },
  { primaryCondition: 'Tinnitus', secondaryCondition: 'Insomnia', medicalConnection: 'Ringing interferes with ability to fall and stay asleep', category: 'Mental Health' },
  { primaryCondition: 'Tinnitus', secondaryCondition: 'Migraines', medicalConnection: 'Shared auditory and neurological pathways', category: 'Neurological' },
  { primaryCondition: 'Tinnitus', secondaryCondition: 'Vertigo', medicalConnection: 'Often co-occur due to inner ear damage', category: 'Neurological' },
  { primaryCondition: 'Tinnitus', secondaryCondition: 'Menieres Disease', medicalConnection: 'Inner ear dysfunction commonly causes both conditions', category: 'Ears' },
  { primaryCondition: 'Tinnitus', secondaryCondition: 'Hearing Loss', medicalConnection: 'Same noise exposure or inner ear damage causes both', category: 'Ears' },
  { primaryCondition: 'Tinnitus', secondaryCondition: 'Hyperacusis', medicalConnection: 'Sound sensitivity often accompanies tinnitus', category: 'Ears' },
  { primaryCondition: 'Tinnitus', secondaryCondition: 'TMJ Disorder', medicalConnection: 'Jaw dysfunction can cause or worsen tinnitus', category: 'Dental' },
  { primaryCondition: 'Tinnitus', secondaryCondition: 'Cognitive Difficulties', medicalConnection: 'Constant distraction affects concentration and focus', category: 'Neurological' },

  // ========================================
  // HEARING LOSS SECONDARIES
  // ========================================
  { primaryCondition: 'Hearing Loss', secondaryCondition: 'Tinnitus', medicalConnection: 'Cochlear damage commonly causes both conditions', category: 'Ears' },
  { primaryCondition: 'Hearing Loss', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Social isolation and communication difficulties cause depression', category: 'Mental Health' },
  { primaryCondition: 'Hearing Loss', secondaryCondition: 'Anxiety Disorder', medicalConnection: 'Difficulty communicating causes social anxiety', category: 'Mental Health' },
  { primaryCondition: 'Hearing Loss', secondaryCondition: 'Social Isolation', medicalConnection: 'Communication difficulties lead to withdrawal', category: 'Mental Health' },
  { primaryCondition: 'Hearing Loss', secondaryCondition: 'Cognitive Decline', medicalConnection: 'Reduced auditory input accelerates cognitive decline', category: 'Neurological' },
  { primaryCondition: 'Hearing Loss', secondaryCondition: 'Balance Disorder', medicalConnection: 'Inner ear damage affects vestibular function', category: 'Neurological' },
  { primaryCondition: 'Hearing Loss', secondaryCondition: 'Vertigo', medicalConnection: 'Cochlear and vestibular systems often damaged together', category: 'Neurological' },

  // ========================================
  // KNEE CONDITIONS SECONDARIES
  // ========================================
  { primaryCondition: 'Knee Condition (Bilateral)', secondaryCondition: 'Hip Condition - Right', medicalConnection: 'Altered gait stresses hip joints', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition (Bilateral)', secondaryCondition: 'Hip Condition - Left', medicalConnection: 'Abnormal mechanics damage hip joints', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition (Bilateral)', secondaryCondition: 'Lumbar Spine Condition', medicalConnection: 'Compensatory gait patterns stress lower back', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition (Bilateral)', secondaryCondition: 'Ankle Condition - Right', medicalConnection: 'Altered gait affects ankle mechanics', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition (Bilateral)', secondaryCondition: 'Ankle Condition - Left', medicalConnection: 'Gait changes stress ankle joints', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition (Bilateral)', secondaryCondition: 'Plantar Fasciitis', medicalConnection: 'Altered weight distribution stresses feet', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition (Bilateral)', secondaryCondition: 'Obesity', medicalConnection: 'Reduced mobility leads to weight gain', category: 'Endocrine' },
  { primaryCondition: 'Knee Condition (Bilateral)', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Chronic pain and mobility limitations', category: 'Mental Health' },
  { primaryCondition: 'Knee Condition (Right)', secondaryCondition: 'Knee Condition - Left', medicalConnection: 'Favoring one knee overloads the other', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition (Right)', secondaryCondition: 'Hip Condition - Right', medicalConnection: 'Ipsilateral kinetic chain stress', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition (Right)', secondaryCondition: 'Hip Condition - Left', medicalConnection: 'Contralateral compensation stress', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition (Right)', secondaryCondition: 'Lumbar Spine Condition', medicalConnection: 'Antalgic gait stresses spine', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition (Left)', secondaryCondition: 'Knee Condition - Right', medicalConnection: 'Overcompensation damages other knee', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition (Left)', secondaryCondition: 'Hip Condition - Left', medicalConnection: 'Same-side kinetic chain dysfunction', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition (Left)', secondaryCondition: 'Hip Condition - Right', medicalConnection: 'Contralateral compensation', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition (Left)', secondaryCondition: 'Lumbar Spine Condition', medicalConnection: 'Gait deviation stresses spine', category: 'Musculoskeletal' },

  // ========================================
  // HIP CONDITIONS SECONDARIES
  // ========================================
  { primaryCondition: 'Hip Condition', secondaryCondition: 'Lumbar Spine Condition', medicalConnection: 'Hip dysfunction alters spinal mechanics', category: 'Musculoskeletal' },
  { primaryCondition: 'Hip Condition', secondaryCondition: 'Opposite Hip Condition', medicalConnection: 'Compensation damages contralateral hip', category: 'Musculoskeletal' },
  { primaryCondition: 'Hip Condition', secondaryCondition: 'Knee Condition - Ipsilateral', medicalConnection: 'Same-side kinetic chain affected', category: 'Musculoskeletal' },
  { primaryCondition: 'Hip Condition', secondaryCondition: 'Knee Condition - Contralateral', medicalConnection: 'Weight-shifting stresses opposite knee', category: 'Musculoskeletal' },
  { primaryCondition: 'Hip Condition', secondaryCondition: 'Sacroiliac Joint Dysfunction', medicalConnection: 'Hip mechanics affect SI joint loading', category: 'Musculoskeletal' },
  { primaryCondition: 'Hip Condition', secondaryCondition: 'Piriformis Syndrome', medicalConnection: 'Hip dysfunction causes muscle compensation', category: 'Musculoskeletal' },
  { primaryCondition: 'Hip Condition', secondaryCondition: 'Trochanteric Bursitis', medicalConnection: 'Abnormal mechanics irritate bursa', category: 'Musculoskeletal' },
  { primaryCondition: 'Hip Condition', secondaryCondition: 'Sciatica', medicalConnection: 'Hip dysfunction can irritate sciatic nerve', category: 'Neurological' },
  { primaryCondition: 'Hip Condition', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Chronic hip pain causes depression', category: 'Mental Health' },

  // ========================================
  // SHOULDER CONDITIONS SECONDARIES
  // ========================================
  { primaryCondition: 'Shoulder Condition', secondaryCondition: 'Cervical Spine Condition', medicalConnection: 'Shoulder dysfunction affects neck mechanics', category: 'Musculoskeletal' },
  { primaryCondition: 'Shoulder Condition', secondaryCondition: 'Opposite Shoulder Condition', medicalConnection: 'Overcompensation with other arm damages it', category: 'Musculoskeletal' },
  { primaryCondition: 'Shoulder Condition', secondaryCondition: 'Thoracic Outlet Syndrome', medicalConnection: 'Altered shoulder mechanics compress neurovascular bundle', category: 'Neurological' },
  { primaryCondition: 'Shoulder Condition', secondaryCondition: 'Rotator Cuff Tendinopathy', medicalConnection: 'Shoulder instability leads to tendon damage', category: 'Musculoskeletal' },
  { primaryCondition: 'Shoulder Condition', secondaryCondition: 'Biceps Tendinopathy', medicalConnection: 'Shoulder dysfunction stresses biceps tendon', category: 'Musculoskeletal' },
  { primaryCondition: 'Shoulder Condition', secondaryCondition: 'Elbow Condition', medicalConnection: 'Compensatory arm use affects elbow', category: 'Musculoskeletal' },
  { primaryCondition: 'Shoulder Condition', secondaryCondition: 'Wrist/Hand Condition', medicalConnection: 'Altered use patterns affect distal joints', category: 'Musculoskeletal' },
  { primaryCondition: 'Shoulder Condition', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Chronic pain and functional limitations', category: 'Mental Health' },

  // ========================================
  // ANKLE/FOOT CONDITIONS SECONDARIES
  // ========================================
  { primaryCondition: 'Ankle Condition', secondaryCondition: 'Knee Condition', medicalConnection: 'Ankle instability affects knee mechanics', category: 'Musculoskeletal' },
  { primaryCondition: 'Ankle Condition', secondaryCondition: 'Hip Condition', medicalConnection: 'Gait changes stress hip joint', category: 'Musculoskeletal' },
  { primaryCondition: 'Ankle Condition', secondaryCondition: 'Lumbar Spine Condition', medicalConnection: 'Ankle dysfunction alters gait and spinal loading', category: 'Musculoskeletal' },
  { primaryCondition: 'Ankle Condition', secondaryCondition: 'Opposite Ankle Condition', medicalConnection: 'Compensation overloads other ankle', category: 'Musculoskeletal' },
  { primaryCondition: 'Ankle Condition', secondaryCondition: 'Plantar Fasciitis', medicalConnection: 'Altered mechanics stress plantar fascia', category: 'Musculoskeletal' },
  { primaryCondition: 'Flat Feet (Pes Planus)', secondaryCondition: 'Plantar Fasciitis', medicalConnection: 'Abnormal arch mechanics strain plantar fascia', category: 'Musculoskeletal' },
  { primaryCondition: 'Flat Feet (Pes Planus)', secondaryCondition: 'Knee Pain', medicalConnection: 'Altered lower limb alignment stresses knees', category: 'Musculoskeletal' },
  { primaryCondition: 'Flat Feet (Pes Planus)', secondaryCondition: 'Hip Pain', medicalConnection: 'Biomechanical chain affects hips', category: 'Musculoskeletal' },
  { primaryCondition: 'Flat Feet (Pes Planus)', secondaryCondition: 'Lumbar Spine Condition', medicalConnection: 'Postural changes from foot dysfunction', category: 'Musculoskeletal' },
  { primaryCondition: 'Flat Feet (Pes Planus)', secondaryCondition: 'Achilles Tendonitis', medicalConnection: 'Altered mechanics stress Achilles tendon', category: 'Musculoskeletal' },
  { primaryCondition: 'Flat Feet (Pes Planus)', secondaryCondition: 'Shin Splints', medicalConnection: 'Pronation stresses tibial muscles', category: 'Musculoskeletal' },
  { primaryCondition: 'Flat Feet (Pes Planus)', secondaryCondition: 'Bunions', medicalConnection: 'Abnormal weight distribution on forefoot', category: 'Musculoskeletal' },
  { primaryCondition: 'Plantar Fasciitis', secondaryCondition: 'Heel Spurs', medicalConnection: 'Chronic inflammation causes bone formation', category: 'Musculoskeletal' },
  { primaryCondition: 'Plantar Fasciitis', secondaryCondition: 'Knee Condition', medicalConnection: 'Altered gait to avoid foot pain stresses knees', category: 'Musculoskeletal' },
  { primaryCondition: 'Plantar Fasciitis', secondaryCondition: 'Hip Condition', medicalConnection: 'Compensatory gait affects hips', category: 'Musculoskeletal' },
  { primaryCondition: 'Plantar Fasciitis', secondaryCondition: 'Lumbar Spine Condition', medicalConnection: 'Antalgic gait stresses lower back', category: 'Musculoskeletal' },

  // ========================================
  // HYPERTENSION SECONDARIES
  // ========================================
  { primaryCondition: 'Hypertension', secondaryCondition: 'Coronary Artery Disease', medicalConnection: 'High blood pressure damages arterial walls accelerating atherosclerosis', category: 'Cardiovascular' },
  { primaryCondition: 'Hypertension', secondaryCondition: 'Stroke', medicalConnection: 'Increased risk of blood vessel rupture or blockage in brain', category: 'Cardiovascular' },
  { primaryCondition: 'Hypertension', secondaryCondition: 'Heart Failure', medicalConnection: 'Heart works harder against high resistance, eventually weakening', category: 'Cardiovascular' },
  { primaryCondition: 'Hypertension', secondaryCondition: 'Left Ventricular Hypertrophy', medicalConnection: 'Heart muscle thickens from working against high pressure', category: 'Cardiovascular' },
  { primaryCondition: 'Hypertension', secondaryCondition: 'Atrial Fibrillation', medicalConnection: 'Chronic pressure changes affect heart electrical system', category: 'Cardiovascular' },
  { primaryCondition: 'Hypertension', secondaryCondition: 'Aortic Aneurysm', medicalConnection: 'High pressure weakens aortic wall', category: 'Cardiovascular' },
  { primaryCondition: 'Hypertension', secondaryCondition: 'Peripheral Artery Disease', medicalConnection: 'Contributes to atherosclerosis in peripheral arteries', category: 'Cardiovascular' },
  { primaryCondition: 'Hypertension', secondaryCondition: 'Chronic Kidney Disease', medicalConnection: 'High blood pressure damages kidney blood vessels', category: 'Genitourinary' },
  { primaryCondition: 'Hypertension', secondaryCondition: 'Hypertensive Retinopathy', medicalConnection: 'High blood pressure damages retinal blood vessels', category: 'Eyes' },
  { primaryCondition: 'Hypertension', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Blood vessel damage and medications affect sexual function', category: 'Genitourinary' },
  { primaryCondition: 'Hypertension', secondaryCondition: 'Vascular Dementia', medicalConnection: 'Chronic cerebral vascular damage affects cognition', category: 'Neurological' },
  { primaryCondition: 'Hypertension', secondaryCondition: 'Headaches', medicalConnection: 'Elevated blood pressure can cause headaches', category: 'Neurological' },

  // ========================================
  // CORONARY ARTERY DISEASE SECONDARIES
  // ========================================
  { primaryCondition: 'Coronary Artery Disease', secondaryCondition: 'Heart Failure', medicalConnection: 'Reduced blood supply weakens heart muscle', category: 'Cardiovascular' },
  { primaryCondition: 'Coronary Artery Disease', secondaryCondition: 'Myocardial Infarction', medicalConnection: 'Blocked coronary arteries cause heart attacks', category: 'Cardiovascular' },
  { primaryCondition: 'Coronary Artery Disease', secondaryCondition: 'Cardiac Arrhythmias', medicalConnection: 'Ischemia disrupts heart electrical system', category: 'Cardiovascular' },
  { primaryCondition: 'Coronary Artery Disease', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Cardiac disease commonly causes depression', category: 'Mental Health' },
  { primaryCondition: 'Coronary Artery Disease', secondaryCondition: 'Anxiety Disorder', medicalConnection: 'Fear of cardiac events causes chronic anxiety', category: 'Mental Health' },
  { primaryCondition: 'Coronary Artery Disease', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Vascular disease affects blood flow; medications contribute', category: 'Genitourinary' },
  { primaryCondition: 'Coronary Artery Disease', secondaryCondition: 'Chronic Fatigue', medicalConnection: 'Reduced cardiac output causes persistent fatigue', category: 'Systemic' },

  // ========================================
  // MIGRAINES SECONDARIES
  // ========================================
  { primaryCondition: 'Migraines', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Chronic pain and disability cause clinical depression', category: 'Mental Health' },
  { primaryCondition: 'Migraines', secondaryCondition: 'Anxiety Disorder', medicalConnection: 'Fear of migraine attacks causes anticipatory anxiety', category: 'Mental Health' },
  { primaryCondition: 'Migraines', secondaryCondition: 'Insomnia', medicalConnection: 'Pain disrupts sleep; poor sleep triggers more migraines', category: 'Mental Health' },
  { primaryCondition: 'Migraines', secondaryCondition: 'GERD', medicalConnection: 'NSAIDs and triptan medications cause gastric irritation', category: 'Digestive' },
  { primaryCondition: 'Migraines', secondaryCondition: 'Medication Overuse Headache', medicalConnection: 'Frequent analgesic use causes rebound headaches', category: 'Neurological' },
  { primaryCondition: 'Migraines', secondaryCondition: 'Cervical Spine Condition', medicalConnection: 'Chronic neck tension accompanies migraines', category: 'Musculoskeletal' },
  { primaryCondition: 'Migraines', secondaryCondition: 'Vertigo', medicalConnection: 'Vestibular migraines cause dizziness', category: 'Neurological' },
  { primaryCondition: 'Migraines', secondaryCondition: 'Visual Disturbances', medicalConnection: 'Migraine aura can cause lasting visual symptoms', category: 'Eyes' },
  { primaryCondition: 'Migraines', secondaryCondition: 'Stroke', medicalConnection: 'Migraine with aura increases stroke risk', category: 'Cardiovascular' },
  { primaryCondition: 'Migraines', secondaryCondition: 'Chronic Pain Syndrome', medicalConnection: 'Central sensitization from chronic migraines', category: 'Neurological' },

  // ========================================
  // DEPRESSION SECONDARIES
  // ========================================
  { primaryCondition: 'Major Depressive Disorder', secondaryCondition: 'Anxiety Disorder', medicalConnection: 'Depression and anxiety commonly co-occur due to shared neurobiology', category: 'Mental Health' },
  { primaryCondition: 'Major Depressive Disorder', secondaryCondition: 'Insomnia', medicalConnection: 'Neurotransmitter imbalances disrupt sleep architecture', category: 'Mental Health' },
  { primaryCondition: 'Major Depressive Disorder', secondaryCondition: 'Hypersomnia', medicalConnection: 'Depression can cause excessive sleeping', category: 'Mental Health' },
  { primaryCondition: 'Major Depressive Disorder', secondaryCondition: 'Chronic Pain Syndrome', medicalConnection: 'Depression lowers pain threshold and amplifies pain perception', category: 'Neurological' },
  { primaryCondition: 'Major Depressive Disorder', secondaryCondition: 'Fibromyalgia', medicalConnection: 'Shared pathways of central sensitization', category: 'Musculoskeletal' },
  { primaryCondition: 'Major Depressive Disorder', secondaryCondition: 'Obesity', medicalConnection: 'Appetite dysregulation and reduced activity', category: 'Endocrine' },
  { primaryCondition: 'Major Depressive Disorder', secondaryCondition: 'Diabetes Type II', medicalConnection: 'Metabolic changes from depression and lifestyle factors', category: 'Endocrine' },
  { primaryCondition: 'Major Depressive Disorder', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Depression and SSRI medications affect sexual function', category: 'Genitourinary' },
  { primaryCondition: 'Major Depressive Disorder', secondaryCondition: 'Female Sexual Dysfunction', medicalConnection: 'Depression and medications reduce libido', category: 'Gynecological' },
  { primaryCondition: 'Major Depressive Disorder', secondaryCondition: 'Migraines', medicalConnection: 'Shared serotonin pathway dysfunction', category: 'Neurological' },
  { primaryCondition: 'Major Depressive Disorder', secondaryCondition: 'IBS', medicalConnection: 'Gut-brain axis affected by depression', category: 'Digestive' },
  { primaryCondition: 'Major Depressive Disorder', secondaryCondition: 'Substance Use Disorder', medicalConnection: 'Self-medication for depressive symptoms', category: 'Mental Health' },
  { primaryCondition: 'Major Depressive Disorder', secondaryCondition: 'Coronary Artery Disease', medicalConnection: 'Depression increases cardiovascular risk', category: 'Cardiovascular' },
  { primaryCondition: 'Major Depressive Disorder', secondaryCondition: 'Immune Dysfunction', medicalConnection: 'Depression suppresses immune function', category: 'Immune' },
  { primaryCondition: 'Major Depressive Disorder', secondaryCondition: 'Cognitive Impairment', medicalConnection: 'Depression affects concentration and memory', category: 'Neurological' },

  // ========================================
  // ANXIETY DISORDER SECONDARIES
  // ========================================
  { primaryCondition: 'Generalized Anxiety Disorder', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Chronic anxiety leads to depression', category: 'Mental Health' },
  { primaryCondition: 'Generalized Anxiety Disorder', secondaryCondition: 'Panic Disorder', medicalConnection: 'Anxiety can escalate to panic attacks', category: 'Mental Health' },
  { primaryCondition: 'Generalized Anxiety Disorder', secondaryCondition: 'Insomnia', medicalConnection: 'Worry and hyperarousal prevent sleep', category: 'Mental Health' },
  { primaryCondition: 'Generalized Anxiety Disorder', secondaryCondition: 'GERD', medicalConnection: 'Stress increases stomach acid production', category: 'Digestive' },
  { primaryCondition: 'Generalized Anxiety Disorder', secondaryCondition: 'IBS', medicalConnection: 'Gut-brain axis dysfunction from chronic anxiety', category: 'Digestive' },
  { primaryCondition: 'Generalized Anxiety Disorder', secondaryCondition: 'Hypertension', medicalConnection: 'Chronic stress hormones elevate blood pressure', category: 'Cardiovascular' },
  { primaryCondition: 'Generalized Anxiety Disorder', secondaryCondition: 'Tension Headaches', medicalConnection: 'Chronic muscle tension from anxiety', category: 'Neurological' },
  { primaryCondition: 'Generalized Anxiety Disorder', secondaryCondition: 'Migraines', medicalConnection: 'Stress is a major migraine trigger', category: 'Neurological' },
  { primaryCondition: 'Generalized Anxiety Disorder', secondaryCondition: 'TMJ Disorder', medicalConnection: 'Jaw clenching from stress', category: 'Dental' },
  { primaryCondition: 'Generalized Anxiety Disorder', secondaryCondition: 'Bruxism', medicalConnection: 'Teeth grinding from anxiety', category: 'Dental' },
  { primaryCondition: 'Generalized Anxiety Disorder', secondaryCondition: 'Fibromyalgia', medicalConnection: 'Central sensitization from chronic stress', category: 'Musculoskeletal' },
  { primaryCondition: 'Generalized Anxiety Disorder', secondaryCondition: 'Chronic Pain Syndrome', medicalConnection: 'Anxiety amplifies pain perception', category: 'Neurological' },
  { primaryCondition: 'Generalized Anxiety Disorder', secondaryCondition: 'Substance Use Disorder', medicalConnection: 'Self-medication for anxiety symptoms', category: 'Mental Health' },
  { primaryCondition: 'Generalized Anxiety Disorder', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Performance anxiety and stress hormones', category: 'Genitourinary' },
  { primaryCondition: 'Generalized Anxiety Disorder', secondaryCondition: 'Psoriasis', medicalConnection: 'Stress triggers autoimmune flares', category: 'Skin' },
  { primaryCondition: 'Generalized Anxiety Disorder', secondaryCondition: 'Cardiac Arrhythmias', medicalConnection: 'Anxiety causes heart palpitations and arrhythmias', category: 'Cardiovascular' },

  // ========================================
  // FIBROMYALGIA SECONDARIES
  // ========================================
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Chronic widespread pain causes depression', category: 'Mental Health' },
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'Anxiety Disorder', medicalConnection: 'Chronic unpredictable pain causes anxiety', category: 'Mental Health' },
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'Chronic Fatigue Syndrome', medicalConnection: 'Overlapping conditions with shared pathophysiology', category: 'Systemic' },
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'Insomnia', medicalConnection: 'Pain disrupts sleep; non-restorative sleep worsens symptoms', category: 'Mental Health' },
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'IBS', medicalConnection: 'Central sensitization affects gut function', category: 'Digestive' },
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'Migraines', medicalConnection: 'Shared central sensitization pathways', category: 'Neurological' },
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'TMJ Disorder', medicalConnection: 'Widespread pain includes jaw dysfunction', category: 'Dental' },
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'Interstitial Cystitis', medicalConnection: 'Central sensitization affects bladder', category: 'Genitourinary' },
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'Cognitive Dysfunction', medicalConnection: 'Fibro fog affects concentration and memory', category: 'Neurological' },
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'Restless Leg Syndrome', medicalConnection: 'Central nervous system dysfunction', category: 'Neurological' },
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'Raynauds Phenomenon', medicalConnection: 'Dysautonomia affects peripheral circulation', category: 'Cardiovascular' },

  // ========================================
  // GERD SECONDARIES
  // ========================================
  { primaryCondition: 'GERD', secondaryCondition: 'Asthma', medicalConnection: 'Acid aspiration irritates airways; vagal reflex', category: 'Respiratory' },
  { primaryCondition: 'GERD', secondaryCondition: 'Chronic Cough', medicalConnection: 'Acid irritation triggers cough reflex', category: 'Respiratory' },
  { primaryCondition: 'GERD', secondaryCondition: 'Chronic Laryngitis', medicalConnection: 'Acid reflux damages vocal cords', category: 'Respiratory' },
  { primaryCondition: 'GERD', secondaryCondition: 'Dental Erosion', medicalConnection: 'Stomach acid damages tooth enamel', category: 'Dental' },
  { primaryCondition: 'GERD', secondaryCondition: 'Sleep Disturbance', medicalConnection: 'Nighttime reflux disrupts sleep', category: 'Mental Health' },
  { primaryCondition: 'GERD', secondaryCondition: 'Barretts Esophagus', medicalConnection: 'Chronic acid exposure causes precancerous changes', category: 'Digestive' },
  { primaryCondition: 'GERD', secondaryCondition: 'Esophageal Stricture', medicalConnection: 'Chronic inflammation causes scarring and narrowing', category: 'Digestive' },
  { primaryCondition: 'GERD', secondaryCondition: 'Esophageal Cancer', medicalConnection: 'Long-term Barretts esophagus increases cancer risk', category: 'Digestive' },
  { primaryCondition: 'GERD', secondaryCondition: 'Chronic Sinusitis', medicalConnection: 'Acid reflux can reach and irritate sinuses', category: 'Respiratory' },
  { primaryCondition: 'GERD', secondaryCondition: 'Pneumonia', medicalConnection: 'Aspiration of gastric contents', category: 'Respiratory' },

  // ========================================
  // ASTHMA SECONDARIES
  // ========================================
  { primaryCondition: 'Asthma', secondaryCondition: 'GERD', medicalConnection: 'Asthma medications relax LES; coughing increases reflux', category: 'Digestive' },
  { primaryCondition: 'Asthma', secondaryCondition: 'Sleep Apnea', medicalConnection: 'Airway inflammation affects nighttime breathing', category: 'Respiratory' },
  { primaryCondition: 'Asthma', secondaryCondition: 'Chronic Sinusitis', medicalConnection: 'United airways disease - inflammation affects both', category: 'Respiratory' },
  { primaryCondition: 'Asthma', secondaryCondition: 'Allergic Rhinitis', medicalConnection: 'Shared allergic pathways', category: 'Respiratory' },
  { primaryCondition: 'Asthma', secondaryCondition: 'Anxiety Disorder', medicalConnection: 'Fear of attacks and breathing difficulties', category: 'Mental Health' },
  { primaryCondition: 'Asthma', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Chronic disease burden and limitations', category: 'Mental Health' },
  { primaryCondition: 'Asthma', secondaryCondition: 'Vocal Cord Dysfunction', medicalConnection: 'Can develop from chronic airway hyperreactivity', category: 'Respiratory' },
  { primaryCondition: 'Asthma', secondaryCondition: 'Osteoporosis', medicalConnection: 'Long-term corticosteroid use weakens bones', category: 'Musculoskeletal' },
  { primaryCondition: 'Asthma', secondaryCondition: 'Adrenal Insufficiency', medicalConnection: 'Long-term steroid use suppresses adrenal function', category: 'Endocrine' },
  { primaryCondition: 'Asthma', secondaryCondition: 'Cataracts', medicalConnection: 'Corticosteroid side effect', category: 'Eyes' },

  // ========================================
  // CHRONIC SINUSITIS SECONDARIES
  // ========================================
  { primaryCondition: 'Chronic Sinusitis', secondaryCondition: 'Sleep Apnea', medicalConnection: 'Nasal obstruction worsens airway resistance', category: 'Respiratory' },
  { primaryCondition: 'Chronic Sinusitis', secondaryCondition: 'Asthma', medicalConnection: 'United airways disease', category: 'Respiratory' },
  { primaryCondition: 'Chronic Sinusitis', secondaryCondition: 'Migraines', medicalConnection: 'Sinus inflammation triggers headaches', category: 'Neurological' },
  { primaryCondition: 'Chronic Sinusitis', secondaryCondition: 'Bronchitis', medicalConnection: 'Post-nasal drip irritates bronchi', category: 'Respiratory' },
  { primaryCondition: 'Chronic Sinusitis', secondaryCondition: 'Anosmia', medicalConnection: 'Chronic inflammation affects sense of smell', category: 'Neurological' },
  { primaryCondition: 'Chronic Sinusitis', secondaryCondition: 'Fatigue', medicalConnection: 'Chronic infection and poor sleep quality', category: 'Systemic' },
  { primaryCondition: 'Chronic Sinusitis', secondaryCondition: 'Ear Infections', medicalConnection: 'Eustachian tube dysfunction from inflammation', category: 'Ears' },

  // ========================================
  // IBS SECONDARIES
  // ========================================
  { primaryCondition: 'IBS', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Chronic GI symptoms cause depression', category: 'Mental Health' },
  { primaryCondition: 'IBS', secondaryCondition: 'Anxiety Disorder', medicalConnection: 'Unpredictable symptoms cause anxiety', category: 'Mental Health' },
  { primaryCondition: 'IBS', secondaryCondition: 'Fibromyalgia', medicalConnection: 'Central sensitization affects multiple systems', category: 'Musculoskeletal' },
  { primaryCondition: 'IBS', secondaryCondition: 'Chronic Fatigue Syndrome', medicalConnection: 'Gut-brain axis dysfunction', category: 'Systemic' },
  { primaryCondition: 'IBS', secondaryCondition: 'Migraines', medicalConnection: 'Shared serotonin pathway dysfunction', category: 'Neurological' },
  { primaryCondition: 'IBS', secondaryCondition: 'Interstitial Cystitis', medicalConnection: 'Overlapping pelvic pain syndrome', category: 'Genitourinary' },
  { primaryCondition: 'IBS', secondaryCondition: 'TMJ Disorder', medicalConnection: 'Central sensitization affects multiple areas', category: 'Dental' },
  { primaryCondition: 'IBS', secondaryCondition: 'Pelvic Floor Dysfunction', medicalConnection: 'Chronic straining and gut-pelvis connection', category: 'Genitourinary' },

  // ========================================
  // PERIPHERAL ARTERY DISEASE SECONDARIES
  // ========================================
  { primaryCondition: 'Peripheral Artery Disease', secondaryCondition: 'Coronary Artery Disease', medicalConnection: 'Systemic atherosclerosis affects all arteries', category: 'Cardiovascular' },
  { primaryCondition: 'Peripheral Artery Disease', secondaryCondition: 'Stroke', medicalConnection: 'Indicates widespread vascular disease', category: 'Cardiovascular' },
  { primaryCondition: 'Peripheral Artery Disease', secondaryCondition: 'Chronic Wounds', medicalConnection: 'Poor circulation prevents healing', category: 'Skin' },
  { primaryCondition: 'Peripheral Artery Disease', secondaryCondition: 'Gangrene', medicalConnection: 'Severe ischemia causes tissue death', category: 'Skin' },
  { primaryCondition: 'Peripheral Artery Disease', secondaryCondition: 'Amputation', medicalConnection: 'Critical limb ischemia may require amputation', category: 'Musculoskeletal' },
  { primaryCondition: 'Peripheral Artery Disease', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Chronic pain and disability cause depression', category: 'Mental Health' },
  { primaryCondition: 'Peripheral Artery Disease', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Reduced blood flow affects sexual function', category: 'Genitourinary' },

  // ========================================
  // CHRONIC KIDNEY DISEASE SECONDARIES
  // ========================================
  { primaryCondition: 'Chronic Kidney Disease', secondaryCondition: 'Anemia', medicalConnection: 'Reduced erythropoietin production', category: 'Blood' },
  { primaryCondition: 'Chronic Kidney Disease', secondaryCondition: 'Secondary Hyperparathyroidism', medicalConnection: 'Phosphate retention stimulates PTH', category: 'Endocrine' },
  { primaryCondition: 'Chronic Kidney Disease', secondaryCondition: 'Bone Disease', medicalConnection: 'Mineral metabolism disturbance weakens bones', category: 'Musculoskeletal' },
  { primaryCondition: 'Chronic Kidney Disease', secondaryCondition: 'Cardiovascular Disease', medicalConnection: 'CKD accelerates atherosclerosis', category: 'Cardiovascular' },
  { primaryCondition: 'Chronic Kidney Disease', secondaryCondition: 'Peripheral Neuropathy', medicalConnection: 'Uremic toxins damage nerves', category: 'Neurological' },
  { primaryCondition: 'Chronic Kidney Disease', secondaryCondition: 'Hypertension', medicalConnection: 'Kidney dysfunction affects blood pressure regulation', category: 'Cardiovascular' },
  { primaryCondition: 'Chronic Kidney Disease', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Hormonal and vascular changes', category: 'Genitourinary' },
  { primaryCondition: 'Chronic Kidney Disease', secondaryCondition: 'Depression', medicalConnection: 'Chronic disease burden and dialysis stress', category: 'Mental Health' },
  { primaryCondition: 'Chronic Kidney Disease', secondaryCondition: 'Restless Leg Syndrome', medicalConnection: 'Uremic toxins cause neurological symptoms', category: 'Neurological' },
  { primaryCondition: 'Chronic Kidney Disease', secondaryCondition: 'Sleep Disorders', medicalConnection: 'Uremia disrupts sleep', category: 'Mental Health' },

  // ========================================
  // RHEUMATOID ARTHRITIS SECONDARIES
  // ========================================
  { primaryCondition: 'Rheumatoid Arthritis', secondaryCondition: 'Cervical Spine Instability', medicalConnection: 'RA affects C1-C2 joints causing atlantoaxial subluxation', category: 'Musculoskeletal' },
  { primaryCondition: 'Rheumatoid Arthritis', secondaryCondition: 'Carpal Tunnel Syndrome', medicalConnection: 'Wrist synovitis compresses median nerve', category: 'Neurological' },
  { primaryCondition: 'Rheumatoid Arthritis', secondaryCondition: 'Interstitial Lung Disease', medicalConnection: 'RA-associated pulmonary fibrosis', category: 'Respiratory' },
  { primaryCondition: 'Rheumatoid Arthritis', secondaryCondition: 'Pericarditis', medicalConnection: 'Systemic inflammation affects heart lining', category: 'Cardiovascular' },
  { primaryCondition: 'Rheumatoid Arthritis', secondaryCondition: 'Vasculitis', medicalConnection: 'RA can cause blood vessel inflammation', category: 'Cardiovascular' },
  { primaryCondition: 'Rheumatoid Arthritis', secondaryCondition: 'Secondary Sjogrens Syndrome', medicalConnection: 'Autoimmune overlap syndromes', category: 'Immune' },
  { primaryCondition: 'Rheumatoid Arthritis', secondaryCondition: 'Osteoporosis', medicalConnection: 'Inflammation and corticosteroids weaken bones', category: 'Musculoskeletal' },
  { primaryCondition: 'Rheumatoid Arthritis', secondaryCondition: 'Anemia', medicalConnection: 'Chronic inflammation suppresses red blood cell production', category: 'Blood' },
  { primaryCondition: 'Rheumatoid Arthritis', secondaryCondition: 'Depression', medicalConnection: 'Chronic pain and disability cause depression', category: 'Mental Health' },
  { primaryCondition: 'Rheumatoid Arthritis', secondaryCondition: 'Scleritis', medicalConnection: 'RA-associated eye inflammation', category: 'Eyes' },

  // ========================================
  // LUPUS SECONDARIES
  // ========================================
  { primaryCondition: 'Systemic Lupus Erythematosus', secondaryCondition: 'Lupus Nephritis', medicalConnection: 'Autoimmune attack on kidney tissue', category: 'Genitourinary' },
  { primaryCondition: 'Systemic Lupus Erythematosus', secondaryCondition: 'Pericarditis', medicalConnection: 'Inflammation of heart lining', category: 'Cardiovascular' },
  { primaryCondition: 'Systemic Lupus Erythematosus', secondaryCondition: 'Pleuritis', medicalConnection: 'Inflammation of lung lining', category: 'Respiratory' },
  { primaryCondition: 'Systemic Lupus Erythematosus', secondaryCondition: 'Neuropsychiatric Lupus', medicalConnection: 'CNS involvement causing cognitive dysfunction', category: 'Neurological' },
  { primaryCondition: 'Systemic Lupus Erythematosus', secondaryCondition: 'Raynauds Phenomenon', medicalConnection: 'Vasospasm in SLE', category: 'Cardiovascular' },
  { primaryCondition: 'Systemic Lupus Erythematosus', secondaryCondition: 'Secondary Sjogrens', medicalConnection: 'Overlapping autoimmune conditions', category: 'Immune' },
  { primaryCondition: 'Systemic Lupus Erythematosus', secondaryCondition: 'Antiphospholipid Syndrome', medicalConnection: 'Associated clotting disorder', category: 'Blood' },
  { primaryCondition: 'Systemic Lupus Erythematosus', secondaryCondition: 'Osteoporosis', medicalConnection: 'Disease and steroids weaken bones', category: 'Musculoskeletal' },
  { primaryCondition: 'Systemic Lupus Erythematosus', secondaryCondition: 'Depression', medicalConnection: 'Chronic disease and CNS involvement', category: 'Mental Health' },

  // ========================================
  // PROSTATE CONDITIONS SECONDARIES
  // ========================================
  { primaryCondition: 'Prostate Cancer', secondaryCondition: 'Urinary Incontinence', medicalConnection: 'Treatment-related bladder control issues', category: 'Genitourinary' },
  { primaryCondition: 'Prostate Cancer', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Surgery or radiation damages nerves', category: 'Genitourinary' },
  { primaryCondition: 'Prostate Cancer', secondaryCondition: 'Bone Metastases', medicalConnection: 'Prostate cancer commonly spreads to bone', category: 'Musculoskeletal' },
  { primaryCondition: 'Prostate Cancer', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Cancer diagnosis and treatment effects', category: 'Mental Health' },
  { primaryCondition: 'Prostate Cancer', secondaryCondition: 'Hormonal Dysfunction', medicalConnection: 'Androgen deprivation therapy effects', category: 'Endocrine' },
  { primaryCondition: 'Prostate Cancer', secondaryCondition: 'Osteoporosis', medicalConnection: 'Hormone therapy weakens bones', category: 'Musculoskeletal' },
  { primaryCondition: 'Benign Prostatic Hyperplasia', secondaryCondition: 'Urinary Tract Infections', medicalConnection: 'Incomplete bladder emptying causes infections', category: 'Genitourinary' },
  { primaryCondition: 'Benign Prostatic Hyperplasia', secondaryCondition: 'Bladder Stones', medicalConnection: 'Urinary stasis promotes stone formation', category: 'Genitourinary' },
  { primaryCondition: 'Benign Prostatic Hyperplasia', secondaryCondition: 'Kidney Damage', medicalConnection: 'Chronic obstruction can damage kidneys', category: 'Genitourinary' },
  { primaryCondition: 'Benign Prostatic Hyperplasia', secondaryCondition: 'Sleep Disturbance', medicalConnection: 'Nocturia disrupts sleep', category: 'Mental Health' },

  // ========================================
  // ENDOMETRIOSIS SECONDARIES
  // ========================================
  { primaryCondition: 'Endometriosis', secondaryCondition: 'Chronic Pelvic Pain', medicalConnection: 'Endometrial implants cause persistent pain', category: 'Gynecological' },
  { primaryCondition: 'Endometriosis', secondaryCondition: 'Infertility', medicalConnection: 'Scarring and inflammation affect fertility', category: 'Gynecological' },
  { primaryCondition: 'Endometriosis', secondaryCondition: 'Ovarian Cysts', medicalConnection: 'Endometriomas form on ovaries', category: 'Gynecological' },
  { primaryCondition: 'Endometriosis', secondaryCondition: 'Painful Intercourse', medicalConnection: 'Pelvic scarring and inflammation', category: 'Gynecological' },
  { primaryCondition: 'Endometriosis', secondaryCondition: 'Bowel Dysfunction', medicalConnection: 'Intestinal endometriosis affects bowel function', category: 'Digestive' },
  { primaryCondition: 'Endometriosis', secondaryCondition: 'Bladder Dysfunction', medicalConnection: 'Bladder endometriosis causes urinary symptoms', category: 'Genitourinary' },
  { primaryCondition: 'Endometriosis', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Chronic pain and fertility concerns', category: 'Mental Health' },
  { primaryCondition: 'Endometriosis', secondaryCondition: 'Anxiety Disorder', medicalConnection: 'Unpredictable pain and life impact', category: 'Mental Health' },
  { primaryCondition: 'Endometriosis', secondaryCondition: 'Fatigue', medicalConnection: 'Chronic inflammation and pain cause fatigue', category: 'Systemic' },

  // ========================================
  // HYPOTHYROIDISM SECONDARIES
  // ========================================
  { primaryCondition: 'Hypothyroidism', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Low thyroid affects mood regulation', category: 'Mental Health' },
  { primaryCondition: 'Hypothyroidism', secondaryCondition: 'Cognitive Impairment', medicalConnection: 'Thyroid affects brain function', category: 'Neurological' },
  { primaryCondition: 'Hypothyroidism', secondaryCondition: 'Weight Gain/Obesity', medicalConnection: 'Slow metabolism causes weight gain', category: 'Endocrine' },
  { primaryCondition: 'Hypothyroidism', secondaryCondition: 'Hyperlipidemia', medicalConnection: 'Thyroid affects cholesterol metabolism', category: 'Cardiovascular' },
  { primaryCondition: 'Hypothyroidism', secondaryCondition: 'Coronary Artery Disease', medicalConnection: 'Elevated cholesterol and cardiac effects', category: 'Cardiovascular' },
  { primaryCondition: 'Hypothyroidism', secondaryCondition: 'Peripheral Neuropathy', medicalConnection: 'Thyroid dysfunction can cause neuropathy', category: 'Neurological' },
  { primaryCondition: 'Hypothyroidism', secondaryCondition: 'Carpal Tunnel Syndrome', medicalConnection: 'Myxedema compresses median nerve', category: 'Neurological' },
  { primaryCondition: 'Hypothyroidism', secondaryCondition: 'Constipation', medicalConnection: 'Slow metabolism affects GI motility', category: 'Digestive' },
  { primaryCondition: 'Hypothyroidism', secondaryCondition: 'Anemia', medicalConnection: 'Thyroid affects red blood cell production', category: 'Blood' },
  { primaryCondition: 'Hypothyroidism', secondaryCondition: 'Infertility', medicalConnection: 'Thyroid affects reproductive hormones', category: 'Gynecological' },
  { primaryCondition: 'Hypothyroidism', secondaryCondition: 'Sleep Apnea', medicalConnection: 'Tissue changes affect airway', category: 'Respiratory' },
  { primaryCondition: 'Hypothyroidism', secondaryCondition: 'Muscle Weakness', medicalConnection: 'Thyroid affects muscle function', category: 'Musculoskeletal' },

  // ========================================
  // HYPERTHYROIDISM SECONDARIES
  // ========================================
  { primaryCondition: 'Hyperthyroidism', secondaryCondition: 'Atrial Fibrillation', medicalConnection: 'Excess thyroid hormone affects heart rhythm', category: 'Cardiovascular' },
  { primaryCondition: 'Hyperthyroidism', secondaryCondition: 'Heart Failure', medicalConnection: 'Prolonged tachycardia weakens heart', category: 'Cardiovascular' },
  { primaryCondition: 'Hyperthyroidism', secondaryCondition: 'Osteoporosis', medicalConnection: 'Excess thyroid increases bone resorption', category: 'Musculoskeletal' },
  { primaryCondition: 'Hyperthyroidism', secondaryCondition: 'Anxiety Disorder', medicalConnection: 'Excess thyroid hormone causes anxiety symptoms', category: 'Mental Health' },
  { primaryCondition: 'Hyperthyroidism', secondaryCondition: 'Graves Ophthalmopathy', medicalConnection: 'Autoimmune eye disease in Graves disease', category: 'Eyes' },
  { primaryCondition: 'Hyperthyroidism', secondaryCondition: 'Muscle Weakness', medicalConnection: 'Thyrotoxic myopathy', category: 'Musculoskeletal' },
  { primaryCondition: 'Hyperthyroidism', secondaryCondition: 'Insomnia', medicalConnection: 'Excess thyroid hormone disrupts sleep', category: 'Mental Health' },
  { primaryCondition: 'Hyperthyroidism', secondaryCondition: 'Heat Intolerance', medicalConnection: 'Increased metabolism raises body temperature', category: 'Systemic' },

  // ========================================
  // GULF WAR ILLNESS SECONDARIES
  // ========================================
  { primaryCondition: 'Gulf War Illness', secondaryCondition: 'Chronic Fatigue Syndrome', medicalConnection: 'Unexplained chronic fatigue is core symptom', category: 'Systemic' },
  { primaryCondition: 'Gulf War Illness', secondaryCondition: 'Fibromyalgia', medicalConnection: 'Widespread pain is common manifestation', category: 'Musculoskeletal' },
  { primaryCondition: 'Gulf War Illness', secondaryCondition: 'IBS', medicalConnection: 'GI dysfunction is a hallmark symptom', category: 'Digestive' },
  { primaryCondition: 'Gulf War Illness', secondaryCondition: 'Cognitive Impairment', medicalConnection: 'Memory and concentration problems', category: 'Neurological' },
  { primaryCondition: 'Gulf War Illness', secondaryCondition: 'Chronic Headaches', medicalConnection: 'Persistent headaches are common', category: 'Neurological' },
  { primaryCondition: 'Gulf War Illness', secondaryCondition: 'Joint Pain', medicalConnection: 'Unexplained musculoskeletal pain', category: 'Musculoskeletal' },
  { primaryCondition: 'Gulf War Illness', secondaryCondition: 'Respiratory Conditions', medicalConnection: 'Burn pit and environmental exposure effects', category: 'Respiratory' },
  { primaryCondition: 'Gulf War Illness', secondaryCondition: 'Sleep Disorders', medicalConnection: 'Sleep disturbance is common symptom', category: 'Mental Health' },
  { primaryCondition: 'Gulf War Illness', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Chronic illness causes depression', category: 'Mental Health' },

  // ========================================
  // BURN PIT EXPOSURE SECONDARIES (PACT Act)
  // ========================================
  { primaryCondition: 'Burn Pit Exposure', secondaryCondition: 'Chronic Bronchitis', medicalConnection: 'Toxic inhalation damages airways', category: 'Respiratory' },
  { primaryCondition: 'Burn Pit Exposure', secondaryCondition: 'COPD', medicalConnection: 'Long-term lung damage from toxic exposure', category: 'Respiratory' },
  { primaryCondition: 'Burn Pit Exposure', secondaryCondition: 'Asthma', medicalConnection: 'Airway inflammation from toxic exposure', category: 'Respiratory' },
  { primaryCondition: 'Burn Pit Exposure', secondaryCondition: 'Constrictive Bronchiolitis', medicalConnection: 'Small airway damage from particulates', category: 'Respiratory' },
  { primaryCondition: 'Burn Pit Exposure', secondaryCondition: 'Pulmonary Fibrosis', medicalConnection: 'Scarring from toxic inhalation', category: 'Respiratory' },
  { primaryCondition: 'Burn Pit Exposure', secondaryCondition: 'Chronic Sinusitis', medicalConnection: 'Upper airway damage from smoke', category: 'Respiratory' },
  { primaryCondition: 'Burn Pit Exposure', secondaryCondition: 'Rhinitis', medicalConnection: 'Nasal passage inflammation', category: 'Respiratory' },
  { primaryCondition: 'Burn Pit Exposure', secondaryCondition: 'Head/Neck Cancer', medicalConnection: 'Carcinogen exposure from burn pits', category: 'Cancer' },
  { primaryCondition: 'Burn Pit Exposure', secondaryCondition: 'Lung Cancer', medicalConnection: 'Carcinogen inhalation', category: 'Cancer' },
  { primaryCondition: 'Burn Pit Exposure', secondaryCondition: 'GI Cancer', medicalConnection: 'Systemic carcinogen exposure', category: 'Cancer' },
  { primaryCondition: 'Burn Pit Exposure', secondaryCondition: 'Brain Cancer', medicalConnection: 'Toxic exposure linked to brain tumors', category: 'Cancer' },
  { primaryCondition: 'Burn Pit Exposure', secondaryCondition: 'Lymphoma', medicalConnection: 'Carcinogen-induced blood cancer', category: 'Cancer' },
  { primaryCondition: 'Burn Pit Exposure', secondaryCondition: 'Kidney Cancer', medicalConnection: 'Toxic exposure affects kidneys', category: 'Cancer' },

  // ========================================
  // AGENT ORANGE EXPOSURE SECONDARIES
  // ========================================
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Diabetes Type II', medicalConnection: 'Presumptive condition for AO exposure', category: 'Endocrine' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Ischemic Heart Disease', medicalConnection: 'Presumptive cardiovascular condition', category: 'Cardiovascular' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Parkinson Disease', medicalConnection: 'Presumptive neurological condition', category: 'Neurological' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Peripheral Neuropathy', medicalConnection: 'Early-onset neuropathy from exposure', category: 'Neurological' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Prostate Cancer', medicalConnection: 'Presumptive cancer from AO', category: 'Cancer' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Lung Cancer', medicalConnection: 'Presumptive cancer condition', category: 'Cancer' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Soft Tissue Sarcoma', medicalConnection: 'Presumptive cancer from herbicide exposure', category: 'Cancer' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Non-Hodgkins Lymphoma', medicalConnection: 'Presumptive blood cancer', category: 'Cancer' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Hodgkins Disease', medicalConnection: 'Presumptive blood cancer', category: 'Cancer' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Chronic B-cell Leukemia', medicalConnection: 'Presumptive blood cancer', category: 'Cancer' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Multiple Myeloma', medicalConnection: 'Presumptive blood cancer', category: 'Cancer' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Chloracne', medicalConnection: 'Skin condition from dioxin exposure', category: 'Skin' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Porphyria Cutanea Tarda', medicalConnection: 'Presumptive skin condition', category: 'Skin' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'AL Amyloidosis', medicalConnection: 'Presumptive systemic condition', category: 'Systemic' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Bladder Cancer', medicalConnection: 'Added presumptive under PACT Act', category: 'Cancer' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Hypothyroidism', medicalConnection: 'Added presumptive under PACT Act', category: 'Endocrine' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Hypertension', medicalConnection: 'Added presumptive under PACT Act', category: 'Cardiovascular' },
  { primaryCondition: 'Agent Orange Exposure', secondaryCondition: 'Monoclonal Gammopathy', medicalConnection: 'Added presumptive under PACT Act', category: 'Blood' },

  // ========================================
  // RADIATION EXPOSURE SECONDARIES
  // ========================================
  { primaryCondition: 'Radiation Exposure', secondaryCondition: 'Thyroid Cancer', medicalConnection: 'Radiation-induced thyroid malignancy', category: 'Cancer' },
  { primaryCondition: 'Radiation Exposure', secondaryCondition: 'Leukemia', medicalConnection: 'Radiation-induced blood cancer', category: 'Cancer' },
  { primaryCondition: 'Radiation Exposure', secondaryCondition: 'Breast Cancer', medicalConnection: 'Radiation exposure increases breast cancer risk', category: 'Cancer' },
  { primaryCondition: 'Radiation Exposure', secondaryCondition: 'Lung Cancer', medicalConnection: 'Radiation-induced malignancy', category: 'Cancer' },
  { primaryCondition: 'Radiation Exposure', secondaryCondition: 'Bone Cancer', medicalConnection: 'Radiation affects bone tissue', category: 'Cancer' },
  { primaryCondition: 'Radiation Exposure', secondaryCondition: 'Brain Cancer', medicalConnection: 'CNS radiation effects', category: 'Cancer' },
  { primaryCondition: 'Radiation Exposure', secondaryCondition: 'Colon Cancer', medicalConnection: 'GI tract radiation exposure', category: 'Cancer' },
  { primaryCondition: 'Radiation Exposure', secondaryCondition: 'Hypothyroidism', medicalConnection: 'Thyroid damage from radiation', category: 'Endocrine' },
  { primaryCondition: 'Radiation Exposure', secondaryCondition: 'Cataracts', medicalConnection: 'Radiation damages lens', category: 'Eyes' },
  { primaryCondition: 'Radiation Exposure', secondaryCondition: 'Bone Marrow Failure', medicalConnection: 'Radiation suppresses bone marrow', category: 'Blood' },

  // ========================================
  // AMPUTATION SECONDARIES
  // ========================================
  { primaryCondition: 'Lower Extremity Amputation', secondaryCondition: 'Lumbar Spine Condition', medicalConnection: 'Altered gait with prosthesis stresses spine', category: 'Musculoskeletal' },
  { primaryCondition: 'Lower Extremity Amputation', secondaryCondition: 'Hip Condition - Contralateral', medicalConnection: 'Increased stress on remaining limb', category: 'Musculoskeletal' },
  { primaryCondition: 'Lower Extremity Amputation', secondaryCondition: 'Knee Condition - Contralateral', medicalConnection: 'Overuse of remaining leg', category: 'Musculoskeletal' },
  { primaryCondition: 'Lower Extremity Amputation', secondaryCondition: 'Phantom Limb Pain', medicalConnection: 'Neurological pain in missing limb', category: 'Neurological' },
  { primaryCondition: 'Lower Extremity Amputation', secondaryCondition: 'Residual Limb Pain', medicalConnection: 'Stump pain from prosthesis use', category: 'Neurological' },
  { primaryCondition: 'Lower Extremity Amputation', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Adjustment to limb loss and disability', category: 'Mental Health' },
  { primaryCondition: 'Lower Extremity Amputation', secondaryCondition: 'PTSD', medicalConnection: 'Trauma from injury event', category: 'Mental Health' },
  { primaryCondition: 'Lower Extremity Amputation', secondaryCondition: 'Skin Breakdown', medicalConnection: 'Prosthetic socket causes skin issues', category: 'Skin' },
  { primaryCondition: 'Lower Extremity Amputation', secondaryCondition: 'Shoulder Condition', medicalConnection: 'Crutch or assistive device use', category: 'Musculoskeletal' },
  { primaryCondition: 'Upper Extremity Amputation', secondaryCondition: 'Shoulder Condition - Contralateral', medicalConnection: 'Overuse of remaining arm', category: 'Musculoskeletal' },
  { primaryCondition: 'Upper Extremity Amputation', secondaryCondition: 'Cervical Spine Condition', medicalConnection: 'Asymmetric loading affects neck', category: 'Musculoskeletal' },
  { primaryCondition: 'Upper Extremity Amputation', secondaryCondition: 'Phantom Limb Pain', medicalConnection: 'Neurological pain in missing limb', category: 'Neurological' },
  { primaryCondition: 'Upper Extremity Amputation', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Adjustment to disability', category: 'Mental Health' },

  // ========================================
  // EPILEPSY/SEIZURE DISORDER SECONDARIES
  // ========================================
  { primaryCondition: 'Epilepsy/Seizure Disorder', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Seizures and medications affect mood; living with seizures causes depression', category: 'Mental Health' },
  { primaryCondition: 'Epilepsy/Seizure Disorder', secondaryCondition: 'Anxiety Disorder', medicalConnection: 'Fear of seizures and unpredictability', category: 'Mental Health' },
  { primaryCondition: 'Epilepsy/Seizure Disorder', secondaryCondition: 'Cognitive Impairment', medicalConnection: 'Seizures and medications affect cognition', category: 'Neurological' },
  { primaryCondition: 'Epilepsy/Seizure Disorder', secondaryCondition: 'Memory Problems', medicalConnection: 'Temporal lobe involvement affects memory', category: 'Neurological' },
  { primaryCondition: 'Epilepsy/Seizure Disorder', secondaryCondition: 'Sleep Disorders', medicalConnection: 'Seizures disrupt sleep architecture', category: 'Mental Health' },
  { primaryCondition: 'Epilepsy/Seizure Disorder', secondaryCondition: 'Injuries from Seizures', medicalConnection: 'Falls during seizures cause injuries', category: 'Musculoskeletal' },
  { primaryCondition: 'Epilepsy/Seizure Disorder', secondaryCondition: 'Osteoporosis', medicalConnection: 'Anti-epileptic drugs affect bone density', category: 'Musculoskeletal' },
  { primaryCondition: 'Epilepsy/Seizure Disorder', secondaryCondition: 'Liver Dysfunction', medicalConnection: 'Anti-epileptic medication hepatotoxicity', category: 'Digestive' },

  // ========================================
  // MULTIPLE SCLEROSIS SECONDARIES
  // ========================================
  { primaryCondition: 'Multiple Sclerosis', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'MS directly affects brain mood centers; chronic disease burden', category: 'Mental Health' },
  { primaryCondition: 'Multiple Sclerosis', secondaryCondition: 'Fatigue', medicalConnection: 'Primary MS fatigue from demyelination', category: 'Systemic' },
  { primaryCondition: 'Multiple Sclerosis', secondaryCondition: 'Cognitive Dysfunction', medicalConnection: 'White matter lesions affect cognition', category: 'Neurological' },
  { primaryCondition: 'Multiple Sclerosis', secondaryCondition: 'Bladder Dysfunction', medicalConnection: 'Spinal cord lesions affect bladder control', category: 'Genitourinary' },
  { primaryCondition: 'Multiple Sclerosis', secondaryCondition: 'Bowel Dysfunction', medicalConnection: 'Neurological dysfunction affects bowel', category: 'Digestive' },
  { primaryCondition: 'Multiple Sclerosis', secondaryCondition: 'Sexual Dysfunction', medicalConnection: 'Neurological and psychological factors', category: 'Genitourinary' },
  { primaryCondition: 'Multiple Sclerosis', secondaryCondition: 'Spasticity', medicalConnection: 'Upper motor neuron damage causes spasticity', category: 'Neurological' },
  { primaryCondition: 'Multiple Sclerosis', secondaryCondition: 'Chronic Pain', medicalConnection: 'Neuropathic pain from demyelination', category: 'Neurological' },
  { primaryCondition: 'Multiple Sclerosis', secondaryCondition: 'Optic Neuritis', medicalConnection: 'MS commonly affects optic nerve', category: 'Eyes' },
  { primaryCondition: 'Multiple Sclerosis', secondaryCondition: 'Trigeminal Neuralgia', medicalConnection: 'Demyelination of trigeminal pathway', category: 'Neurological' },
  { primaryCondition: 'Multiple Sclerosis', secondaryCondition: 'Osteoporosis', medicalConnection: 'Immobility and steroids weaken bones', category: 'Musculoskeletal' },
  { primaryCondition: 'Multiple Sclerosis', secondaryCondition: 'Pressure Ulcers', medicalConnection: 'Immobility in advanced MS', category: 'Skin' },

  // ========================================
  // OPIOID DEPENDENCE (from chronic pain treatment) SECONDARIES
  // ========================================
  { primaryCondition: 'Opioid Use Disorder', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Opioids affect brain reward and mood systems', category: 'Mental Health' },
  { primaryCondition: 'Opioid Use Disorder', secondaryCondition: 'Anxiety Disorder', medicalConnection: 'Withdrawal and dependence cause anxiety', category: 'Mental Health' },
  { primaryCondition: 'Opioid Use Disorder', secondaryCondition: 'Constipation', medicalConnection: 'Opioids slow GI motility', category: 'Digestive' },
  { primaryCondition: 'Opioid Use Disorder', secondaryCondition: 'Sleep Apnea', medicalConnection: 'Opioids suppress respiratory drive', category: 'Respiratory' },
  { primaryCondition: 'Opioid Use Disorder', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Opioids suppress testosterone', category: 'Genitourinary' },
  { primaryCondition: 'Opioid Use Disorder', secondaryCondition: 'Hypogonadism', medicalConnection: 'Opioid-induced androgen deficiency', category: 'Endocrine' },
  { primaryCondition: 'Opioid Use Disorder', secondaryCondition: 'Osteoporosis', medicalConnection: 'Hormonal effects and reduced activity', category: 'Musculoskeletal' },
  { primaryCondition: 'Opioid Use Disorder', secondaryCondition: 'Immune Dysfunction', medicalConnection: 'Opioids suppress immune function', category: 'Immune' },

  // ========================================
  // ERECTILE DYSFUNCTION SECONDARIES (as primary)
  // ========================================
  { primaryCondition: 'Erectile Dysfunction', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'ED significantly impacts mental health and relationships', category: 'Mental Health' },
  { primaryCondition: 'Erectile Dysfunction', secondaryCondition: 'Anxiety Disorder', medicalConnection: 'Performance anxiety worsens ED and overall anxiety', category: 'Mental Health' },
  { primaryCondition: 'Erectile Dysfunction', secondaryCondition: 'Relationship Problems', medicalConnection: 'ED strains intimate relationships', category: 'Mental Health' },

  // ========================================
  // CHRONIC FATIGUE SYNDROME SECONDARIES
  // ========================================
  { primaryCondition: 'Chronic Fatigue Syndrome', secondaryCondition: 'Major Depressive Disorder', medicalConnection: 'Chronic illness burden and functional limitations', category: 'Mental Health' },
  { primaryCondition: 'Chronic Fatigue Syndrome', secondaryCondition: 'Fibromyalgia', medicalConnection: 'Overlapping central sensitization syndromes', category: 'Musculoskeletal' },
  { primaryCondition: 'Chronic Fatigue Syndrome', secondaryCondition: 'Orthostatic Intolerance', medicalConnection: 'Autonomic dysfunction common in CFS', category: 'Cardiovascular' },
  { primaryCondition: 'Chronic Fatigue Syndrome', secondaryCondition: 'Sleep Disorders', medicalConnection: 'Non-restorative sleep is core symptom', category: 'Mental Health' },
  { primaryCondition: 'Chronic Fatigue Syndrome', secondaryCondition: 'Cognitive Dysfunction', medicalConnection: 'Brain fog is hallmark symptom', category: 'Neurological' },
  { primaryCondition: 'Chronic Fatigue Syndrome', secondaryCondition: 'IBS', medicalConnection: 'GI dysfunction common in CFS', category: 'Digestive' },
  { primaryCondition: 'Chronic Fatigue Syndrome', secondaryCondition: 'Headaches', medicalConnection: 'Chronic headaches are common symptom', category: 'Neurological' },

  // ========================================
  // ADDITIONAL MUSCULOSKELETAL CHAINS
  // ========================================
  { primaryCondition: 'Achilles Tendonitis', secondaryCondition: 'Plantar Fasciitis', medicalConnection: 'Altered mechanics affect foot', category: 'Musculoskeletal' },
  { primaryCondition: 'Achilles Tendonitis', secondaryCondition: 'Calf Muscle Weakness', medicalConnection: 'Chronic tendon issues cause muscle atrophy', category: 'Musculoskeletal' },
  { primaryCondition: 'Achilles Tendonitis', secondaryCondition: 'Knee Condition', medicalConnection: 'Compensation affects kinetic chain', category: 'Musculoskeletal' },
  { primaryCondition: 'Rotator Cuff Tear', secondaryCondition: 'Frozen Shoulder', medicalConnection: 'Immobility after injury causes capsulitis', category: 'Musculoskeletal' },
  { primaryCondition: 'Rotator Cuff Tear', secondaryCondition: 'Cervical Radiculopathy', medicalConnection: 'Compensatory posture affects neck', category: 'Neurological' },
  { primaryCondition: 'Rotator Cuff Tear', secondaryCondition: 'Shoulder Arthritis', medicalConnection: 'Chronic dysfunction leads to degenerative changes', category: 'Musculoskeletal' },
  { primaryCondition: 'Carpal Tunnel Syndrome', secondaryCondition: 'Cubital Tunnel Syndrome', medicalConnection: 'Compensatory hand positioning affects ulnar nerve', category: 'Neurological' },
  { primaryCondition: 'Carpal Tunnel Syndrome', secondaryCondition: 'Wrist Arthritis', medicalConnection: 'Underlying joint dysfunction', category: 'Musculoskeletal' },
  { primaryCondition: 'Carpal Tunnel Syndrome', secondaryCondition: 'Shoulder Pain', medicalConnection: 'Altered arm use patterns', category: 'Musculoskeletal' },
  { primaryCondition: 'Tennis Elbow (Lateral Epicondylitis)', secondaryCondition: 'Wrist Condition', medicalConnection: 'Gripping compensation affects wrist', category: 'Musculoskeletal' },
  { primaryCondition: 'Tennis Elbow (Lateral Epicondylitis)', secondaryCondition: 'Shoulder Condition', medicalConnection: 'Altered arm mechanics', category: 'Musculoskeletal' },
  { primaryCondition: 'Golfers Elbow (Medial Epicondylitis)', secondaryCondition: 'Cubital Tunnel Syndrome', medicalConnection: 'Inflammation near ulnar nerve', category: 'Neurological' },

  // ========================================
  // SCAR TISSUE SECONDARIES
  // ========================================
  { primaryCondition: 'Painful Scars', secondaryCondition: 'Chronic Pain Syndrome', medicalConnection: 'Scar tissue can cause persistent pain', category: 'Neurological' },
  { primaryCondition: 'Painful Scars', secondaryCondition: 'Limited Range of Motion', medicalConnection: 'Scar contracture restricts movement', category: 'Musculoskeletal' },
  { primaryCondition: 'Painful Scars', secondaryCondition: 'Depression', medicalConnection: 'Disfiguring scars affect self-image', category: 'Mental Health' },
  { primaryCondition: 'Burn Scars', secondaryCondition: 'Skin Cancer', medicalConnection: 'Chronic wounds increase cancer risk', category: 'Skin' },
  { primaryCondition: 'Burn Scars', secondaryCondition: 'Joint Contracture', medicalConnection: 'Severe scars limit joint mobility', category: 'Musculoskeletal' },
  { primaryCondition: 'Burn Scars', secondaryCondition: 'Peripheral Neuropathy', medicalConnection: 'Nerve damage from burns', category: 'Neurological' },
];

// Extract unique categories for filtering
export const secondaryCategories = [...new Set(secondaryConditions.map(c => c.category))].sort();

// Extract unique primary conditions for filtering
export const primaryConditionsList = [...new Set(secondaryConditions.map(c => c.primaryCondition))].sort();

// Helper function to get secondaries for a specific primary
export const getSecondariesForPrimary = (primaryCondition: string): SecondaryConnection[] => {
  return secondaryConditions.filter(c => 
    c.primaryCondition.toLowerCase().includes(primaryCondition.toLowerCase())
  );
};

// Helper function to search connections
export const searchSecondaryConnections = (searchTerm: string): SecondaryConnection[] => {
  const lower = searchTerm.toLowerCase();
  return secondaryConditions.filter(c =>
    c.primaryCondition.toLowerCase().includes(lower) ||
    c.secondaryCondition.toLowerCase().includes(lower) ||
    c.medicalConnection.toLowerCase().includes(lower) ||
    c.category.toLowerCase().includes(lower)
  );
};
