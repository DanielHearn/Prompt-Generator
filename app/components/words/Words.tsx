"use client";
import {
  generateWords,
  selectWords,
  setWords
} from "@/lib/features/counter/counterSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Word from '../word/Word'
import { Reorder } from "framer-motion"

export const Words = () => {
  const dispatch = useAppDispatch();
  const words = useAppSelector(selectWords);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-2">
        <Reorder.Group className="flex flex-row gap-4" axis="x" values={words} onReorder={(newWords) => {
          dispatch(setWords({ words: newWords }))
        }}>
          {words.map((word, i) => <Word word={word} key={word.value} />)}
        </Reorder.Group>
      </div>
      <div className="flex flex-row gap-2 mt-48 mb-2 ml-0 mr-0">
        <button  className="p-4 disabled:opacity-75 text-white bg-gray-700 hover:bg-gray-600 rounded-md overflow-hidden"
          onClick={() => dispatch(generateWords())}
        >
          Regenerate Words
        </button>
      </div>
    </div>
  );
};

export default Words;