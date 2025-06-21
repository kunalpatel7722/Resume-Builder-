import { config } from 'dotenv';
config();

import '@/ai/flows/linkedin-profile-score.ts';
import '@/ai/flows/resume-ats-check.ts';
import '@/ai/flows/generate-resume-content.ts';
import '@/ai/flows/suggest-job-titles.ts';
