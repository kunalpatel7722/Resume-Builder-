
"use client";

import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import Link from 'next/link';
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
import { FileCheck2, Bot, Plus, Trash2, Loader2, Download, Wand2, Palette, Edit, Baby, ChevronsUp, Briefcase, Building, Trophy, GraduationCap, Globe, FileImage, FilePlus2, UploadCloud, Bold, Italic, List, Underline, ClipboardPaste, Award, Info, Languages, Users, FileText, CheckCircle, Activity, Link as LinkIcon, Pencil, CaseSensitive, FileSignature, SpellCheck, ArrowLeft } from 'lucide-react';
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
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ResumeThumbnail } from './resume-templates/resume-thumbnail';
import { useIsMobile } from '@/hooks/use-mobile';


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
  personalInfo: { firstName: '', lastName: '', email: '', phone: '', streetAddress: '', city: '', state: '', zipCode: '' },
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

const coreSteps = [
  { id: 'career-level', name: 'Career Level' },
  { id: 'target-country', name: 'Target Country' },
  { id: 'template', name: 'Choose Template' },
  { id: 'select-method', name: 'Start' },
  { id: 'personal', name: 'Personal Info' },
  { id: 'experience', name: 'Experience' },
  { id: 'experience-description', name: 'Job Description' },
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

const finalizationSections = [
    {id: 'summary', name: 'Summary', icon: FileSignature},
    {id: 'skills', name: 'Skills', icon: CheckCircle},
    {id: 'experience', name: 'Experience', icon: Briefcase},
    {id: 'education', name: 'Education', icon: GraduationCap},
];

const colorOptions = [
    { name: 'Indigo', color: '#4F46E5' },
    { name: 'Blue', color: '#3B82F6' },
    { name: 'Green', color: '#10B981' },
    { name: 'Red', color: '#EF4444' },
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
];

const careerLevels = [
  { title: 'No Experience', icon: Baby },
  { title: 'Less than 3 years', icon: ChevronsUp },
  { title: '3-5 years', icon: Briefcase },
  { title: '5-10 years', icon: Building },
  { title: '10+ years', icon: Trophy },
  { title: 'Student / Intern', icon: GraduationCap },
];

const countries = [
  { name: 'United States', icon: '🇺🇸' },
  { name: 'United Kingdom', icon: '🇬🇧' },
  { name: 'Canada', icon: '🇨🇦' },
  { name: 'Australia', icon: '🇦🇺' },
  { name: 'Germany', icon: '🇩🇪' },
  { name: 'Other', icon: '🌍' },
];

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 70 }, (_, i) => (currentYear + 5 - i).toString());

const fullWidthSteps = ['career-level', 'target-country', 'template', 'select-method'];

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

