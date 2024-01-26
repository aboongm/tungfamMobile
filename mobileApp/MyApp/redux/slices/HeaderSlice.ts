import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Category {
  category_id: number;
  name: string;
}

interface Firm {
  firm_id: number,
  firm_name: string,
  address: string,
  mobile: number,
  registration:string,
  contact_person: string,
  email: string,
  website: string,
  status: string,
  created_at: Date
}

interface HeaderSliceState {
  categories: Category[],
  selectedCategory: string;
  scrolledPosition: number;
  firmData: {}
}

const initialState: HeaderSliceState = {
  categories: [],
  selectedCategory: 'LoanBook',
  scrolledPosition: 0,
  firmData: {}
};

const HeaderSlice = createSlice({
  name: 'Header',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload
    },
    setCategoryStyling(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setScrollPosition(state, action: PayloadAction<number>) {
      state.scrolledPosition = action.payload
    },
    setFirmData(state, action: PayloadAction<Firm>) {
      state.firmData = action.payload
    }
  },
});

export const { 
  setCategories, 
  setCategoryStyling, 
  setScrollPosition,
  setFirmData
} = HeaderSlice.actions;

export default HeaderSlice.reducer;
