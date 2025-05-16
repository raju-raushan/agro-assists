"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileUpload } from '@/components/FileUpload';
import { SectionTitle } from '@/components/SectionTitle';
import { detectCropDisease, type DetectCropDiseaseInput, type DetectCropDiseaseOutput } from '@/ai/flows/detect-crop-disease';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertTriangle, Microscope, ListChecks, Leaf } from 'lucide-react';

export default function CropDiseasePage() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectCropDiseaseOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (dataUri: string, fileName: string) => {
    setPhotoDataUri(dataUri);
    setResult(null); // Clear previous results
    setError(null); // Clear previous errors
    toast({ title: "Image Selected", description: `${fileName} is ready for analysis.` });
  };

  const handleSubmit = async () => {
    if (!photoDataUri) {
      toast({
        title: "No Image Selected",
        description: "Please select an image of a crop to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const input: DetectCropDiseaseInput = { photoDataUri };
      const response = await detectCropDisease(input);
      setResult(response);
      toast({
        title: "Analysis Complete",
        description: response.diseaseIdentification.diseaseDetected
          ? `Disease detected: ${response.diseaseIdentification.diseaseName}`
          : "No disease detected.",
      });
    } catch (e) {
      console.error("Error detecting crop disease:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        title: "Analysis Failed",
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
        title="Crop Disease Detection"
        description="Upload an image of your crop. Our AI will analyze it for diseases and suggest treatments."
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Leaf className="text-primary"/>Upload Crop Image</CardTitle>
          <CardDescription>Select a clear image of the affected crop area.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUpload onFileSelect={handleFileSelect} />
          <Button onClick={handleSubmit} disabled={isLoading || !photoDataUri} className="w-full md:w-auto bg-primary hover:bg-primary/90">
            {isLoading ? "Analyzing..." : "Detect Disease"}
          </Button>
          {isLoading && <Progress value={undefined} className="w-full mt-4 animate-pulse" />}
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
            <CardTitle className="flex items-center gap-2"><Microscope className="text-primary"/>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {photoDataUri && (
              <div className="mb-4 border rounded-lg overflow-hidden">
                <Image src={photoDataUri} alt="Analyzed crop" width={300} height={200} className="object-cover w-full max-h-72" data-ai-hint="crop analysis" />
              </div>
            )}
            <Alert variant={result.diseaseIdentification.diseaseDetected ? "destructive" : "default"} className={result.diseaseIdentification.diseaseDetected ? "" : "border-green-500 bg-green-50"}>
               {result.diseaseIdentification.diseaseDetected ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4 text-green-700" />}
              <AlertTitle>{result.diseaseIdentification.diseaseDetected ? "Disease Detected!" : "No Disease Detected"}</AlertTitle>
              <AlertDescription className={result.diseaseIdentification.diseaseDetected ? "" : "text-green-700"}>
                {result.diseaseIdentification.diseaseDetected
                  ? `The AI identified: ${result.diseaseIdentification.diseaseName} (Confidence: ${(result.diseaseIdentification.confidence * 100).toFixed(1)}%)`
                  : "The AI analysis indicates the plant appears healthy based on the provided image."}
              </AlertDescription>
            </Alert>

            {result.diseaseIdentification.diseaseDetected && result.suggestedTreatments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><ListChecks className="text-primary"/>Suggested Treatments:</h3>
                <ul className="list-disc list-inside space-y-1 bg-card p-4 rounded-md border">
                  {result.suggestedTreatments.map((treatment, index) => (
                    <li key={index} className="text-foreground">{treatment}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
