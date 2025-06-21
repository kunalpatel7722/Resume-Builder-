"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8 bg-background">
        <div className="flex flex-col items-center justify-center gap-4 text-center w-full max-w-md">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <h3 className="text-2xl font-bold text-foreground">Scanning Resume...</h3>
          <p className="text-muted-foreground">The AI is checking your resume. This may take a moment.</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
       <div className="min-h-screen bg-muted/40">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">ATS Resume Scan Results</h1>
                <p className="text-muted-foreground">Here's a detailed breakdown of your resume's match for the job.</p>
              </div>
              <Button variant="outline" onClick={() => { setResult(null); setFile(null); setJobDescription(""); }}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Scan Another
              </Button>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8 lg:items-start">
              {/* Left Column */}
              <div className="lg:col-span-3 space-y-4">
                <OverallScoreDisplay score={result.overallScore} summary={result.overallSummary} />
                
                {result.keywordAnalysis && (
                  <KeywordAnalysis data={result.keywordAnalysis} />
                )}

                <div className="space-y-4">
                  {result.reportSections.map((section, index) => (
                    <ReportSection 
                      key={index} 
                      section={section}
                      isActive={activeDetail?.title === section.title}
                      onClick={() => setActiveDetail(section)}
                    />
                  ))}
                  <Card 
                      className={cn(
                          "shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary",
                          activeDetail?.title === 'Extracted Resume Text' && "border-primary shadow-lg ring-2 ring-primary/20"
                      )}
                      onClick={() => setActiveDetail({ title: 'Extracted Resume Text' })}
                  >
                      <CardHeader className="p-4">
                          <div className="flex items-center gap-4">
                              <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-lg">
                                  <FileText className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                  <CardTitle className="text-lg">Extracted Resume Text</CardTitle>
                                  <CardDescription className="mt-1 text-xs">View the text our AI used for the analysis.</CardDescription>
                              </div>
                          </div>
                      </CardHeader>
                  </Card>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
                <ImprovementTips suggestions={result.aiSuggestions} />
                 {activeDetail && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{activeDetail.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {activeDetail.title === 'Extracted Resume Text' ? (
                                <pre className="text-sm text-foreground whitespace-pre-wrap font-sans bg-muted/50 p-4 rounded-md max-h-[500px] overflow-y-auto">
                                    {result.extractedText}
                                </pre>
                            ) : (
                                'checks' in activeDetail && activeDetail.checks && <SectionDetailContent checks={activeDetail.checks} />
                            )}
                        </CardContent>
                    </Card>
                )}
              </div>
            </div>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-background">
      <div className="w-full max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
           <FileText className="w-12 h-12 mx-auto text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            ATS Resume Checker
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Upload your resume and (optionally) a job description to see how well you match. Get an instant analysis of your resume's ATS-friendliness and keyword optimization.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><UploadCloud /> Upload Your Resume</CardTitle>
                      <CardDescription>
                          Upload your resume in PDF format to get started.
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span></p>
                              <p className="text-xs text-muted-foreground">or drag and drop your resume PDF</p>
                          </div>
                          <input id="file-upload" type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
                      </label>
                      {file && <p className="text-sm mt-2 text-muted-foreground">Selected: {file.name}</p>}
                  </CardContent>
              </Card>

              <Card className="shadow-lg">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Search /> Job Description</CardTitle>
                      <CardDescription>
                          Paste the full job description here (optional).
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Label htmlFor="job-description" className="sr-only">Job Description</Label>
                      <Textarea 
                          id="job-description"
                          placeholder="Paste the job description here..."
                          className="h-48"
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          suppressHydrationWarning
                      />
                  </CardContent>
              </Card>
          </div>
          <Button type="submit" className="w-full mt-8 text-lg py-6" disabled={!file}>
            <BarChart className="mr-2" />Analyze Resume
          </Button>
        </form>
      </div>
    </div>
  );
}
