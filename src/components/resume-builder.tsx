
"use client";

import React, { useState, useRef, ChangeEvent, useEffect, useCallback, createContext, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateResumeContent, type GenerateResumeContentOutput } from '@/ai/flows/generate-resume-content';
import { suggestJobTitles } from '@/ai/flows/suggest-job-titles';
import { generateResumeSummary } from '@/ai/flows/generate-resume-summary';
import { ModernTemplate } from '@/components/resume-templates/modern-template';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { FileCheck2, Bot, Plus, Trash2, Loader2, Download, Wand2, Palette, Edit, Baby, ChevronsUp, Briefcase, Building, Trophy, GraduationCap, Globe, FileImage, FilePlus2, UploadCloud, Bold, Italic, List, Underline, ClipboardPaste, Award, Info, Languages, Users, FileText, CheckCircle, Activity, Link as LinkIcon, Pencil, CaseSensitive, FileSignature, SpellCheck, ArrowLeft, ArrowRight, ClipboardCheck, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClassicTemplate } from './resume-templates/classic-template';
import { CreativeTemplate } from './resume-templates/creative-template';
import { ProfessionalTemplate } from './resume-templates/professional-template';
import { MinimalistTemplate } from './resume-templates/minimalist-template';
import { ExecutiveTemplate } from './resume-templates/executive-template';
import { SimpleTemplate } from './resume-templates/simple-template';
import { TechnicalTemplate } from './resume-templates/technical-template';
import { AcademicTemplate } from './resume-templates/academic-template';
import { SalesTemplate } from './resume-templates/sales-template';
import { MarketingTemplate } from './resume-templates/marketing-template';
import { HealthcareTemplate } from './resume-templates/healthcare-template';
import { LegalTemplate } from './resume-templates/legal-template';
import { FinanceTemplate } from './resume-templates/finance-template';
import { HospitalityTemplate } from './resume-templates/hospitality-template';
import { SoftwareEngineerTemplate } from './resume-templates/software-engineer-template';
import { GraphicDesignerTemplate } from './resume-templates/graphic-designer-template';
import { CustomerServiceTemplate } from './resume-templates/customer-service-template';
import { ItProfessionalTemplate } from './resume-templates/it-professional-template';
import { ProjectManagerTemplate } from './resume-templates/project-manager-template';
import { CreativeWriterTemplate } from './resume-templates/creative-writer-template';
import { DatePicker } from './ui/date-picker';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ResumeThumbnail } from './resume-templates/resume-thumbnail';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { StellarTemplate } from './resume-templates/stellar-template';
import { DynamicTemplate } from './resume-templates/dynamic-template';
import { CascadeTemplate } from './resume-templates/cascade-template';
import { FolioTemplate } from './resume-templates/folio-template';
import { ImpactTemplate } from './resume-templates/impact-template';
import { OnyxTemplate } from './resume-templates/onyx-template';


export interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    photoUrl?: string;
  };
  summary: string;
  experience: {
    id: number;
    company: string;
    role: string;
    startDate: Date | null;
    endDate: Date | null;
    isCurrentJob: boolean;
    description: string;
    city: string;
    state: string;
  }[];
  education: {
    id: number;
    school: string;
    location: string;
    degree: string;
    fieldOfStudy: string;
    graduationMonth: string;
    graduationYear: string;
    isStillEnrolled: boolean;
  }[];
  skills: string[];
  languages: { id: number; name: string; level: string }[];
  certifications: { id: number; name: string; issuer: string; date: string }[];
  activities: string[];
  awards: { id: number; name: string; date: string; description: string }[];
  websites: { id: number; label: string; url: string }[];
  customSections: { id: number; title: string; content: string }[];
  showReferences: boolean;
  targetCountry: string;
}

const initialResumeData: ResumeData = {
  personalInfo: { firstName: '', lastName: '', email: '', phone: '', streetAddress: '', city: '', state: '', zipCode: '', photoUrl: '' },
  summary: '',
  experience: [{ id: Date.now(), company: '', role: '', startDate: null, endDate: null, isCurrentJob: false, description: '', city: '', state: '' }],
  education: [{ id: Date.now(), school: '', location: '', degree: '', fieldOfStudy: '', graduationMonth: '', graduationYear: '', isStillEnrolled: false }],
  skills: [],
  languages: [],
  certifications: [],
  activities: [],
  awards: [],
  websites: [],
  customSections: [],
  showReferences: false,
  targetCountry: '',
};

const sampleResumeData: ResumeData = {
  personalInfo: {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phone: '555-123-4567',
    streetAddress: '123 Main Street',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    photoUrl: 'https://placehold.co/120x120.png',
  },
  summary: 'A highly motivated and results-oriented professional with 5+ years of experience in project management and software development. Proven ability to lead cross-functional teams and deliver projects on time and within budget.',
  experience: [
    { id: 1, company: 'Tech Solutions Inc.', role: 'Senior Project Manager', startDate: new Date('2020-01-15'), endDate: null, isCurrentJob: true, description: '* Led a team of 10 developers in the successful launch of a new SaaS product.\n* Managed project budgets exceeding $1M.\n* Improved team productivity by 20% through Agile methodologies.', city: 'San Francisco', state: 'CA' },
    { id: 2, company: 'Innovate Corp.', role: 'Software Engineer', startDate: new Date('2018-06-01'), endDate: new Date('2020-01-10'), isCurrentJob: false, description: '* Developed and maintained key features for a high-traffic e-commerce platform.\n* Collaborated with product managers to define feature requirements.', city: 'Palo Alto', state: 'CA' },
  ],
  education: [
    { id: 1, school: 'State University', location: 'Anytown, USA', degree: 'Bachelor of Science', fieldOfStudy: 'Computer Science', graduationMonth: 'May', graduationYear: '2018', isStillEnrolled: false }
  ],
  skills: ['Project Management', 'Agile Methodologies', 'Scrum', 'JIRA', 'React', 'Node.js', 'TypeScript', 'Risk Management'],
  languages: [{ id: 1, name: 'English', level: 'Native' }, { id: 2, name: 'Spanish', level: 'Conversational' }],
  certifications: [{ id: 1, name: 'PMP - Project Management Professional', issuer: 'PMI', date: '2021' }],
  activities: ['Member of Women in Tech', 'Volunteer at local animal shelter'],
  awards: [{id: 1, name: 'Best Project Delivery', date: '2022', description: 'Awarded for delivering the project 20% under budget'}],
  websites: [{ id: 1, label: 'LinkedIn', url: 'linkedin.com/in/janedoe' }],
  customSections: [],
  showReferences: false,
  targetCountry: 'USA',
};

const coreSteps = [
  { id: 'template', name: 'Template' },
  { id: 'personal', name: 'Personal Info' },
  { id: 'experience', name: 'Work History' },
  { id: 'education', name: 'Education' },
  { id: 'skills', name: 'Skills' },
  { id: 'summary', name: 'Summary' },
];

