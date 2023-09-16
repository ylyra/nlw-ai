'use client'
import { PromptSelect } from '@/components/PromptSelect'
import { VideoInputForm } from '@/components/VideoInputForm'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useCompletion } from 'ai/react'
import { Github, Wand2 } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [temperature, setTemperature] = useState(0.5)
  const [videoId, setVideoId] = useState('')
  const { input, setInput, handleSubmit, completion, isLoading } =
    useCompletion({
      api: 'http://localhost:3333/ai/complete',
      body: {
        videoId,
        temperature,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

  return (
    <>
      <header className="flex items-center justify-between border-b px-6 py-3">
        <h1 className="font-mono text-xl font-bold">upload.ai</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com ❤️ no NLW da Rocketseat
          </span>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="outline">
            <Github className="mr-2 h-4 w-4" />
            Github
          </Button>
        </div>
      </header>

      <main className="flex flex-1 gap-6 p-6">
        <section className="flex flex-1 flex-col gap-4">
          <div className="grid flex-1 grid-rows-2 gap-4">
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Inclua o prompt par IA..."
              spellCheck={false}
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <Textarea
              className="pointer-events-none resize-none p-4 leading-relaxed"
              placeholder="Conteúdo gerado pela IA"
              readOnly
              value={completion}
            />
          </div>

          <p>
            Lembre-se: você pode utilizar a variável{' '}
            <code className="text-violet-400">{'{transcription}'}</code> no seu
            propmpt para adicionar o conteúdo da transcrição do vídeo
            selecionado
          </p>
        </section>

        <aside className="w-96 space-y-6">
          <VideoInputForm onUploaded={setVideoId} />

          <Separator />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Prompt</Label>

              <PromptSelect onSelect={setInput} />
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>

              <Select defaultValue="gpt3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs italic text-muted-foreground">
                Você poderá customizar essa opção em breve
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperatura</Label>

              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />

              <span className="block text-xs italic leading-relaxed text-muted-foreground">
                Valores mais altos tendem a deixar o resultado mais criativos e
                com possíveis erros.
              </span>
            </div>

            <Separator />

            <Button type="submit" className="w-full" disabled={isLoading}>
              Executar
              <Wand2 className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </aside>
      </main>
    </>
  )
}