export default function ResumeBuilder() {
  const [isBuilding, setIsBuilding] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [currentStep, setCurrentStep] = useState('career-level');
  const [careerLevel, setCareerLevel] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  
  const [aiSuggestions, setAiSuggestions] = useState<GenerateResumeContentOutput | null>(null);
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
  const [suggestionsForIndex, setSuggestionsForIndex] = useState<number | null>(null);
  const [editorFocus, setEditorFocus] = useState<{ id: string; start: number; end: number } | null>(null);
  const [generatingSkills, setGeneratingSkills] = useState(false);
  const [suggestionsForRole, setSuggestionsForRole] = useState<string | null>(null);
  
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState<string[]>([]);
  const [suggestionsLoadingFor, setSuggestionsLoadingFor] = useState<number | null>(null);
  const [activeSuggestionBox, setActiveSuggestionBox] = useState<number | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [summarySuggestions, setSummarySuggestions] = useState<string[]>([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [addedSections, setAddedSections] = useState<string[]>([]);

  const [isFinalizing, setIsFinalizing] = useState(false);
  const [accentColor, setAccentColor] = useState(colorOptions[0].color);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = previewContainerRef.current;
    const content = previewContentRef.current;

    if (!container || !content) return;

    const applyScale = () => {
      const containerWidth = container.offsetWidth;
      const contentWidth = content.offsetWidth;
      if (container.offsetWidth > 0 && contentWidth > 0) {
        const scale = containerWidth / contentWidth;
        content.style.transform = `scale(${scale})`;
        content.style.transformOrigin = 'top left';
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      applyScale();
    });

    resizeObserver.observe(container);

    setTimeout(applyScale, 50);

    return () => {
      if (container) resizeObserver.unobserve(container);
    };
  }, [isFinalizing, isMobile, mobileView, selectedTemplate, resumeData, accentColor, fontSize]);


  const showPreview = !fullWidthSteps.includes(currentStep);

  const steps = [
    ...coreSteps,
    ...optionalStepsData.filter(s => addedSections.includes(s.id)),
    ...finalSteps,
  ];

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
  };
  
  const TemplateComponent = templateComponents[selectedTemplate as keyof typeof templateComponents];

  useEffect(() => {
    // This is the cleanup function for the component unmount
    return () => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
    };
  }, []);

  useEffect(() => {
    if (editorFocus) {
      const el = document.getElementById(editorFocus.id) as HTMLTextAreaElement;
      if (el) {
        el.focus();
        el.setSelectionRange(editorFocus.start, editorFocus.end);
      }
      setEditorFocus(null);
    }
  }, [editorFocus, resumeData.experience]);

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
        setSuggestionsForRole(null); // Allow refetch on error
      } finally {
        setGeneratingSkills(false);
      }
    };
  
    if(currentStep === 'skills') {
      fetchSkillSuggestions();
    }
  }, [currentStep, resumeData.experience, suggestionsForRole, toast]);


  const handlePersonalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, [name]: value}}));
  };
  
  const handleSummaryChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setResumeData(prev => ({...prev, summary: e.target.value}));
  };

  const fetchJobTitleSuggestions = async (query: string, index: number) => {
    try {
        const result = await suggestJobTitles({ query });
        setJobTitleSuggestions(result.titles);
    } catch (error) {
        console.error("Failed to fetch job title suggestions:", error);
        setJobTitleSuggestions([]);
    } finally {
        setSuggestionsLoadingFor(null);
    }
  };
  
  const handleExperienceChange = (index: number, name: string, value: any) => {
    const newExperience = [...resumeData.experience];
    (newExperience[index] as any)[name] = value;
    setResumeData(prev => ({ ...prev, experience: newExperience }));

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
  };

  const handleSuggestionClick = (suggestion: string, index: number) => {
    if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
    }
    const newExperience = [...resumeData.experience];
    newExperience[index].role = suggestion;
    setResumeData(prev => ({ ...prev, experience: newExperience }));
    setJobTitleSuggestions([]);
    setActiveSuggestionBox(null);
  };

  const addExperience = () => {
    setResumeData(prev => ({ ...prev, experience: [...prev.experience, { id: Date.now(), company: '', role: '', startDate: null, endDate: null, isCurrentJob: false, description: '', city: '', state: '' }]}));
  };
  
  const removeExperience = (id: number) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
  };
  
  const handleEducationChange = (index: number, name: string, value: any) => {
    const newEducation = [...resumeData.education];
    (newEducation[index] as any)[name] = value;
    setResumeData(prev => ({ ...prev, education: newEducation }));
  };


  const addEducation = () => {
    setResumeData(prev => ({ ...prev, education: [...prev.education, { id: Date.now(), school: '', location: '', degree: '', fieldOfStudy: '', graduationMonth: '', graduationYear: '', isStillEnrolled: false }]}));
  };

  const removeEducation = (id: number) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
  };

  const handleSkillsChange = (newSkills: string[]) => {
    setResumeData(prev => ({ ...prev, skills: newSkills }));
  };

  const addCertification = () => {
    setResumeData(prev => ({ ...prev, certifications: [...prev.certifications, { id: Date.now(), name: '', issuer: '', date: '' }]}));
  };
  const removeCertification = (id: number) => {
    setResumeData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));
  };
  const handleCertificationChange = (index: number, name: string, value: string) => {
    const newCerts = [...resumeData.certifications];
    (newCerts[index] as any)[name] = value;
    setResumeData(prev => ({ ...prev, certifications: newCerts }));
  };

  const addLanguage = () => {
    setResumeData(prev => ({ ...prev, languages: [...prev.languages, { id: Date.now(), name: '', level: 'Proficient' }]}));
  };
  const removeLanguage = (id: number) => {
    setResumeData(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== id) }));
  };
  const handleLanguageChange = (index: number, name: string, value: string) => {
    const newLangs = [...resumeData.languages];
    (newLangs[index] as any)[name] = value;
    setResumeData(prev => ({ ...prev, languages: newLangs }));
  };

  const addActivity = () => {
    setResumeData(prev => ({ ...prev, activities: [...prev.activities, ''] }));
  };
  const removeActivity = (index: number) => {
    setResumeData(prev => ({ ...prev, activities: prev.activities.filter((_, i) => i !== index) }));
  };
  const handleActivityChange = (index: number, value: string) => {
    const newActivities = [...resumeData.activities];
    newActivities[index] = value;
    setResumeData(prev => ({ ...prev, activities: newActivities }));
  };

  const addAward = () => {
    setResumeData(prev => ({...prev, awards: [...prev.awards, { id: Date.now(), name: '', date: '', description: '' }]}));
  };
  const removeAward = (id: number) => {
    setResumeData(prev => ({ ...prev, awards: prev.awards.filter(a => a.id !== id) }));
  };
  const handleAwardChange = (index: number, name: string, value: string) => {
    const newAwards = [...resumeData.awards];
    (newAwards[index] as any)[name] = value;
    setResumeData(prev => ({ ...prev, awards: newAwards }));
  };
  
  const addWebsite = () => {
    setResumeData(prev => ({ ...prev, websites: [...prev.websites, { id: Date.now(), label: '', url: '' }]}));
  };
  const removeWebsite = (id: number) => {
    setResumeData(prev => ({ ...prev, websites: prev.websites.filter(w => w.id !== id) }));
  };
  const handleWebsiteChange = (index: number, name: string, value: string) => {
    const newWebsites = [...resumeData.websites];
    (newWebsites[index] as any)[name] = value;
    setResumeData(prev => ({ ...prev, websites: newWebsites }));
  };
  
  const addCustomSection = () => {
    setResumeData(prev => ({ ...prev, customSections: [...prev.customSections, { id: Date.now(), title: '', content: '' }]}));
  };
  const removeCustomSection = (id: number) => {
    setResumeData(prev => ({ ...prev, customSections: prev.customSections.filter(c => c.id !== id) }));
  };
  const handleCustomSectionChange = (index: number, name: string, value: string) => {
    const newCustomSections = [...resumeData.customSections];
    (newCustomSections[index] as any)[name] = value;
    setResumeData(prev => ({ ...prev, customSections: newCustomSections }));
  };
  
  const handleReferencesChange = (checked: boolean) => {
    setResumeData(prev => ({ ...prev, showReferences: checked }));
  };
  
  const handleAiGenerate = async (index: number) => {
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
  };

  const handleAddResponsibility = (responsibility: string, experienceIndex: number) => {
    const newExperience = [...resumeData.experience];
    const currentDescription = newExperience[experienceIndex].description;
    const newDescription = (currentDescription ? currentDescription + '\n' : '') + `* ${responsibility}`;
    
    handleExperienceChange(experienceIndex, 'description', newDescription);
  };

  const applyFormat = (index: number, format: 'bold' | 'italic' | 'underline' | 'bullet') => {
    const expId = resumeData.experience[index].id;
    const textareaId = `description-${expId}`;
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let newValue;
    let newStart;
    let newEnd;

    switch (format) {
      case 'bold':
        newValue = `${text.substring(0, start)}**${selectedText || 'text'}**${text.substring(end)}`;
        newStart = start + 2;
        newEnd = newStart + (selectedText || 'text').length;
        break;
      case 'italic':
        newValue = `${text.substring(0, start)}*${selectedText || 'text'}*${text.substring(end)}`;
        newStart = start + 1;
        newEnd = newStart + (selectedText || 'text').length;
        break;
      case 'underline':
        newValue = `${text.substring(0, start)}<u>${selectedText || 'text'}</u>${text.substring(end)}`;
        newStart = start + 3;
        newEnd = newStart + (selectedText || 'text').length;
        break;
      case 'bullet':
        const lineStart = text.lastIndexOf('\n', start - 1) + 1;
        newValue = `${text.substring(0, lineStart)}* ${text.substring(lineStart)}`;
        newStart = start + 2;
        newEnd = newStart;
        break;
      default:
        return;
    }
    
    handleExperienceChange(index, 'description', newValue);

    setEditorFocus({ id: textareaId, start: newStart, end: newEnd });
  };


  const handleAddSkill = (skill: string) => {
    if (!resumeData.skills.includes(skill)) {
      setResumeData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const handleGenerateSummary = async () => {
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
        toast({ title: 'AI Summary Failed', description: 'Could not generate summary suggestions. Please try again. Please try again.', variant: 'destructive' });
    } finally {
        setIsGeneratingSummary(false);
    }
  };

  const handleApplySummary = (summary: string) => {
    setResumeData(prev => ({...prev, summary: summary}));
    toast({ title: 'Summary Applied', description: 'The AI-generated summary has been added to the editor.'});
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentStep === 'add-section') {
      setIsFinalizing(true);
      return;
    }
    if (currentIndex < steps.length - 1) {
      if (currentStep === 'experience' && resumeData.experience.every(exp => exp.role)) {
        setCurrentStep('experience-description');
      } else if (currentStep === 'experience') {
        toast({ title: 'Role is required', description: 'Please enter a role for each experience before proceeding.', variant: 'destructive' });
      } else {
        setCurrentStep(steps[currentIndex + 1].id);
      }
    }
  };
  
  const prevStep = () => {
    if (isFinalizing) {
        setIsFinalizing(false);
        return;
    }
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
       if (currentStep === 'experience-description') {
        setCurrentStep('experience');
      } else if (addedSections.includes(currentStep)) {
        setCurrentStep('add-section');
      }
      else {
        setCurrentStep(steps[currentIndex - 1].id);
      }
    }
  };
  
  const handleGoToStep = (stepId: string) => {
    setCurrentStep(stepId);
    setIsFinalizing(false);
  }

  const handleCareerLevelSelect = (level: string) => {
    setCareerLevel(level);
    nextStep();
  };

  const handleCountrySelect = (country: string) => {
    setResumeData(prev => ({ ...prev, targetCountry: country }));
    nextStep();
  };

  const handleAddSection = (sectionId: string) => {
    if (!addedSections.includes(sectionId)) {
        setAddedSections(prev => [...prev, sectionId]);
        setCurrentStep(sectionId);
    }
  };

  const handleRemoveSection = (sectionId: string) => {
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
  };


  const handleDownloadPdf = async () => {
    const element = previewContentRef.current;
    if (!element) {
        if(isMobile) {
            toast({ title: "Preview not visible", description: "Please switch to the Preview tab to download the PDF.", variant: "destructive" });
        }
        return;
    }

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });

      const pdf = new jspdf({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Download Failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isBuilding) {
    return (
      <div className="bg-background min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <FileCheck2 className="w-12 h-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Create a Job-Winning Resume in Minutes
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              Our intuitive builder and AI-powered tools make resume writing fast and simple.
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-8 text-center mb-12">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <Palette className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Follow Guided Steps</h3>
              <p className="text-muted-foreground">Our guided steps allow you to create a polished, professional resume faster.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <Wand2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Get AI Suggestions</h3>
              <p className="text-muted-foreground">Search by job title to find pre-written, impactful descriptions for your resume.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <Edit className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Fine-Tune & Download</h3>
              <p className="text-muted-foreground">Quickly generate each section, fine-tune the details, and download your new resume.</p>
            </div>
          </div>
          <div className="text-center">
            <Button size="lg" className="text-lg py-7 px-10" onClick={() => setIsBuilding(true)}>
              Create My Resume Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const nextStepName = currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1].name : '';

  if (isFinalizing) {
    return (
        <div className="grid lg:grid-cols-12 lg:gap-8 lg:items-start bg-muted/40 p-4 lg:p-8">
            <aside className="lg:col-span-3 border-r bg-background p-4 lg:p-6 rounded-lg shadow-sm lg:sticky lg:top-24">
                <Button variant="outline" size="sm" onClick={() => setIsFinalizing(false)} className="mb-4">
                    <ArrowLeft className="mr-2" />
                    Back to Editor
                </Button>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Template</h3>
                        <div className="grid grid-cols-3 gap-2">
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
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Palette size={20}/> Color</h3>
                        <div className="flex flex-wrap gap-3">
                            {colorOptions.map(option => (
                                <button key={option.name} onClick={() => setAccentColor(option.color)} className={cn("h-8 w-8 rounded-full border-2 transition-all", accentColor === option.color ? 'border-primary ring-2 ring-primary/50 ring-offset-2' : 'border-gray-200')} style={{backgroundColor: option.color}} />
                            ))}
                        </div>
                    </div>
                    <div>
                         <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><CaseSensitive size={20}/> Font Size</h3>
                        <div className="flex items-center gap-2">
                            {fontSizes.map(size => (
                                <Button key={size.id} variant={fontSize === size.id ? 'default' : 'outline'} onClick={() => setFontSize(size.id as 'sm'|'md'|'lg')}>{size.name}</Button>
                            ))}
                        </div>
                    </div>
                     <div>
                         <h3 className="font-semibold text-lg mb-4">Resume Sections</h3>
                        <div className="space-y-2">
                            {finalizationSections.map(section => (
                                <Button key={section.id} variant="ghost" className="w-full justify-start" onClick={() => handleGoToStep(section.id)}>
                                    <section.icon className="mr-2" />
                                    {section.name}
                                </Button>
                            ))}
                             <Button variant="ghost" className="w-full justify-start" onClick={() => handleGoToStep('add-section')}>
                                <Plus className="mr-2" />
                                Add a section
                            </Button>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Proofread</h3>
                         <Button variant="outline" className="w-full justify-start" disabled>
                            <SpellCheck className="mr-2" />
                            Spell Check (Coming Soon)
                        </Button>
                    </div>
                </div>
            </aside>
            <main className="lg:col-span-9 flex flex-col items-center justify-start mt-8 lg:mt-0">
                 <div className="flex justify-end w-full max-w-md mb-4">
                     <Button size="lg" onClick={handleDownloadPdf} disabled={isDownloading}>
                        {isDownloading ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />}
                        Download PDF
                    </Button>
                 </div>
                 <div 
                    ref={previewContainerRef}
                    className="w-full max-w-md shadow-xl ring-1 ring-black/5"
                  >
                    <div ref={previewContentRef} className="w-[850px] bg-white aspect-[210/297] origin-top-left">
                        <TemplateComponent data={resumeData} accentColor={accentColor} fontSize={fontSize} />
                    </div>
                  </div>
            </main>
        </div>
    );
}

  return (
    <div className={cn(
        "bg-background",
        showPreview
            ? "lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start"
            : ""
    )}>
      
      {showPreview && !isMobile && (
        <aside className="hidden lg:flex flex-col gap-6 lg:col-span-5 bg-muted p-8 sticky top-24 items-center">
          <div 
            ref={previewContainerRef}
            className="w-full max-w-md shadow-xl ring-1 ring-black/5"
          >
             <div ref={previewContentRef} className="w-[850px] bg-white aspect-[210/297] origin-top-left">
                <TemplateComponent data={resumeData} accentColor={accentColor} fontSize={fontSize} />
            </div>
          </div>
        </aside>
      )}

      <main className={cn(
          "w-full p-4 sm:p-6 lg:p-8",
          showPreview
              ? "lg:col-span-7"
              : "max-w-4xl mx-auto py-16"
      )}>
        <div className="lg:hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Resume Builder</h2>
              <Button variant="outline" size="sm" onClick={() => setIsBuilding(false)}>Exit</Button>
            </div>
            <div className="flex items-center justify-between mb-8 space-x-1 sm:space-x-2 text-xs">
              {steps.map((step, index) => {
                  const stepIndex = steps.findIndex(s => s.id === currentStep);
                  const isActive = step.id === currentStep;
                  const isCompleted = stepIndex > index;
                  return (
                      <React.Fragment key={step.id}>
                          <div className="flex flex-col items-center text-center w-12">
                             <button onClick={() => setCurrentStep(step.id)} className={cn("w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors text-xs", 
                                  isActive ? 'bg-primary text-primary-foreground' : isCompleted ? 'bg-green-500 text-white' : 'bg-card border'
                             )}
                             disabled={!isCompleted && !isActive && step.id !== 'career-level' && !careerLevel}
                             >
                                  {isCompleted ? <FileCheck2 size={14}/> : index + 1}
                             </button>
                             <p className={cn("mt-2 text-center text-[10px] leading-tight", isActive && "font-bold text-primary")}>{step.name}</p>
                          </div>
                          {index < steps.length - 1 && <div className="flex-1 h-0.5 bg-border -mt-4"></div>}
                      </React.Fragment>
                  );
              })}
          </div>
        </div>

        {showPreview && (
            <div className="lg:hidden sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-2 mb-4 border-b">
                <div className="flex justify-center rounded-md bg-muted p-1 max-w-xs mx-auto">
                    <Button 
                        onClick={() => setMobileView('edit')}
                        variant={mobileView === 'edit' ? 'default' : 'ghost'}
                        className="flex-1"
                        size="sm"
                    >
                        Edit
                    </Button>
                    <Button 
                        onClick={() => setMobileView('preview')}
                        variant={mobileView === 'preview' ? 'default' : 'ghost'}
                        className="flex-1"
                        size="sm"
                    >
                        Preview
                    </Button>
                </div>
            </div>
        )}

        <div className={cn(
            "",
            showPreview ? "max-w-xl mx-auto lg:mx-0" : "max-w-4xl mx-auto",
            isMobile && mobileView === 'preview' ? 'hidden' : 'block'
        )}>
          {currentStep === 'career-level' && (
            <div className="space-y-4">
                <h3 className="text-2xl font-semibold">What's your career level?</h3>
                <p className="text-muted-foreground">This helps us tailor suggestions for you.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {careerLevels.map((level) => (
                        <Card 
                            key={level.title}
                            onClick={() => handleCareerLevelSelect(level.title)}
                            className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                        >
                            <CardContent className="p-6 flex items-center gap-4">
                                <level.icon className="h-8 w-8 text-primary" />
                                <span className="text-lg font-medium">{level.title}</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
          )}
          {currentStep === 'target-country' && (
            <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Where are you applying for jobs?</h3>
                <p className="text-muted-foreground">This helps us format your resume correctly for the region.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {countries.map((country) => (
                        <Card 
                            key={country.name}
                            onClick={() => handleCountrySelect(country.name)}
                            className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                        >
                            <CardContent className="p-6 flex items-center gap-4">
                                <span className="text-2xl">{country.icon}</span>
                                <span className="text-lg font-medium">{country.name}</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
          )}
          {currentStep === 'template' && (
            <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Choose Your Template</h3>
                <p className="text-muted-foreground">Select a template to get started. Your content will be automatically transferred.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                    {templates.map((template) => (
                        <div 
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={cn(
                                "cursor-pointer rounded-lg border-2 p-1 transition-all",
                                selectedTemplate === template.id ? "border-primary shadow-lg" : "border-transparent hover:border-primary/50"
                            )}
                        >
                            <ResumeThumbnail templateId={template.id as keyof typeof templateComponents} />
                            <p className="text-center text-sm font-medium mt-2">{template.name}</p>
                        </div>
                    ))}
                </div>
            </div>
          )}
          {currentStep === 'select-method' && (
            <div className="space-y-4">
                <h3 className="text-2xl font-semibold">How would you like to start?</h3>
                <p className="text-muted-foreground">You can either build a new resume from scratch or upload an existing one.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Card 
                        onClick={() => nextStep()}
                        className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                    >
                        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                            <FilePlus2 className="h-12 w-12 text-primary" />
                            <h4 className="text-lg font-semibold">Create a new resume</h4>
                            <p className="text-sm text-muted-foreground">Build your resume from scratch with our step-by-step resume builder.</p>
                        </CardContent>
                    </Card>
                    <Card 
                        className="cursor-not-allowed bg-muted/50 border-dashed"
                    >
                        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                            <UploadCloud className="h-12 w-12 text-muted-foreground" />
                            <h4 className="text-lg font-semibold text-muted-foreground">Upload an existing resume</h4>
                            <p className="text-sm text-muted-foreground">This feature is coming soon. We'll parse your resume and fill in the details automatically.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
          )}
          {currentStep === 'personal' && (
              <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">What's the best way for employers to contact you?</h3>
                  <p className="text-muted-foreground">We suggest including an email and phone number.</p>
                  <div className="space-y-4 pt-4">
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
                  </div>
              </div>
          )}
          {currentStep === 'experience' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Tell us about your most recent job</h3>
                <p className="text-muted-foreground">We’ll start with your most recent job and go back from there.</p>
                
                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="space-y-4 p-4 border rounded-lg relative">
                      <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeExperience(exp.id)}><Trash2 size={16}/></Button>
                      
                      <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <Label htmlFor={`role-${exp.id}`}>Job Title</Label>
                                <Input 
                                    id={`role-${exp.id}`} 
                                    name="role" 
                                    value={exp.role} 
                                    onChange={(e) => handleExperienceChange(index, e.target.name, e.target.value)}
                                    onBlur={() => setTimeout(() => setActiveSuggestionBox(null), 150)}
                                    autoComplete="off"
                                />
                                {activeSuggestionBox === index && (
                                    <Card className="absolute top-full z-10 w-full mt-1 shadow-lg">
                                        <CardContent className="p-2 max-h-60 overflow-y-auto">
                                            {suggestionsLoadingFor === index ? (
                                                <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Loading suggestions...
                                                </div>
                                            ) : jobTitleSuggestions.length > 0 ? (
                                                <ul className="space-y-1">
                                                    {jobTitleSuggestions.map((suggestion, sIndex) => (
                                                        <li key={sIndex}>
                                                            <button
                                                                type="button"
                                                                className="w-full text-left p-2 rounded-md hover:bg-muted text-sm"
                                                                onMouseDown={() => handleSuggestionClick(suggestion, index)}
                                                            >
                                                                {suggestion}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="p-4 text-center text-sm text-muted-foreground">
                                                    No suggestions found.
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                            <div><Label htmlFor={`company-${exp.id}`}>Company</Label><Input id={`company-${exp.id}`} name="company" value={exp.company} onChange={(e) => handleExperienceChange(index, e.target.name, e.target.value)} /></div>
                          </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div><Label htmlFor={`city-${exp.id}`}>City</Label><Input id={`city-${exp.id}`} name="city" value={exp.city} onChange={(e) => handleExperienceChange(index, e.target.name, e.target.value)} /></div>
                              <div><Label htmlFor={`state-${exp.id}`}>State</Label><Input id={`state-${exp.id}`} name="state" value={exp.state} onChange={(e) => handleExperienceChange(index, e.target.name, e.target.value)} /></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                  <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                                  <DatePicker
                                      date={exp.startDate ?? undefined}
                                      setDate={(date) => handleExperienceChange(index, 'startDate', date)}
                                  />
                              </div>
                              <div>
                                  <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                                  <DatePicker
                                      date={exp.endDate ?? undefined}
                                      setDate={(date) => handleExperienceChange(index, 'endDate', date)}
                                      disabled={exp.isCurrentJob}
                                  />
                              </div>
                          </div>
                          <div className="flex items-center space-x-2">
                              <Checkbox
                                  id={`currentJob-${exp.id}`}
                                  checked={exp.isCurrentJob}
                                  onCheckedChange={(checked) => {
                                      const isChecked = checked === true;
                                      handleExperienceChange(index, 'isCurrentJob', isChecked);
                                      if (isChecked) {
                                          handleExperienceChange(index, 'endDate', null);
                                      }
                                  }}
                              />
                              <Label htmlFor={`currentJob-${exp.id}`} className="font-normal">
                                  I currently work here
                              </Label>
                          </div>
                      </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addExperience}><Plus className="mr-2" />Add Another Position</Button>
              </div>
          )}
          {currentStep === 'experience-description' && (
            <div className="space-y-6">
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="space-y-4 p-4 border rounded-lg">
                   <h3 className="text-xl font-semibold">Next, write about what you did as a {exp.role || '...'}</h3>
                  <p className="text-muted-foreground">Pick from our ready-to-use phrases or write your own and get AI writing help.</p>

                  <div>
                    <div className="flex items-center gap-2 border border-input rounded-t-md p-1 bg-muted/50">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => applyFormat(index, 'bold')}><Bold size={16}/></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => applyFormat(index, 'italic')}><Italic size={16}/></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => applyFormat(index, 'underline')}><Underline size={16}/></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => applyFormat(index, 'bullet')}><List size={16}/></Button>
                    </div>
                    <Textarea 
                        id={`description-${exp.id}`}
                        name="description" 
                        value={exp.description} 
                        onChange={(e) => handleExperienceChange(index, e.target.name, e.target.value)} 
                        className="h-24 rounded-t-none border-t-0" 
                        placeholder="Use the toolbar to add formatting."
                      />
                  </div>
                   <Card className="bg-muted/50">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Wand2 className="h-5 w-5 text-primary" />
                             AI Content Helper for '{exp.role}'
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                         <Button onClick={() => handleAiGenerate(index)} disabled={generatingIndex === index}>
                              {generatingIndex === index ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                              Get Suggestions
                          </Button>
                    </CardContent>
                  </Card>

                  {aiSuggestions && suggestionsForIndex === index && (
                    <Card className="bg-muted/50">
                      <CardHeader className='p-3'>
                        <CardTitle className='text-sm'>AI Suggestions for '{resumeData.experience[suggestionsForIndex as number].role}'</CardTitle>
                      </CardHeader>
                      <CardContent className='p-3 pt-0'>
                        <p className="text-xs text-muted-foreground mb-2">Click to add a bullet point to the description above.</p>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {aiSuggestions.responsibilities.map((resp, i) => (
                            <button key={i} onClick={() => handleAddResponsibility(resp, index)} className="flex items-start gap-2 text-left p-1.5 rounded hover:bg-primary/10 w-full">
                              <Plus size={14} className="mt-1 text-primary flex-shrink-0" />
                              <span className="text-xs">{resp}</span>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          )}
           {currentStep === 'education' && (
               <div className="space-y-6">
                  <h3 className="text-2xl font-semibold">Tell us about your education</h3>
                  <p className="text-muted-foreground">Include every school, even if you're still there or didn't graduate.</p>
                  
                  {resumeData.education.map((edu, index) => (
                      <div key={edu.id} className="space-y-4 p-4 border rounded-lg relative">
                          <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeEducation(edu.id)}><Trash2 size={16}/></Button>
                          <div className="space-y-4">
                              <div>
                                  <Label htmlFor={`school-${edu.id}`}>School Name</Label>
                                  <Input id={`school-${edu.id}`} name="school" value={edu.school} onChange={(e) => handleEducationChange(index, e.target.name, e.target.value)} />
                              </div>
                               <div>
                                  <Label htmlFor={`location-${edu.id}`}>School Location</Label>
                                  <Input id={`location-${edu.id}`} name="location" value={edu.location} onChange={(e) => handleEducationChange(index, e.target.name, e.target.value)} />
                              </div>
                              <div>
                                  <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                                  <Select 
                                      onValueChange={(value) => handleEducationChange(index, 'degree', value)} 
                                      value={edu.degree}>
                                    <SelectTrigger id={`degree-${edu.id}`}>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {degreeLevels.map(level => (
                                            <SelectItem key={level} value={level}>{level}</SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                              </div>
                               <div>
                                  <Label htmlFor={`fieldOfStudy-${edu.id}`}>Field of Study</Label>
                                  <Input id={`fieldOfStudy-${edu.id}`} name="fieldOfStudy" value={edu.fieldOfStudy} onChange={(e) => handleEducationChange(index, e.target.name, e.target.value)} />
                              </div>
                              <div>
                                <Label>Graduation Date</Label>
                                <div className="grid grid-cols-2 gap-4">
                                  <Select 
                                    onValueChange={(value) => handleEducationChange(index, 'graduationMonth', value)} 
                                    value={edu.graduationMonth}
                                    disabled={edu.isStillEnrolled}
                                    >
                                    <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                                    <SelectContent>
                                      {months.map(month => <SelectItem key={month} value={month}>{month}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                   <Select 
                                     onValueChange={(value) => handleEducationChange(index, 'graduationYear', value)} 
                                     value={edu.graduationYear}
                                     disabled={edu.isStillEnrolled}
                                     >
                                    <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                                    <SelectContent>
                                      {years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`stillEnrolled-${edu.id}`}
                                  checked={edu.isStillEnrolled}
                                  onCheckedChange={(checked) => handleEducationChange(index, 'isStillEnrolled', checked === true)}
                                />
                                <Label htmlFor={`stillEnrolled-${edu.id}`} className="font-normal">
                                    I am still enrolled
                                </Label>
                             </div>
                          </div>
                      </div>
                  ))}
                  <Button variant="outline" onClick={addEducation}><Plus className="mr-2" />Add Another School</Button>
              </div>
          )}
           {currentStep === 'skills' && (
              <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">What skills would you like to highlight?</h3>
                  <p className="text-muted-foreground">We’ve chosen the following skills based on your job title to get you started.</p>
                  <Textarea 
                      placeholder="e.g., React, Project Management, SEO, Public Speaking"
                      value={resumeData.skills.join(', ')}
                      onChange={(e) => handleSkillsChange(e.target.value.split(',').map(s => s.trim()))}
                  />
                  {generatingSkills ? (
                    <div className="flex items-center gap-2 text-muted-foreground p-4 bg-muted/50 rounded-lg">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span>Loading AI skill suggestions based on your experience...</span>
                    </div>
                  ) : aiSuggestions && (
                        <Card className="bg-muted/50">
                          <CardHeader className='p-3'>
                            <CardTitle className='text-sm flex items-center gap-2'>
                              <Wand2 className="h-4 w-4 text-primary" />
                              <span>Top skills for a {suggestionsForRole || 'role'}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className='p-3 pt-0'>
                            <p className="text-xs text-muted-foreground mb-2">Click to add a skill.</p>
                            <div className="flex flex-wrap gap-2">
                              {aiSuggestions.skills.map((skill, i) => (
                                <Button key={i} size="sm" variant="secondary" onClick={() => handleAddSkill(skill)} disabled={resumeData.skills.includes(skill)}>
                                  <Plus size={14} className="mr-1" />{skill}
                                </Button>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                  )}
              </div>
          )}
           {currentStep === 'summary' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold">Almost there! Let’s write your summary.</h3>
                  <p className="text-sm text-muted-foreground">Write a brief, 2-4 sentence summary of your career, key achievements, and professional goals.</p>
                </div>
                <Textarea 
                  className="h-32" 
                  value={resumeData.summary} 
                  onChange={handleSummaryChange} 
                  placeholder="e.g., Results-driven Software Engineer with 5+ years of experience..."
                />
                <Card className="bg-muted/50">
                  <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                          <Wand2 className="h-5 w-5 text-primary" />
                            AI Summary Writer
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Use the information you've already provided to get a custom-written summary.
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                        <Button onClick={handleGenerateSummary} disabled={isGeneratingSummary}>
                            {isGeneratingSummary ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                            Write with AI
                        </Button>
                  </CardContent>
                </Card>

                  {summarySuggestions.length > 0 && (
                  <Card>
                    <CardHeader className='p-4 pb-2'>
                      <CardTitle className='text-base'>AI Suggestions</CardTitle>
                      <CardDescription className="text-xs">Click a summary to use it.</CardDescription>
                    </CardHeader>
                    <CardContent className='p-4 pt-0'>
                      <div className="space-y-3">
                        {summarySuggestions.map((suggestion, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground flex-1">{suggestion}</p>
                            <Button size="sm" variant="ghost" onClick={() => handleApplySummary(suggestion)}>
                              <ClipboardPaste className="mr-2 h-4 w-4" />
                              Use
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
          )}
          {currentStep === 'certifications' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Do you have any certifications?</h3>
              <p className="text-muted-foreground">Add any relevant certifications you have earned.</p>
              
              {resumeData.certifications.map((cert, index) => (
                <div key={cert.id} className="space-y-4 p-4 border rounded-lg relative">
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeCertification(cert.id)}><Trash2 size={16}/></Button>
                    <div className="space-y-4">
                        <div><Label htmlFor={`certName-${cert.id}`}>Certification Name</Label><Input id={`certName-${cert.id}`} name="name" value={cert.name} onChange={(e) => handleCertificationChange(index, e.target.name, e.target.value)} /></div>
                        <div><Label htmlFor={`certIssuer-${cert.id}`}>Issuing Organization</Label><Input id={`certIssuer-${cert.id}`} name="issuer" value={cert.issuer} onChange={(e) => handleCertificationChange(index, e.target.name, e.target.value)} /></div>
                        <div><Label htmlFor={`certDate-${cert.id}`}>Date Earned</Label><Input id={`certDate-${cert.id}`} name="date" value={cert.date} onChange={(e) => handleCertificationChange(index, e.target.name, e.target.value)} placeholder="e.g., May 2023" /></div>
                    </div>
                </div>
              ))}
              <Button variant="outline" onClick={addCertification}><Plus className="mr-2" />Add Another Certification</Button>
            </div>
          )}
           {currentStep === 'languages' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Which languages do you speak?</h3>
              <p className="text-muted-foreground">Add any languages you speak and your proficiency level.</p>
              
              {resumeData.languages.map((lang, index) => (
                <div key={lang.id} className="space-y-4 p-4 border rounded-lg relative">
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeLanguage(lang.id)}><Trash2 size={16}/></Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor={`langName-${lang.id}`}>Language</Label><Input id={`langName-${lang.id}`} name="name" value={lang.name} onChange={(e) => handleLanguageChange(index, e.target.name, e.target.value)} /></div>
                        <div>
                            <Label htmlFor={`langLevel-${lang.id}`}>Proficiency</Label>
                            <Select onValueChange={(value) => handleLanguageChange(index, 'level', value)} value={lang.level}>
                                <SelectTrigger id={`langLevel-${lang.id}`}><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {languageLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
              ))}
              <Button variant="outline" onClick={addLanguage}><Plus className="mr-2" />Add Another Language</Button>
            </div>
          )}
          {currentStep === 'activities' && (
            <div className="space-y-6">
                <h3 className="text-2xl font-semibold">What are your main activities or hobbies?</h3>
                <p className="text-muted-foreground">List a few key activities that show your personality.</p>
                {resumeData.activities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input 
                            value={activity}
                            onChange={(e) => handleActivityChange(index, e.target.value)}
                            placeholder="e.g., Volunteer Soccer Coach"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeActivity(index)}><Trash2 size={16} className="text-destructive"/></Button>
                    </div>
                ))}
                 <Button variant="outline" onClick={addActivity}><Plus className="mr-2" />Add Activity</Button>
            </div>
          )}
          {currentStep === 'awards' && (
            <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Have you received any awards or accomplishments?</h3>
                <p className="text-muted-foreground">Showcase your achievements and recognition.</p>
                {resumeData.awards.map((award, index) => (
                    <div key={award.id} className="space-y-4 p-4 border rounded-lg relative">
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeAward(award.id)}><Trash2 size={16}/></Button>
                        <div><Label htmlFor={`awardName-${award.id}`}>Award/Accomplishment</Label><Input id={`awardName-${award.id}`} name="name" value={award.name} onChange={(e) => handleAwardChange(index, e.target.name, e.target.value)} /></div>
                        <div><Label htmlFor={`awardDate-${award.id}`}>Date Received</Label><Input id={`awardDate-${award.id}`} name="date" value={award.date} onChange={(e) => handleAwardChange(index, e.target.name, e.target.value)} placeholder="e.g., June 2024" /></div>
                        <div><Label htmlFor={`awardDesc-${award.id}`}>Description</Label><Textarea id={`awardDesc-${award.id}`} name="description" value={award.description} onChange={(e) => handleAwardChange(index, 'description', e.target.value)} /></div>
                    </div>
                ))}
                 <Button variant="outline" onClick={addAward}><Plus className="mr-2" />Add Award</Button>
            </div>
          )}
           {currentStep === 'websites' && (
            <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Add your websites or social links</h3>
                <p className="text-muted-foreground">Link to your portfolio, GitHub, LinkedIn, etc.</p>
                {resumeData.websites.map((website, index) => (
                    <div key={website.id} className="space-y-4 p-4 border rounded-lg relative">
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeWebsite(website.id)}><Trash2 size={16}/></Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor={`websiteLabel-${website.id}`}>Label</Label><Input id={`websiteLabel-${website.id}`} name="label" value={website.label} onChange={(e) => handleWebsiteChange(index, e.target.name, e.target.value)} placeholder="e.g., Portfolio" /></div>
                            <div><Label htmlFor={`websiteUrl-${website.id}`}>URL</Label><Input id={`websiteUrl-${website.id}`} name="url" value={website.url} onChange={(e) => handleWebsiteChange(index, e.target.name, e.target.value)} placeholder="https://..." /></div>
                        </div>
                    </div>
                ))}
                <Button variant="outline" onClick={addWebsite}><Plus className="mr-2" />Add Link</Button>
            </div>
          )}
          {currentStep === 'custom' && (
            <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Create a custom section</h3>
                <p className="text-muted-foreground">Add a section with your own title and content.</p>
                {resumeData.customSections.map((section, index) => (
                    <div key={section.id} className="space-y-4 p-4 border rounded-lg relative">
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeCustomSection(section.id)}><Trash2 size={16}/></Button>
                        <div><Label htmlFor={`customTitle-${section.id}`}>Section Title</Label><Input id={`customTitle-${section.id}`} name="title" value={section.title} onChange={(e) => handleCustomSectionChange(index, e.target.name, e.target.value)} placeholder="e.g., Volunteer Experience" /></div>
                        <div><Label htmlFor={`customContent-${section.id}`}>Content</Label><Textarea id={`customContent-${section.id}`} name="content" value={section.content} onChange={(e) => handleCustomSectionChange(index, 'content', e.target.value)} placeholder="Describe your experience..." /></div>
                    </div>
                ))}
                <Button variant="outline" onClick={addCustomSection}><Plus className="mr-2" />Add Custom Section</Button>
            </div>
          )}
          {currentStep === 'references' && (
            <div className="space-y-4">
                <h3 className="text-2xl font-semibold">References</h3>
                <p className="text-muted-foreground">It's standard practice to make references available upon request rather than listing them directly on your resume. Check the box to add this line to your resume.</p>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <Checkbox
                        id="showReferences"
                        checked={resumeData.showReferences}
                        onCheckedChange={(checked) => handleReferencesChange(checked === true)}
                    />
                    <Label htmlFor="showReferences" className="font-normal text-base">
                        Show "References available upon request" on my resume.
                    </Label>
                </div>
            </div>
          )}
           {currentStep === 'add-section' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Do you want to add any other sections?</h3>
              <p className="text-muted-foreground">Employers are impressed by a thorough resume. Add any of the sections below.</p>
              <Card>
                <CardContent className="p-4 space-y-2">
                    {optionalStepsData.map((section) => {
                        const isAdded = addedSections.includes(section.id);
                        return (
                            <div key={section.id} className="flex items-start gap-4 p-3 rounded-md bg-muted/50">
                                <section.icon className={cn("h-6 w-6 mt-1 flex-shrink-0", isAdded ? "text-primary" : "text-muted-foreground")} />
                                <div className="flex-1">
                                    <span className={cn("font-semibold", isAdded && "text-foreground")}>{section.name}</span>
                                    <p className="text-xs text-muted-foreground">{section.description}</p>
                                </div>
                                <div className="ml-auto flex items-center gap-2 self-center">
                                {isAdded ? (
                                    <>
                                        <Button variant="ghost" size="sm" onClick={() => handleRemoveSection(section.id)}>Remove</Button>
                                        <Button variant="outline" size="sm" onClick={() => setCurrentStep(section.id)}>Edit</Button>
                                    </>
                                ) : (
                                    <Button variant="secondary" size="sm" onClick={() => handleAddSection(section.id)}>
                                        <Plus className="mr-2 h-4 w-4" /> Add
                                    </Button>
                                )}
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
              </Card>
            </div>
           )}
        </div>
        
        <div className={cn("mt-8 pt-6 border-t flex", 
          showPreview ? "justify-between max-w-xl mx-auto lg:mx-0" : "justify-between max-w-4xl mx-auto",
          isMobile && mobileView === 'preview' ? 'hidden' : 'block'
        )}>
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 'career-level'}>Previous</Button>
           {currentStep === 'add-section' ? (
              <Button onClick={nextStep}>
                  Finish & Next
              </Button>
          ) : currentStep !== 'career-level' && currentStep !== 'target-country' && currentStep !== 'select-method' ? (
              <Button onClick={nextStep}>
                  Next: {nextStepName}
              </Button>
          ) : null}
         </div>

        {showPreview && isMobile && mobileView === 'preview' && (
            <div className="space-y-4">
                <div className="bg-muted p-2 -mx-4 -mt-4">
                    <div 
                        ref={previewContainerRef} 
                        className="w-full shadow-xl ring-1 ring-black/5"
                    >
                       <div ref={previewContentRef} className="w-[850px] bg-white aspect-[210/297] origin-top-left">
                            <TemplateComponent data={resumeData} accentColor={accentColor} fontSize={fontSize} />
                        </div>
                    </div>
                </div>
                {isFinalizing && (
                    <Button size="lg" onClick={handleDownloadPdf} disabled={isDownloading} className="w-full">
                        {isDownloading ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />}
                        Download PDF
                    </Button>
                )}
            </div>
        )}
      </main>

      {showPreview && !isMobile && (
        <aside className="hidden lg:flex flex-col gap-6 lg:col-span-5 bg-muted p-8 sticky top-24 items-center">
          <div 
            ref={previewContainerRef}
            className="w-full max-w-md shadow-xl ring-1 ring-black/5"
          >
             <div ref={previewContentRef} className="w-[850px] bg-white aspect-[210/297] origin-top-left">
                <TemplateComponent data={resumeData} accentColor={accentColor} fontSize={fontSize} />
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

    