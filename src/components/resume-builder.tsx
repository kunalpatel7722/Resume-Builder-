
"use client";

import React, { useState, useRef, ChangeEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateResumeContent, type GenerateResumeContentOutput } from '@/ai/flows/generate-resume-content';
import { ModernTemplate } from '@/components/resume-templates/modern-template';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { FileCheck2, Bot, Plus, Trash2, Loader2, Download, Wand2, Palette, Edit, Baby, ChevronsUp, Briefcase, Building, Trophy, GraduationCap, Globe, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClassicTemplate } from './resume-templates/classic-template';
import { CreativeTemplate } from './resume-templates/creative-template';
import { ResumeThumbnail } from './resume-templates/resume-thumbnail';
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

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  summary: string;
  experience: {
    id: number;
    company: string;
    role: string;
    dates: string;
    description: string;
  }[];
  education: {
    id: number;
    school: string;
    degree: string;
    dates: string;
  }[];
  skills: string[];
  targetCountry: string;
}

const initialResumeData: ResumeData = {
  personalInfo: { name: '', email: '', phone: '', address: '' },
  summary: '',
  experience: [{ id: 1, company: '', role: '', dates: '', description: '' }],
  education: [{ id: 1, school: '', degree: '', dates: '' }],
  skills: [],
  targetCountry: '',
};

const steps = [
  { id: 'career-level', name: 'Career Level' },
  { id: 'target-country', name: 'Target Country' },
  { id: 'template', name: 'Choose Template' },
  { id: 'personal', name: 'Personal Info' },
  { id: 'experience', name: 'Experience' },
  { id: 'education', name: 'Education' },
  { id: 'skills', name: 'Skills' },
  { id: 'summary', name: 'Summary' },
  { id: 'finalize', name: 'Finalize' },
];

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


