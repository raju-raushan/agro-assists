import { config } from 'dotenv';
config();

import '@/ai/flows/detect-crop-disease.ts';
import '@/ai/flows/recommend-crops.ts';