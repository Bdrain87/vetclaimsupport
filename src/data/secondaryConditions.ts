// Comprehensive list of secondary condition relationships

export interface SecondaryConnection {
  primaryCondition: string;
  secondaryCondition: string;
  medicalConnection: string;
  category: string;
}

export const secondaryConditions: SecondaryConnection[] = [
  // PTSD Related
  { primaryCondition: 'PTSD', secondaryCondition: 'Major Depression', medicalConnection: 'PTSD commonly causes persistent depressive symptoms due to emotional dysregulation and trauma', category: 'Mental Health' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Generalized Anxiety Disorder', medicalConnection: 'Hypervigilance and trauma response lead to chronic anxiety', category: 'Mental Health' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Sleep Apnea', medicalConnection: 'Weight gain from medications and reduced activity; stress hormones affect breathing patterns', category: 'Respiratory' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Insomnia', medicalConnection: 'Hyperarousal, nightmares, and hypervigilance disrupt sleep architecture', category: 'Mental Health' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Migraines', medicalConnection: 'Chronic stress, muscle tension, and sleep disruption trigger migraines', category: 'Neurological' },
  { primaryCondition: 'PTSD', secondaryCondition: 'GERD', medicalConnection: 'Stress increases stomach acid production; medications may contribute', category: 'Digestive' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Psychological impact, medications (SSRIs), and reduced blood flow from stress', category: 'Genitourinary' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Hypertension', medicalConnection: 'Chronic stress elevates cortisol and adrenaline, raising blood pressure', category: 'Cardiovascular' },
  { primaryCondition: 'PTSD', secondaryCondition: 'IBS', medicalConnection: 'Gut-brain axis dysfunction from chronic stress', category: 'Digestive' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Substance Abuse Disorder', medicalConnection: 'Self-medication for symptoms is common', category: 'Mental Health' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Panic Disorder', medicalConnection: 'Trauma triggers can cause panic attacks', category: 'Mental Health' },
  { primaryCondition: 'PTSD', secondaryCondition: 'Bruxism (Teeth Grinding)', medicalConnection: 'Stress and anxiety cause jaw clenching and grinding', category: 'Dental' },

  // Sleep Apnea Related
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Hypertension', medicalConnection: 'Intermittent hypoxia activates sympathetic nervous system, raising BP', category: 'Cardiovascular' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Heart Disease', medicalConnection: 'Oxygen deprivation stresses cardiovascular system', category: 'Cardiovascular' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Atrial Fibrillation', medicalConnection: 'Hypoxia and pressure changes affect heart rhythm', category: 'Cardiovascular' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Stroke', medicalConnection: 'Increased risk due to blood pressure spikes and hypoxia', category: 'Cardiovascular' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Depression', medicalConnection: 'Poor sleep quality and oxygen deprivation affect mood', category: 'Mental Health' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'GERD', medicalConnection: 'Negative pressure during apneas pulls stomach acid up', category: 'Digestive' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Diabetes Type II', medicalConnection: 'Sleep disruption affects insulin sensitivity', category: 'Endocrine' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Cognitive Impairment', medicalConnection: 'Chronic oxygen deprivation affects brain function', category: 'Neurological' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Reduced oxygen and hormonal changes', category: 'Genitourinary' },
  { primaryCondition: 'Sleep Apnea', secondaryCondition: 'Weight Gain', medicalConnection: 'Poor sleep affects metabolism and hunger hormones', category: 'Endocrine' },

  // Tinnitus Related
  { primaryCondition: 'Tinnitus', secondaryCondition: 'Anxiety', medicalConnection: 'Constant ringing causes psychological distress', category: 'Mental Health' },
  { primaryCondition: 'Tinnitus', secondaryCondition: 'Depression', medicalConnection: 'Chronic tinnitus significantly impacts quality of life', category: 'Mental Health' },
  { primaryCondition: 'Tinnitus', secondaryCondition: 'Insomnia', medicalConnection: 'Ringing interferes with ability to fall asleep', category: 'Mental Health' },
  { primaryCondition: 'Tinnitus', secondaryCondition: 'Migraines', medicalConnection: 'Shared auditory and neurological pathways', category: 'Neurological' },
  { primaryCondition: 'Tinnitus', secondaryCondition: 'Vertigo', medicalConnection: 'Often co-occur due to inner ear damage', category: 'Neurological' },

  // Back Conditions Related
  { primaryCondition: 'Lower Back Pain (DDD)', secondaryCondition: 'Radiculopathy', medicalConnection: 'Disc degeneration compresses nerve roots', category: 'Neurological' },
  { primaryCondition: 'Lower Back Pain (DDD)', secondaryCondition: 'Sciatica', medicalConnection: 'Disc herniation or stenosis impinges sciatic nerve', category: 'Neurological' },
  { primaryCondition: 'Lower Back Pain (DDD)', secondaryCondition: 'Hip Condition', medicalConnection: 'Altered gait and mechanics stress hip joint', category: 'Musculoskeletal' },
  { primaryCondition: 'Lower Back Pain (DDD)', secondaryCondition: 'Knee Condition', medicalConnection: 'Compensatory movement patterns stress knees', category: 'Musculoskeletal' },
  { primaryCondition: 'Lower Back Pain (DDD)', secondaryCondition: 'Depression', medicalConnection: 'Chronic pain frequently causes depression', category: 'Mental Health' },
  { primaryCondition: 'Lower Back Pain (DDD)', secondaryCondition: 'Sleep Disturbance', medicalConnection: 'Pain interferes with sleep quality', category: 'Mental Health' },
  { primaryCondition: 'Lower Back Pain (DDD)', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Nerve damage and medications can cause ED', category: 'Genitourinary' },
  { primaryCondition: 'Lower Back Pain (DDD)', secondaryCondition: 'Urinary Incontinence', medicalConnection: 'Nerve compression can affect bladder control', category: 'Genitourinary' },
  { primaryCondition: 'Lower Back Pain (DDD)', secondaryCondition: 'Obesity', medicalConnection: 'Reduced mobility leads to weight gain', category: 'Endocrine' },

  // Cervical Spine Related
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Cervical Radiculopathy', medicalConnection: 'Disc degeneration compresses cervical nerve roots', category: 'Neurological' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Migraines', medicalConnection: 'Cervical dysfunction triggers cervicogenic headaches', category: 'Neurological' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Thoracic Outlet Syndrome', medicalConnection: 'Postural changes compress nerves/vessels', category: 'Neurological' },
  { primaryCondition: 'Cervical Spine DDD', secondaryCondition: 'Shoulder Condition', medicalConnection: 'Referred pain and compensatory movement', category: 'Musculoskeletal' },

  // Knee Conditions Related
  { primaryCondition: 'Knee Condition', secondaryCondition: 'Hip Condition', medicalConnection: 'Altered gait stresses hip joint', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition', secondaryCondition: 'Lower Back Pain', medicalConnection: 'Compensatory gait patterns stress spine', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition', secondaryCondition: 'Opposite Knee Condition', medicalConnection: 'Favoring one knee overloads the other', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition', secondaryCondition: 'Ankle Condition', medicalConnection: 'Altered gait affects ankle mechanics', category: 'Musculoskeletal' },
  { primaryCondition: 'Knee Condition', secondaryCondition: 'Depression', medicalConnection: 'Chronic pain and mobility limitations', category: 'Mental Health' },
  { primaryCondition: 'Knee Condition', secondaryCondition: 'Weight Gain', medicalConnection: 'Reduced physical activity from pain', category: 'Endocrine' },

  // Diabetes Related
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Peripheral Neuropathy', medicalConnection: 'High blood sugar damages peripheral nerves', category: 'Neurological' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Hypertension', medicalConnection: 'Insulin resistance affects blood vessels', category: 'Cardiovascular' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Coronary Artery Disease', medicalConnection: 'Accelerated atherosclerosis from metabolic dysfunction', category: 'Cardiovascular' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Kidney Disease', medicalConnection: 'High blood sugar damages kidney blood vessels', category: 'Genitourinary' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Diabetic Retinopathy', medicalConnection: 'Microvascular damage to retinal blood vessels', category: 'Eyes' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Nerve and blood vessel damage', category: 'Genitourinary' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Gastroparesis', medicalConnection: 'Diabetic nerve damage affects stomach motility', category: 'Digestive' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Foot Ulcers', medicalConnection: 'Neuropathy and poor circulation', category: 'Skin' },
  { primaryCondition: 'Diabetes Type II', secondaryCondition: 'Depression', medicalConnection: 'Chronic disease management burden', category: 'Mental Health' },

  // Migraine Related
  { primaryCondition: 'Migraines', secondaryCondition: 'Depression', medicalConnection: 'Chronic pain and disability cause depression', category: 'Mental Health' },
  { primaryCondition: 'Migraines', secondaryCondition: 'Anxiety', medicalConnection: 'Fear of migraine attacks causes anticipatory anxiety', category: 'Mental Health' },
  { primaryCondition: 'Migraines', secondaryCondition: 'GERD', medicalConnection: 'Pain medications cause gastric irritation', category: 'Digestive' },
  { primaryCondition: 'Migraines', secondaryCondition: 'Insomnia', medicalConnection: 'Pain disrupts sleep; poor sleep triggers migraines', category: 'Mental Health' },
  { primaryCondition: 'Migraines', secondaryCondition: 'Neck Pain', medicalConnection: 'Muscle tension during and after migraines', category: 'Musculoskeletal' },

  // TBI Related
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'PTSD', medicalConnection: 'Trauma from incident and cognitive changes', category: 'Mental Health' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Migraines', medicalConnection: 'Brain injury commonly causes chronic headaches', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Depression', medicalConnection: 'Brain chemistry changes and coping with disability', category: 'Mental Health' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Cognitive Impairment', medicalConnection: 'Direct brain damage affects cognition', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Sleep Apnea', medicalConnection: 'Brainstem damage affects breathing regulation', category: 'Respiratory' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Tinnitus', medicalConnection: 'Auditory pathway damage from head trauma', category: 'Ears' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Vertigo', medicalConnection: 'Vestibular system damage from head trauma', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Seizure Disorder', medicalConnection: 'Brain injury increases seizure risk', category: 'Neurological' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Vision Problems', medicalConnection: 'Optic nerve or visual cortex damage', category: 'Eyes' },
  { primaryCondition: 'TBI (Traumatic Brain Injury)', secondaryCondition: 'Hormonal Dysfunction', medicalConnection: 'Pituitary damage affects hormone production', category: 'Endocrine' },

  // Hypertension Related
  { primaryCondition: 'Hypertension', secondaryCondition: 'Coronary Artery Disease', medicalConnection: 'High BP damages arterial walls', category: 'Cardiovascular' },
  { primaryCondition: 'Hypertension', secondaryCondition: 'Stroke', medicalConnection: 'Increased risk of blood vessel rupture/blockage', category: 'Cardiovascular' },
  { primaryCondition: 'Hypertension', secondaryCondition: 'Kidney Disease', medicalConnection: 'High BP damages kidney blood vessels', category: 'Genitourinary' },
  { primaryCondition: 'Hypertension', secondaryCondition: 'Heart Failure', medicalConnection: 'Heart works harder against high resistance', category: 'Cardiovascular' },
  { primaryCondition: 'Hypertension', secondaryCondition: 'Retinopathy', medicalConnection: 'High BP damages retinal blood vessels', category: 'Eyes' },
  { primaryCondition: 'Hypertension', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Blood vessel damage and medications', category: 'Genitourinary' },

  // Shoulder Related
  { primaryCondition: 'Shoulder Condition', secondaryCondition: 'Neck Pain', medicalConnection: 'Compensatory movement and muscle guarding', category: 'Musculoskeletal' },
  { primaryCondition: 'Shoulder Condition', secondaryCondition: 'Thoracic Outlet Syndrome', medicalConnection: 'Altered shoulder mechanics compress nerves', category: 'Neurological' },
  { primaryCondition: 'Shoulder Condition', secondaryCondition: 'Opposite Shoulder Condition', medicalConnection: 'Overcompensation with other arm', category: 'Musculoskeletal' },
  { primaryCondition: 'Shoulder Condition', secondaryCondition: 'Depression', medicalConnection: 'Chronic pain and functional limitations', category: 'Mental Health' },

  // Flat Feet Related
  { primaryCondition: 'Flat Feet (Pes Planus)', secondaryCondition: 'Plantar Fasciitis', medicalConnection: 'Abnormal arch mechanics strain plantar fascia', category: 'Musculoskeletal' },
  { primaryCondition: 'Flat Feet (Pes Planus)', secondaryCondition: 'Knee Pain', medicalConnection: 'Altered lower limb alignment', category: 'Musculoskeletal' },
  { primaryCondition: 'Flat Feet (Pes Planus)', secondaryCondition: 'Hip Pain', medicalConnection: 'Biomechanical chain affects hips', category: 'Musculoskeletal' },
  { primaryCondition: 'Flat Feet (Pes Planus)', secondaryCondition: 'Lower Back Pain', medicalConnection: 'Postural changes from foot dysfunction', category: 'Musculoskeletal' },
  { primaryCondition: 'Flat Feet (Pes Planus)', secondaryCondition: 'Achilles Tendonitis', medicalConnection: 'Altered mechanics stress Achilles', category: 'Musculoskeletal' },

  // Sinusitis Related
  { primaryCondition: 'Chronic Sinusitis', secondaryCondition: 'Sleep Apnea', medicalConnection: 'Nasal obstruction worsens airway resistance', category: 'Respiratory' },
  { primaryCondition: 'Chronic Sinusitis', secondaryCondition: 'Migraines', medicalConnection: 'Sinus inflammation can trigger headaches', category: 'Neurological' },
  { primaryCondition: 'Chronic Sinusitis', secondaryCondition: 'Asthma', medicalConnection: 'United airways disease - inflammation affects both', category: 'Respiratory' },
  { primaryCondition: 'Chronic Sinusitis', secondaryCondition: 'Bronchitis', medicalConnection: 'Post-nasal drip irritates bronchi', category: 'Respiratory' },

  // Asthma Related
  { primaryCondition: 'Asthma', secondaryCondition: 'GERD', medicalConnection: 'Asthma medications and coughing worsen reflux', category: 'Digestive' },
  { primaryCondition: 'Asthma', secondaryCondition: 'Sleep Apnea', medicalConnection: 'Airway inflammation affects nighttime breathing', category: 'Respiratory' },
  { primaryCondition: 'Asthma', secondaryCondition: 'Sinusitis', medicalConnection: 'United airways disease', category: 'Respiratory' },
  { primaryCondition: 'Asthma', secondaryCondition: 'Anxiety', medicalConnection: 'Fear of attacks and breathing difficulties', category: 'Mental Health' },
  { primaryCondition: 'Asthma', secondaryCondition: 'Depression', medicalConnection: 'Chronic disease burden and limitations', category: 'Mental Health' },

  // GERD Related
  { primaryCondition: 'GERD', secondaryCondition: 'Asthma', medicalConnection: 'Acid aspiration irritates airways', category: 'Respiratory' },
  { primaryCondition: 'GERD', secondaryCondition: 'Chronic Cough', medicalConnection: 'Acid irritation triggers cough reflex', category: 'Respiratory' },
  { primaryCondition: 'GERD', secondaryCondition: 'Dental Erosion', medicalConnection: 'Stomach acid damages tooth enamel', category: 'Dental' },
  { primaryCondition: 'GERD', secondaryCondition: 'Sleep Disturbance', medicalConnection: 'Nighttime reflux disrupts sleep', category: 'Mental Health' },
  { primaryCondition: 'GERD', secondaryCondition: 'Barrett\'s Esophagus', medicalConnection: 'Chronic acid exposure changes esophageal lining', category: 'Digestive' },
  { primaryCondition: 'GERD', secondaryCondition: 'Esophageal Stricture', medicalConnection: 'Chronic inflammation causes scarring', category: 'Digestive' },

  // Depression Related
  { primaryCondition: 'Major Depression', secondaryCondition: 'Anxiety', medicalConnection: 'Depression and anxiety commonly co-occur', category: 'Mental Health' },
  { primaryCondition: 'Major Depression', secondaryCondition: 'Insomnia', medicalConnection: 'Neurotransmitter imbalances disrupt sleep', category: 'Mental Health' },
  { primaryCondition: 'Major Depression', secondaryCondition: 'Chronic Pain Syndrome', medicalConnection: 'Depression lowers pain threshold', category: 'Neurological' },
  { primaryCondition: 'Major Depression', secondaryCondition: 'Weight Changes', medicalConnection: 'Appetite dysregulation from depression', category: 'Endocrine' },
  { primaryCondition: 'Major Depression', secondaryCondition: 'Erectile Dysfunction', medicalConnection: 'Depression and SSRI medications affect sexual function', category: 'Genitourinary' },
  { primaryCondition: 'Major Depression', secondaryCondition: 'Migraines', medicalConnection: 'Shared serotonin pathways', category: 'Neurological' },

  // Fibromyalgia Related
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'Depression', medicalConnection: 'Chronic pain causes depression', category: 'Mental Health' },
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'Anxiety', medicalConnection: 'Chronic unpredictable pain causes anxiety', category: 'Mental Health' },
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'Sleep Disturbance', medicalConnection: 'Pain interrupts restorative sleep', category: 'Mental Health' },
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'IBS', medicalConnection: 'Central sensitization affects gut function', category: 'Digestive' },
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'Migraines', medicalConnection: 'Central sensitization and shared pathways', category: 'Neurological' },
  { primaryCondition: 'Fibromyalgia', secondaryCondition: 'Chronic Fatigue', medicalConnection: 'Non-restorative sleep and pain', category: 'Neurological' },

  // Peripheral Neuropathy Related
  { primaryCondition: 'Peripheral Neuropathy', secondaryCondition: 'Falls/Injury', medicalConnection: 'Balance impairment from sensory loss', category: 'Neurological' },
  { primaryCondition: 'Peripheral Neuropathy', secondaryCondition: 'Depression', medicalConnection: 'Chronic pain and disability', category: 'Mental Health' },
  { primaryCondition: 'Peripheral Neuropathy', secondaryCondition: 'Sleep Disturbance', medicalConnection: 'Nighttime pain worsens', category: 'Mental Health' },
  { primaryCondition: 'Peripheral Neuropathy', secondaryCondition: 'Skin Ulcers', medicalConnection: 'Loss of protective sensation', category: 'Skin' },

  // Hearing Loss Related
  { primaryCondition: 'Hearing Loss', secondaryCondition: 'Tinnitus', medicalConnection: 'Same noise exposure causes both', category: 'Ears' },
  { primaryCondition: 'Hearing Loss', secondaryCondition: 'Depression', medicalConnection: 'Social isolation from communication difficulties', category: 'Mental Health' },
  { primaryCondition: 'Hearing Loss', secondaryCondition: 'Anxiety', medicalConnection: 'Difficulty in social situations', category: 'Mental Health' },
  { primaryCondition: 'Hearing Loss', secondaryCondition: 'Cognitive Decline', medicalConnection: 'Reduced auditory stimulation affects brain', category: 'Neurological' },

  // Plantar Fasciitis Related
  { primaryCondition: 'Plantar Fasciitis', secondaryCondition: 'Hip Pain', medicalConnection: 'Altered gait to avoid foot pain', category: 'Musculoskeletal' },
  { primaryCondition: 'Plantar Fasciitis', secondaryCondition: 'Lower Back Pain', medicalConnection: 'Compensatory posture and gait changes', category: 'Musculoskeletal' },
  { primaryCondition: 'Plantar Fasciitis', secondaryCondition: 'Knee Pain', medicalConnection: 'Biomechanical chain reaction', category: 'Musculoskeletal' },
  { primaryCondition: 'Plantar Fasciitis', secondaryCondition: 'Achilles Tendonitis', medicalConnection: 'Connected tissue structures', category: 'Musculoskeletal' },

  // Hip Condition Related
  { primaryCondition: 'Hip Condition', secondaryCondition: 'Lower Back Pain', medicalConnection: 'Altered gait and hip-spine connection', category: 'Musculoskeletal' },
  { primaryCondition: 'Hip Condition', secondaryCondition: 'Opposite Hip Condition', medicalConnection: 'Overcompensation for painful hip', category: 'Musculoskeletal' },
  { primaryCondition: 'Hip Condition', secondaryCondition: 'Knee Condition', medicalConnection: 'Biomechanical chain effects', category: 'Musculoskeletal' },
  { primaryCondition: 'Hip Condition', secondaryCondition: 'Radiculopathy', medicalConnection: 'Referred pain patterns mimic nerve issues', category: 'Neurological' },

  // Medication-Related Secondaries
  { primaryCondition: 'NSAIDs Use (Chronic)', secondaryCondition: 'GERD', medicalConnection: 'NSAIDs reduce gastric mucosal protection', category: 'Digestive' },
  { primaryCondition: 'NSAIDs Use (Chronic)', secondaryCondition: 'Peptic Ulcer Disease', medicalConnection: 'Direct gastric irritation', category: 'Digestive' },
  { primaryCondition: 'NSAIDs Use (Chronic)', secondaryCondition: 'Kidney Disease', medicalConnection: 'Chronic use affects kidney function', category: 'Genitourinary' },
  { primaryCondition: 'NSAIDs Use (Chronic)', secondaryCondition: 'Hypertension', medicalConnection: 'NSAIDs cause sodium retention', category: 'Cardiovascular' },
  { primaryCondition: 'Opioid Use (Chronic)', secondaryCondition: 'Constipation', medicalConnection: 'Opioids slow gut motility', category: 'Digestive' },
  { primaryCondition: 'Opioid Use (Chronic)', secondaryCondition: 'Hypogonadism', medicalConnection: 'Opioids suppress hormone production', category: 'Endocrine' },
  { primaryCondition: 'Steroid Use (Chronic)', secondaryCondition: 'Osteoporosis', medicalConnection: 'Steroids reduce bone density', category: 'Musculoskeletal' },
  { primaryCondition: 'Steroid Use (Chronic)', secondaryCondition: 'Diabetes', medicalConnection: 'Steroids affect glucose metabolism', category: 'Endocrine' },
  { primaryCondition: 'Steroid Use (Chronic)', secondaryCondition: 'Cataracts', medicalConnection: 'Steroids accelerate lens clouding', category: 'Eyes' },
  { primaryCondition: 'Steroid Use (Chronic)', secondaryCondition: 'Hypertension', medicalConnection: 'Steroids cause fluid retention', category: 'Cardiovascular' },
];

// Get unique categories for filtering
export const secondaryCategories = [...new Set(secondaryConditions.map(c => c.category))].sort();

// Get unique primary conditions
export const primaryConditionsList = [...new Set(secondaryConditions.map(c => c.primaryCondition))].sort();
