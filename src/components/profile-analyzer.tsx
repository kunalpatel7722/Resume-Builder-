"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Loader2, BarChart, FileText, Briefcase, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { linkedinProfileScore, type LinkedinProfileScoreInput, type LinkedinProfileScoreOutput } from "@/ai/flows/linkedin-profile-score";
import ImprovementTips from "@/components/improvement-tips";
import ReportSection from "@/components/report-section";
import OverallScoreDisplay from "./overall-score-display";
import { cn } from "@/lib/utils";
import SectionDetailContent from "./section-detail-content";
import { useIsMobile } from "@/hooks/use-mobile";

type AnalysisResult = LinkedinProfileScoreOutput;

export default function ProfileAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();
  const [activeDetail, setActiveDetail] = useState<AnalysisResult['reportSections'][0] | { title: 'Extracted Profile Text' } | null>(null);
  const detailContentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleSectionClick = (section: AnalysisResult['reportSections'][0] | { title: 'Extracted Profile Text' }) => {
    setActiveDetail(section);
    if (isMobile) {
      setTimeout(() => {
        detailContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
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
      toast({ title: "No Profile Provided", description: "Please upload your PDF.", variant: "destructive" });
      return;
    }
    
    const pdfProfileData = await fileToDataURL(file);
    const scoreInput: LinkedinProfileScoreInput = { pdfProfileData };
    
    setIsLoading(true);
    setResult(null);
    setActiveDetail(null);

    try {
      const scoreOutput = await linkedinProfileScore(scoreInput);
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
      <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8 bg-background">
        <div className="flex flex-col items-center justify-center gap-4 text-center w-full max-w-md">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <h3 className="text-2xl font-bold text-foreground">Analyzing Profile...</h3>
          <p className="text-muted-foreground">The AI is working its magic. This may take a moment.</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
       <div className="min-h-screen bg-muted/40">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">LinkedIn Review Results</h1>
                <p className="text-muted-foreground">Here's a detailed breakdown of your LinkedIn profile analysis.</p>
              </div>
              <Button variant="outline" onClick={() => { setResult(null); setFile(null); }}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Analyze Another
              </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 lg:items-start">
              <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-24">
                <OverallScoreDisplay score={result.overallScore} summary={result.overallSummary} />
                <div className="space-y-4">
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
                          "shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary",
                          activeDetail?.title === 'Extracted Profile Text' && "border-primary shadow-lg ring-2 ring-primary/20"
                      )}
                      onClick={() => handleSectionClick({ title: 'Extracted Profile Text' })}
                  >
                      <CardHeader className="p-4">
                          <div className="flex items-center gap-4">
                              <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-lg">
                                  <FileText className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                  <CardTitle className="text-lg">Extracted Profile Text</CardTitle>
                                  <CardDescription className="mt-1 text-xs">View the text our AI used for the analysis.</CardDescription>
                              </div>
                          </div>
                      </CardHeader>
                  </Card>
                </div>
              </div>

              <div ref={detailContentRef} className="lg:col-span-2 space-y-8 mt-8 lg:mt-0">
                <ImprovementTips suggestions={result.aiSuggestions} />
                 {activeDetail && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{activeDetail.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {activeDetail.title === 'Extracted Profile Text' ? (
                                <pre className="text-sm text-foreground whitespace-pre-wrap font-sans bg-muted/50 p-4 rounded-md">
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
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
           <Briefcase className="w-12 h-12 mx-auto text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Get your LinkedIn Profile Reviewed by AI
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Get an instant, detailed review of your LinkedIn profile. Our AI, trained on thousands of profiles, will give you a score and actionable feedback to help you land your dream job.
          </p>
        </header>

        <Card className="shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UploadCloud /> Upload Your Profile PDF</CardTitle>
              <Alert variant="default" className="mt-4">
                <FileText className="h-4 w-4" />
                <AlertTitle>How to get your PDF</AlertTitle>
                <AlertDescription>
                  Go to your LinkedIn profile, click the "More" button, and select "Save to PDF".
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent>
              <div>
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span></p>
                        <p className="text-xs text-muted-foreground">or drag and drop your LinkedIn PDF</p>
                    </div>
                    <input id="file-upload" type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
                </label>
                {file && <p className="text-sm mt-2 text-muted-foreground">Selected: {file.name}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full text-lg py-6" disabled={!file}>
                <BarChart className="mr-2" />Analyze Profile
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
