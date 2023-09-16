import { FFmpeg } from '@ffmpeg/ffmpeg'

let ffmpeg: FFmpeg | null

export async function getFFmpeg() {
  if (ffmpeg) {
    return ffmpeg
  }

  ffmpeg = new FFmpeg()

  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL: '/ffmpeg-core.js',
      wasmURL: '/ffmpeg-core.wasm',
      workerURL: '/ffmpeg-worker.js',
    })
  }

  return ffmpeg
}
