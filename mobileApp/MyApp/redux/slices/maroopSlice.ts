import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface Maroop {
  maroop_id: number;
  name: string;
  start_date: Date;
  created_at: Date;
}

interface MaroopSliceState {
  maroops: Maroop[];
  selectedMaroop: {};
}

const initialState: MaroopSliceState = {
  maroops: [],
  selectedMaroop: {},
};

const MaroopSlice = createSlice({
  name: 'Maroop',
  initialState,
  reducers: {
    setMaroops(state, action: PayloadAction<Maroop[]>) {
      state.maroops = action.payload;
    },
    setSelectedMaroop(state, action: PayloadAction<Maroop>) {
      state.selectedMaroop = action.payload;
    },
  },
});

export const { 
  setMaroops,
  setSelectedMaroop,
} = MaroopSlice.actions;

export default MaroopSlice.reducer;
