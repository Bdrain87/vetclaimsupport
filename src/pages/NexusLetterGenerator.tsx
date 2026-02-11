import { useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileSignature,
  ChevronRight,
  ChevronLeft,
  Check,
  Printer,
  Download,
  AlertCircle,
  Info,
  User,
  Stethoscope,
  Calendar,
  FileText,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { vaDisabilitiesBySystem } from '@/data/vaDisabilities';
import { secondaryConditions } from '@/data/secondaryConditions';
import { cn } from '@/lib/utils';
import { useClaims } from '@/hooks/useClaims';
import { useProfileStore } from '@/store/useProfileStore';
import { getAllBranchLabels } from '@/utils/veteranProfile';
import { exportNexusLetterTemplate } from '@/utils/pdfExport';
import { PageContainer } from '@/components/PageContainer';

// Get all conditions for autocomplete
const getAllConditions = (): string[] => {
  const conditions = new Set<string>();
  vaDisabilitiesBySystem.forEach(system => {
    system.conditions.forEach(condition => {
      conditions.add(condition.name);
    });
  });
  return [...conditions].sort();
};

const allConditions = getAllConditions();

type ConnectionType = 'secondary' | 'direct' | 'aggravation';

interface NexusFormData {
  // Step 1: Condition
  primaryCondition: string;
  secondaryCondition: string;
  // Step 2: Connection Type
  connectionType: ConnectionType;
  // Step 3: Service Details
  veteranName: string;
  serviceStartDate: string;
  serviceEndDate: string;
  branchOfService: string;
  // Step 4: Current Status
  diagnosisDate: string;
  treatingPhysician: string;
  currentSymptoms: string;
  impactOnLife: string;
  // Step 5: Review
}

const STEPS = [
  { id: 1, title: 'Condition', icon: Stethoscope },
  { id: 2, title: 'Connection Type', icon: Shield },
  { id: 3, title: 'Service Details', icon: Calendar },
  { id: 4, title: 'Current Status', icon: User },
  { id: 5, title: 'Review & Build Summary', icon: FileText },
];

export default function NexusLetterGenerator() {
  const [searchParams] = useSearchParams();
  const printRef = useRef<HTMLDivElement>(null);
  const { data } = useClaims();
  const profile = useProfileStore();

  // Build symptom summary from health logs for pre-population
  const buildSymptomSummary = () => {
    const recentSymptoms = data.symptoms.slice(-10);
    if (recentSymptoms.length === 0) return '';
    return recentSymptoms
      .map(s => `${s.symptom} (${s.bodyArea}, severity ${s.severity}/10${s.frequency ? `, ${s.frequency}` : ''})`)
      .join('; ');
  };

  const buildImpactSummary = () => {
    const recentLogs = data.symptoms.slice(-5);
    return recentLogs
      .filter(s => s.dailyImpact)
      .map(s => s.dailyImpact)
      .join('; ');
  };

  const branchLabel = getAllBranchLabels(profile);
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<NexusFormData>({
    primaryCondition: searchParams.get('primary') || '',
    secondaryCondition: searchParams.get('secondary') || '',
    connectionType: 'secondary',
    veteranName: fullName,
    serviceStartDate: profile.serviceDates?.start || '',
    serviceEndDate: profile.serviceDates?.end || '',
    branchOfService: branchLabel,
    diagnosisDate: '',
    treatingPhysician: '',
    currentSymptoms: buildSymptomSummary(),
    impactOnLife: buildImpactSummary(),
  });

  const [primarySearch, setPrimarySearch] = useState(formData.primaryCondition);
  const [secondarySearch, setSecondarySearch] = useState(formData.secondaryCondition);
  const [showPrimaryDropdown, setShowPrimaryDropdown] = useState(false);
  const [showSecondaryDropdown, setShowSecondaryDropdown] = useState(false);

  // Get medical connection from secondary conditions data
  const medicalConnection = useMemo(() => {
    if (formData.primaryCondition && formData.secondaryCondition) {
      const connection = secondaryConditions.find(
        c => c.primaryCondition === formData.primaryCondition &&
             c.secondaryCondition === formData.secondaryCondition
      );
      return connection?.medicalConnection || '';
    }
    return '';
  }, [formData.primaryCondition, formData.secondaryCondition]);

  // Filter conditions for autocomplete
  const filteredPrimary = useMemo(() => {
    if (!primarySearch) return allConditions.slice(0, 50);
    return allConditions.filter(c =>
      c.toLowerCase().includes(primarySearch.toLowerCase())
    ).slice(0, 50);
  }, [primarySearch]);

  const filteredSecondary = useMemo(() => {
    if (!secondarySearch) return allConditions.slice(0, 50);
    return allConditions.filter(c =>
      c.toLowerCase().includes(secondarySearch.toLowerCase())
    ).slice(0, 50);
  }, [secondarySearch]);

  const updateFormData = (field: keyof NexusFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.connectionType === 'direct'
          ? formData.secondaryCondition.trim() !== ''
          : formData.primaryCondition.trim() !== '' && formData.secondaryCondition.trim() !== '';
      case 2:
        return formData.connectionType !== '';
      case 3:
        return formData.veteranName.trim() !== '' && formData.branchOfService.trim() !== '';
      case 4:
        return formData.currentSymptoms.trim() !== '';
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const generateLetterText = (): string => {
    const lines: string[] = [];
    lines.push('INFORMATION SUMMARY FOR YOUR DOCTOR');
    lines.push('For VA Disability Claim');
    lines.push('');
    lines.push(`Date: ${generateLetterDate()}`);
    lines.push(`Re: ${formData.veteranName}`);
    lines.push(`Condition: ${formData.secondaryCondition}`);
    lines.push('');
    lines.push('To Whom It May Concern:');
    lines.push('');

    let intro = `I am writing this letter in support of ${formData.veteranName}'s claim for VA disability benefits for ${formData.secondaryCondition}`;
    if (formData.connectionType === 'secondary' && formData.primaryCondition) {
      intro += ` as secondary to their service-connected ${formData.primaryCondition}`;
    } else if (formData.connectionType === 'direct') {
      intro += ' as directly connected to their military service';
    } else if (formData.connectionType === 'aggravation') {
      intro += ' which was aggravated beyond its natural progression during military service';
    }
    intro += '.';
    lines.push(intro);
    lines.push('');

    let background = `Patient Background:\n${formData.veteranName} served in the ${formData.branchOfService}`;
    if (formData.serviceStartDate && formData.serviceEndDate) {
      background += ` from ${new Date(formData.serviceStartDate).toLocaleDateString()} to ${new Date(formData.serviceEndDate).toLocaleDateString()}`;
    }
    background += '.';
    if (formData.diagnosisDate) {
      background += ` The patient was diagnosed with ${formData.secondaryCondition} on ${new Date(formData.diagnosisDate).toLocaleDateString()}.`;
    }
    lines.push(background);
    lines.push('');

    lines.push(`Current Symptoms:\n${formData.currentSymptoms}`);
    lines.push('');

    if (formData.impactOnLife) {
      lines.push(`Functional Impact:\n${formData.impactOnLife}`);
      lines.push('');
    }

    if (formData.connectionType === 'secondary' && medicalConnection) {
      lines.push(`Medical Rationale for Secondary Connection:\n${medicalConnection}`);
      lines.push('');
    }

    let opinion = `Medical Opinion:\nBased on my review of the medical evidence and my clinical expertise, it is my professional medical opinion that the veteran's ${formData.secondaryCondition} is at least as likely as not (50% or greater probability)`;
    if (formData.connectionType === 'secondary') {
      opinion += ` caused by or aggravated by their service-connected ${formData.primaryCondition}`;
    } else if (formData.connectionType === 'direct') {
      opinion += ' directly related to their military service';
    } else {
      opinion += ' permanently aggravated beyond its natural progression as a result of military service';
    }
    opinion += '.';
    lines.push(opinion);
    lines.push('');

    lines.push('This opinion is provided with reasonable medical certainty and is based on generally accepted medical principles and current peer-reviewed medical literature.');
    lines.push('');
    lines.push('Respectfully submitted,');
    lines.push('');
    lines.push('_______________________________');
    lines.push('Physician Signature');
    lines.push('');
    lines.push('_______________________________');
    lines.push('Printed Name, Credentials');
    lines.push('');
    lines.push('_______________________________');
    lines.push('Date');
    lines.push('');
    lines.push('_______________________________');
    lines.push('License Number / NPI');

    return lines.join('\n');
  };

  const handleDownloadPDF = () => {
    const letterText = generateLetterText();
    exportNexusLetterTemplate(letterText, formData.secondaryCondition);
  };

  const generateLetterDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {formData.connectionType !== 'direct' && (
                <div className="space-y-2">
                  <Label>Primary (Service-Connected) Condition</Label>
                  <div className="relative">
                    <Input
                      value={primarySearch}
                      onChange={(e) => {
                        setPrimarySearch(e.target.value);
                        setShowPrimaryDropdown(true);
                      }}
                      onFocus={() => setShowPrimaryDropdown(true)}
                      placeholder="Search for your service-connected condition..."
                    />
                    {showPrimaryDropdown && filteredPrimary.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-card border border-border rounded-lg shadow-lg">
                        {filteredPrimary.map(condition => (
                          <button
                            key={condition}
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-muted text-sm truncate"
                            onClick={() => {
                              updateFormData('primaryCondition', condition);
                              setPrimarySearch(condition);
                              setShowPrimaryDropdown(false);
                            }}
                          >
                            {condition}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {formData.primaryCondition && (
                    <Badge variant="secondary" className="truncate max-w-full">{formData.primaryCondition}</Badge>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label>
                  {formData.connectionType === 'direct' ? 'Condition to Claim' : 'Secondary Condition to Claim'}
                </Label>
                <div className="relative">
                  <Input
                    value={secondarySearch}
                    onChange={(e) => {
                      setSecondarySearch(e.target.value);
                      setShowSecondaryDropdown(true);
                    }}
                    onFocus={() => setShowSecondaryDropdown(true)}
                    placeholder="Search for the condition you want to claim..."
                  />
                  {showSecondaryDropdown && filteredSecondary.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-card border border-border rounded-lg shadow-lg">
                      {filteredSecondary.map(condition => (
                        <button
                          key={condition}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-muted text-sm truncate"
                          onClick={() => {
                            updateFormData('secondaryCondition', condition);
                            setSecondarySearch(condition);
                            setShowSecondaryDropdown(false);
                          }}
                        >
                          {condition}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {formData.secondaryCondition && (
                  <Badge variant="secondary" className="truncate max-w-full">{formData.secondaryCondition}</Badge>
                )}
              </div>

              {medicalConnection && (
                <Card className="bg-success/10 border-success/30">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Medical Connection Found</p>
                        <p className="text-sm text-muted-foreground mt-1">{medicalConnection}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>How is this condition connected to your service?</Label>
              <RadioGroup
                value={formData.connectionType}
                onValueChange={(value) => updateFormData('connectionType', value as ConnectionType)}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="secondary" id="secondary" />
                  <div className="flex-1">
                    <Label htmlFor="secondary" className="font-medium cursor-pointer">Secondary Condition</Label>
                    <p className="text-sm text-muted-foreground">
                      This condition was caused or aggravated by an already service-connected condition
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="direct" id="direct" />
                  <div className="flex-1">
                    <Label htmlFor="direct" className="font-medium cursor-pointer">Direct Service Connection</Label>
                    <p className="text-sm text-muted-foreground">
                      This condition began during or was caused by military service
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="aggravation" id="aggravation" />
                  <div className="flex-1">
                    <Label htmlFor="aggravation" className="font-medium cursor-pointer">Aggravation</Label>
                    <p className="text-sm text-muted-foreground">
                      A pre-existing condition was permanently worsened by military service
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Veteran's Full Name</Label>
                <Input
                  value={formData.veteranName}
                  onChange={(e) => updateFormData('veteranName', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Branch of Service</Label>
                <Input
                  value={formData.branchOfService}
                  onChange={(e) => updateFormData('branchOfService', e.target.value)}
                  placeholder="U.S. Army"
                />
              </div>
              <div className="space-y-2">
                <Label>Service Start Date (Optional)</Label>
                <Input
                  type="date"
                  value={formData.serviceStartDate}
                  onChange={(e) => updateFormData('serviceStartDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Service End Date (Optional)</Label>
                <Input
                  type="date"
                  value={formData.serviceEndDate}
                  onChange={(e) => updateFormData('serviceEndDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Date of Diagnosis (Optional)</Label>
                <Input
                  type="date"
                  value={formData.diagnosisDate}
                  onChange={(e) => updateFormData('diagnosisDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Treating Physician (Optional)</Label>
                <Input
                  value={formData.treatingPhysician}
                  onChange={(e) => updateFormData('treatingPhysician', e.target.value)}
                  placeholder="Dr. Jane Smith"
                />
              </div>
              <div className="space-y-2">
                <Label>Current Symptoms</Label>
                <Textarea
                  value={formData.currentSymptoms}
                  onChange={(e) => updateFormData('currentSymptoms', e.target.value)}
                  placeholder="Describe your current symptoms..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Impact on Daily Life (Optional)</Label>
                <Textarea
                  value={formData.impactOnLife}
                  onChange={(e) => updateFormData('impactOnLife', e.target.value)}
                  placeholder="Describe how this condition affects your daily activities, work, and relationships..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* Preview Card */}
            <Card className="bg-primary/5 border-primary/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-5 w-5 text-primary" />
                  <span className="font-medium">Review Your Information</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Please review the information below. You can print this summary and share it with a qualified medical professional.
                </p>
              </CardContent>
            </Card>

            {/* Letter Preview */}
            <div ref={printRef} className="bg-white dark:bg-gray-900 p-4 sm:p-8 rounded-lg border border-border print:border-none print:shadow-none">
              <div className="text-foreground space-y-6 font-serif print:text-black overflow-hidden break-words">
                <div className="text-center mb-8">
                  <h1 className="text-xl font-bold">INFORMATION SUMMARY FOR YOUR DOCTOR</h1>
                  <p className="text-sm text-muted-foreground print:text-gray-600">
                    For VA Disability Claim
                  </p>
                </div>

                <p><strong>Date:</strong> {generateLetterDate()}</p>
                <p><strong>Re:</strong> {formData.veteranName}</p>
                <p><strong>Condition:</strong> {formData.secondaryCondition}</p>

                <div className="border-t border-border pt-4 print:border-gray-300">
                  <p className="mb-4">To Whom It May Concern:</p>

                  <p className="mb-4">
                    I am writing this letter in support of {formData.veteranName}'s claim for VA disability benefits
                    for <strong>{formData.secondaryCondition}</strong>
                    {formData.connectionType === 'secondary' && formData.primaryCondition && (
                      <> as secondary to their service-connected <strong>{formData.primaryCondition}</strong></>
                    )}
                    {formData.connectionType === 'direct' && (
                      <> as directly connected to their military service</>
                    )}
                    {formData.connectionType === 'aggravation' && (
                      <> which was aggravated beyond its natural progression during military service</>
                    )}
                    .
                  </p>

                  <p className="mb-4">
                    <strong>Patient Background:</strong><br />
                    {formData.veteranName} served in the {formData.branchOfService}
                    {formData.serviceStartDate && formData.serviceEndDate && (
                      <> from {new Date(formData.serviceStartDate).toLocaleDateString()} to {new Date(formData.serviceEndDate).toLocaleDateString()}</>
                    )}.
                    {formData.diagnosisDate && (
                      <> The patient was diagnosed with {formData.secondaryCondition} on {new Date(formData.diagnosisDate).toLocaleDateString()}.</>
                    )}
                  </p>

                  <p className="mb-4">
                    <strong>Current Symptoms:</strong><br />
                    {formData.currentSymptoms}
                  </p>

                  {formData.impactOnLife && (
                    <p className="mb-4">
                      <strong>Functional Impact:</strong><br />
                      {formData.impactOnLife}
                    </p>
                  )}

                  {formData.connectionType === 'secondary' && medicalConnection && (
                    <p className="mb-4">
                      <strong>Medical Rationale for Secondary Connection:</strong><br />
                      {medicalConnection}
                    </p>
                  )}

                  <p className="mb-4">
                    <strong>Medical Opinion:</strong><br />
                    Based on my review of the medical evidence and my clinical expertise, it is my professional medical opinion that
                    the veteran's {formData.secondaryCondition} is <strong>at least as likely as not</strong> (50% or greater probability)
                    {formData.connectionType === 'secondary' ? (
                      <> caused by or aggravated by their service-connected {formData.primaryCondition}</>
                    ) : formData.connectionType === 'direct' ? (
                      <> directly related to their military service</>
                    ) : (
                      <> permanently aggravated beyond its natural progression as a result of military service</>
                    )}.
                  </p>

                  <p className="mb-8">
                    This opinion is provided with reasonable medical certainty and is based on generally accepted medical principles
                    and current peer-reviewed medical literature.
                  </p>

                  <div className="border-t border-border pt-6 print:border-gray-300">
                    <p className="mb-8">Respectfully submitted,</p>

                    <div className="space-y-4">
                      <div className="border-b border-border w-full max-w-64 print:border-gray-300"></div>
                      <p><strong>Physician Signature</strong></p>

                      <div className="border-b border-border w-full max-w-64 print:border-gray-300"></div>
                      <p><strong>Printed Name, Credentials</strong></p>

                      <div className="border-b border-border w-full max-w-64 print:border-gray-300"></div>
                      <p><strong>Date</strong></p>

                      <div className="border-b border-border w-full max-w-64 print:border-gray-300"></div>
                      <p><strong>License Number / NPI</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Print Summary
              </Button>
              <Button variant="outline" onClick={handleDownloadPDF} className="gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>

            {/* Warning */}
            <Card className="border-warning/30 bg-warning/5">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Important</p>
                    <p className="text-muted-foreground">
                      This letter template must be reviewed and signed by a qualified medical professional (MD, DO, PA, or NP)
                      to be valid for VA claims. The physician should modify this template based on their medical examination
                      and professional opinion.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <FileSignature className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctor Summary Builder</h1>
          <p className="text-muted-foreground">
            Create an organized summary of your service-connected condition to share with your doctor
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-primary mt-0.5 shrink-0 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              This tool helps you organize your information into a clear summary. A licensed medical professional must write the actual nexus letter. This summary is designed to help your doctor understand your condition and service connection.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <div className="flex items-center justify-between overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin gap-0">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => step.id < currentStep && setCurrentStep(step.id)}
              disabled={step.id > currentStep}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
                currentStep === step.id
                  ? 'bg-primary text-primary-foreground'
                  : step.id < currentStep
                  ? 'bg-success/20 text-success cursor-pointer hover:bg-success/30'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                currentStep === step.id
                  ? 'bg-primary-foreground text-primary'
                  : step.id < currentStep
                  ? 'bg-success text-white'
                  : 'bg-muted-foreground/30 text-muted-foreground'
              )}>
                {step.id < currentStep ? <Check className="h-3 w-3" /> : step.id}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
            </button>
            {index < STEPS.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => {
              const StepIcon = STEPS[currentStep - 1].icon;
              return <StepIcon className="h-5 w-5 text-primary" />;
            })()}
            Step {currentStep}: {STEPS[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && 'Select the conditions for your summary'}
            {currentStep === 2 && 'Choose how this condition is connected to your service'}
            {currentStep === 3 && 'Enter your military service information'}
            {currentStep === 4 && 'Describe your current medical status'}
            {currentStep === 5 && 'Review and build your summary'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        {currentStep < 5 ? (
          <Button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!canProceed()}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:text-black,
          .print\\:text-black * {
            visibility: visible;
            color: black !important;
          }
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          .print\\:text-gray-600 {
            color: #4b5563 !important;
          }
        }
      `}</style>
    </PageContainer>
  );
}