export default function ResumeBuilder() {
  const [isBuilding, setIsBuilding] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [currentStep, setCurrentStep] = useState('career-level');
  const [careerLevel, setCareerLevel] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const [jobTitleForAi, setJobTitleForAi] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<GenerateResumeContentOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePersonalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, [name]: value}}));
  };
  
  const handleSummaryChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setResumeData(prev => ({...prev, summary: e.target.value}));
  };
  
  const handleExperienceChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newExperience = [...resumeData.experience];
    newExperience[index] = { ...newExperience[index], [name]: value };
    setResumeData(prev => ({ ...prev, experience: newExperience }));
  };

  const addExperience = () => {
    setResumeData(prev => ({ ...prev, experience: [...prev.experience, { id: Date.now(), company: '', role: '', dates: '', description: '' }]}));
  };
  
  const removeExperience = (id: number) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
  };
  
  const handleEducationChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newEducation = [...resumeData.education];
    newEducation[index] = { ...newEducation[index], [name]: value };
    setResumeData(prev => ({ ...prev, education: newEducation }));
  };

  const addEducation = () => {
    setResumeData(prev => ({ ...prev, education: [...prev.education, { id: Date.now(), school: '', degree: '', dates: '' }]}));
  };

  const removeEducation = (id: number) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
  };

  const handleSkillsChange = (newSkills: string[]) => {
    setResumeData(prev => ({ ...prev, skills: newSkills }));
  };

  const handleAiGenerate = async () => {
    if (!jobTitleForAi) {
      toast({ title: 'Job title is missing', description: 'Please enter a job title to get AI suggestions.', variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    setAiSuggestions(null);
    try {
      const result = await generateResumeContent({ jobTitle: jobTitleForAi });
      setAiSuggestions(result);
    } catch (error) {
      console.error(error);
      toast({ title: 'AI Generation Failed', description: 'Could not generate suggestions. Please try again.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddResponsibility = (responsibility: string, experienceIndex: number) => {
    const newExperience = [...resumeData.experience];
    const currentDescription = newExperience[experienceIndex].description;
    newExperience[experienceIndex].description = (currentDescription ? currentDescription + '\n' : '') + `• ${responsibility}`;
    setResumeData(prev => ({ ...prev, experience: newExperience }));
  };

  const handleAddSkill = (skill: string) => {
    if (!resumeData.skills.includes(skill)) {
      setResumeData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };
  
  const prevStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleCareerLevelSelect = (level: string) => {
    setCareerLevel(level);
    nextStep();
  };

  const handleCountrySelect = (country: string) => {
    setResumeData(prev => ({ ...prev, targetCountry: country }));
    nextStep();
  };


  const handleDownloadPdf = async () => {
    const element = previewRef.current;
    if (!element) return;

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
      pdf.save(`${resumeData.personalInfo.name.replace(' ', '_')}_Resume.pdf`);
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

  const templateComponents = {
    modern: <ModernTemplate data={resumeData} />,
    classic: <ClassicTemplate data={resumeData} />,
    creative: <CreativeTemplate data={resumeData} />,
    professional: <ProfessionalTemplate data={resumeData} />,
    minimalist: <MinimalistTemplate data={resumeData} />,
    executive: <ExecutiveTemplate data={resumeData} />,
    simple: <SimpleTemplate data={resumeData} />,
    technical: <TechnicalTemplate data={resumeData} />,
    academic: <AcademicTemplate data={resumeData} />,
    sales: <SalesTemplate data={resumeData} />,
    marketing: <MarketingTemplate data={resumeData} />,
    healthcare: <HealthcareTemplate data={resumeData} />,
    legal: <LegalTemplate data={resumeData} />,
    finance: <FinanceTemplate data={resumeData} />,
    hospitality: <HospitalityTemplate data={resumeData} />,
    'software-engineer': <SoftwareEngineerTemplate data={resumeData} />,
    'graphic-designer': <GraphicDesignerTemplate data={resumeData} />,
  };

  return (
    <div className="lg:grid lg:grid-cols-12 h-[calc(100vh-4rem)] bg-background">
      
      {/* Left Vertical Stepper (Desktop only) */}
      <aside className="hidden lg:flex flex-col gap-6 lg:col-span-3 border-r bg-card p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-foreground">Resume Builder</h2>
        <div className="space-y-1">
          {steps.map((step, index) => {
            const stepIndex = steps.findIndex(s => s.id === currentStep);
            const isActive = step.id === currentStep;
            const isCompleted = stepIndex > index;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "w-full flex items-center text-left p-3 rounded-lg transition-colors",
                  isActive ? "bg-primary/10 text-primary font-semibold" : isCompleted ? "text-muted-foreground" : "hover:bg-muted"
                )}
                disabled={!isCompleted && !isActive && step.id !== 'career-level' && !careerLevel}
              >
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center mr-4 border-2 flex-shrink-0",
                  isActive ? "bg-primary text-primary-foreground border-primary" : 
                  isCompleted ? "bg-green-500 text-white border-green-500" : "bg-card"
                )}>
                  {isCompleted ? <FileCheck2 size={16}/> : index + 1}
                </div>
                <span className="text-sm">{step.name}</span>
              </button>
            )
          })}
        </div>
      </aside>

      {/* Middle Form Panel */}
      <main className="lg:col-span-5 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Mobile Header and Stepper */}
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

        {/* Form Content */}
        <div className="max-w-xl mx-auto lg:mx-0 min-h-[50vh]">
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
          {currentStep === 'personal' && (
              <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label htmlFor="name">Full Name</Label><Input id="name" name="name" value={resumeData.personalInfo.name} onChange={handlePersonalChange} /></div>
                      <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={resumeData.personalInfo.email} onChange={handlePersonalChange} /></div>
                      <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalChange} /></div>
                      <div><Label htmlFor="address">Address, City, State</Label><Input id="address" name="address" value={resumeData.personalInfo.address} onChange={handlePersonalChange} /></div>
                  </div>
              </div>
          )}
          {currentStep === 'experience' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Work Experience</h3>
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base"><Bot size={18}/> AI Content Helper</CardTitle>
                        <CardDescription>Enter a job title to get AI-powered suggestions for responsibilities.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Input placeholder="e.g., 'Digital Marketing Manager'" value={jobTitleForAi} onChange={(e) => setJobTitleForAi(e.target.value)} />
                            <Button onClick={handleAiGenerate} disabled={isGenerating}>
                                {isGenerating ? <Loader2 className="animate-spin" /> : 'Generate'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="space-y-4 p-4 border rounded-lg relative">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><Label>Role</Label><Input name="role" value={exp.role} onChange={(e) => handleExperienceChange(index, e)} /></div>
                          <div><Label>Company</Label><Input name="company" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} /></div>
                          <div><Label>Dates (e.g., 2020 - Present)</Label><Input name="dates" value={exp.dates} onChange={(e) => handleExperienceChange(index, e)} /></div>
                      </div>
                      <div>
                          <Label>Description</Label>
                          <Textarea name="description" value={exp.description} onChange={(e) => handleExperienceChange(index, e)} className="h-24" placeholder="Start each bullet point on a new line with a '•'."/>
                      </div>
                      {aiSuggestions && (
                        <Card className="bg-muted/50">
                          <CardHeader className='p-3'>
                            <CardTitle className='text-sm'>Suggestions for '{jobTitleForAi}'</CardTitle>
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
                      <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeExperience(exp.id)}><Trash2 size={16}/></Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addExperience}><Plus className="mr-2" />Add Experience</Button>
              </div>
          )}
           {currentStep === 'education' && (
              <div className="space-y-6">
                  <h3 className="text-2xl font-semibold">Education</h3>
                  {resumeData.education.map((edu, index) => (
                      <div key={edu.id} className="space-y-4 p-4 border rounded-lg relative">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div><Label>School/University</Label><Input name="school" value={edu.school} onChange={(e) => handleEducationChange(index, e)} /></div>
                              <div><Label>Degree/Field of Study</Label><Input name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} /></div>
                              <div><Label>Dates (e.g., 2016 - 2020)</Label><Input name="dates" value={edu.dates} onChange={(e) => handleEducationChange(index, e)} /></div>
                          </div>
                          <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeEducation(edu.id)}><Trash2 size={16}/></Button>
                      </div>
                  ))}
                  <Button variant="outline" onClick={addEducation}><Plus className="mr-2" />Add Education</Button>
              </div>
          )}
           {currentStep === 'skills' && (
              <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">Skills</h3>
                  <p className="text-sm text-muted-foreground">Enter your skills below, separated by commas.</p>
                  <Textarea 
                      placeholder="e.g., React, Project Management, SEO, Public Speaking"
                      value={resumeData.skills.join(', ')}
                      onChange={(e) => handleSkillsChange(e.target.value.split(',').map(s => s.trim()))}
                  />
                  {aiSuggestions && (
                        <Card className="bg-muted/50">
                          <CardHeader className='p-3'>
                            <CardTitle className='text-sm'>Skill suggestions for '{jobTitleForAi}'</CardTitle>
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
              <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">Professional Summary</h3>
                  <p className="text-sm text-muted-foreground">Write a brief, 2-4 sentence summary of your career, key achievements, and professional goals.</p>
                  <Textarea className="h-32" value={resumeData.summary} onChange={handleSummaryChange} />
              </div>
          )}
           {currentStep === 'finalize' && (
              <div className="text-center space-y-4 flex flex-col items-center justify-center h-full">
                  <FileCheck2 className="w-16 h-16 text-green-500" />
                  <h3 className="text-2xl font-bold">Your Resume is Ready!</h3>
                  <p className="text-muted-foreground max-w-md">Review your resume on the right (on desktop) or download it below. If you need to make changes, just click on a previous step.</p>
              </div>
          )}
        </div>
        
        {/* Footer with Next/Prev buttons */}
        <div className="mt-8 pt-6 border-t flex justify-between max-w-xl mx-auto lg:mx-0">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 'career-level'}>Back</Button>
          {currentStep === 'finalize' ? (
              <Button size="lg" onClick={handleDownloadPdf} disabled={isDownloading}>
                  {isDownloading ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />}
                  Download PDF
              </Button>
          ) : currentStep !== 'career-level' && currentStep !== 'target-country' ? (
              <Button onClick={nextStep}>
                  Next: {nextStepName}
              </Button>
          ) : null}
         </div>

      </main>

      {/* Right Preview Panel */}
      <aside className="hidden lg:flex lg:col-span-4 bg-muted p-8 items-start justify-center overflow-y-auto">
        <div 
          ref={previewRef} 
          className="w-full max-w-2xl aspect-[1/1.414] bg-white transform scale-95 origin-top shadow-xl ring-1 ring-black/5"
        >
          {templateComponents[selectedTemplate as keyof typeof templateComponents]}
        </div>
      </aside>
    </div>
  );
}
