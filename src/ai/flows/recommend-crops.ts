// src/ai/flows/recommend-crops.ts
'use server';
/**
 * @fileOverview Provides crop recommendations based on location, soil, climate, and market demand.
 *
 * - recommendCrops - A function that takes location, soil, climate, and market data to suggest optimal crops.
 * - RecommendCropsInput - The input type for the recommendCrops function.
 * - RecommendCropsOutput - The return type for the recommendCrops function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendCropsInputSchema = z.object({
  location: z.string().describe('The geographical location of the farm.'),
  soilComposition: z.string().describe('The composition of the soil, including pH and nutrient levels.'),
  localClimate: z.string().describe('The local climate conditions, including temperature and rainfall patterns.'),
  marketDemand: z.string().describe('Current market demand for various crops in the region.'),
});

export type RecommendCropsInput = z.infer<typeof RecommendCropsInputSchema>;

const RecommendCropsOutputSchema = z.object({
  recommendedCrops: z.array(
    z.object({
      cropName: z.string().describe('The name of the recommended crop.'),
      suitabilityScore: z
        .number()
        .describe(
          'A score indicating the suitability of the crop for the given conditions (0-100).' /* Added suitabilityScore description*/
        ),
      rationale: z.string().describe('The detailed rationale for recommending this crop.'),
    })
  ).describe('A list of crops recommended for the given conditions, with suitability scores and rationales.'),
  additionalTips: z.string().describe('Additional tips for maximizing yield and profitability.'),
});

export type RecommendCropsOutput = z.infer<typeof RecommendCropsOutputSchema>;

export async function recommendCrops(input: RecommendCropsInput): Promise<RecommendCropsOutput> {
  return recommendCropsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCropsPrompt',
  input: {schema: RecommendCropsInputSchema},
  output: {schema: RecommendCropsOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the following information, recommend the best crops to plant:

Location: {{{location}}}
Soil Composition: {{{soilComposition}}}
Local Climate: {{{localClimate}}}
Market Demand: {{{marketDemand}}}

Consider factors such as:
- Crop yield
- Profitability
- Sustainability
- Pest and disease resistance

Format your response as a JSON object matching the following schema:
${JSON.stringify(RecommendCropsOutputSchema)}

Make sure the suitabilityScore is a number between 0 and 100.
`,
});

const recommendCropsFlow = ai.defineFlow(
  {
    name: 'recommendCropsFlow',
    inputSchema: RecommendCropsInputSchema,
    outputSchema: RecommendCropsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
