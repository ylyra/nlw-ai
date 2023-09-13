import type { FastifyInstance } from "fastify";
import { createReadStream } from 'node:fs';
import { object, parse, string, uuid } from 'valibot';
import { openai } from "../lib/openai";
import { prisma } from "../lib/prisma";

export async function createTranscriptionRoute(app: FastifyInstance) {
  app.post('/videos/:id/transcription', async (req, reply) => {
    const {id} = parse(object({
      id: string([uuid()])
    }), req.params)

    const { prompt } = parse(object({
      prompt: string()
    }), req.body)

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id
      }
    })

    const audioReadStream = createReadStream(video.path)

    const response = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: 'whisper-1',
      language: 'pt',
      response_format: 'json',
      temperature: 0,
      prompt
    })

    const transcription = response.text

    await prisma.video.update({
      where: {
        id
      },
      data: {
        transcription
      }
    })

    return {
      transcription      
    }
  })
}