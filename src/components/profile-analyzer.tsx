"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Keyboard, Loader2, BarChart, FileText, Wand2, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

import { linkedinProfileScore, type LinkedinProfileScoreInput, type LinkedinProfileScoreOutput } from "@/ai/flows/linkedin-profile-score";
import ScoreDisplay from "@/components/score-display";
import ScoreBreakdown from "./score-breakdown";

type AnalysisResult = {
  score: number;
  summaryFeedback: string;
  scoreBreakdown: LinkedinProfileScoreOutput['scoreBreakdown'];
  extractedText: string;
};

export default function ProfileAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [activeTab, setActiveTab] = useState("pdf");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setPastedText("");
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
    
    let scoreInput: LinkedinProfileScoreInput = {};

    if (activeTab === 'pdf' && file) {
      scoreInput.pdfProfileData = await fileToDataURL(file);
    } else if (activeTab === 'text' && pastedText) {
      scoreInput.textProfileData = pastedText;
    }

    if (!scoreInput.pdfProfileData && !scoreInput.textProfileData) {
      toast({
        title: "No Input Provided",
        description: "Please upload a PDF or paste your profile text to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setResult(null);

    try {
      const scoreOutput = await linkedinProfileScore(scoreInput);

      setResult({
        score: scoreOutput.overallScore,
        summaryFeedback: scoreOutput.summaryFeedback,
        scoreBreakdown: scoreOutput.scoreBreakdown,
        extractedText: scoreOutput.extractedText,
      });

    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Something went wrong while analyzing your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-8 bg-background">
        <div className="flex flex-col items-center justify-center gap-4 text-center w-full max-w-md">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <h3 className="text-2xl font-bold text-foreground">Analyzing Profile...</h3>
          <p className="text-muted-foreground">The AI is working its magic. This may take a moment.</p>
          <div className="mt-8 space-y-4 w-full">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
       <div className="min-h-screen bg-muted/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-[100rem] mx-auto">
          <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            <Card className="shadow-sm p-4">
                <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">LinkBoost Report</h1>
                 <Button variant="outline" onClick={() => setResult(null)} className="w-full mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Analyze Another Profile
                </Button>
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md border">{result.summaryFeedback}</p>
            </Card>
            
            <Card className="shadow-sm p-6">
              <ScoreDisplay score={result.score} />
            </Card>

            <Card className="shadow-sm p-6">
              <ScoreBreakdown breakdown={result.scoreBreakdown} />
            </Card>

          </aside>

          <main className="lg:col-span-8 xl:col-span-9">
            <Card className="shadow-sm h-full">
              <CardHeader>
                <CardTitle>Extracted Profile Text</CardTitle>
                <CardDescription>This is the text our AI used for the analysis.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-10rem)] rounded-md border p-4 bg-muted/50">
                  <pre className="text-sm text-foreground whitespace-pre-wrap break-words font-sans">
                    {result.extractedText}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center gap-3 bg-primary/10 text-primary p-2 rounded-lg mb-4">
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          LinkBoost
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Analyze your LinkedIn profile, get an instant score, and receive AI-powered tips to boost your professional presence.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg sticky top-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText /> Start Your Analysis</CardTitle>
            <CardDescription>Upload your profile as a PDF or paste the text directly.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pdf"><UploadCloud className="w-4 h-4 mr-2" /> Upload PDF</TabsTrigger>
                  <TabsTrigger value="text"><Keyboard className="w-4 h-4 mr-2" /> Paste Text</TabsTrigger>
                </TabsList>
                <TabsContent value="pdf" className="mt-4">
                  <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span></p>
                          <p className="text-xs text-muted-foreground">or drag and drop (PDF only)</p>
                      </div>
                      <input id="file-upload" type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
                  </label>
                  {file && <p className="text-sm mt-2 text-muted-foreground">Selected: {file.name}</p>}
                </TabsContent>
                <TabsContent value="text" className="mt-4">
                   <div className="space-y-2">
                    <label htmlFor="text-input" className="text-sm font-medium">Paste Profile Text</label>
                    <Textarea
                      id="text-input"
                      placeholder="Paste the text from your 'About' and 'Experience' sections here..."
                      value={pastedText}
                      onChange={(e) => { setPastedText(e.target.value); setFile(null); }}
                      className="h-48"
                    />
                  </div>
                </TabsContent>
              </Tabs>
              <Button type="submit" className="w-full mt-6 text-lg py-6">
                <BarChart className="mr-2" />Analyze Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="relative min-h-[400px]">
          <Card className="shadow-lg h-full flex flex-col justify-center items-center text-center p-8 border-dashed">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Wand2 className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Your Analysis Awaits</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Submit your profile to see your score and get personalized, AI-driven feedback to elevate your career.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
