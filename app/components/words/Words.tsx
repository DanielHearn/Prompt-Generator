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
      <div className="flex flex-row">
        {words.map((word, i) => <Word word={word} index={i} key={i} />)}
      </div>
      <div >
        <button
          onClick={() => dispatch(generateWords())}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default Words;