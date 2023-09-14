import { Label } from '@radix-ui/react-label'
import { Separator } from '@radix-ui/react-select'
import { FileVideo, Upload } from 'lucide-react'
import { ChangeEvent, useMemo, useState } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

export function VideoInputForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null)

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files) return

    const selectedFile = files[0]

    setVideoFile(selectedFile)
  }

  const previewUrl = useMemo(() => {
    if (!videoFile) return null

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form className="space-y-6">
      <label
        htmlFor="video"
        className="relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground hover:bg-primary/5"
      >
        {previewUrl ? (
          <video
            src={previewUrl}
            controls={false}
            className="pointer-events-none absolute inset-0"
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
        />
      </div>

      <Button className="w-full" type="submit">
        Carregar vídeo
        <Upload className="ml-2 h-4 w-4" />
      </Button>

      <input
        type="file"
        className="sr-only"
        id="video"
        accept="video/mp4"
        onChange={handleFileSelected}
      />
    </form>
  )
}
