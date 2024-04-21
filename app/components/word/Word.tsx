"use client";

import {
  regenerateWord,
  lockWord,
} from "@/lib/features/counter/counterSlice";

import { useAppDispatch } from "@/lib/hooks";

export const Word = (props) => {
  const {word, index} = props;
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-row m-1 p-1">
      <div>{word.value}</div>
      <input type="checkbox" value={word.locked} onChange={ 
        () => { dispatch(lockWord({ word, index, value: !word.locked })) }} />
      <button 
        onClick={() => {
          if (!word.locked) {
            dispatch(regenerateWord({ word, index }))
          }
        }}
        disabled={word.locked}
        className="disabled:opacity-75"
      >Regen</button>
    </div>
  );
};
