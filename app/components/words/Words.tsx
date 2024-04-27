'use client'
import {
  generateWords,
  selectWords,
  selectHistory,
  setWords,
  addWord,
  resetWords,
} from '@/lib/features/words/wordSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import Word from '../word/Word'
import { Reorder } from 'framer-motion'
import { BiPlus } from 'react-icons/bi'

export const Words = () => {
  const dispatch = useAppDispatch()
  const words = useAppSelector(selectWords)
  const history = useAppSelector(selectHistory)

  const formattedSentence = words
    .map((word, i) => {
      let formatted = word.value
      if (i === 0) {
        return formatted[0].toUpperCase() + formatted.substring(1)
      }
      return formatted
    })
    .join(' ')

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-row gap-2 mb-8 items-center justify-center text-xl">
        {formattedSentence}
      </div>
      <div className="flex flex-row gap-2 items-center justify-center">
        <Reorder.Group
          className="flex flex-row gap-4"
          axis="x"
          values={words}
          onReorder={(newWords) => {
            dispatch(setWords({ words: newWords }))
          }}
          key={words.length.toString()}
        >
          {words.map((word, i) => (
            <Word word={word} key={word.value} />
          ))}
        </Reorder.Group>
      </div>
      <div className="flex flex-row items-center justify-center gap-2 mt-48 mb-2 ml-0 mr-0">
        <button
          className="p-4 disabled:opacity-75 text-white bg-gray-700 hover:bg-gray-600 rounded-md overflow-hidden"
          onClick={() => dispatch(generateWords())}
        >
          Regenerate Words
        </button>
        <button
          className="p-4 flex flex-row items-center disabled:opacity-75 text-white bg-gray-700 hover:bg-gray-600 rounded-md overflow-hidden"
          onClick={() => dispatch(addWord())}
        >
          <BiPlus className="pointer-events-none" />
          Add Word
        </button>
        <button
          className="p-4 flex flex-row items-center disabled:opacity-75 text-white bg-gray-700 hover:bg-gray-600 rounded-md overflow-hidden"
          onClick={() => dispatch(resetWords())}
        >
          Reset to Default
        </button>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 mt-8 mb-2 ml-0 mr-0 w-screen bg-gray-200 overflow-hidden">
        <h4 className="text-xl">Prompt History</h4>
        <ul className="flex flex-col gap-2 overflow-auto h-80">
          {history.toReversed().map((sentence) => (
            <li key={sentence}>
              <p>{sentence}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Words
