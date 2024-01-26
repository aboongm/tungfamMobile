import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Loan {
  loan_id: number;
  loan_officer_id: number;
  lender_firm_id: number;
  borrower_id: number;
  loan_type: string;
  start_date: Date;
  status: string;
  created_at: Date;
}

interface Firm {
  firm_id: number;
  firm_name: string;
  address: string;
  mobile: number;
  registration: string;
  contact_person: string;
  email: string;
  website: string;
  status: string;
  created_at: Date;
}

interface LoanSliceState {
  loans: Loan[];
  firm: {};
  selectedLoan: {};
}

const initialState: LoanSliceState = {
  loans: [],
  firm: {},
  selectedLoan: {},
};

const LoanSlice = createSlice({
  name: 'Loan',
  initialState,
  reducers: {
    setLoans(state, action: PayloadAction<Loan[]>) {
      state.loans = action.payload;
    },
    setFirmData(state, action: PayloadAction<Firm>) {
      state.firm = action.payload;
    },
    setSelectedLoan(state, action: PayloadAction<Loan>) {
      state.selectedLoan = action.payload;
    },
  },
});

export const { 
  setLoans,
  setFirmData,
  setSelectedLoan,
} = LoanSlice.actions;

export default LoanSlice.reducer;
