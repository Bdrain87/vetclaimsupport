// Common military and VA-prescribed medications
export interface MedicationOption {
  name: string;
  category: string;
  commonlyPrescribedFor: string;
}

export const commonMedications: MedicationOption[] = [
  // Pain Medications
  { name: 'Ibuprofen 800mg (Motrin)', category: 'Pain', commonlyPrescribedFor: 'Pain, inflammation, headaches' },
  { name: 'Naproxen 500mg (Aleve)', category: 'Pain', commonlyPrescribedFor: 'Pain, inflammation, arthritis' },
  { name: 'Meloxicam 15mg (Mobic)', category: 'Pain', commonlyPrescribedFor: 'Arthritis, joint pain, inflammation' },
  { name: 'Tramadol 50mg (Ultram)', category: 'Pain', commonlyPrescribedFor: 'Moderate to severe pain' },
  { name: 'Gabapentin (Neurontin)', category: 'Pain', commonlyPrescribedFor: 'Nerve pain, neuropathy, seizures' },
  { name: 'Diclofenac (Voltaren)', category: 'Pain', commonlyPrescribedFor: 'Arthritis, muscle pain, inflammation' },
  { name: 'Acetaminophen 500mg (Tylenol)', category: 'Pain', commonlyPrescribedFor: 'Pain, fever, headaches' },
  { name: 'Celecoxib (Celebrex)', category: 'Pain', commonlyPrescribedFor: 'Arthritis, pain, inflammation' },
  
  // Mental Health - Antidepressants
  { name: 'Sertraline 50mg (Zoloft)', category: 'Mental Health', commonlyPrescribedFor: 'Depression, anxiety, PTSD' },
  { name: 'Fluoxetine 20mg (Prozac)', category: 'Mental Health', commonlyPrescribedFor: 'Depression, anxiety, OCD' },
  { name: 'Citalopram (Celexa)', category: 'Mental Health', commonlyPrescribedFor: 'Depression, anxiety' },
  { name: 'Escitalopram (Lexapro)', category: 'Mental Health', commonlyPrescribedFor: 'Depression, generalized anxiety' },
  { name: 'Duloxetine (Cymbalta)', category: 'Mental Health', commonlyPrescribedFor: 'Depression, anxiety, nerve pain' },
  { name: 'Venlafaxine (Effexor)', category: 'Mental Health', commonlyPrescribedFor: 'Depression, anxiety, panic disorder' },
  { name: 'Bupropion (Wellbutrin)', category: 'Mental Health', commonlyPrescribedFor: 'Depression, smoking cessation' },
  { name: 'Mirtazapine (Remeron)', category: 'Mental Health', commonlyPrescribedFor: 'Depression, insomnia, appetite' },
  
  // Mental Health - Anti-anxiety
  { name: 'Buspirone (Buspar)', category: 'Mental Health', commonlyPrescribedFor: 'Anxiety, tension' },
  { name: 'Hydroxyzine (Vistaril)', category: 'Mental Health', commonlyPrescribedFor: 'Anxiety, itching, sleep' },
  { name: 'Lorazepam (Ativan)', category: 'Mental Health', commonlyPrescribedFor: 'Anxiety, panic attacks, insomnia' },
  { name: 'Clonazepam (Klonopin)', category: 'Mental Health', commonlyPrescribedFor: 'Anxiety, panic disorder, seizures' },
  
  // Mental Health - PTSD specific
  { name: 'Prazosin (Minipress)', category: 'Mental Health', commonlyPrescribedFor: 'PTSD nightmares, high blood pressure' },
  { name: 'Propranolol (Inderal)', category: 'Mental Health', commonlyPrescribedFor: 'Anxiety, tremors, PTSD symptoms' },
  
  // Sleep Aids
  { name: 'Trazodone 50mg (Desyrel)', category: 'Sleep', commonlyPrescribedFor: 'Insomnia, depression' },
  { name: 'Zolpidem 10mg (Ambien)', category: 'Sleep', commonlyPrescribedFor: 'Insomnia, sleep initiation' },
  { name: 'Eszopiclone (Lunesta)', category: 'Sleep', commonlyPrescribedFor: 'Insomnia' },
  { name: 'Melatonin', category: 'Sleep', commonlyPrescribedFor: 'Sleep regulation, jet lag' },
  { name: 'Diphenhydramine (Benadryl)', category: 'Sleep', commonlyPrescribedFor: 'Allergies, sleep aid' },
  { name: 'Doxepin (Silenor)', category: 'Sleep', commonlyPrescribedFor: 'Insomnia, sleep maintenance' },
  
  // Muscle Relaxants
  { name: 'Cyclobenzaprine 10mg (Flexeril)', category: 'Muscle Relaxant', commonlyPrescribedFor: 'Muscle spasms, back pain' },
  { name: 'Methocarbamol 750mg (Robaxin)', category: 'Muscle Relaxant', commonlyPrescribedFor: 'Muscle spasms, pain' },
  { name: 'Tizanidine (Zanaflex)', category: 'Muscle Relaxant', commonlyPrescribedFor: 'Muscle spasticity, spasms' },
  { name: 'Baclofen', category: 'Muscle Relaxant', commonlyPrescribedFor: 'Muscle spasticity, MS, spinal cord injury' },
  { name: 'Carisoprodol (Soma)', category: 'Muscle Relaxant', commonlyPrescribedFor: 'Acute muscle pain' },
  
  // GI Medications
  { name: 'Omeprazole 20mg (Prilosec)', category: 'GI', commonlyPrescribedFor: 'GERD, heartburn, ulcers' },
  { name: 'Famotidine 20mg (Pepcid)', category: 'GI', commonlyPrescribedFor: 'Heartburn, GERD, ulcers' },
  { name: 'Pantoprazole (Protonix)', category: 'GI', commonlyPrescribedFor: 'GERD, erosive esophagitis' },
  { name: 'Ranitidine (Zantac)', category: 'GI', commonlyPrescribedFor: 'Heartburn, ulcers' },
  { name: 'Ondansetron (Zofran)', category: 'GI', commonlyPrescribedFor: 'Nausea, vomiting' },
  { name: 'Dicyclomine (Bentyl)', category: 'GI', commonlyPrescribedFor: 'IBS, stomach cramps' },
  { name: 'Sucralfate (Carafate)', category: 'GI', commonlyPrescribedFor: 'Ulcers, GERD' },
  
  // Blood Pressure / Heart
  { name: 'Lisinopril (Zestril)', category: 'Blood Pressure', commonlyPrescribedFor: 'High blood pressure, heart failure' },
  { name: 'Amlodipine (Norvasc)', category: 'Blood Pressure', commonlyPrescribedFor: 'High blood pressure, angina' },
  { name: 'Metoprolol (Lopressor)', category: 'Blood Pressure', commonlyPrescribedFor: 'High blood pressure, heart rate' },
  { name: 'Losartan (Cozaar)', category: 'Blood Pressure', commonlyPrescribedFor: 'High blood pressure, kidney protection' },
  { name: 'Hydrochlorothiazide (HCTZ)', category: 'Blood Pressure', commonlyPrescribedFor: 'High blood pressure, fluid retention' },
  
  // Diabetes
  { name: 'Metformin (Glucophage)', category: 'Diabetes', commonlyPrescribedFor: 'Type 2 diabetes, blood sugar control' },
  { name: 'Glipizide (Glucotrol)', category: 'Diabetes', commonlyPrescribedFor: 'Type 2 diabetes' },
  { name: 'Insulin (various)', category: 'Diabetes', commonlyPrescribedFor: 'Diabetes, blood sugar control' },
  
  // Cholesterol
  { name: 'Atorvastatin (Lipitor)', category: 'Cholesterol', commonlyPrescribedFor: 'High cholesterol, heart disease prevention' },
  { name: 'Simvastatin (Zocor)', category: 'Cholesterol', commonlyPrescribedFor: 'High cholesterol' },
  { name: 'Rosuvastatin (Crestor)', category: 'Cholesterol', commonlyPrescribedFor: 'High cholesterol, heart disease' },
  
  // Allergy / Respiratory
  { name: 'Cetirizine (Zyrtec)', category: 'Allergy', commonlyPrescribedFor: 'Allergies, hay fever, hives' },
  { name: 'Loratadine (Claritin)', category: 'Allergy', commonlyPrescribedFor: 'Allergies, hay fever' },
  { name: 'Montelukast (Singulair)', category: 'Allergy', commonlyPrescribedFor: 'Asthma, allergies' },
  { name: 'Albuterol Inhaler (ProAir)', category: 'Respiratory', commonlyPrescribedFor: 'Asthma, COPD, breathing problems' },
  { name: 'Fluticasone (Flonase)', category: 'Allergy', commonlyPrescribedFor: 'Nasal congestion, allergies' },
  
  // Topical / Skin
  { name: 'Triamcinolone Cream', category: 'Topical', commonlyPrescribedFor: 'Skin inflammation, eczema, rashes' },
  { name: 'Hydrocortisone Cream', category: 'Topical', commonlyPrescribedFor: 'Skin irritation, itching, rashes' },
  { name: 'Lidocaine Patches', category: 'Topical', commonlyPrescribedFor: 'Localized pain, nerve pain' },
  
  // Migraine
  { name: 'Sumatriptan (Imitrex)', category: 'Migraine', commonlyPrescribedFor: 'Migraines, cluster headaches' },
  { name: 'Topiramate (Topamax)', category: 'Migraine', commonlyPrescribedFor: 'Migraine prevention, seizures' },
  { name: 'Rizatriptan (Maxalt)', category: 'Migraine', commonlyPrescribedFor: 'Migraines' },
];

export const medicationCategories = [
  'Pain',
  'Mental Health', 
  'Sleep',
  'Muscle Relaxant',
  'GI',
  'Blood Pressure',
  'Diabetes',
  'Cholesterol',
  'Allergy',
  'Respiratory',
  'Topical',
  'Migraine',
] as const;

export function searchMedications(query: string): MedicationOption[] {
  if (!query.trim()) return commonMedications;
  
  const lowerQuery = query.toLowerCase();
  return commonMedications.filter(med => 
    med.name.toLowerCase().includes(lowerQuery) ||
    med.category.toLowerCase().includes(lowerQuery) ||
    med.commonlyPrescribedFor.toLowerCase().includes(lowerQuery)
  );
}
