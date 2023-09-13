import 'dotenv/config';

import { fastify } from "fastify";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { generateAiCompletionRoute } from './routes/generate-ai-completion';
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";

const app = fastify()

app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(generateAiCompletionRoute)

app.listen({
  port: 3333
}).then(() => {
  console.log('HTTP Server Running!')
})