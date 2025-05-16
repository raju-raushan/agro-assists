'use server';
/**
 * @fileOverview Detects crop diseases from an image and suggests treatments.
 *
 * - detectCropDisease - A function that handles the crop disease detection process.
 * - DetectCropDiseaseInput - The input type for the detectCropDisease function.
 * - DetectCropDiseaseOutput - The return type for the detectCropDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectCropDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectCropDiseaseInput = z.infer<typeof DetectCropDiseaseInputSchema>;

const DetectCropDiseaseOutputSchema = z.object({
  diseaseIdentification: z.object({
    diseaseDetected: z.boolean().describe('Whether or not a disease is detected.'),
    diseaseName: z.string().describe('The name of the identified disease, if any.'),
    confidence: z.number().describe('The confidence level of the disease identification (0-1).'),
  }),
  suggestedTreatments: z.array(z.string()).describe('Suggested treatments for the identified disease.'),
});
export type DetectCropDiseaseOutput = z.infer<typeof DetectCropDiseaseOutputSchema>;

export async function detectCropDisease(input: DetectCropDiseaseInput): Promise<DetectCropDiseaseOutput> {
  return detectCropDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectCropDiseasePrompt',
  input: {schema: DetectCropDiseaseInputSchema},
  output: {schema: DetectCropDiseaseOutputSchema},
  prompt: `You are an expert in identifying crop diseases. Analyze the provided image and determine if any disease is present.

  Consider aspects like leaf discoloration, spots, or any other visual signs of disease.

  Based on the analysis, provide the disease name, a confidence level (0-1), and suggested treatments.

  If no disease is detected, indicate that clearly and provide a general statement about the plant's health based on the image.

  Image: {{media url=photoDataUri}}`,
});

const detectCropDiseaseFlow = ai.defineFlow(
  {
    name: 'detectCropDiseaseFlow',
    inputSchema: DetectCropDiseaseInputSchema,
    outputSchema: DetectCropDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
