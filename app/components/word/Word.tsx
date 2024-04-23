"use client";
import {
  regenerateWord,
  lockWord,
  changeWordType,
  wordTypeNames
} from "@/lib/features/counter/counterSlice";
import type {
  word as wordType
} from "@/lib/features/counter/counterSlice";
import { BiLock,  BiLockOpen, BiRefresh, BiDotsVerticalRounded } from "react-icons/bi";
import { useAppDispatch } from "@/lib/hooks";
import Dropdown from "../dropdown/Dropdown";

export const Word = (props: {word: wordType, index: number}) => {
  const {word, index} = props;
  const dispatch = useAppDispatch();

  return (
    <div className="word flex flex-row bg-gray-700 text-white rounded-md">
      <div className="flex p-4 items-center bg-slate-600 rounded-bl-md rounded-tl-md"><BiDotsVerticalRounded/></div>
      <div className="flex flex-col">
        <div className="word__value p-4">{word.value}</div>
        <div className="flex flex-row">
          <Dropdown
              menu={Object.values(wordTypeNames).map((name, key) => <button key={key} onClick={() => dispatch(changeWordType({word, index, value: key}))}>{name}</button>)}
          />
          <button className={`p-4 hover:bg-gray-600 ${word.locked && 'bg-red-800 hover:bg-red-700'}`} onClick={ 
            () => { dispatch(lockWord({ word, index, value: !word.locked })) }}>{word.locked ? <BiLock /> : <BiLockOpen />}
          </button>
          <button  className="p-4 disabled:opacity-75 hover:bg-gray-600"
            onClick={() => {
              if (!word.locked) {
                dispatch(regenerateWord({ word, index }))
              }
            }}
            disabled={word.locked}
          ><BiRefresh />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Word;