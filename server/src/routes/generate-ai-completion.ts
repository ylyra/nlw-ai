import { OpenAIStream, streamToResponse } from 'ai';
import type { FastifyInstance } from "fastify";
import { maxValue, minValue, number, object, optional, parse, string, uuid } from 'valibot';
import { openai } from "../lib/openai";
import { prisma } from "../lib/prisma";

export async function generateAiCompletionRoute(app: FastifyInstance) {
  app.post('/ai/complete', async (req, reply) => {
    const { temperature, prompt, videoId } = parse(object({
      videoId: string([uuid()]),
      prompt: string(),
      temperature: optional(number([minValue(0), maxValue(1)]), 0.5),
    }), req.body)

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId
      }
    })

    if (!video.transcription) {
      return reply.status(400).send({
        error: 'Transcription not found'
      })
    }

    const promptMessage = prompt.replace('{transcription}', video.transcription)

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      temperature,
      messages: [
        {
          role: 'user',
          content: promptMessage,
        }
      ],
      stream: true,
    })

    const stream = OpenAIStream(response)

    streamToResponse(stream, reply.raw, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Content-Type': 'application/json',
      }
    })
  })
}