const optionalStepsData = [
  { id: 'activities', name: 'Activities', icon: Activity, description: "Show that you're a well-rounded individual! This highlights your ability to balance different aspects of your life. It could be anything from Beekeeping to Urban Gardening to Ethical Fashion!" },
  { id: 'awards', name: 'Awards & Accomplishments', icon: Trophy, description: "Did you receive awards, exceed targets, earn a leadership role or achieve recognition of some sort? Make them shine in this section. Include anything you've authored or co-authored. For example: a brand logo project, a best selling book" },
  { id: 'certifications', name: 'Certifications & Licenses', icon: Award, description: 'Elevate your resume with noteworthy credentials that prove you are an expert in your field. Include certificate or license name and date of issuance' },
  { id: 'languages', name: 'Languages', icon: Languages, description: 'If you are proficient in one or more languages, mention them in this section. Native Beginner (A1)' },
  { id: 'websites', name: 'Websites & Social Links', icon: LinkIcon, description: 'Include a direct link to your portfolio or samples of your work for an added boost. Let your skills speak for themselves!' },
  { id: 'custom', name: 'Add Your Own', icon: Pencil, description: 'Use this space to build a custom section, and make it your own. Volunteer work, Memberships, Interests, etc.' },
  { id: 'references', name: 'References', icon: Users, description: 'Checking the box shows that you are willing to share a point of contact. This builds trust and confidence in your candidacy.' },
];

const finalSteps = [
  { id: 'add-section', name: 'Add Section' },
];

const colorOptions = [
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Green', color: '#10B981' },
    { name: 'Red', color: '#EF4444' },
    { name: 'Purple', color: '#8b5cf6' },
    { name: 'Gray', color: '#6B7280' },
    { name: 'Black', color: '#111827' },
];

const fontSizes = [
    { id: 'sm', name: 'Small' },
    { id: 'md', name: 'Medium' },
    { id: 'lg', name: 'Large' },
]


const templates = [
  { id: 'modern', name: 'Modern' },
  { id: 'classic', name: 'Classic' },
  { id: 'creative', name: 'Creative' },
  { id: 'professional', name: 'Professional' },
  { id: 'minimalist', name: 'Minimalist' },
  { id: 'executive', name: 'Executive' },
  { id: 'simple', name: 'Simple' },
  { id: 'technical', name: 'Technical' },
  { id: 'academic', name: 'Academic' },
  { id: 'sales', name: 'Sales' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'legal', name: 'Legal' },
  { id: 'finance', name: 'Finance' },
  { id: 'hospitality', name: 'Hospitality' },
  { id: 'software-engineer', name: 'Software Engineer' },
  { id: 'graphic-designer', name: 'Graphic Designer' },
  { id: 'customer-service', name: 'Customer Service' },
  { id: 'it-professional', name: 'IT Professional' },
  { id: 'project-manager', name: 'Project Manager' },
  { id: 'creative-writer', name: 'Creative Writer' },
  { id: 'stellar', name: 'Stellar (Circular Photo)' },
  { id: 'dynamic', name: 'Dynamic (Circular Photo)' },
  { id: 'cascade', name: 'Cascade (Circular Photo)' },
  { id: 'folio', name: 'Folio (Square Photo)' },
  { id: 'impact', name: 'Impact (Square Photo)' },
  { id: 'onyx', name: 'Onyx (Square Photo)' },
];

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 70 }, (_, i) => (currentYear + 5 - i).toString());

const degreeLevels = [
  "High School Diploma",
  "GED",
  "Associate of Arts",
  "Associate of Science",
  "Associate of Applied Science",
  "Bachelor of Arts",
  "Bachelor of Science",
  "Bachelor of Business Administration",
  "Master of Arts",
  "Master of Science",
  "Master of Business Administration (MBA)",
  "Juris Doctor (JD)",
  "Doctor of Medicine (MD)",
  "Doctor of Philosophy (PhD)",
  "Other",
];

const languageLevels = ["Native", "Fluent", "Proficient", "Conversational", "Basic"];

const templateComponents = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    creative: CreativeTemplate,
    professional: ProfessionalTemplate,
    minimalist: MinimalistTemplate,
    executive: ExecutiveTemplate,
    simple: SimpleTemplate,
    technical: TechnicalTemplate,
    academic: AcademicTemplate,
    sales: SalesTemplate,
    marketing: MarketingTemplate,
    healthcare: HealthcareTemplate,
    legal: LegalTemplate,
    finance: FinanceTemplate,
    hospitality: HospitalityTemplate,
    'software-engineer': SoftwareEngineerTemplate,
    'graphic-designer': GraphicDesignerTemplate,
    'customer-service': CustomerServiceTemplate,
    'it-professional': ItProfessionalTemplate,
    'project-manager': ProjectManagerTemplate,
    'creative-writer': CreativeWriterTemplate,
    stellar: StellarTemplate,
    dynamic: DynamicTemplate,
    cascade: CascadeTemplate,
    folio: FolioTemplate,
    impact: ImpactTemplate,
    onyx: OnyxTemplate,
};

type ResumeBuilderContextType = {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
    debouncedResumeData: ResumeData;
    currentStep: string;
    setCurrentStep: React.Dispatch<React.SetStateAction<string>>;
    selectedTemplate: string;
    setSelectedTemplate: React.Dispatch<React.SetStateAction<string>>;
    isDownloading: boolean;
    toast: (options: { title: string; description: string; variant?: "default" | "destructive" }) => void;
    aiSuggestions: GenerateResumeContentOutput | null;
    generatingIndex: number | null;
    suggestionsForIndex: number | null;
    generatingSkills: boolean;
    suggestionsForRole: string | null;
    jobTitleSuggestions: string[];
    suggestionsLoadingFor: number | null;
    activeSuggestionBox: number | null;
    summarySuggestions: string[];
    isGeneratingSummary: boolean;
    isMobile: boolean;
    addedSections: string[];
    isFinalizing: boolean;
    setIsFinalizing: React.Dispatch<React.SetStateAction<boolean>>;
    accentColor: string;
    setAccentColor: React.Dispatch<React.SetStateAction<string>>;
    fontSize: 'sm' | 'md' | 'lg';
    setFontSize: React.Dispatch<React.SetStateAction<'sm' | 'md' | 'lg'>>;
    previewContainerRef: React.RefObject<HTMLDivElement>;
    previewContentRef: React.RefObject<HTMLDivElement>;
    TemplateComponent: React.FC<any>;
    steps: { id: string, name: string }[];
    handlePersonalChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSummaryChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    fetchJobTitleSuggestions: (query: string, index: number) => Promise<void>;
    handleExperienceChange: (index: number, name: string, value: any) => void;
    handleSuggestionClick: (suggestion: string, index: number) => void;
    setActiveSuggestionBox: React.Dispatch<React.SetStateAction<number | null>>;
    addExperience: () => void;
    removeExperience: (id: number) => void;
    handleEducationChange: (index: number, name: string, value: any) => void;
    addEducation: () => void;
    removeEducation: (id: number) => void;
    handleSkillsChange: (newSkills: string[]) => void;
    addCertification: () => void;
    removeCertification: (id: number) => void;
    handleCertificationChange: (index: number, name: string, value: string) => void;
    addLanguage: () => void;
    removeLanguage: (id: number) => void;
    handleLanguageChange: (index: number, name: string, value: string) => void;
    addActivity: () => void;
    removeActivity: (index: number) => void;
    handleActivityChange: (index: number, value: string) => void;
    addAward: () => void;
    removeAward: (id: number) => void;
    handleAwardChange: (index: number, name: string, value: string) => void;
    addWebsite: () => void;
    removeWebsite: (id: number) => void;
    handleWebsiteChange: (index: number, name: string, value: string) => void;
    addCustomSection: () => void;
    removeCustomSection: (id: number) => void;
    handleCustomSectionChange: (index: number, name: string, value: string) => void;
    handleReferencesChange: (checked: boolean) => void;
    handlePhotoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    handleAiGenerate: (index: number) => Promise<void>;
    handleAddResponsibility: (responsibility: string, experienceIndex: number) => void;
    handleAddSkill: (skill: string) => void;
    handleGenerateSummary: () => Promise<void>;
    handleApplySummary: (summary: string) => void;
    nextStep: () => void;
    prevStep: () => void;
    handleGoToStep: (stepId: string) => void;
    handleAddSection: (sectionId: string) => void;
    handleRemoveSection: (sectionId: string) => void;
    handleDownloadPdf: () => Promise<void>;
};

