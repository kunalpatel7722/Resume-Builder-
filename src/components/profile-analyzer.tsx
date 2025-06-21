
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Loader2, BarChart, FileText, Briefcase, ArrowLeft, CheckCircle2, XCircle, Link, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { linkedinProfileScore, type LinkedinProfileScoreInput, type LinkedinProfileScoreOutput } from "@/ai/flows/linkedin-profile-score";
import ScoreDisplay from "@/components/score-display";
import ImprovementTips from "@/components/improvement-tips";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


type AnalysisResult = {
  score: number;
  summaryFeedback: string;
  scoreBreakdown: LinkedinProfileScoreOutput['scoreBreakdown'];
  improvementTips: LinkedinProfileScoreOutput['improvementTips'];
  extractedText: string;
};

const getScoreStyle = (score: number): React.CSSProperties => {
  if (score >= 80) { // Great
    return { backgroundColor: 'hsl(var(--chart-2))', color: 'hsl(var(--primary-foreground))' };
  }
  if (score >= 70) { // Good
    return { backgroundColor: 'hsl(var(--chart-4))', color: 'hsl(var(--foreground))' };
  }
  if (score >= 50) { // Medium
    return { backgroundColor: 'hsl(var(--chart-1))', color: 'hsl(var(--primary-foreground))' };
  }
  // Low
  return { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' };
};

const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div
      className="flex items-center justify-center w-12 h-7 rounded-md font-bold text-sm"
      style={getScoreStyle(score)}
    >
      {score}
    </div>
  );
};

export default function ProfileAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState("overview");

  const toKebabCase = (str: string) => str.toLowerCase().replace(/\s/g, '-').replace(/[&']/g, '');

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (!result) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            return;
          }
        }
      },
      {
        rootMargin: "-25% 0px -75% 0px",
        threshold: 0,
      }
    );

    const elementsToObserve = document.querySelectorAll('[data-section-id]');
    elementsToObserve.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      elementsToObserve.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, [result]);

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
    
    let scoreInput: LinkedinProfileScoreInput = {};

    if (file) {
      scoreInput.pdfProfileData = await fileToDataURL(file);
    } else {
       toast({
        title: "No Profile Provided",
        description: "Please upload a PDF of your LinkedIn profile to analyze.",
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
        description: error instanceof Error ? error.message : "Something went wrong while analyzing your profile. Please try again.",
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
    const navLinks = [
      { id: 'overview', title: 'Overview' },
      ...result.scoreBreakdown.map(cat => ({ id: toKebabCase(cat.title), title: cat.title })),
    ];
    return (
       <div className="min-h-screen bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 p-4 md:p-6 max-w-[100rem] mx-auto">
          <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            <div className="sticky top-20 flex flex-col gap-6">
                <ScoreDisplay score={result.score} />

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{result.summaryFeedback}</p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardContent className="p-2">
                    <nav className="space-y-1">
                      {navLinks.map(link => (
                        <a 
                            key={link.id}
                            href={`#${link.id}`}
                            onClick={(e) => handleScrollTo(e, link.id)}
                            className={cn(
                                "block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                                activeSection === link.id && "bg-muted font-semibold text-foreground"
                            )}
                        >
                            {link.title}
                        </a>
                      ))}
                    </nav>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="p-4">
                      <Button variant="outline" onClick={() => { setResult(null); setFile(null); }} className="w-full">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Analyze Another Profile
                      </Button>
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
                      <div id="overview" data-section-id="overview" className="scroll-mt-20">
                        <ImprovementTips tips={result.improvementTips} />
                      </div>
                       {result.scoreBreakdown.map((category) => (
                        <div key={category.title} id={toKebabCase(category.title)} data-section-id={toKebabCase(category.title)} className="scroll-mt-20">
                          <Card className="shadow-sm">
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between text-xl">
                                <span>{category.title}</span>
                                <ScoreBadge score={category.score} />
                              </CardTitle>
                              <CardDescription>
                                {category.feedback}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {category.checks.map((check, checkIndex) => (
                                  <div key={checkIndex} className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                                    {check.passed ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                    ) : (
                                      <XCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                                    )}
                                    <div>
                                      <p className="font-medium text-sm text-foreground">{check.check}</p>
                                      <p className="text-xs text-muted-foreground">{check.details}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
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
              <CardDescription>
                To get started, go to your LinkedIn profile, click the "More" button, select "Save to PDF," and upload the file below.
              </CardDescription>
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
