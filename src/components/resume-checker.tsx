"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Loader2, BarChart, FileText, ArrowLeft, Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { resumeAtsCheck, type ResumeAtsCheckInput, type ResumeAtsCheckOutput } from "@/ai/flows/resume-ats-check";
import ImprovementTips from "@/components/improvement-tips";
import KeywordAnalysis from "@/components/keyword-analysis";
import ReportSection from "@/components/report-section";
import OverallScoreDisplay from "./overall-score-display";
import { cn } from "@/lib/utils";
import SectionDetailContent from "./section-detail-content";

type AnalysisResult = ResumeAtsCheckOutput;

export default function ResumeChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();
  const [activeDetail, setActiveDetail] = useState<AnalysisResult['reportSections'][0] | { title: 'Extracted Resume Text' } | null>(null);
  const detailContentRef = useRef<HTMLDivElement>(null);

  const handleSectionClick = (section: AnalysisResult['reportSections'][0] | { title: 'Extracted Resume Text' }) => {
    setActiveDetail(section);
    setTimeout(() => {
      detailContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        e.target.value = '';
      }
    }
  };

  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!file) {
      toast({ title: "No Resume Provided", description: "Please upload your resume PDF.", variant: "destructive" });
      return;
    }
    
    const resumePdfData = await fileToDataURL(file);
    const scoreInput: ResumeAtsCheckInput = { resumePdfData, jobDescription: jobDescription.trim() };
    
    setIsLoading(true);
    setResult(null);
    setActiveDetail(null);

    try {
      const scoreOutput = await resumeAtsCheck(scoreInput);
      setResult(scoreOutput);
      if (scoreOutput.reportSections.length > 0) {
        setActiveDetail(scoreOutput.reportSections[0]);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center w-full max-w-md py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <h3 className="text-2xl font-bold text-foreground">Scanning Your Resume...</h3>
          <p className="text-muted-foreground">Our AI is checking for ATS compatibility and keyword matches. This may take a moment.</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
       <div className="min-h-screen">
        <div className="max-w-screen-xl mx-auto p-4 md:p-8">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">ATS Resume Scan Report</h1>
                <p className="text-muted-foreground">Here's how your resume stacks up against the job description.</p>
              </div>
              <Button variant="outline" onClick={() => { setResult(null); setFile(null); setJobDescription(""); }}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Scan Another
              </Button>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 lg:items-start">
              <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                <OverallScoreDisplay score={result.overallScore} summary={result.overallSummary} />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold px-4">Report Sections</h3>
                  {result.reportSections.map((section, index) => (
                    <ReportSection 
                      key={index} 
                      section={section}
                      isActive={activeDetail?.title === section.title}
                      onClick={() => handleSectionClick(section)}
                    />
                  ))}
                  <Card 
                      className={cn(
                          "cursor-pointer transition-all hover:bg-secondary",
                          activeDetail?.title === 'Extracted Resume Text' && "bg-secondary border-primary"
                      )}
                      onClick={() => handleSectionClick({ title: 'Extracted Resume Text' })}
                  >
                      <CardHeader className="p-4">
                          <div className="flex items-center gap-4">
                              <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-lg">
                                  <FileText className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                  <CardTitle className="text-base font-semibold">Extracted Resume Text</CardTitle>
                                  <CardDescription className="text-xs">The text our AI analyzed.</CardDescription>
                              </div>
                          </div>
                      </CardHeader>
                  </Card>
                </div>
              </aside>

              <main ref={detailContentRef} className="lg:col-span-8 space-y-8 mt-8 lg:mt-0">
                {result.keywordAnalysis && (
                  <KeywordAnalysis data={result.keywordAnalysis} />
                )}
                <ImprovementTips suggestions={result.aiSuggestions} />
                 {activeDetail && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">{activeDetail.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {activeDetail.title === 'Extracted Resume Text' ? (
                                <pre className="text-sm text-foreground whitespace-pre-wrap font-sans bg-secondary p-4 rounded-md max-h-96 overflow-y-auto">
                                    {result.extractedText}
                                </pre>
                            ) : (
                                'checks' in activeDetail && activeDetail.checks && <SectionDetailContent checks={activeDetail.checks} />
                            )}
                        </CardContent>
                    </Card>
                )}
              </main>
            </div>
        </div>
      </div>
    );
  }


  return (
    <div className="w-full">
       <section className="text-center py-20 px-4 sm:px-6 lg:px-8">
        <FileText className="w-16 h-16 mx-auto text-primary mb-6" />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Beat the Robots: Check Your Resume's ATS Score
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
          See if your resume will pass the Applicant Tracking System (ATS). Upload your resume and the job description to get your match score and keyword analysis.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3"><UploadCloud /> 1. Upload Your Resume</CardTitle>
                    <CardDescription>
                        Your resume must be in PDF format.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                        </div>
                        <input id="file-upload" type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
                    </label>
                    {file && <p className="text-sm mt-2 text-center text-muted-foreground">Selected: {file.name}</p>}
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3"><Search /> 2. Paste Job Description</CardTitle>
                    <CardDescription>
                        For the best results, paste the full job description (optional).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="job-description" className="sr-only">Job Description</Label>
                    <Textarea 
                        id="job-description"
                        placeholder="Paste the job description here..."
                        className="h-40"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        suppressHydrationWarning
                    />
                </CardContent>
            </Card>
        </div>
        <div className="mt-8">
          <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={!file || isLoading}>
              {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <BarChart className="mr-2" />}
              Analyze My Resume
          </Button>
        </div>
      </form>
    </div>
  );
}
