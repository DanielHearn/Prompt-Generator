import { createAppSlice } from "@/lib/createAppSlice";
import { NOUNS, VERBS, ADJECTIVES, LOCATIONS } from '../../words'

export enum WORD_TYPES { 'VERB', 'NOUN', 'ADJECTIVE', 'LOCATION' }

export type word = {
  type: WORD_TYPES,
  value: string,
  locked: boolean,
  id: string,
}

export type words = word[]

export interface WordSliceState {
  words: words;
}

export const wordTypeMap = {
  [WORD_TYPES.VERB]: VERBS,
  [WORD_TYPES.NOUN]: NOUNS,
  [WORD_TYPES.ADJECTIVE]: ADJECTIVES,
  [WORD_TYPES.LOCATION]: LOCATIONS,
}

export const wordTypeNames = {
  [WORD_TYPES.VERB]: 'Verbs',
  [WORD_TYPES.NOUN]: 'Nouns',
  [WORD_TYPES.ADJECTIVE]: 'Adjectives',
  [WORD_TYPES.LOCATION]: 'Locations',
}

const randomIndexFromArray = (max: number) => {
  return Math.floor(Math.random()*max)
}

const generateSlug = () => Math.random().toString(16).slice(2)

const generateWord = (type: WORD_TYPES): word => {
  const value = wordTypeMap[type][randomIndexFromArray(wordTypeMap[type].length)]
  return {
    type,
    value: value || '',
    locked: false,
    id: generateSlug()
  }
} 

const generateDefaultWords = (): words => {
  const wordTypes = [WORD_TYPES.ADJECTIVE, WORD_TYPES.NOUN, WORD_TYPES.LOCATION]

  return wordTypes.map((type) => generateWord(type))
}

const initialState: WordSliceState = {
  words: generateDefaultWords(),
};


// If you are not using async thunks you can use the standalone `createSlice`.
export const wordSlice = createAppSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    generateWords: create.reducer((state) => {
      state.words = state.words.slice().map((word) => {
        if (!word.locked) {
          const newWord = generateWord(word.type)
          return newWord
        }
        return word
      })
    }),
    setWords: create.reducer((state, action: { payload: { words: words } }) => {
      const { words } = action.payload
      state.words = words
    }),
    regenerateWord: create.reducer((state, action: { payload: {word: word, id: string} }) => {
      const { word, id } = action.payload
      const newWord = generateWord(word.type)
      newWord.locked = word.locked
      const newWords = state.words.slice()
      const index = newWords.findIndex(item => item.id === id)
      newWords[index] = newWord
      state.words = newWords.slice()
    }),
    lockWord: create.reducer((state, action: { payload: { word: word, id: string, value: boolean } }) => {
      const { word, id, value } = action.payload
      const newWord = {...word}
      newWord.locked = value
      const newWords = state.words.slice()
      const index = newWords.findIndex(item => item.id === id)
      newWords[index] = newWord
      state.words = newWords.slice()
    }),
    changeWordType: create.reducer((state, action: { payload: { id: string, value: WORD_TYPES } }) => {
      const { id, value } = action.payload
      const newWord = generateWord(value)
      const newWords = state.words.slice()
      const index = newWords.findIndex(item => item.id === id)
      newWords[index] = newWord
      state.words = newWords.slice()
    }),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectWords: (counter) => counter.words,
  },
});

// Action creators are generated for each case reducer function.
export const {generateWords, regenerateWord, lockWord, changeWordType, setWords } =
  wordSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectWords } = wordSlice.selectors;