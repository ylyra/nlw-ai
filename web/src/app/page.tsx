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
import { FileVideo, Github, Upload, Wand2 } from 'lucide-react'

export default function Home() {
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
            />
            <Textarea
              className="pointer-events-none resize-none p-4 leading-relaxed"
              placeholder="Conteúdo gerado pela IA"
              readOnly
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
          <form className="space-y-6">
            <label
              htmlFor="video"
              className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground hover:bg-primary/5"
            >
              <FileVideo className="h-4 w-4" />
              Selecione um vídeo
            </label>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="transcription_prompt">
                Prompt de transcrição
              </Label>
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
            />
          </form>

          <Separator />

          <form className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um prompt" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="youtube-title">
                    Título do Youtube
                  </SelectItem>
                  <SelectItem value="youtube-description">
                    Descrição do Youtube
                  </SelectItem>
                </SelectContent>
              </Select>
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

              <Slider min={0} max={1} step={0.1} />

              <span className="block text-xs italic leading-relaxed text-muted-foreground">
                Valores mais altos tendem a deixar o resultado mais criativos e
                com possíveis erros.
              </span>
            </div>

            <Separator />

            <Button type="submit" className="w-full">
              Executar
              <Wand2 className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </aside>
      </main>
    </>
  )
}