const ResumeBuilderContext = createContext<ResumeBuilderContextType | null>(null);

const useResumeBuilder = () => {
    const context = useContext(ResumeBuilderContext);
    if (!context) {
        throw new Error("useResumeBuilder must be used within a ResumeBuilderProvider");
    }
    return context;
}

const Editor = () => {
    const {
        currentStep, prevStep, nextStep, resumeData, handlePersonalChange, handlePhotoUpload,
        addExperience, removeExperience, handleExperienceChange, activeSuggestionBox, setActiveSuggestionBox,
        suggestionsLoadingFor, jobTitleSuggestions, handleSuggestionClick, handleAiGenerate, generatingIndex,
        aiSuggestions, suggestionsForIndex, handleAddResponsibility, addEducation, removeEducation, handleEducationChange,
        handleSkillsChange, handleAddSkill, suggestionsForRole, generatingSkills, handleSummaryChange, handleGenerateSummary,
        isGeneratingSummary, summarySuggestions, handleApplySummary, addedSections, optionalStepsData, handleRemoveSection,
        handleAddSection, activities, handleActivityChange, removeActivity, addActivity, awards, handleAwardChange,
        removeAward, addAward, certifications, handleCertificationChange, removeCertification, addCertification, languages,
        handleLanguageChange, removeLanguage, addLanguage, websites, handleWebsiteChange, removeWebsite, addWebsite,
        customSections, handleCustomSectionChange, removeCustomSection, addCustomSection, handleReferencesChange
    } = useResumeBuilder();

    const renderContent = () => {
      switch (currentStep) {
          case 'personal':
            return (
               <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>What's the best way for employers to contact you?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="photo-upload">Profile Photo</Label>
                        <div className="mt-2 flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={resumeData.personalInfo.photoUrl || ''} alt="Profile photo" data-ai-hint="person face" />
                                <AvatarFallback>{resumeData.personalInfo.firstName?.[0]}{resumeData.personalInfo.lastName?.[0]}</AvatarFallback>
                            </Avatar>
                            <Input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="max-w-xs" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" name="firstName" value={resumeData.personalInfo.firstName} onChange={handlePersonalChange} /></div>
                          <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" name="lastName" value={resumeData.personalInfo.lastName} onChange={handlePersonalChange} /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={resumeData.personalInfo.email} onChange={handlePersonalChange} /></div>
                          <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalChange} /></div>
                      </div>
                      <div><Label htmlFor="streetAddress">Street Address</Label><Input id="streetAddress" name="streetAddress" value={resumeData.personalInfo.streetAddress} onChange={handlePersonalChange} /></div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div><Label htmlFor="city">City</Label><Input id="city" name="city" value={resumeData.personalInfo.city} onChange={handlePersonalChange} /></div>
                          <div><Label htmlFor="state">State / Province</Label><Input id="state" name="state" value={resumeData.personalInfo.state} onChange={handlePersonalChange} /></div>
                          <div><Label htmlFor="zipCode">Zip / Postal Code</Label><Input id="zipCode" name="zipCode" value={resumeData.personalInfo.zipCode} onChange={handlePersonalChange} /></div>
                      </div>
                  </CardContent>
                </Card>
            );
          case 'add-section':
              return (
                  <Card>
                    <CardHeader>
                      <CardTitle>Add Sections to Your Resume</CardTitle>
                      <CardDescription>Strengthen your resume by adding these optional sections.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {optionalStepsData.map((section) => (
                        <div key={section.id} className="flex items-start gap-4 p-4 rounded-lg border bg-background hover:bg-secondary/50 transition-colors">
                          <section.icon className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-semibold">{section.name}</h3>
                            <p className="text-sm text-muted-foreground">{section.description}</p>
                          </div>
                          {addedSections.includes(section.id) ? (
                            <Button variant="ghost" className="text-destructive" onClick={() => handleRemoveSection(section.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </Button>
                          ) : (
                            <Button variant="secondary" onClick={() => handleAddSection(section.id)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add
                            </Button>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
              );
          default:
              return (
                <div className="max-w-xl mx-auto space-y-6">
                  {currentStep === 'experience' && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Work History</CardTitle>
                          <CardDescription>Tell us about your most recent job and we’ll go from there.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {resumeData.experience.map((exp, index) => (
                            <div key={exp.id} className="space-y-4 p-4 border rounded-lg relative bg-background">
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => removeExperience(exp.id)}><Trash2 size={16}/></Button>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="relative">
                                      <Label htmlFor={`role-${exp.id}`}>Job Title</Label>
                                      <Input 
                                          id={`role-${exp.id}`} 
                                          name="role" 
                                          value={exp.role} 
                                          onChange={(e) => handleExperienceChange(index, e.target.name, e.target.value)}
                                          onFocus={() => setActiveSuggestionBox(index)}
                                          onBlur={() => setTimeout(() => setActiveSuggestionBox(null), 150)}
                                          autoComplete="off"
                                      />
                                      {activeSuggestionBox === index && (
                                          <Card className="absolute top-full z-10 w-full mt-1 shadow-lg">
                                              <CardContent className="p-2 max-h-60 overflow-y-auto">
                                                  {suggestionsLoadingFor === index ? (
                                                      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                          Loading...
                                                      </div>
                                                  ) : jobTitleSuggestions.length > 0 ? (
                                                      <ul className="space-y-1">
                                                          {jobTitleSuggestions.map((suggestion, sIndex) => (
                                                              <li key={sIndex}>
                                                                  <button
                                                                      type="button"
                                                                      className="w-full text-left p-2 rounded-md hover:bg-secondary text-sm"
                                                                      onMouseDown={() => handleSuggestionClick(suggestion, index)}
                                                                  >
                                                                      {suggestion}
                                                                  </button>
                                                              </li>
                                                          ))}
                                                      </ul>
                                                  ) : ( exp.role.length > 2 && <div className="p-4 text-center text-sm text-muted-foreground">No suggestions.</div> )}
                                              </CardContent>
                                          </Card>
                                      )}
                                  </div>
                                  <div><Label htmlFor={`company-${exp.id}`}>Company</Label><Input id={`company-${exp.id}`} name="company" value={exp.company} onChange={(e) => handleExperienceChange(index, e.target.name, e.target.value)} /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Start Date</Label>
                                        <DatePicker date={exp.startDate || undefined} setDate={(date) => handleExperienceChange(index, 'startDate', date)} />
                                    </div>
                                     <div>
                                        <Label>End Date</Label>
                                        <DatePicker date={exp.endDate || undefined} setDate={(date) => handleExperienceChange(index, 'endDate', date)} disabled={exp.isCurrentJob} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox id={`current-${exp.id}`} checked={exp.isCurrentJob} onCheckedChange={(checked) => handleExperienceChange(index, 'isCurrentJob', Boolean(checked))} />
                                  <Label htmlFor={`current-${exp.id}`}>I currently work here</Label>
                                </div>
                                <div>
                                  <Label htmlFor={`description-${exp.id}`}>Description</Label>
                                  <Textarea id={`description-${exp.id}`} name="description" value={exp.description} onChange={(e) => handleExperienceChange(index, e.target.name, e.target.value)} placeholder="Describe your responsibilities and achievements..." />
                                </div>
                                <Button variant="outline" size="sm" onClick={() => handleAiGenerate(index)} disabled={generatingIndex === index}>
                                    {generatingIndex === index ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                    AI Suggestions for '{exp.role || "this role"}'
                                </Button>
                                {aiSuggestions && suggestionsForIndex === index && (
                                    <div className="space-y-1 max-h-40 overflow-y-auto">
                                      {aiSuggestions.responsibilities.map((resp, i) => (
                                        <button key={i} onClick={() => handleAddResponsibility(resp, index)} className="flex items-start gap-2 text-left p-1.5 rounded hover:bg-primary/10 w-full">
                                          <Plus size={14} className="mt-1 text-primary flex-shrink-0" />
                                          <span className="text-xs">{resp}</span>
                                        </button>
                                      ))}
                                    </div>
                                )}
                            </div>
                          ))}
                          <Button variant="secondary" onClick={addExperience}><Plus className="mr-2" />Add Another Position</Button>
                        </CardContent>
                      </Card>
                  )}
                  {currentStep === 'education' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Education</CardTitle>
                        <CardDescription>Tell us about your education.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {resumeData.education.map((edu, index) => (
                            <div key={edu.id} className="space-y-4 p-4 border rounded-lg relative bg-background">
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => removeEducation(edu.id)}><Trash2 size={16}/></Button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div><Label htmlFor={`school-${edu.id}`}>School Name</Label><Input id={`school-${edu.id}`} name="school" value={edu.school} onChange={(e) => handleEducationChange(index, e.target.name, e.target.value)} /></div>
                                  <div><Label htmlFor={`location-${edu.id}`}>School Location</Label><Input id={`location-${edu.id}`} name="location" value={edu.location} onChange={(e) => handleEducationChange(index, e.target.name, e.target.value)} /></div>
                                </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                      <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                                      <Select onValueChange={(value) => handleEducationChange(index, 'degree', value)} value={edu.degree}>
                                        <SelectTrigger id={`degree-${edu.id}`}><SelectValue placeholder="Select a degree" /></SelectTrigger>
                                        <SelectContent>
                                          {degreeLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                                        </SelectContent>
                                      </Select>
                                  </div>
                                  <div><Label htmlFor={`fieldOfStudy-${edu.id}`}>Field of Study</Label><Input id={`fieldOfStudy-${edu.id}`} name="fieldOfStudy" value={edu.fieldOfStudy} onChange={(e) => handleEducationChange(index, e.target.name, e.target.value)} /></div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox id={`current-edu-${edu.id}`} checked={edu.isStillEnrolled} onCheckedChange={(checked) => handleEducationChange(index, 'isStillEnrolled', Boolean(checked))} />
                                  <Label htmlFor={`current-edu-${edu.id}`}>I'm still enrolled</Label>
                                </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                      <Label>Graduation Month</Label>
                                      <Select onValueChange={(value) => handleEducationChange(index, 'graduationMonth', value)} value={edu.graduationMonth} disabled={edu.isStillEnrolled}>
                                          <SelectTrigger><SelectValue placeholder="Select month"/></SelectTrigger>
                                          <SelectContent>
                                              {months.map(month => <SelectItem key={month} value={month}>{month}</SelectItem>)}
                                          </SelectContent>
                                      </Select>
                                  </div>
                                  <div>
                                      <Label>Graduation Year</Label>
                                      <Select onValueChange={(value) => handleEducationChange(index, 'graduationYear', value)} value={edu.graduationYear} disabled={edu.isStillEnrolled}>
                                          <SelectTrigger><SelectValue placeholder="Select year"/></SelectTrigger>
                                          <SelectContent>
                                              {years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                                          </SelectContent>
                                      </Select>
                                  </div>
                                 </div>
                            </div>
                        ))}
                        <Button variant="secondary" onClick={addEducation}><Plus className="mr-2" />Add Another School</Button>
                      </CardContent>
                    </Card>
                  )}
                  {currentStep === 'skills' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Skills</CardTitle>
                        <CardDescription>Highlight your top skills.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Textarea 
                            placeholder="e.g., React, Project Management, SEO, Public Speaking"
                            value={resumeData.skills.join(', ')}
                            onChange={(e) => handleSkillsChange(e.target.value.split(',').map(s => s.trim()))}
                        />
                        {generatingSkills ? (
                          <div className="flex items-center gap-2 text-muted-foreground p-4 bg-secondary rounded-lg">
                              <Loader2 className="animate-spin h-5 w-5" />
                              <span>Loading AI skill suggestions...</span>
                          </div>
                        ) : aiSuggestions && (
                              <div className="p-4 bg-secondary rounded-lg">
                                <h4 className="font-semibold text-sm mb-2">Suggestions for a {suggestionsForRole || 'role'}</h4>
                                <div className="flex flex-wrap gap-2">
                                  {aiSuggestions.skills.map((skill, i) => (
                                    <Button key={i} size="sm" variant="outline" className="bg-white" onClick={() => handleAddSkill(skill)} disabled={resumeData.skills.includes(skill)}>
                                      <Plus size={14} className="mr-1" />{skill}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  {currentStep === 'summary' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Summary</CardTitle>
                        <CardDescription>Write a brief 2-4 sentence summary about your career.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Textarea 
                          className="h-32" 
                          value={resumeData.summary} 
                          onChange={handleSummaryChange} 
                          placeholder="e.g., Results-driven Software Engineer with 5+ years of experience..."
                        />
                        <Button variant="outline" onClick={handleGenerateSummary} disabled={isGeneratingSummary}>
                            {isGeneratingSummary ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                            Generate with AI
                        </Button>
                        {summarySuggestions.length > 0 && (
                            <div className="space-y-3">
                              {summarySuggestions.map((suggestion, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary">
                                  <p className="text-sm text-foreground flex-1">{suggestion}</p>
                                  <Button size="sm" variant="ghost" onClick={() => handleApplySummary(suggestion)}>
                                    <ClipboardPaste className="mr-2 h-4 w-4" />
                                    Use
                                  </Button>
                                </div>
                              ))}
                            </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                   {currentStep === 'activities' && (
                      <Card>
                          <CardHeader><CardTitle>Activities</CardTitle></CardHeader>
                          <CardContent className="space-y-4">
                              {resumeData.activities.map((activity, index) => (
                                  <div key={index} className="flex gap-2">
                                      <Input value={activity} onChange={e => handleActivityChange(index, e.target.value)} placeholder="e.g., Volunteer at animal shelter" />
                                      <Button variant="ghost" size="icon" onClick={() => removeActivity(index)}><Trash2 className="text-destructive h-4 w-4"/></Button>
                                  </div>
                              ))}
                              <Button variant="secondary" onClick={addActivity}><Plus className="mr-2"/>Add Activity</Button>
                          </CardContent>
                      </Card>
                   )}
                   {currentStep === 'awards' && (
                      <Card>
                          <CardHeader><CardTitle>Awards & Accomplishments</CardTitle></CardHeader>
                          <CardContent className="space-y-4">
                             {resumeData.awards.map((award, index) => (
                              <div key={award.id} className="p-4 border rounded-lg space-y-2 relative">
                                  <Button variant="ghost" size="icon" onClick={() => removeAward(award.id)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="text-destructive h-4 w-4"/></Button>
                                  <div><Label>Award Name</Label><Input value={award.name} onChange={e => handleAwardChange(index, 'name', e.target.value)} /></div>
                                  <div><Label>Date</Label><Input value={award.date} onChange={e => handleAwardChange(index, 'date', e.target.value)} /></div>
                                  <div><Label>Description</Label><Textarea value={award.description} onChange={e => handleAwardChange(index, 'description', e.target.value)} /></div>
                              </div>
                             ))}
                             <Button variant="secondary" onClick={addAward}><Plus className="mr-2"/>Add Award</Button>
                          </CardContent>
                      </Card>
                   )}
                   {currentStep === 'certifications' && (
                      <Card>
                          <CardHeader><CardTitle>Certifications & Licenses</CardTitle></CardHeader>
                          <CardContent className="space-y-4">
                               {resumeData.certifications.map((cert, index) => (
                                  <div key={cert.id} className="p-4 border rounded-lg space-y-2 relative">
                                      <Button variant="ghost" size="icon" onClick={() => removeCertification(cert.id)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="text-destructive h-4 w-4"/></Button>
                                      <div><Label>Name</Label><Input value={cert.name} onChange={e => handleCertificationChange(index, 'name', e.target.value)} /></div>
                                      <div><Label>Issuer</Label><Input value={cert.issuer} onChange={e => handleCertificationChange(index, 'issuer', e.target.value)} /></div>
                                      <div><Label>Date</Label><Input value={cert.date} onChange={e => handleCertificationChange(index, 'date', e.target.value)} /></div>
                                  </div>
                              ))}
                              <Button variant="secondary" onClick={addCertification}><Plus className="mr-2"/>Add Certification</Button>
                          </CardContent>
                      </Card>
                   )}
                   {currentStep === 'languages' && (
                      <Card>
                          <CardHeader><CardTitle>Languages</CardTitle></CardHeader>
                          <CardContent className="space-y-4">
                              {resumeData.languages.map((lang, index) => (
                                  <div key={lang.id} className="flex gap-2 items-end">
                                      <div className="flex-1"><Label>Language</Label><Input value={lang.name} onChange={e => handleLanguageChange(index, 'name', e.target.value)} /></div>
                                      <div className="flex-1">
                                          <Label>Level</Label>
                                          <Select onValueChange={(value) => handleLanguageChange(index, 'level', value)} value={lang.level}>
                                              <SelectTrigger><SelectValue/></SelectTrigger>
                                              <SelectContent>{languageLevels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                                          </Select>
                                      </div>
                                      <Button variant="ghost" size="icon" onClick={() => removeLanguage(lang.id)}><Trash2 className="text-destructive h-4 w-4"/></Button>
                                  </div>
                              ))}
                             <Button variant="secondary" onClick={addLanguage}><Plus className="mr-2"/>Add Language</Button>
                          </CardContent>
                      </Card>
                   )}
                   {currentStep === 'websites' && (
                      <Card>
                          <CardHeader><CardTitle>Websites & Social Links</CardTitle></CardHeader>
                          <CardContent className="space-y-4">
                               {resumeData.websites.map((site, index) => (
                                  <div key={site.id} className="flex gap-2 items-end">
                                      <div className="flex-1"><Label>Label</Label><Input value={site.label} onChange={e => handleWebsiteChange(index, 'label', e.target.value)} placeholder="e.g., LinkedIn, Portfolio" /></div>
                                      <div className="flex-1"><Label>URL</Label><Input value={site.url} onChange={e => handleWebsiteChange(index, 'url', e.target.value)} /></div>
                                      <Button variant="ghost" size="icon" onClick={() => removeWebsite(site.id)}><Trash2 className="text-destructive h-4 w-4"/></Button>
                                  </div>
                              ))}
                              <Button variant="secondary" onClick={addWebsite}><Plus className="mr-2"/>Add Link</Button>
                          </CardContent>
                      </Card>
                   )}
                   {currentStep === 'custom' && (
                      <Card>
                          <CardHeader><CardTitle>Custom Section</CardTitle></CardHeader>
                          <CardContent className="space-y-4">
                              {resumeData.customSections.map((section, index) => (
                                  <div key={section.id} className="p-4 border rounded-lg space-y-2 relative">
                                      <Button variant="ghost" size="icon" onClick={() => removeCustomSection(section.id)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="text-destructive h-4 w-4"/></Button>
                                      <div><Label>Title</Label><Input value={section.title} onChange={e => handleCustomSectionChange(index, 'title', e.target.value)} /></div>
                                      <div><Label>Content</Label><Textarea value={section.content} onChange={e => handleCustomSectionChange(index, 'content', e.target.value)} /></div>
                                  </div>
                              ))}
                              <Button variant="secondary" onClick={addCustomSection}><Plus className="mr-2"/>Add Custom Section</Button>
                          </CardContent>
                      </Card>
                   )}
                   {currentStep === 'references' && (
                      <Card>
                          <CardHeader><CardTitle>References</CardTitle></CardHeader>
                          <CardContent>
                              <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary">
                                  <Checkbox id="references" checked={resumeData.showReferences} onCheckedChange={(checked) => handleReferencesChange(Boolean(checked))} />
                                  <Label htmlFor="references">Show "References available upon request" on my resume.</Label>
                              </div>
                          </CardContent>
                      </Card>
                   )}
                </div>
              );
      }
    };
    
    return (
        <div className="lg:col-span-7 xl:col-span-8 w-full">
            {renderContent()}
            <div className="mt-8 pt-6 border-t flex justify-between">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 'template'}>
                    <ArrowLeft className="mr-2" />
                    Back
                </Button>
                <Button onClick={nextStep}>
                    {currentStep === 'add-section' ? 'Finalize' : 'Next'}
                    <ArrowRight className="ml-2" />
                </Button>
            </div>
        </div>
    );
};
  
const Preview = () => {
    const { debouncedResumeData, TemplateComponent, accentColor, fontSize, previewContainerRef, previewContentRef } = useResumeBuilder();
    return (
        <aside className="hidden lg:block lg:col-span-5 xl:col-span-4 lg:sticky top-24 self-start">
            <div ref={previewContainerRef} className="w-full max-w-full mx-auto overflow-hidden shadow-lg ring-1 ring-black/5">
                <div ref={previewContentRef} className="w-[850px] bg-white aspect-[210/297]">
                    <TemplateComponent data={debouncedResumeData} accentColor={accentColor} fontSize={fontSize} />
                </div>
            </div>
        </aside>
    );
};

const BuilderLayout = () => {
    return (
      <div className="min-h-screen">
          <div className="grid lg:grid-cols-12 lg:gap-8 items-start p-4 sm:p-6 md:p-8">
            <Editor />
            <Preview />
          </div>
      </div>
    );
};

export default function ResumeBuilder() {
  const [isBuilding, setIsBuilding] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [debouncedResumeData, setDebouncedResumeData] = useState<ResumeData>(initialResumeData);
  const debouncePreviewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [currentStep, setCurrentStep] = useState('template');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  
  const [aiSuggestions, setAiSuggestions] = useState<GenerateResumeContentOutput | null>(null);
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
  const [suggestionsForIndex, setSuggestionsForIndex] = useState<number | null>(null);
  const [generatingSkills, setGeneratingSkills] = useState(false);
  const [suggestionsForRole, setSuggestionsForRole] = useState<string | null>(null);
  
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState<string[]>([]);
  const [suggestionsLoadingFor, setSuggestionsLoadingFor] = useState<number | null>(null);
  const [activeSuggestionBox, setActiveSuggestionBox] = useState<number | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [summarySuggestions, setSummarySuggestions] = useState<string[]>([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  
  const isMobile = useIsMobile();
  const [addedSections, setAddedSections] = useState<string[]>([]);

  const [isFinalizing, setIsFinalizing] = useState(false);
  const [accentColor, setAccentColor] = useState(colorOptions[0].color);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewContentRef = useRef<HTMLDivElement>(null);

  
  const TemplateComponent = selectedTemplate ? templateComponents[selectedTemplate as keyof typeof templateComponents] : ModernTemplate;
  
  useEffect(() => {
    if (debouncePreviewTimeoutRef.current) {
      clearTimeout(debouncePreviewTimeoutRef.current);
    }
    debouncePreviewTimeoutRef.current = setTimeout(() => {
      setDebouncedResumeData(resumeData);
    }, 300);

    return () => {
      if (debouncePreviewTimeoutRef.current) {
        clearTimeout(debouncePreviewTimeoutRef.current);
      }
    };
  }, [resumeData]);

  useEffect(() => {
    const container = previewContainerRef.current;
    const content = previewContentRef.current;
    if (!container || !content) return;

    const applyScale = () => {
        const containerWidth = container.offsetWidth;
        const contentWidth = 850; 
        
        if (containerWidth > 0 && contentWidth > 0) {
            const scale = containerWidth / contentWidth;
            content.style.transform = `scale(${scale})`;
            content.style.transformOrigin = 'top left';
            container.style.height = `${content.getBoundingClientRect().height}px`; 
        }
    };

    const resizeObserver = new ResizeObserver(applyScale);
    resizeObserver.observe(container);
    
    const timeoutId = setTimeout(applyScale, 100);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.unobserve(container);
    };
}, [isFinalizing, selectedTemplate, isMobile, debouncedResumeData, accentColor, fontSize, currentStep]);



  const steps = [
    ...coreSteps,
    ...optionalStepsData.filter(s => addedSections.includes(s.id)),
    ...finalSteps,
  ];

  useEffect(() => {
    return () => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
    };
  }, []);

  useEffect(() => {
    const fetchSkillSuggestions = async () => {
      const lastExperienceWithRole = [...resumeData.experience].reverse().find(exp => exp.role);
      const latestRole = lastExperienceWithRole?.role;
  
      if (!latestRole || latestRole === suggestionsForRole) {
        if (!latestRole) {
            setAiSuggestions(null);
            setSuggestionsForRole(null);
        }
        return;
      }
      
      setGeneratingSkills(true);
      setSuggestionsForRole(latestRole);
      
      try {
        const result = await generateResumeContent({ jobTitle: latestRole });
        setAiSuggestions(result);
      } catch (error) {
        console.error(error);
        toast({ title: 'AI Suggestion Failed', description: 'Could not load skill suggestions.', variant: 'destructive' });
        setSuggestionsForRole(null);
      } finally {
        setGeneratingSkills(false);
      }
    };
  
    if(currentStep === 'skills') {
      fetchSkillSuggestions();
    }
  }, [currentStep, resumeData.experience, suggestionsForRole, toast]);


  const handlePersonalChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, [name]: value}}));
  }, []);
  
  const handleSummaryChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setResumeData(prev => ({...prev, summary: e.target.value}));
  }, []);

  const fetchJobTitleSuggestions = useCallback(async (query: string, index: number) => {
    try {
        const result = await suggestJobTitles({ query });
        setJobTitleSuggestions(result.titles);
    } catch (error) {
        console.error("Failed to fetch job title suggestions:", error);
        setJobTitleSuggestions([]);
    } finally {
        setSuggestionsLoadingFor(null);
    }
  }, []);
  
  const handleExperienceChange = useCallback((index: number, name: string, value: any) => {
    setResumeData(prev => {
        const newExperience = [...prev.experience];
        (newExperience[index] as any)[name] = value;
        return { ...prev, experience: newExperience };
    });

    if (name === 'role') {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        if (value.length < 3) {
            setJobTitleSuggestions([]);
            setActiveSuggestionBox(null);
            return;
        }
        
        setActiveSuggestionBox(index);
        setJobTitleSuggestions([]); 
        setSuggestionsLoadingFor(index); 

        debounceTimeoutRef.current = setTimeout(() => {
            fetchJobTitleSuggestions(value, index);
        }, 300);
    }
  }, [fetchJobTitleSuggestions]);

  const handleSuggestionClick = useCallback((suggestion: string, index: number) => {
    if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
    }
    setResumeData(prev => {
        const newExperience = [...prev.experience];
        newExperience[index].role = suggestion;
        return { ...prev, experience: newExperience };
    });
    setJobTitleSuggestions([]);
    setActiveSuggestionBox(null);
  }, []);

  const addExperience = useCallback(() => {
    setResumeData(prev => ({ ...prev, experience: [...prev.experience, { id: Date.now(), company: '', role: '', startDate: null, endDate: null, isCurrentJob: false, description: '', city: '', state: '' }]}));
  }, []);
  
  const removeExperience = useCallback((id: number) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
  }, []);
  
  const handleEducationChange = useCallback((index: number, name: string, value: any) => {
    setResumeData(prev => {
        const newEducation = [...prev.education];
        (newEducation[index] as any)[name] = value;
        return { ...prev, education: newEducation };
    });
  }, []);


  const addEducation = useCallback(() => {
    setResumeData(prev => ({ ...prev, education: [...prev.education, { id: Date.now(), school: '', location: '', degree: '', fieldOfStudy: '', graduationMonth: '', graduationYear: '', isStillEnrolled: false }]}));
  }, []);

  const removeEducation = useCallback((id: number) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
  }, []);

  const handleSkillsChange = useCallback((newSkills: string[]) => {
    setResumeData(prev => ({ ...prev, skills: newSkills }));
  }, []);

  const addCertification = useCallback(() => {
    setResumeData(prev => ({ ...prev, certifications: [...prev.certifications, { id: Date.now(), name: '', issuer: '', date: '' }]}));
  }, []);
  const removeCertification = useCallback((id: number) => {
    setResumeData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));
  }, []);
  const handleCertificationChange = useCallback((index: number, name: string, value: string) => {
    setResumeData(prev => {
        const newCerts = [...prev.certifications];
        (newCerts[index] as any)[name] = value;
        return { ...prev, certifications: newCerts };
    });
  }, []);

  const addLanguage = useCallback(() => {
    setResumeData(prev => ({ ...prev, languages: [...prev.languages, { id: Date.now(), name: '', level: 'Proficient' }]}));
  }, []);
  const removeLanguage = useCallback((id: number) => {
    setResumeData(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== id) }));
  }, []);
  const handleLanguageChange = useCallback((index: number, name: string, value: string) => {
    setResumeData(prev => {
        const newLangs = [...prev.languages];
        (newLangs[index] as any)[name] = value;
        return { ...prev, languages: newLangs };
    });
  }, []);

  const addActivity = useCallback(() => {
    setResumeData(prev => ({ ...prev, activities: [...prev.activities, ''] }));
  }, []);
  const removeActivity = useCallback((index: number) => {
    setResumeData(prev => ({ ...prev, activities: prev.activities.filter((_, i) => i !== index) }));
  }, []);
  const handleActivityChange = useCallback((index: number, value: string) => {
    setResumeData(prev => {
        const newActivities = [...prev.activities];
        newActivities[index] = value;
        return { ...prev, activities: newActivities };
    });
  }, []);

  const addAward = useCallback(() => {
    setResumeData(prev => ({...prev, awards: [...prev.awards, { id: Date.now(), name: '', date: '', description: '' }]}));
  }, []);
  const removeAward = useCallback((id: number) => {
    setResumeData(prev => ({ ...prev, awards: prev.awards.filter(a => a.id !== id) }));
  }, []);
  const handleAwardChange = useCallback((index: number, name: string, value: string) => {
    setResumeData(prev => {
        const newAwards = [...prev.awards];
        (newAwards[index] as any)[name] = value;
        return { ...prev, awards: newAwards };
    });
  }, []);
  
  const addWebsite = useCallback(() => {
    setResumeData(prev => ({ ...prev, websites: [...prev.websites, { id: Date.now(), label: '', url: '' }]}));
  }, []);
  const removeWebsite = useCallback((id: number) => {
    setResumeData(prev => ({ ...prev, websites: prev.websites.filter(w => w.id !== id) }));
  }, []);
  const handleWebsiteChange = useCallback((index: number, name: string, value: string) => {
    setResumeData(prev => {
        const newWebsites = [...prev.websites];
        (newWebsites[index] as any)[name] = value;
        return { ...prev, websites: newWebsites };
    });
  }, []);
  
  const addCustomSection = useCallback(() => {
    setResumeData(prev => ({ ...prev, customSections: [...prev.customSections, { id: Date.now(), title: '', content: '' }]}));
  }, []);
  const removeCustomSection = useCallback((id: number) => {
    setResumeData(prev => ({ ...prev, customSections: prev.customSections.filter(c => c.id !== id) }));
  }, []);
  const handleCustomSectionChange = useCallback((index: number, name: string, value: string) => {
    setResumeData(prev => {
        const newCustomSections = [...prev.customSections];
        (newCustomSections[index] as any)[name] = value;
        return { ...prev, customSections: newCustomSections };
    });
  }, []);
  
  const handleReferencesChange = useCallback((checked: boolean) => {
    setResumeData(prev => ({ ...prev, showReferences: checked }));
  }, []);

  const handlePhotoUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            photoUrl: reader.result as string,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);
  
  const handleAiGenerate = useCallback(async (index: number) => {
    const jobTitle = resumeData.experience[index].role;
    if (!jobTitle) {
      toast({ title: 'Role is missing', description: 'Please enter a role for this experience to get AI suggestions.', variant: 'destructive' });
      return;
    }
    setGeneratingIndex(index);
    if (jobTitle !== suggestionsForRole) {
        setAiSuggestions(null);
    }
    setSuggestionsForIndex(index);

    try {
      const result = await generateResumeContent({ jobTitle });
      setAiSuggestions(result);
      setSuggestionsForRole(jobTitle);
    } catch (error) {
      console.error(error);
      toast({ title: 'AI Generation Failed', description: 'Could not generate suggestions. Please try again.', variant: 'destructive' });
    } finally {
      setGeneratingIndex(null);
    }
  }, [resumeData.experience, suggestionsForRole, toast]);

  const handleAddResponsibility = useCallback((responsibility: string, experienceIndex: number) => {
    setResumeData(prev => {
        const newExperience = [...prev.experience];
        const currentDescription = newExperience[experienceIndex].description;
        newExperience[experienceIndex].description = (currentDescription ? currentDescription + '\n' : '') + `* ${responsibility}`;
        return { ...prev, experience: newExperience };
    });
  }, []);

  const handleAddSkill = useCallback((skill: string) => {
    setResumeData(prev => {
        if (!prev.skills.includes(skill)) {
            return { ...prev, skills: [...prev.skills, skill] };
        }
        return prev;
    });
  }, []);

  const handleGenerateSummary = useCallback(async () => {
    setIsGeneratingSummary(true);
    setSummarySuggestions([]);
    try {
        const relevantExperience = resumeData.experience.map(({ role, company, description }) => ({ role: role || '', company: company || '', description: description || '' }));
        const result = await generateResumeSummary({
            experience: relevantExperience,
            skills: resumeData.skills,
        });
        setSummarySuggestions(result.summaries);
    } catch (error) {
        console.error(error);
        toast({ title: 'AI Summary Failed', description: 'Could not generate summary suggestions. Please try again.', variant: 'destructive' });
    } finally {
        setIsGeneratingSummary(false);
    }
  }, [resumeData.experience, resumeData.skills, toast]);

  const handleApplySummary = useCallback((summary: string) => {
    setResumeData(prev => ({...prev, summary: summary}));
    toast({ title: 'Summary Applied', description: 'The AI-generated summary has been added to the editor.'});
  }, [toast]);

  const nextStep = useCallback(() => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentStep === 'template' && !selectedTemplate) {
      toast({ title: 'No Template Selected', description: 'Please select a template to continue.', variant: 'destructive' });
      return;
    }
    if (currentStep === 'add-section') {
      setIsFinalizing(true);
      return;
    }
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  }, [currentStep, selectedTemplate, steps, toast]);
  
  const prevStep = useCallback(() => {
    if (isFinalizing) {
        setIsFinalizing(false);
        setCurrentStep('add-section');
        return;
    }
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
       if (addedSections.includes(currentStep)) {
        setCurrentStep('add-section');
      }
      else {
        setCurrentStep(steps[currentIndex - 1].id);
      }
    }
  }, [isFinalizing, currentStep, steps, addedSections]);
  
  const handleGoToStep = useCallback((stepId: string) => {
    setCurrentStep(stepId);
    setIsFinalizing(false);
  }, []);

  const handleAddSection = useCallback((sectionId: string) => {
    if (!addedSections.includes(sectionId)) {
        setAddedSections(prev => [...prev, sectionId]);
        setCurrentStep(sectionId);
    }
  }, [addedSections]);

  const handleRemoveSection = useCallback((sectionId: string) => {
    setAddedSections(prev => prev.filter(id => id !== sectionId));
    
    const resetFunctions: { [key: string]: () => void } = {
        certifications: () => setResumeData(prev => ({ ...prev, certifications: [] })),
        languages: () => setResumeData(prev => ({ ...prev, languages: [] })),
        activities: () => setResumeData(prev => ({ ...prev, activities: [] })),
        awards: () => setResumeData(prev => ({ ...prev, awards: [] })),
        websites: () => setResumeData(prev => ({ ...prev, websites: [] })),
        custom: () => setResumeData(prev => ({ ...prev, customSections: [] })),
        references: () => setResumeData(prev => ({ ...prev, showReferences: false })),
    };

    if (resetFunctions[sectionId]) {
        resetFunctions[sectionId]();
    }
  }, []);


  const handleDownloadPdf = useCallback(async () => {
    setDebouncedResumeData(resumeData);
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const element = previewContentRef.current;
    if (!element) return;

    setIsDownloading(true);
    try {
      await document.fonts.ready;
      
      const originalTransform = element.style.transform;
      element.style.transform = 'scale(1)';
      await new Promise(resolve => setTimeout(resolve, 50));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      
      element.style.transform = originalTransform;

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jspdf({
        orientation: 'p',
        unit: 'pt',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      pdf.save(`${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`);
    } catch (error) {
      console.error("PDF Download Error:", error);
      toast({
        title: "Download Failed",
        description: "An error occurred while generating the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  }, [resumeData, toast]);

  const contextValue: ResumeBuilderContextType = {
    resumeData, setResumeData, debouncedResumeData, currentStep, setCurrentStep, selectedTemplate,
    setSelectedTemplate, isDownloading, toast, aiSuggestions, generatingIndex, suggestionsForIndex,
    generatingSkills, suggestionsForRole, jobTitleSuggestions, suggestionsLoadingFor, activeSuggestionBox,
    summarySuggestions, isGeneratingSummary, isMobile, addedSections, isFinalizing, setIsFinalizing,
    accentColor, setAccentColor, fontSize, setFontSize, previewContainerRef, previewContentRef,
    TemplateComponent, steps, handlePersonalChange, handleSummaryChange, fetchJobTitleSuggestions,
    handleExperienceChange, handleSuggestionClick, setActiveSuggestionBox, addExperience, removeExperience,
    handleEducationChange, addEducation, removeEducation, handleSkillsChange, addCertification,
    removeCertification, handleCertificationChange, addLanguage, removeLanguage, handleLanguageChange,
    addActivity, removeActivity, handleActivityChange, addAward, removeAward, handleAwardChange, addWebsite,
    removeWebsite, handleWebsiteChange, addCustomSection, removeCustomSection, handleCustomSectionChange,
    handleReferencesChange, handlePhotoUpload, handleAiGenerate, handleAddResponsibility, handleAddSkill,
    handleGenerateSummary, handleApplySummary, nextStep, prevStep, handleGoToStep, handleAddSection,
    handleRemoveSection, handleDownloadPdf
  };

  if (!isBuilding) {
    return (
      <div className="w-full">
        <section className="text-center py-20 px-4 sm:px-6 lg:px-8">
          <FileCheck2 className="w-16 h-16 mx-auto text-primary mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            The AI-Powered Resume Builder
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Create a professional, ATS-friendly resume in minutes. Get AI-powered suggestions, choose from professional templates, and land your dream job.
          </p>
          <div className="mt-10">
            <Button size="lg" className="text-lg h-14 px-10" onClick={() => setIsBuilding(true)}>
              Create My Resume
            </Button>
          </div>
        </section>

        <section className="bg-secondary/50 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Why Choose AI Resume Pro?</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                We provide the tools and expertise you need to craft a standout resume that gets results.
              </p>
            </div>
            <div className="mt-16 grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">Impressive Resumes, Made Easy</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Win over employers and recruiters by using one of our 20+ elegant, professionally-tested resume templates.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">ATS-Friendly & Recruiter-Approved</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Our resume templates are designed to get you past applicant tracking systems (ATS) and into the hands of a real person.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">Expert Tips & Guidance</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Get the help you need to create a professional resume in minutes. No more writer's block or formatting struggles!
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <ResumeBuilderContext.Provider value={contextValue}>
        <ResumeBuilderContent />
    </ResumeBuilderContext.Provider>
  )
}

const ResumeBuilderContent = () => {
    const { 
        currentStep, selectedTemplate, setSelectedTemplate, nextStep, previewContainerRef, 
        previewContentRef, TemplateComponent, accentColor, fontSize, 
        isFinalizing, setIsFinalizing, setAccentColor, handleDownloadPdf, isDownloading
    } = useResumeBuilder();

    const FinalizeScreen = () => (
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
            <div className="grid lg:grid-cols-12 lg:gap-8">
                <main className="lg:col-span-7 xl:col-span-8 flex flex-col items-center">
                    <div className="flex justify-between w-full max-w-xl mb-4">
                        <Button variant="outline" onClick={() => setIsFinalizing(false)}>
                            <ArrowLeft className="mr-2" />
                            Back to Editor
                        </Button>
                        <Button size="lg" onClick={handleDownloadPdf} disabled={isDownloading}>
                            {isDownloading ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />}
                            Download PDF
                        </Button>
                    </div>
                    <div 
                        ref={previewContainerRef}
                        className="w-full max-w-xl shadow-lg ring-1 ring-black/5 overflow-hidden"
                    >
                        <div ref={previewContentRef} className="w-[850px] bg-white aspect-[210/297]">
                            <TemplateComponent data={useResumeBuilder().debouncedResumeData} accentColor={accentColor} fontSize={fontSize} />
                        </div>
                    </div>
                </main>
                <aside className="lg:col-span-5 xl:col-span-4 mt-8 lg:mt-0 space-y-6 lg:sticky top-8 self-start">
                    <Card>
                        <CardHeader>
                            <CardTitle>Final Touches</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Template</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {templates.map((template) => (
                                    <div 
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template.id)}
                                        className={cn(
                                            "cursor-pointer rounded-md border-2 p-0.5 transition-all",
                                            selectedTemplate === template.id ? "border-primary" : "border-transparent hover:border-primary/50"
                                        )}
                                    >
                                        <ResumeThumbnail templateId={template.id as keyof typeof templateComponents} />
                                    </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Palette size={20}/> Accent Color</h3>
                                <div className="flex flex-wrap gap-3">
                                    {colorOptions.map(option => (
                                        <button key={option.name} onClick={() => setAccentColor(option.color)} className={cn("h-8 w-8 rounded-full border-2 transition-all", accentColor === option.color ? 'border-primary ring-2 ring-primary/50 ring-offset-2' : 'border-gray-200')} style={{backgroundColor: option.color}} />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );

    if (isFinalizing) {
        return <FinalizeScreen />;
    }

    if (currentStep === 'template') {
        return (
            <div className="w-full">
                <div className="text-center py-12 px-4">
                    <h3 className="text-3xl font-bold">Choose a template to get started</h3>
                    <p className="text-muted-foreground mt-2">You can change it any time.</p>
                </div>

                <div className="lg:grid lg:grid-cols-12 gap-8 items-start px-4 lg:px-8 pb-12">
                    <div className="lg:col-span-7 xl:col-span-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {templates.map((template) => (
                                <div 
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template.id)}
                                    className="cursor-pointer group"
                                >
                                    <div className={cn(
                                        "rounded-lg border-2 p-1 transition-all group-hover:border-primary group-hover:shadow-lg",
                                        selectedTemplate === template.id ? "border-primary" : "border-card"
                                    )}>
                                        <ResumeThumbnail templateId={template.id as keyof typeof templateComponents} />
                                    </div>
                                    <p className="text-center text-sm font-medium mt-2 group-hover:text-primary">{template.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside className="lg:col-span-5 xl:col-span-4 lg:sticky top-24 self-start mt-8 lg:mt-0">
                        {selectedTemplate ? (
                            <>
                                <div ref={previewContainerRef} className="w-full max-w-full mx-auto shadow-lg ring-1 ring-black/5 overflow-hidden">
                                    <div ref={previewContentRef} className="w-[850px] bg-white aspect-[210/297]">
                                        <TemplateComponent data={sampleResumeData} accentColor={accentColor} fontSize={fontSize} />
                                    </div>
                                </div>
                                <Button onClick={nextStep} size="lg" className="w-full mt-6 h-12 text-lg">
                                    Continue with this template <ArrowRight className="ml-2" />
                                </Button>
                            </>
                        ) : (
                            <div className="hidden lg:flex items-center justify-center h-96 border-2 border-dashed rounded-lg bg-secondary/50">
                                <p className="text-muted-foreground">Click a template to preview</p>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        );
    }
  
    return <BuilderLayout />;
}
