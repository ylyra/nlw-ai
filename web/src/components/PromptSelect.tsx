import { api } from '@/lib/axios'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

type Prompt = {
  id: string
  title: string
  template: string
}

type Props = {
  onSelect: (template: string) => void
}

export function PromptSelect({ onSelect }: Props) {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [currentSelectedPrompt, setCurrentSelectedPrompt] = useState('')

  function handlePromptSelected(id: string) {
    const selectedPrompt = prompts.find((prompt) => prompt.id === id)

    if (!selectedPrompt) return

    onSelect(selectedPrompt.template)
    setCurrentSelectedPrompt(id)
  }

  useEffect(() => {
    async function bootstrap() {
      const response = await api.get('/prompts')

      setPrompts(response.data)
    }

    bootstrap()
  }, [])

  return (
    <Select onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt" />
      </SelectTrigger>

      <SelectContent>
        {prompts.map((prompt) => (
          <SelectItem key={prompt.id} value={prompt.id}>
            {prompt.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
