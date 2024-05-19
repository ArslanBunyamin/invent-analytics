import { createSlice } from '@reduxjs/toolkit'

export const moviesSlice = createSlice({
    name: 'movies',
    initialState: {
        year: null,
        searchText: 'Pokemon',
        type: null
    },
    reducers: {
        setYear: (state, action) => {
            state.year = action.payload
        },
        setSearchText: (state, action) => {
            state.searchText = action.payload
        },
        setType: (state, action) => {
            state.type = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
export const { setYear, setSearchText, setType } = moviesSlice.actions

export default moviesSlice.reducer