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

type AnalysisResult = LinkedinProfileScoreOutput;

export default function ProfileAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();
  const [activeDetail, setActiveDetail] = useState<AnalysisResult['reportSections'][0] | { title: 'Extracted Profile Text' } | null>(null);
  const detailContentRef = useRef<HTMLDivElement>(null);

  const handleSectionClick = (section: AnalysisResult['reportSections'][0] | { title: 'Extracted Profile Text' }) => {
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
      <div className="w-full flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center w-full max-w-md py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <h3 className="text-2xl font-bold text-foreground">Analyzing Your Profile...</h3>
          <p className="text-muted-foreground">Our AI is working its magic. This can take up to 30 seconds.</p>
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
                <h1 className="text-3xl font-bold tracking-tight text-foreground">LinkedIn Analysis Report</h1>
                <p className="text-muted-foreground">Here's a detailed breakdown of your profile's strengths and weaknesses.</p>
              </div>
              <Button variant="outline" onClick={() => { setResult(null); setFile(null); }}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Analyze Another
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
                          activeDetail?.title === 'Extracted Profile Text' && "bg-secondary border-primary"
                      )}
                      onClick={() => handleSectionClick({ title: 'Extracted Profile Text' })}
                  >
                      <CardHeader className="p-4">
                          <div className="flex items-center gap-4">
                              <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-lg">
                                  <FileText className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                  <CardTitle className="text-base font-semibold">Extracted Profile Text</CardTitle>
                                  <CardDescription className="text-xs">The text our AI analyzed.</CardDescription>
                              </div>
                          </div>
                      </CardHeader>
                  </Card>
                </div>
              </aside>

              <main ref={detailContentRef} className="lg:col-span-8 space-y-8 mt-8 lg:mt-0">
                <ImprovementTips suggestions={result.aiSuggestions} />
                 {activeDetail && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">{activeDetail.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {activeDetail.title === 'Extracted Profile Text' ? (
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
        <Briefcase className="w-16 h-16 mx-auto text-primary mb-6" />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Land Your Dream Job with an AI-Powered Profile Review
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
          Instantly score your LinkedIn profile, identify weaknesses, and get personalized, actionable feedback to stand out to recruiters.
        </p>
      </section>

      <div className="max-w-2xl mx-auto px-4 pb-16">
        <Card className="shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3"><UploadCloud /> Upload Your LinkedIn Profile PDF</CardTitle>
              <CardDescription>
                Go to your LinkedIn profile, click "More", then "Save to PDF" to download your file.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-muted-foreground">LinkedIn Profile PDF</p>
                  </div>
                  <input id="file-upload" type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
              </label>
              {file && <p className="text-sm mt-4 text-center text-muted-foreground">Selected file: {file.name}</p>}
            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" className="w-full text-lg" disabled={!file || isLoading}>
                {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <BarChart className="mr-2" />}
                Analyze My Profile
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
