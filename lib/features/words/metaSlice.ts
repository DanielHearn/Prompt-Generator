import { createAppSlice } from '@/lib/createAppSlice'

export interface MetaSliceState {
  mobile: boolean
}

const initialState: MetaSliceState = {
  mobile: window.innerWidth < 700,
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const metaSlice = createAppSlice({
  name: 'meta',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    setMobile: create.reducer((state, action: { payload: boolean }) => {
      state.mobile = action.payload
    }),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectMobile: (state) => state.mobile,
  },
})

// Action creators are generated for each case reducer function.
export const { setMobile } = metaSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectMobile } = metaSlice.selectors
