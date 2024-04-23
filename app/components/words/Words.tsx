"use client";

import {
  generateWords,
  selectWords
} from "@/lib/features/counter/counterSlice";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Word from '../word/Word'

export const Words = () => {
  const dispatch = useAppDispatch();
  const words = useAppSelector(selectWords);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-2">
        {words.map((word, i) => <Word word={word} index={i} key={i} />)}
      </div>
      <div className="flex flex-row gap-2 m-2 ml-0 mr-0">
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