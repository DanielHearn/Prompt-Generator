'use client'
import {
  generateWords,
  selectWords,
  selectHistory,
  setWords,
  addWord,
  resetWords,
  resetHistory,
} from '@/lib/features/words/wordSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import Word from '../word/Word'
import { Reorder } from 'framer-motion'
import { BiPlus } from 'react-icons/bi'
import { primaryButtonStyle, secondaryButtonStyle } from '../../styles'
import { useEffect, useMemo, useState } from 'react'
import { selectMobile, setMobile } from '@/lib/features/words/metaSlice'

export const Words = () => {
  const dispatch = useAppDispatch()
  const words = useAppSelector(selectWords)
  const history = useAppSelector(selectHistory)
  const mobile = useAppSelector(selectMobile)
  const [imageUrl, setImageUrl] = useState(null)

  const formattedSentence = words
    .map((word, i) => {
      let formatted = word.value
      if (i === 0) {
        return formatted[0].toUpperCase() + formatted.substring(1)
      }
      return formatted
    })
    .join(' ')

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 700) {
        dispatch(setMobile(true))
      } else {
        dispatch(setMobile(false))
      }
    }

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [dispatch])

  async function streamToString(stream) {
    return await new Response(stream).text()
  }

  const generateImage = async () => {
    const uri = await fetch(
      `https://ai-image-gen-55a.pages.dev/generate_image?prompt=${formattedSentence}`,
    )
    const str = await streamToString(uri.body)
    const obj = JSON.parse(str)
    setImageUrl(obj.dataURI)
  }

  useEffect(() => {
    setImageUrl(null)
  }, [formattedSentence])

  const orderedHistory = useMemo(() => {
    const tempHistory = history.slice()
    tempHistory.reverse()
    return tempHistory
  }, [history])

  return (
    <div className="flex flex-col justify-center items-center">
      <div
        className="flex flex-row gap-2 mb-8 mt-6 p-4 bg-gray-100 items-center justify-center text-xl"
        suppressHydrationWarning
      >
        {formattedSentence}
      </div>
      <div
        className={`flex flex-row pt-8 w-screen bg-gray-100 justify-center ${
          !mobile && 'h-96 overflow-hidden'
        }`}
      >
        <div className={!mobile ? 'overflow-auto pl-8 w-full' : ''}>
          <Reorder.Group
            className={`flex ${mobile ? 'flex-col gap-4' : 'flex-row items-center justify-center'}`}
            axis={mobile ? 'y' : 'x'}
            values={words}
            onReorder={(newWords) => {
              dispatch(setWords({ words: newWords }))
            }}
            key={`${mobile}_${words.length.toString()}`}
          >
            {words.map((word, i) => (
              <Word
                word={word}
                key={word.value}
                index={i}
                totalLength={words.length}
                onMove={(up: boolean) => {
                  const newWords = words.slice()
                  if (up && i > 0) {
                    const swapWord = newWords[i - 1]
                    newWords[i - 1] = word
                    newWords[i] = swapWord
                    dispatch(setWords({ words: newWords }))
                  } else if (!up && i < words.length - 1) {
                    const swapWord = newWords[i + 1]
                    newWords[i + 1] = word
                    newWords[i] = swapWord
                    dispatch(setWords({ words: newWords }))
                  }
                }}
              />
            ))}
          </Reorder.Group>
        </div>
      </div>
      <div
        className={`flex flex-row flex-wrap items-center justify-center gap-2 mt-8 mb-2 ml-0 mr-0`}
      >
        <button className={primaryButtonStyle} onClick={() => dispatch(generateWords())}>
          Regenerate Words
        </button>
        <button className={primaryButtonStyle} onClick={() => dispatch(addWord())}>
          <BiPlus className="pointer-events-none" />
          Add Word
        </button>
        <button className={secondaryButtonStyle} onClick={() => dispatch(resetWords())}>
          Reset to Default
        </button>
        <button className={secondaryButtonStyle} onClick={() => generateImage()}>
          Generate Image
        </button>
      </div>
      {imageUrl && (
        <div>
          <img src={imageUrl} alt="" width="512" height="512" />
        </div>
      )}
      <div className="flex flex-col items-center justify-center gap-2 mt-8 mb-2 ml-0 mr-0 w-full max-w-4xl bg-gray-100 rounded-md overflow-hidden">
        <div className="flex flex-row items-center place-content-between p-4 bg-gray-300 w-full">
          <h4 className="text-xl">Prompt History</h4>
          <button className={secondaryButtonStyle} onClick={() => dispatch(resetHistory())}>
            Reset History
          </button>
        </div>
        <ul
          className={`flex flex-col gap-2 overflow-auto ${mobile ? 'min-h-20' : 'h-64'} w-full p-4`}
        >
          {orderedHistory.map((sentence, i) => (
            <li key={`${sentence}_${i}`}>
              <p suppressHydrationWarning>{sentence}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Words
