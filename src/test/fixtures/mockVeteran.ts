/**
 * Mock veteran data for testing.
 * Uses realistic but fake PII data.
 */

export const MOCK_VETERAN = {
  firstName: 'James',
  lastName: 'Rodriguez',
  branch: 'army' as const,
  mosCode: '11B',
  mosTitle: 'Infantryman',
  ssn: '987-65-4321',
  dob: '03/15/1988',
  email: 'james.rodriguez@fakemail.com',
  phone: '(555) 867-5309',
  address: '742 Evergreen Terrace, Springfield, IL 62704',
  claimNumber: '600987654',
  serviceNumber: '12345678',
  mrn: 'MR9876543',
  servicePeriods: [
    {
      id: 'sp-1',
      branch: 'army' as const,
      mos: '11B',
      jobTitle: 'Infantryman',
      startDate: '2008-06-15',
      endDate: '2012-06-15',
      dutyStation: 'Fort Bragg',
      currentlyServing: false,
    },
    {
      id: 'sp-2',
      branch: 'army' as const,
      mos: '18X',
      jobTitle: 'Special Forces Candidate',
      startDate: '2012-06-16',
      endDate: '2016-06-16',
      dutyStation: 'Fort Campbell',
      currentlyServing: false,
    },
  ],
  conditions: [
    { name: 'PTSD', diagnosticCode: '9411', rating: 70 },
    { name: 'Lumbar Degenerative Disc Disease', diagnosticCode: '5242', rating: 20 },
    { name: 'Bilateral Tinnitus', diagnosticCode: '6260', rating: 10 },
    { name: 'Left Knee Strain', diagnosticCode: '5260', rating: 10 },
  ],
  claimDates: {
    intentToFileDate: '2024-01-15',
    separationDate: '2016-06-16',
    claimSubmissionDate: '2024-03-01',
  },
};

export const MOCK_VETERAN_FULL_TEXT = `
Patient: James Rodriguez
DOB: 03/15/1988
SSN: 987-65-4321
Phone: (555) 867-5309
Email: james.rodriguez@fakemail.com
Address: 742 Evergreen Terrace, Springfield, IL 62704
Claim number: 600987654
Service number: 12345678
MRN: MR9876543

Service-connected PTSD, rated 70%. Currently prescribed Sertraline 50mg daily.
Bilateral hearing loss, moderate to severe. Tinnitus rated 10%.
Lumbar degenerative disc disease rated 20% with limited range of motion.
Total disability based on individual unemployability (TDIU) under consideration.
`;

export const MOCK_CLEAN_MEDICAL_TEXT = `
Service-connected PTSD, rated 70%.
Currently prescribed Sertraline 50mg daily.
Bilateral hearing loss, moderate to severe.
Lumbar degenerative disc disease with limited range of motion.
Total disability based on individual unemployability (TDIU) under consideration.
Diagnosis: chronic lumbar radiculopathy with intermittent flare-ups.
`;
