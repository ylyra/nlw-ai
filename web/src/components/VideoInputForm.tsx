'use client'
import { api } from '@/lib/axios'
import { getFFmpeg } from '@/lib/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { Label } from '@radix-ui/react-label'
import { Separator } from '@radix-ui/react-select'
import { FileVideo, Upload } from 'lucide-react'
import { ChangeEvent, useMemo, useState } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

type Status =
  | 'waiting'
  | 'converting'
  | 'uploading'
  | 'generating'
  | 'success'
  | 'error'

const STATUS_MESSAGES = {
  converting: 'Convertendo...',
  generating: 'Transcrevendo...',
  uploading: 'Carregando...',
  success: 'Sucesso!',
  error: 'Erro!',
  waiting: 'Carregar vídeo',
}

type Props = {
  onUploaded: (videoId: string) => void
}

export function VideoInputForm({ onUploaded }: Props) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('waiting')

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files) return

    const selectedFile = files[0]

    setVideoFile(selectedFile)
  }

  async function convertVideoToAudio(video: File) {
    console.log('Convert started.')

    const ffmpeg = await getFFmpeg()

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    ffmpeg.on('log', (log) => {
      console.log(log)
    })

    ffmpeg.on('progress', (progress) => {
      console.log('Convert progress: ' + Math.round(progress.progress * 100))
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      'output.mp3',
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], { type: 'audio/mp3' })
    const audioFile = new File([audioFileBlob], 'output.mp3', {
      type: 'audio/mpeg',
    })

    console.log('Convert finished.')

    return audioFile
  }

  async function handleUploadVideo(event: ChangeEvent<HTMLFormElement>) {
    try {
      event.preventDefault()

      if (!videoFile) {
        return
      }

      // convert video file to audio
      setStatus('converting')
      const audioFile = await convertVideoToAudio(videoFile)

      const data = new FormData(event.currentTarget)
      data.append('file', audioFile)

      setStatus('uploading')
      const response = await api.post('/videos', data)

      const videoId = response.data.video.id

      const prompt = data.get('prompt')

      setStatus('generating')
      await api.post(`/videos/${videoId}/transcription`, {
        prompt,
      })

      console.log('Video uploaded.')

      setStatus('success')

      onUploaded(videoId)
    } catch (error) {
      console.error(error)
      setStatus('error')
    } finally {
      setTimeout(() => {
        setStatus('waiting')
      }, 3000)
    }
  }

  const previewUrl = useMemo(() => {
    if (!videoFile) return null

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <label
        htmlFor="video"
        className="relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed text-sm text-muted-foreground hover:bg-primary/5"
      >
        {previewUrl ? (
          <video
            src={previewUrl}
            controls={false}
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
        ) : (
          <>
            <FileVideo className="h-4 w-4" />
            Selecione um vídeo
          </>
        )}
      </label>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          id="transcription_prompt"
          className="h-20 resize-none leading-relaxed"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
          name="prompt"
          disabled={status !== 'waiting'}
        />
      </div>

      <Button
        data-success={status === 'success'}
        disabled={status !== 'waiting'}
        className="w-full data-[success=true]:bg-emerald-400"
        type="submit"
      >
        {status === 'waiting' ? (
          <>
            Carregar vídeo
            <Upload className="ml-2 h-4 w-4" />
          </>
        ) : (
          STATUS_MESSAGES[status]
        )}
      </Button>

      <input
        type="file"
        className="sr-only"
        id="video"
        accept="video/mp4"
        onChange={handleFileSelected}
        disabled={status !== 'waiting'}
      />
    </form>
  )
}
