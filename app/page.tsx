'use client'
import { Words } from './components/words/Words'
import { useAppSelector } from '@/lib/hooks'
import { selectMobile } from '@/lib/features/words/metaSlice'

export default function Home() {
  const mobile = useAppSelector(selectMobile)

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between ${
        mobile ? 'p-4' : 'p-24 pl-8 pr-8 '
      } overflow-hidden`}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl">Prompt Generator</h1>
        <h2 className="text-l">
          Generate prompts for creative usage such as drawing, 3D modeling or AI
        </h2>
      </div>
      <Words />
      <div>
        Developed by{' '}
        <a href="https://www.danielhearn.co.uk" className="text-blue-600 hover:underline">
          Daniel Hearn
        </a>
      </div>
    </main>
  )
}
