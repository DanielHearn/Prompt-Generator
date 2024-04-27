'use client'
import {
  generateWords,
  selectWords,
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

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-2">
        <Reorder.Group
          className="flex flex-row gap-4"
          axis="x"
          values={words}
          onReorder={(newWords) => {
            dispatch(setWords({ words: newWords }))
          }}
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
    </div>
  )
}

export default Words
