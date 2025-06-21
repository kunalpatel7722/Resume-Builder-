
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
import ImprovementTips from "@/components/improvement-tips";

type AnalysisResult = {
  score: number;
  summaryFeedback: string;
  scoreBreakdown: LinkedinProfileScoreOutput['scoreBreakdown'];
  improvementTips: LinkedinProfileScoreOutput['improvementTips'];
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
        improvementTips: scoreOutput.improvementTips,
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
       <div className="min-h-screen bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 max-w-[100rem] mx-auto">
          <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            <div className="sticky top-6 flex flex-col gap-6">
                <Card className="shadow-sm">
                    <CardContent className="p-4">
                      <Button variant="outline" onClick={() => setResult(null)} className="w-full">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Analyze Another Profile
                      </Button>
                    </CardContent>
                </Card>
              
                <ScoreDisplay score={result.score} />

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{result.summaryFeedback}</p>
                  </CardContent>
                </Card>
            </div>
          </aside>

          <main className="lg:col-span-8 xl:col-span-9">
             <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">LinkedIn Review Results</h1>
                <p className="text-muted-foreground">Here's a detailed breakdown of your LinkedIn profile analysis.</p>
            </div>
             <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="overview"><BarChart className="mr-2"/>Overview</TabsTrigger>
                  <TabsTrigger value="extracted-text"><FileText className="mr-2"/>Extracted Text</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <div className="space-y-6">
                      <ImprovementTips tips={result.improvementTips} />
                      <Card className="shadow-sm">
                        <CardHeader>
                          <CardTitle>Detailed Analysis</CardTitle>
                          <CardDescription>
                            Each section of your profile has been scored. Click on a section to see detailed checks and feedback.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ScoreBreakdown breakdown={result.scoreBreakdown} />
                        </CardContent>
                      </Card>
                    </div>
                </TabsContent>
                <TabsContent value="extracted-text">
                  <Card className="shadow-sm h-full">
                    <CardHeader>
                      <CardTitle>Extracted Profile Text</CardTitle>
                      <CardDescription>This is the text our AI used for the analysis to ensure accuracy.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[calc(100vh-12rem)] rounded-md border p-4 bg-muted/50">
                        <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
                          {result.extractedText}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="w-full max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
           <Wand2 className="w-12 h-12 mx-auto text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Get your LinkedIn Profile Reviewed by AI
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Get an instant, detailed review of your LinkedIn profile. Our AI, trained on thousands of profiles, will give you a score and actionable feedback to help you land your dream job.
          </p>
        </header>

        <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText /> Start Your Analysis</CardTitle>
              <CardDescription>Upload your profile as a PDF or paste the text directly for an instant review.</CardDescription>
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
      </div>
    </div>
  );
}
