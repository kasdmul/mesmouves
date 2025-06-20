"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Sparkles } from "lucide-react";
import { analyzeJobSkills } from "@/ai/flows/analyze-job-skills";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
  jobDescription1: z.string().min(50, "Please provide a more detailed job description."),
  jobDescription2: z.string().min(50, "Please provide a more detailed job description."),
});

type FormValues = z.infer<typeof formSchema>;

export function SkillsAnalyzer() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription1: "Example: Seeking a Senior Software Engineer with 5+ years of experience in React, TypeScript, and Node.js. Must have strong problem-solving skills and experience with cloud platforms like AWS or Azure. Familiarity with CI/CD pipelines and agile methodologies is required.",
      jobDescription2: "Example: We are hiring a Full-Stack Developer proficient in JavaScript, React, and Python. The ideal candidate will have experience building scalable web applications, working with RESTful APIs, and deploying services on GCP. Knowledge of containerization with Docker is a plus.",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeJobSkills({
        jobDescriptions: [values.jobDescription1, values.jobDescription2],
      });
      if (result.summary) {
        setAnalysis(result.summary);
      } else {
        throw new Error("Analysis failed to produce a summary.");
      }
    } catch (error) {
      console.error("Skill analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing the job skills. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Skills Analyzer
            </CardTitle>
            <CardDescription>
              Paste two job descriptions below to identify common skills and trends.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="jobDescription1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description 1</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the first job description here..."
                      className="min-h-[200px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobDescription2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description 2</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the second job description here..."
                      className="min-h-[200px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Skills"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
      {analysis && !isLoading && (
        <CardContent className="pt-6">
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle>Analysis Complete</AlertTitle>
            <AlertDescription className="prose prose-sm dark:prose-invert max-w-none">
              {analysis}
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
}
