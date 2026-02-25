/**
 * Mock document data for testing redaction and export.
 */

export const DOCUMENT_WITH_PII = `
DEPARTMENT OF VETERANS AFFAIRS
COMPENSATION AND PENSION EXAMINATION

Patient: James Rodriguez
DOB: 03/15/1988
SSN: 987-65-4321
C-File: 600987654

MEDICAL OPINION:

The veteran, James Rodriguez (SSN ending in 4321), presents with
bilateral knee pain. MRN: MR9876543.

Contact: (555) 867-5309, james.rodriguez@fakemail.com
Address: 742 Evergreen Terrace, Springfield, IL 62704

DIAGNOSIS: Service-connected PTSD with secondary insomnia.
Prescribed Sertraline 50mg daily and Prazosin 2mg at bedtime.
`;

export const DOCUMENT_NO_PII = `
DEPARTMENT OF VETERANS AFFAIRS
RATING DECISION

The veteran's claim for service connection for bilateral knee strain
is granted with a rating of 10% for each knee.

The evidence supports a finding that the condition was incurred during
active military service. Range of motion testing shows flexion limited
to 100 degrees bilaterally.

Effective date: March 1, 2024.
`;

export const DOCUMENT_MULTIPLE_SSNS = `
Record A: SSN 123-45-6789
Record B: SSN 234-56-7890
Record C: Social Security Number: 345 67 8901
Record D: last 4 of SSN: 2345
`;

export const DOCUMENT_EDGE_CASES = `
SSN at start: 111-22-3333 is the patient's SSN.
Mid-sentence SSN: The patient's SSN is 222-33-4444 and is on file.
SSN at end of document: Patient SSN 333-44-5555
Phone: 555-123-4567
Zip code: 62704
Random digits: 1234
Date that looks numeric: 20230115
`;
