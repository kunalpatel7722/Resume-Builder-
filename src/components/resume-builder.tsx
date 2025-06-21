"use client";

import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateResumeContent, type GenerateResumeContentOutput } from '@/ai/flows/generate-resume-content';
import { ModernTemplate } from '@/components/resume-templates/modern-template';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { FileCheck2, Bot, Plus, Trash2, Loader2, Download, Wand2, Palette, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

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
}

const initialResumeData: ResumeData = {
  personalInfo: { name: '', email: '', phone: '', address: '' },
  summary: '',
  experience: [{ id: 1, company: '', role: '', dates: '', description: '' }],
  education: [{ id: 1, school: '', degree: '', dates: '' }],
  skills: [],
};

const steps = [
  { id: 'personal', name: 'Personal Info' },
  { id: 'experience', name: 'Experience' },
  { id: 'education', name: 'Education' },
  { id: 'skills', name: 'Skills' },
  { id: 'summary', name: 'Summary' },
  { id: 'finalize', name: 'Finalize' },
];

export default function ResumeBuilder() {
  const [isBuilding, setIsBuilding] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [currentStep, setCurrentStep] = useState('personal');
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const [jobTitleForAi, setJobTitleForAi] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<GenerateResumeContentOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: keyof ResumeData, index?: number, field?: string) => {
    const { name, value } = e.target;
    
    setResumeData(prev => {
        const newData = { ...prev };
        if (section === 'personalInfo' || section === 'summary') {
            (newData[section] as any)[name] = value;
        } else if ((section === 'experience' || section === 'education') && index !== undefined && field) {
            (newData[section] as any)[index][field] = value;
        }
        return newData;
    });
  };

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

  const handleDownloadPdf = async () => {
    const element = previewRef.current;
    if (!element) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
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
              <h3 className="text-xl font-bold mb-2">1. Choose a Template</h3>
              <p className="text-muted-foreground">Check out our pre-designed templates and guided steps, allowing you to create a polished resume faster.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <Wand2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Get AI Suggestions</h3>
              <p className="text-muted-foreground">Search by job title to find pre-written, impactful descriptions of your skills and responsibilities.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <Edit className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Fine-Tune & Download</h3>
              <p className="text-muted-foreground">Quickly generate each section, fine-tune the details, and download your new resume, ready to send.</p>
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

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-muted/40">
      {/* Left: Form Panel */}
      <aside className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Resume Builder</h2>
          <Button variant="outline" onClick={() => setIsBuilding(false)}>Back to Home</Button>
        </div>
        
        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 space-x-2 text-xs sm:text-sm">
            {steps.map((step, index) => {
                const stepIndex = steps.findIndex(s => s.id === currentStep);
                const isActive = step.id === currentStep;
                const isCompleted = stepIndex > index;
                return (
                    <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center">
                           <button onClick={() => setCurrentStep(step.id)} className={cn("w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors", 
                                isActive ? 'bg-primary text-primary-foreground' : isCompleted ? 'bg-primary/50 text-primary-foreground' : 'bg-card border'
                           )}>
                                {isCompleted ? <FileCheck2 size={16}/> : index + 1}
                           </button>
                           <p className={cn("mt-2 text-center", isActive && "font-bold text-primary")}>{step.name}</p>
                        </div>
                        {index < steps.length - 1 && <div className="flex-1 h-0.5 bg-border"></div>}
                    </React.Fragment>
                );
            })}
        </div>

        {/* Form Content */}
        <Card>
            <CardContent className="p-6">
                 {currentStep === 'personal' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor="name">Full Name</Label><Input id="name" name="name" value={resumeData.personalInfo.name} onChange={handlePersonalChange} /></div>
                            <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={resumeData.personalInfo.email} onChange={handlePersonalChange} /></div>
                            <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalChange} /></div>
                            <div><Label htmlFor="address">Address</Label><Input id="address" name="address" value={resumeData.personalInfo.address} onChange={handlePersonalChange} /></div>
                        </div>
                    </div>
                )}
                {currentStep === 'experience' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Work Experience</h3>
                      <Card className="bg-primary/5 border-primary/20">
                          <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-base"><Bot size={18}/> AI Content Helper</CardTitle>
                              <CardDescription>Enter a job title to get AI-powered suggestions for responsibilities and skills.</CardDescription>
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
                                <div><Label>Dates</Label><Input name="dates" value={exp.dates} onChange={(e) => handleExperienceChange(index, e)} /></div>
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea name="description" value={exp.description} onChange={(e) => handleExperienceChange(index, e)} className="h-24" placeholder="Start each bullet point on a new line."/>
                            </div>
                            {aiSuggestions && (
                              <Card className="bg-muted/50">
                                <CardHeader className='p-3'>
                                  <CardTitle className='text-sm'>Suggestions for '{jobTitleForAi}'</CardTitle>
                                </CardHeader>
                                <CardContent className='p-3 pt-0'>
                                  <p className="text-xs text-muted-foreground mb-2">Click to add a bullet point to the description above.</p>
                                  <div className="space-y-1">
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
                        <h3 className="text-xl font-semibold">Education</h3>
                        {resumeData.education.map((edu, index) => (
                            <div key={edu.id} className="space-y-4 p-4 border rounded-lg relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><Label>School/University</Label><Input name="school" value={edu.school} onChange={(e) => handleEducationChange(index, e)} /></div>
                                    <div><Label>Degree/Field of Study</Label><Input name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} /></div>
                                    <div><Label>Dates</Label><Input name="dates" value={edu.dates} onChange={(e) => handleEducationChange(index, e)} /></div>
                                </div>
                                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeEducation(edu.id)}><Trash2 size={16}/></Button>
                            </div>
                        ))}
                        <Button variant="outline" onClick={addEducation}><Plus className="mr-2" />Add Education</Button>
                    </div>
                )}
                 {currentStep === 'skills' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Skills</h3>
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
                                      <Button key={i} size="sm" variant="secondary" onClick={() => handleAddSkill(skill)}>
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
                        <h3 className="text-xl font-semibold">Professional Summary</h3>
                        <p className="text-sm text-muted-foreground">Write a brief, 2-3 sentence summary of your career and key achievements.</p>
                        <Textarea className="h-32" value={resumeData.summary} onChange={handleSummaryChange} />
                    </div>
                )}
                 {currentStep === 'finalize' && (
                    <div className="text-center space-y-4">
                        <h3 className="text-2xl font-bold">Your Resume is Ready!</h3>
                        <p className="text-muted-foreground">Review your resume on the right. If everything looks good, you can download it as a PDF.</p>
                        <Button size="lg" onClick={handleDownloadPdf} disabled={isDownloading}>
                            {isDownloading ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />}
                            Download PDF
                        </Button>
                    </div>
                )}

            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 'personal'}>Back</Button>
                <Button onClick={nextStep} disabled={currentStep === 'finalize'}>Next</Button>
            </CardFooter>
        </Card>
      </aside>

      {/* Right: Preview Panel */}
      <main className="w-full lg:w-1/2 bg-muted p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div 
          ref={previewRef} 
          className="w-full aspect-[1/1.414] bg-white transform scale-95 origin-center"
        >
          <ModernTemplate data={resumeData} />
        </div>
      </main>
    </div>
  );
}
