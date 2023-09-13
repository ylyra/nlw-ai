import { fastifyMultipart } from '@fastify/multipart';
import type { FastifyInstance } from "fastify";
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { prisma } from '../lib/prisma';


export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      // 25 MB
      fieldSize: 25 * 1024 * 1024 
    }
  })

  app.post('/videos', async (req, reply) => {
    const data = await req.file()

    if (!data) {
      return reply.status(400).send({
        error: 'No file uploaded'
      })
    }

    const extension = path.extname(data.filename)

    if (extension !== '.mp3') {
      return reply.status(400).send({
        error: 'Invalid file type'
      })
    }

    const fileBaseName = path.basename(data.filename, extension)
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`
    const uploadDestination = path.resolve(__dirname, '..', '..', 'tmp', fileUploadName)

    await pipeline(data.file, fs.createWriteStream(uploadDestination))

    const video = await prisma.video.create({
      data: {
        name: data.fieldname,
        path: uploadDestination,
      }
    })
        
    return video
  })
}