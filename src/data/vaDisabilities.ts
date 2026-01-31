// Comprehensive list of VA-rated disabilities organized by body system

export interface VADisability {
  name: string;
  typicalRatings: string;
  description: string;
}

export interface BodySystem {
  name: string;
  icon: string;
  conditions: VADisability[];
}

export const vaDisabilitiesBySystem: BodySystem[] = [
  {
    name: 'Spine & Back',
    icon: 'spine',
    conditions: [
      { name: 'Lumbosacral Strain', typicalRatings: '10-40%', description: 'Lower back muscle/ligament injury' },
      { name: 'Degenerative Disc Disease (Lumbar)', typicalRatings: '10-60%', description: 'Disc deterioration in lower spine' },
      { name: 'Degenerative Disc Disease (Cervical)', typicalRatings: '10-60%', description: 'Disc deterioration in neck' },
      { name: 'Herniated Disc (Lumbar)', typicalRatings: '10-60%', description: 'Ruptured disc in lower back' },
      { name: 'Herniated Disc (Cervical)', typicalRatings: '10-60%', description: 'Ruptured disc in neck' },
      { name: 'Spinal Stenosis', typicalRatings: '20-60%', description: 'Narrowing of spinal canal' },
      { name: 'Spondylolisthesis', typicalRatings: '10-40%', description: 'Vertebra slippage' },
      { name: 'Spondylosis', typicalRatings: '10-40%', description: 'Spinal arthritis/degeneration' },
      { name: 'Cervicalgia', typicalRatings: '10-30%', description: 'Chronic neck pain' },
      { name: 'Thoracolumbar Strain', typicalRatings: '10-40%', description: 'Mid to lower back strain' },
      { name: 'Sacroiliac Joint Dysfunction', typicalRatings: '10-20%', description: 'SI joint pain/instability' },
      { name: 'Ankylosing Spondylitis', typicalRatings: '20-100%', description: 'Inflammatory spine arthritis' },
      { name: 'Compression Fracture (Vertebral)', typicalRatings: '10-50%', description: 'Fractured vertebra' },
      { name: 'Intervertebral Disc Syndrome (IVDS)', typicalRatings: '10-60%', description: 'Disc problems with neurological symptoms' },
    ]
  },
  {
    name: 'Upper Extremities',
    icon: 'arm',
    conditions: [
      { name: 'Rotator Cuff Tear/Injury', typicalRatings: '20-40%', description: 'Shoulder tendon damage' },
      { name: 'Shoulder Impingement Syndrome', typicalRatings: '10-20%', description: 'Shoulder tendon compression' },
      { name: 'Shoulder Arthritis', typicalRatings: '10-40%', description: 'Degenerative shoulder joint' },
      { name: 'Shoulder Instability', typicalRatings: '10-30%', description: 'Recurrent shoulder dislocations' },
      { name: 'Frozen Shoulder (Adhesive Capsulitis)', typicalRatings: '20-30%', description: 'Severe shoulder stiffness' },
      { name: 'Carpal Tunnel Syndrome', typicalRatings: '10-70%', description: 'Wrist nerve compression' },
      { name: 'Cubital Tunnel Syndrome', typicalRatings: '10-50%', description: 'Elbow nerve compression' },
      { name: 'Tennis Elbow (Lateral Epicondylitis)', typicalRatings: '10-20%', description: 'Outer elbow tendon pain' },
      { name: 'Golfer\'s Elbow (Medial Epicondylitis)', typicalRatings: '10-20%', description: 'Inner elbow tendon pain' },
      { name: 'Elbow Arthritis', typicalRatings: '10-30%', description: 'Degenerative elbow joint' },
      { name: 'Wrist Tendonitis', typicalRatings: '10%', description: 'Wrist tendon inflammation' },
      { name: 'De Quervain\'s Tenosynovitis', typicalRatings: '10%', description: 'Thumb tendon inflammation' },
      { name: 'Trigger Finger', typicalRatings: '10%', description: 'Finger tendon catching' },
      { name: 'Hand Arthritis', typicalRatings: '10-30%', description: 'Degenerative hand joints' },
      { name: 'Dupuytren\'s Contracture', typicalRatings: '10-40%', description: 'Finger contracture condition' },
      { name: 'Thoracic Outlet Syndrome', typicalRatings: '20-60%', description: 'Nerve/vessel compression at shoulder' },
    ]
  },
  {
    name: 'Lower Extremities',
    icon: 'leg',
    conditions: [
      { name: 'Knee Arthritis (Degenerative Joint Disease)', typicalRatings: '10-60%', description: 'Degenerative knee joint' },
      { name: 'Patellofemoral Pain Syndrome', typicalRatings: '10-20%', description: 'Kneecap pain' },
      { name: 'ACL Tear/Reconstruction', typicalRatings: '10-30%', description: 'Anterior cruciate ligament injury' },
      { name: 'MCL/LCL Injury', typicalRatings: '10-20%', description: 'Collateral ligament injury' },
      { name: 'Meniscus Tear', typicalRatings: '10-20%', description: 'Knee cartilage tear' },
      { name: 'Chondromalacia Patella', typicalRatings: '10-20%', description: 'Kneecap cartilage damage' },
      { name: 'Knee Instability', typicalRatings: '10-30%', description: 'Recurrent knee giving way' },
      { name: 'Hip Arthritis', typicalRatings: '10-90%', description: 'Degenerative hip joint' },
      { name: 'Hip Bursitis', typicalRatings: '10%', description: 'Hip bursa inflammation' },
      { name: 'Hip Labral Tear', typicalRatings: '10-30%', description: 'Hip cartilage ring tear' },
      { name: 'Plantar Fasciitis', typicalRatings: '10-30%', description: 'Heel/arch pain' },
      { name: 'Achilles Tendonitis', typicalRatings: '10-20%', description: 'Heel tendon inflammation' },
      { name: 'Ankle Arthritis', typicalRatings: '10-40%', description: 'Degenerative ankle joint' },
      { name: 'Ankle Instability', typicalRatings: '10-20%', description: 'Chronic ankle sprains' },
      { name: 'Flat Feet (Pes Planus)', typicalRatings: '0-30%', description: 'Fallen arches' },
      { name: 'Hammertoe', typicalRatings: '0-10%', description: 'Toe deformity' },
      { name: 'Bunion (Hallux Valgus)', typicalRatings: '0-10%', description: 'Big toe deformity' },
      { name: 'Morton\'s Neuroma', typicalRatings: '10%', description: 'Foot nerve pain' },
      { name: 'Shin Splints (Medial Tibial Stress Syndrome)', typicalRatings: '10%', description: 'Shin pain from running' },
      { name: 'Stress Fracture', typicalRatings: '10-20%', description: 'Overuse bone fracture' },
      { name: 'Peripheral Artery Disease (Lower)', typicalRatings: '20-100%', description: 'Reduced leg blood flow' },
    ]
  },
  {
    name: 'Neurological',
    icon: 'brain',
    conditions: [
      { name: 'Radiculopathy (Cervical)', typicalRatings: '10-70%', description: 'Neck nerve root compression' },
      { name: 'Radiculopathy (Lumbar)', typicalRatings: '10-70%', description: 'Lower back nerve root compression' },
      { name: 'Sciatica', typicalRatings: '10-60%', description: 'Sciatic nerve pain' },
      { name: 'Peripheral Neuropathy', typicalRatings: '10-60%', description: 'Nerve damage in extremities' },
      { name: 'Diabetic Neuropathy', typicalRatings: '10-60%', description: 'Diabetes-related nerve damage' },
      { name: 'Traumatic Brain Injury (TBI)', typicalRatings: '10-100%', description: 'Brain injury from trauma' },
      { name: 'Migraines', typicalRatings: '0-50%', description: 'Severe recurring headaches' },
      { name: 'Tension Headaches', typicalRatings: '0-30%', description: 'Stress-related headaches' },
      { name: 'Epilepsy/Seizure Disorder', typicalRatings: '10-100%', description: 'Seizure condition' },
      { name: 'Multiple Sclerosis', typicalRatings: '30-100%', description: 'Autoimmune nerve disease' },
      { name: 'Parkinson\'s Disease', typicalRatings: '30-100%', description: 'Degenerative movement disorder' },
      { name: 'Essential Tremor', typicalRatings: '10-30%', description: 'Involuntary shaking' },
      { name: 'Trigeminal Neuralgia', typicalRatings: '10-50%', description: 'Facial nerve pain' },
      { name: 'Vertigo/Vestibular Disorder', typicalRatings: '10-100%', description: 'Balance/dizziness disorder' },
      { name: 'Meralgia Paresthetica', typicalRatings: '10%', description: 'Thigh nerve compression' },
      { name: 'Bell\'s Palsy', typicalRatings: '10-30%', description: 'Facial paralysis' },
    ]
  },
  {
    name: 'Mental Health',
    icon: 'mental',
    conditions: [
      { name: 'Post-Traumatic Stress Disorder (PTSD)', typicalRatings: '10-100%', description: 'Trauma-related disorder' },
      { name: 'Major Depressive Disorder', typicalRatings: '10-100%', description: 'Clinical depression' },
      { name: 'Generalized Anxiety Disorder', typicalRatings: '10-100%', description: 'Chronic anxiety' },
      { name: 'Panic Disorder', typicalRatings: '10-100%', description: 'Recurring panic attacks' },
      { name: 'Adjustment Disorder', typicalRatings: '10-50%', description: 'Difficulty adjusting to change' },
      { name: 'Bipolar Disorder', typicalRatings: '30-100%', description: 'Mood swing disorder' },
      { name: 'Obsessive-Compulsive Disorder', typicalRatings: '10-100%', description: 'OCD' },
      { name: 'Social Anxiety Disorder', typicalRatings: '10-70%', description: 'Social phobia' },
      { name: 'Persistent Depressive Disorder', typicalRatings: '10-70%', description: 'Chronic low-grade depression' },
      { name: 'Somatic Symptom Disorder', typicalRatings: '10-50%', description: 'Physical symptoms from psychological factors' },
      { name: 'Insomnia', typicalRatings: '0-30%', description: 'Chronic sleep difficulty' },
      { name: 'Nightmare Disorder', typicalRatings: '0-30%', description: 'Recurring nightmares' },
    ]
  },
  {
    name: 'Ears & Hearing',
    icon: 'ear',
    conditions: [
      { name: 'Tinnitus', typicalRatings: '10%', description: 'Ringing in the ears' },
      { name: 'Hearing Loss (Bilateral)', typicalRatings: '0-100%', description: 'Both ears hearing impairment' },
      { name: 'Hearing Loss (Unilateral)', typicalRatings: '0-10%', description: 'Single ear hearing impairment' },
      { name: 'Meniere\'s Disease', typicalRatings: '30-100%', description: 'Inner ear disorder' },
      { name: 'Otitis Media (Chronic)', typicalRatings: '0-10%', description: 'Chronic ear infection' },
      { name: 'Perforated Eardrum', typicalRatings: '0-10%', description: 'Hole in eardrum' },
      { name: 'Acoustic Neuroma', typicalRatings: '10-100%', description: 'Ear nerve tumor' },
      { name: 'Vestibular Labyrinthitis', typicalRatings: '10-30%', description: 'Inner ear inflammation' },
      { name: 'Hyperacusis', typicalRatings: '0-10%', description: 'Sound sensitivity' },
    ]
  },
  {
    name: 'Eyes & Vision',
    icon: 'eye',
    conditions: [
      { name: 'Dry Eye Syndrome', typicalRatings: '0-30%', description: 'Chronic dry eyes' },
      { name: 'Glaucoma', typicalRatings: '10-100%', description: 'Eye pressure condition' },
      { name: 'Macular Degeneration', typicalRatings: '10-100%', description: 'Central vision loss' },
      { name: 'Cataracts', typicalRatings: '10-30%', description: 'Cloudy lens' },
      { name: 'Diabetic Retinopathy', typicalRatings: '10-100%', description: 'Diabetes-related eye damage' },
      { name: 'Pterygium', typicalRatings: '0-10%', description: 'Eye growth from sun exposure' },
      { name: 'Keratitis', typicalRatings: '0-10%', description: 'Cornea inflammation' },
      { name: 'Retinal Detachment', typicalRatings: '10-100%', description: 'Detached retina' },
      { name: 'Optic Neuritis', typicalRatings: '10-30%', description: 'Optic nerve inflammation' },
      { name: 'Conjunctivitis (Chronic)', typicalRatings: '0-10%', description: 'Chronic pink eye' },
      { name: 'Visual Field Defect', typicalRatings: '10-100%', description: 'Partial vision loss' },
    ]
  },
  {
    name: 'Respiratory',
    icon: 'lungs',
    conditions: [
      { name: 'Asthma', typicalRatings: '10-100%', description: 'Airway inflammation' },
      { name: 'COPD (Chronic Obstructive Pulmonary Disease)', typicalRatings: '10-100%', description: 'Chronic lung disease' },
      { name: 'Chronic Bronchitis', typicalRatings: '10-60%', description: 'Bronchial inflammation' },
      { name: 'Emphysema', typicalRatings: '30-100%', description: 'Lung tissue damage' },
      { name: 'Sleep Apnea (Obstructive)', typicalRatings: '0-100%', description: 'Breathing stops during sleep' },
      { name: 'Sleep Apnea (Central)', typicalRatings: '0-100%', description: 'Brain signal sleep apnea' },
      { name: 'Sinusitis (Chronic)', typicalRatings: '0-50%', description: 'Chronic sinus inflammation' },
      { name: 'Rhinitis (Allergic)', typicalRatings: '0-30%', description: 'Allergic nasal inflammation' },
      { name: 'Rhinitis (Vasomotor)', typicalRatings: '0-30%', description: 'Non-allergic nasal inflammation' },
      { name: 'Pulmonary Fibrosis', typicalRatings: '30-100%', description: 'Lung scarring' },
      { name: 'Sarcoidosis', typicalRatings: '0-100%', description: 'Inflammatory cell clusters' },
      { name: 'Bronchiectasis', typicalRatings: '10-100%', description: 'Widened airways' },
      { name: 'Pleural Plaques', typicalRatings: '0-10%', description: 'Asbestos-related pleural changes' },
      { name: 'Deviated Septum', typicalRatings: '0-10%', description: 'Crooked nasal wall' },
    ]
  },
  {
    name: 'Cardiovascular',
    icon: 'heart',
    conditions: [
      { name: 'Hypertension', typicalRatings: '10-60%', description: 'High blood pressure' },
      { name: 'Coronary Artery Disease', typicalRatings: '10-100%', description: 'Heart artery blockage' },
      { name: 'Heart Attack (MI) Residuals', typicalRatings: '10-100%', description: 'Post-heart attack effects' },
      { name: 'Atrial Fibrillation', typicalRatings: '10-100%', description: 'Irregular heartbeat' },
      { name: 'Cardiomyopathy', typicalRatings: '30-100%', description: 'Heart muscle disease' },
      { name: 'Heart Valve Disease', typicalRatings: '10-100%', description: 'Valve malfunction' },
      { name: 'Congestive Heart Failure', typicalRatings: '30-100%', description: 'Heart pumping failure' },
      { name: 'Aortic Aneurysm', typicalRatings: '10-100%', description: 'Aorta bulging' },
      { name: 'Deep Vein Thrombosis (DVT)', typicalRatings: '10-60%', description: 'Blood clot in vein' },
      { name: 'Varicose Veins', typicalRatings: '0-40%', description: 'Enlarged veins' },
      { name: 'Peripheral Artery Disease', typicalRatings: '20-100%', description: 'Reduced limb blood flow' },
      { name: 'Raynaud\'s Disease', typicalRatings: '10-60%', description: 'Cold-triggered blood vessel spasm' },
      { name: 'Supraventricular Tachycardia', typicalRatings: '10-100%', description: 'Fast heart rate' },
      { name: 'Pacemaker', typicalRatings: '10-100%', description: 'Implanted heart device' },
    ]
  },
  {
    name: 'Digestive',
    icon: 'stomach',
    conditions: [
      { name: 'GERD (Gastroesophageal Reflux Disease)', typicalRatings: '10-60%', description: 'Acid reflux disease' },
      { name: 'Hiatal Hernia', typicalRatings: '10-60%', description: 'Stomach protrusion into chest' },
      { name: 'Irritable Bowel Syndrome (IBS)', typicalRatings: '10-30%', description: 'Chronic bowel irregularity' },
      { name: 'Crohn\'s Disease', typicalRatings: '10-100%', description: 'Inflammatory bowel disease' },
      { name: 'Ulcerative Colitis', typicalRatings: '10-100%', description: 'Colon inflammation' },
      { name: 'Peptic Ulcer Disease', typicalRatings: '10-60%', description: 'Stomach/duodenal ulcers' },
      { name: 'Gastritis', typicalRatings: '10-30%', description: 'Stomach lining inflammation' },
      { name: 'Diverticulitis', typicalRatings: '10-30%', description: 'Colon pouch inflammation' },
      { name: 'Hemorrhoids', typicalRatings: '0-20%', description: 'Swollen rectal veins' },
      { name: 'Anal Fissure', typicalRatings: '0-10%', description: 'Rectal tear' },
      { name: 'Fatty Liver Disease', typicalRatings: '10-100%', description: 'Liver fat accumulation' },
      { name: 'Cirrhosis', typicalRatings: '10-100%', description: 'Liver scarring' },
      { name: 'Hepatitis (Chronic)', typicalRatings: '10-100%', description: 'Liver inflammation' },
      { name: 'Cholecystitis', typicalRatings: '10-30%', description: 'Gallbladder inflammation' },
      { name: 'Pancreatitis (Chronic)', typicalRatings: '30-100%', description: 'Pancreas inflammation' },
    ]
  },
  {
    name: 'Skin',
    icon: 'skin',
    conditions: [
      { name: 'Eczema (Atopic Dermatitis)', typicalRatings: '0-60%', description: 'Chronic skin inflammation' },
      { name: 'Psoriasis', typicalRatings: '0-60%', description: 'Autoimmune skin condition' },
      { name: 'Contact Dermatitis', typicalRatings: '0-30%', description: 'Allergic skin reaction' },
      { name: 'Acne (Severe/Scarring)', typicalRatings: '0-30%', description: 'Severe acne condition' },
      { name: 'Hidradenitis Suppurativa', typicalRatings: '10-60%', description: 'Skin abscess condition' },
      { name: 'Keloid Scars', typicalRatings: '0-30%', description: 'Raised scar tissue' },
      { name: 'Burn Scars', typicalRatings: '0-80%', description: 'Scarring from burns' },
      { name: 'Chloracne', typicalRatings: '10-30%', description: 'Agent Orange skin condition' },
      { name: 'Tinea (Chronic Fungal Infection)', typicalRatings: '0-10%', description: 'Chronic fungal skin infection' },
      { name: 'Vitiligo', typicalRatings: '0-10%', description: 'Skin pigment loss' },
      { name: 'Rosacea', typicalRatings: '0-10%', description: 'Facial redness condition' },
      { name: 'Urticaria (Chronic Hives)', typicalRatings: '0-60%', description: 'Chronic allergic hives' },
      { name: 'Hyperhidrosis', typicalRatings: '0-30%', description: 'Excessive sweating' },
    ]
  },
  {
    name: 'Endocrine',
    icon: 'gland',
    conditions: [
      { name: 'Diabetes Mellitus Type I', typicalRatings: '10-100%', description: 'Insulin-dependent diabetes' },
      { name: 'Diabetes Mellitus Type II', typicalRatings: '10-100%', description: 'Non-insulin dependent diabetes' },
      { name: 'Hypothyroidism', typicalRatings: '0-100%', description: 'Underactive thyroid' },
      { name: 'Hyperthyroidism', typicalRatings: '0-100%', description: 'Overactive thyroid' },
      { name: 'Thyroid Nodules', typicalRatings: '0-30%', description: 'Thyroid growths' },
      { name: 'Thyroid Cancer', typicalRatings: '0-100%', description: 'Thyroid malignancy' },
      { name: 'Addison\'s Disease', typicalRatings: '20-60%', description: 'Adrenal insufficiency' },
      { name: 'Cushing\'s Syndrome', typicalRatings: '30-100%', description: 'Excess cortisol' },
      { name: 'Hypogonadism', typicalRatings: '0-30%', description: 'Low testosterone' },
      { name: 'Growth Hormone Deficiency', typicalRatings: '0-30%', description: 'Pituitary disorder' },
    ]
  },
  {
    name: 'Genitourinary',
    icon: 'kidney',
    conditions: [
      { name: 'Erectile Dysfunction', typicalRatings: '0-20%', description: 'Inability to achieve/maintain erection' },
      { name: 'Kidney Disease (Chronic)', typicalRatings: '0-100%', description: 'Chronic kidney impairment' },
      { name: 'Kidney Stones (Recurrent)', typicalRatings: '0-30%', description: 'Recurring kidney stones' },
      { name: 'Urinary Incontinence', typicalRatings: '20-60%', description: 'Loss of bladder control' },
      { name: 'Overactive Bladder', typicalRatings: '10-40%', description: 'Frequent urination urge' },
      { name: 'Benign Prostatic Hyperplasia', typicalRatings: '0-40%', description: 'Enlarged prostate' },
      { name: 'Prostatitis', typicalRatings: '0-40%', description: 'Prostate inflammation' },
      { name: 'Urethral Stricture', typicalRatings: '0-30%', description: 'Narrowed urethra' },
      { name: 'Interstitial Cystitis', typicalRatings: '10-60%', description: 'Bladder pain syndrome' },
      { name: 'Prostate Cancer', typicalRatings: '0-100%', description: 'Prostate malignancy' },
      { name: 'Testicular Cancer', typicalRatings: '0-100%', description: 'Testicular malignancy' },
    ]
  },
  {
    name: 'Musculoskeletal (General)',
    icon: 'bone',
    conditions: [
      { name: 'Fibromyalgia', typicalRatings: '10-40%', description: 'Widespread chronic pain' },
      { name: 'Rheumatoid Arthritis', typicalRatings: '20-100%', description: 'Autoimmune joint disease' },
      { name: 'Gout', typicalRatings: '10-40%', description: 'Uric acid crystal arthritis' },
      { name: 'Osteoporosis', typicalRatings: '0-10%', description: 'Bone density loss' },
      { name: 'Lupus (SLE)', typicalRatings: '10-100%', description: 'Systemic autoimmune disease' },
      { name: 'Chronic Fatigue Syndrome', typicalRatings: '10-60%', description: 'Persistent exhaustion' },
      { name: 'TMJ Disorder', typicalRatings: '10-40%', description: 'Jaw joint dysfunction' },
      { name: 'Costochondritis', typicalRatings: '0-10%', description: 'Rib cartilage inflammation' },
      { name: 'Bursitis (Various)', typicalRatings: '10%', description: 'Bursa inflammation' },
      { name: 'Tendonitis (Various)', typicalRatings: '10%', description: 'Tendon inflammation' },
      { name: 'Osteomyelitis', typicalRatings: '10-60%', description: 'Bone infection' },
    ]
  },
  {
    name: 'Dental & Oral',
    icon: 'tooth',
    conditions: [
      { name: 'Dental Trauma (Service-Connected)', typicalRatings: '0-40%', description: 'Teeth damaged in service' },
      { name: 'Periodontal Disease', typicalRatings: '0-20%', description: 'Gum disease' },
      { name: 'Loss of Teeth (Trauma)', typicalRatings: '0-40%', description: 'Missing teeth from injury' },
      { name: 'Temporomandibular Disorder', typicalRatings: '10-40%', description: 'TMJ dysfunction' },
      { name: 'Osteonecrosis of the Jaw', typicalRatings: '10-100%', description: 'Jaw bone death' },
    ]
  },
  {
    name: 'Infectious Disease',
    icon: 'virus',
    conditions: [
      { name: 'Gulf War Syndrome', typicalRatings: '10-100%', description: 'Medically unexplained chronic illness' },
      { name: 'Chronic Multi-Symptom Illness', typicalRatings: '10-100%', description: 'Post-deployment syndrome' },
      { name: 'HIV/AIDS', typicalRatings: '0-100%', description: 'Immunodeficiency virus' },
      { name: 'Hepatitis B (Chronic)', typicalRatings: '10-100%', description: 'Liver infection' },
      { name: 'Hepatitis C (Chronic)', typicalRatings: '10-100%', description: 'Liver infection' },
      { name: 'Tuberculosis (Latent/Active)', typicalRatings: '0-100%', description: 'Bacterial lung infection' },
      { name: 'Malaria Residuals', typicalRatings: '0-100%', description: 'Post-malaria effects' },
      { name: 'Lyme Disease (Chronic)', typicalRatings: '10-60%', description: 'Tick-borne illness' },
    ]
  },
  {
    name: 'Cancer',
    icon: 'cancer',
    conditions: [
      { name: 'Lung Cancer', typicalRatings: '0-100%', description: 'Pulmonary malignancy' },
      { name: 'Skin Cancer (Melanoma)', typicalRatings: '0-100%', description: 'Skin malignancy' },
      { name: 'Skin Cancer (Non-Melanoma)', typicalRatings: '0-100%', description: 'Basal/squamous cell carcinoma' },
      { name: 'Colon Cancer', typicalRatings: '0-100%', description: 'Colorectal malignancy' },
      { name: 'Kidney Cancer', typicalRatings: '0-100%', description: 'Renal malignancy' },
      { name: 'Bladder Cancer', typicalRatings: '0-100%', description: 'Bladder malignancy' },
      { name: 'Lymphoma', typicalRatings: '0-100%', description: 'Lymphatic cancer' },
      { name: 'Leukemia', typicalRatings: '0-100%', description: 'Blood cancer' },
      { name: 'Brain Cancer', typicalRatings: '0-100%', description: 'Brain malignancy' },
      { name: 'Soft Tissue Sarcoma', typicalRatings: '0-100%', description: 'Connective tissue cancer' },
    ]
  },
];

// Flatten for searching
export const allVADisabilities: (VADisability & { bodySystem: string })[] = vaDisabilitiesBySystem.flatMap(
  (system) => system.conditions.map((condition) => ({ ...condition, bodySystem: system.name }))
);
