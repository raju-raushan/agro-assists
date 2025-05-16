"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SectionTitle } from '@/components/SectionTitle';
import { recommendCrops, type RecommendCropsInput, type RecommendCropsOutput } from '@/ai/flows/recommend-crops';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle, Lightbulb, Trees, MessageSquareQuote } from 'lucide-react';

const formSchema = z.object({
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  soilComposition: z.string().min(10, { message: "Soil composition details must be at least 10 characters." }),
  localClimate: z.string().min(10, { message: "Local climate details must be at least 10 characters." }),
  marketDemand: z.string().min(5, { message: "Market demand information must be at least 5 characters." }),
});

type FormData = z.infer<typeof formSchema>;

export default function CropRecommendationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecommendCropsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      soilComposition: "",
      localClimate: "",
      marketDemand: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const input: RecommendCropsInput = data;
      const response = await recommendCrops(input);
      setResult(response);
      toast({
        title: "Recommendations Generated",
        description: `Found ${response.recommendedCrops.length} crop recommendations.`,
      });
    } catch (e) {
      console.error("Error getting crop recommendations:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        title: "Recommendation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        title="AI Crop Recommendations"
        description="Provide details about your farm, and our AI will suggest the most suitable crops."
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary"/>Farm Details</CardTitle>
          <CardDescription>Fill in the information below to receive crop recommendations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Napa Valley, California" {...field} />
                    </FormControl>
                    <FormDescription>The geographical location of your farm.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soilComposition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Composition</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Loamy soil, pH 6.5, rich in organic matter" {...field} />
                    </FormControl>
                    <FormDescription>Describe your soil's type, pH, and nutrient levels.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="localClimate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local Climate</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Mediterranean climate, average rainfall 500mm/year, hot dry summers" {...field} />
                    </FormControl>
                    <FormDescription>Detail temperature ranges, rainfall, and seasonal patterns.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketDemand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Demand</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., High demand for organic vegetables, growing market for specialty fruits" {...field} />
                    </FormControl>
                    <FormDescription>Information on local or regional market needs for crops.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-primary hover:bg-primary/90">
                {isLoading ? "Generating..." : "Get Recommendations"}
              </Button>
              {isLoading && <Progress value={undefined} className="w-full mt-4 animate-pulse" />}
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="shadow-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trees className="text-primary"/>Recommended Crops</CardTitle>
            <CardDescription>Based on your input, here are the AI's top crop suggestions:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.recommendedCrops.length === 0 && (
              <Alert>
                <AlertDescription>No specific crop recommendations could be generated with the provided information. Try to be more specific.</AlertDescription>
              </Alert>
            )}
            {result.recommendedCrops.map((crop, index) => (
              <Card key={index} className="bg-secondary/50 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{crop.cropName}</CardTitle>
                  <CardDescription>Suitability Score: <span className="font-bold text-primary">{crop.suitabilityScore}/100</span></CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80">{crop.rationale}</p>
                </CardContent>
              </Card>
            ))}
            {result.additionalTips && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><MessageSquareQuote className="text-primary"/>Additional Tips:</h3>
                <Alert className="bg-card border-accent/50">
                  <AlertDescription className="text-accent-foreground">{result.additionalTips}</AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
