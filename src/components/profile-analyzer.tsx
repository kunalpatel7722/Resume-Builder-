"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Loader2, BarChart, FileText, Briefcase, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { linkedinProfileScore, type LinkedinProfileScoreInput, type LinkedinProfileScoreOutput } from "@/ai/flows/linkedin-profile-score";
import ImprovementTips from "@/components/improvement-tips";
import ReportSection from "@/components/report-section";
import OverallScoreDisplay from "./overall-score-display";

type AnalysisResult = LinkedinProfileScoreOutput;

export default function ProfileAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

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

    try {
      const scoreOutput = await linkedinProfileScore(scoreInput);
      setResult(scoreOutput);
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
          <h3 className="text-2xl font-bold text-foreground">Analyzing Profile...</h3>
          <p className="text-muted-foreground">The AI is working its magic. This may take a moment.</p>
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
                <h1 className="text-3xl font-bold tracking-tight text-foreground">LinkedIn Review Results</h1>
                <p className="text-muted-foreground">Here's a detailed breakdown of your LinkedIn profile analysis.</p>
              </div>
              <Button variant="outline" onClick={() => { setResult(null); setFile(null); }}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Analyze Another
              </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8 lg:items-start">
              {/* Left Column */}
              <div className="lg:col-span-3 space-y-8">
                <OverallScoreDisplay score={result.overallScore} summary={result.overallSummary} />
                <div className="space-y-4">
                  {result.reportSections.map((section, index) => (
                    <ReportSection key={index} section={section} />
                  ))}
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
                <ImprovementTips suggestions={result.aiSuggestions} />
                <Card>
                  <CardHeader>
                      <CardTitle>Extracted Profile Text</CardTitle>
                      <CardDescription>This is the text our AI used for the analysis.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <pre className="text-sm text-foreground whitespace-pre-wrap font-sans bg-muted/50 p-4 rounded-md max-h-[500px] overflow-y-auto">
                          {result.extractedText}
                      </pre>
                  </CardContent>
                </Card>
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
