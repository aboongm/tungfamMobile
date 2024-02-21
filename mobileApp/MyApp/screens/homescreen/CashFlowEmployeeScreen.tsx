import { ActivityIndicator, Alert, Button, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { connect, useSelector } from 'react-redux';
import { COLORS } from '../../constants';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { API_URL } from '@env';
import { RootState } from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CashFlowEmployeeScreen = ({ userRole, userId }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [open, setOpen] = useState(false);
  const [newPaymentDate, setNewPaymentDate] = useState(new Date());
  const [inflows, setInflows] = useState([]); // Array to store inflow entries
  const [outflows, setOutflows] = useState([]);
  const [inflowsTotal, setInflowsTotal] = useState([]); // Array to store inflow entries
  const [outflowsTotal, setOutflowsTotal] = useState([]);
  const [latestInflowAmount, setLatestInflowAmount] = useState('');
  const [latestInflowRemark, setLatestInflowRemark] = useState('');
  const [latestOutflowAmount, setLatestOutflowAmount] = useState('');
  const [latestOutflowRemark, setLatestOutflowRemark] = useState('');
  const [isLoading, setIsLoading] = useState(true)
  const [cashFlows, setCashFlows] = useState([]);
  const [latestCashflowBalance, setLatestCashflowBalance] = useState(0);
  const [latestLoansPayable, setLatestLoansPayable] = useState(0);
  const [latestPreviousCashflowBalance, setLatestPreviousCashflowBalance] = useState(0);
  const [showCashFlowItem, setShowCashFlowItem] = useState(false);
  const [entryId, setEntryId] = useState("");
  const [page, setPage] = useState(1);
  const [latestCashFlowDate, setLatestCashFlowDate] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isPaymentSchedule, setIsPaymentSchedule] = useState(false);
  const [borrowerName, setBorrowerName] = useState('');
  const [loanId, setLoanId] = useState('');
  const [loanType, setLoanType] = useState('');
  const [noOfPayments, setNoOfPayments] = useState('');
  const [outstandingPayable, setOutstandingPayable] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [totalPayable, setTotalPayable] = useState('');

  const firmData = useSelector((state: RootState) => state.headerSlice.firmData)
  const loanData = useSelector((state: RootState) => state.loanSlice.loans)

  const isPaymentScheduleRef = useRef(isPaymentSchedule);
  const selectedLoanRef = useRef(selectedLoan);

  const toggleCashFlow = () => {
    setShowDetails(!showDetails);
  };

  const toggleCashFlowItem = (entryId) => {
    setShowCashFlowItem((prevOpenItems) => ({
      ...prevOpenItems,
      [entryId]: !prevOpenItems[entryId],
    }));
    setEntryId(entryId);
  };

  useEffect(() => {
    const fetchCashFlows = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const headers = {
          Authorization: `${token}`
        };

        const firmId = firmData.firm_id;
        const allCashFlows = [];
        for (let i = 1; i <= page; i++) {
          const cashFlowReponse = await axios.get(
            `${API_URL}/cashflows/${firmId.toString()}?page=${i}`,
            { headers }
          );
          if (cashFlowReponse.status === 200) {
            allCashFlows.push(...cashFlowReponse.data.entries.filter(entry => entry.user_id === userId))
            // console.log("allCashFlows", allCashFlows);

            setIsLoading(false)
          } else {
            console.log("Cashflow entry not found!");
            setIsLoading(false)
          }
        }
        setCashFlows(allCashFlows);
      } catch (error) {
        console.log("Error fetching latest cash flow:", error);
        setIsLoading(false)
      }
    };

    fetchCashFlows();

  }, [firmData, page]);

  useEffect(() => {
    const totalInflows = inflows.reduce((acc, val) => acc + parseFloat(val.amount), 0);
    const totalOutflows = outflows.reduce((acc, val) => acc + parseFloat(val.amount), 0);
    setInflowsTotal(totalInflows);
    setOutflowsTotal(totalOutflows);
    setInflows(inflows)
    setOutflows(outflows)
  }, [inflows, outflows]);

  useEffect(() => {
    const fetchLatestCashFlow = async () => {
      try {

        if (cashFlows.length > 0) {
          const sortedCashFlows = cashFlows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

          // console.log("sortedCashFlows: ", sortedCashFlows);
          // Get the latest cash flow entry
          const latestCashFlow = sortedCashFlows[0];

          // console.log("latestCashFlow: ", latestCashFlow);

          setLatestCashflowBalance(latestCashFlow.cash_balance);
          setLatestPreviousCashflowBalance(latestCashFlow.previous_cash_balance);
          setLatestCashFlowDate(latestCashFlow.entry_date);
        } else {
          console.log("Cashflow entry not found!");
        }
      } catch (error) {
        console.log("Error fetching latest cash flow:", error);
      }
    };

    fetchLatestCashFlow();
  }, [firmData, cashFlows]);

  useEffect(() => {
    const fetchLoansOutstanding = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const headers = { Authorization: `${token}` };
  
        const filteredLoans = loanData.filter(item => item.loan_officer_id === userId);
        const paymentScheduleArray = []
        for (const loan of filteredLoans) {
          try {
            const paymentResponse = await axios.get(`${API_URL}/loans/${loan.loan_id}/latestpaymentschedules`, { headers });
            const latestPaymentSchedule = paymentResponse.data;
  
            console.log("Latest Payment Schedule: ", latestPaymentSchedule);
            paymentScheduleArray.push(...latestPaymentSchedule)
          } catch (error) {
            console.error("Error fetching latest payment schedule: ", error);
          }
        }
        console.log("paymentScheduleArray: ", paymentScheduleArray);
        // Add the outstanding_payable prop of each item
        const totalOutstandingPayable = paymentScheduleArray.reduce((sum, item) => {
          return sum + parseFloat(item.outstanding_payable || 0); // Convert to number and handle possible null values
        }, 0);
        console.log("Total Outstanding Payable: ", totalOutstandingPayable);
        const updatedTotalOutstandingPayable = totalOutstandingPayable - inflowsTotal
        setLatestLoansPayable(updatedTotalOutstandingPayable)
      } catch (error) {
        console.error("Error fetching loans: ", error);
      }
      
    };
  
    fetchLoansOutstanding();
  }, [loanData, userId, inflowsTotal]);
  

  useEffect(() => {
    isPaymentScheduleRef.current = isPaymentSchedule;
    selectedLoanRef.current = selectedLoan;
  }, [isPaymentSchedule, selectedLoan]);

  const takePermission = () => {
    if (inflows.length <= 0 && outflows.length <= 0) {
      Alert.alert("Create an entry to inflows/outflows First!");
    } else {
      const newPaymentDateString = newPaymentDate.toISOString().split('T')[0];
      // const latestCashFlowDateString = latestCashFlowDate.split('T')[0];

      // if (newPaymentDateString === latestCashFlowDateString) {
      //   Alert.alert(`Entry for Date ${newPaymentDateString} already exists!`);
      // } else {
      Alert.alert(
        'Confirm Payment',
        `Are you sure you want to add this CashFlow Entry for ${newPaymentDateString}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'OK',
            onPress: addCashFlow
          }
        ]
      );
      // }
    }
  }

  const addInflow = () => {
    setInflows((prevInflows) => [
      ...prevInflows,
      {
        amount: latestInflowAmount,
        remark: latestInflowRemark,
        is_payment_schedule: isPaymentSchedule,
        loan_id: loanId
      }
    ]);
    setLatestInflowRemark('');
    setLatestInflowAmount('');
    setIsPaymentSchedule(false);
  };
  // console.log('inflows: ', inflows);

  const removeInflow = (index) => {
    const updatedInflows = [...inflows];
    updatedInflows.splice(index, 1);
    setInflows(updatedInflows);
  };

  const addOutflow = () => {
    setOutflows((prevOutflows) => [...prevOutflows, { amount: latestOutflowAmount, remark: latestOutflowRemark }]);
    setLatestOutflowAmount('');
    setLatestOutflowRemark('');
  };

  const removeOutflow = (index) => {
    const updatedOutflows = [...outflows];
    updatedOutflows.splice(index, 1);
    setOutflows(updatedOutflows);
  };

  const handleLoadMore = () => {
    console.log("More cashflows");
    setPage(prevPage => prevPage + 1);
  };

  const handleLoan = async (loan) => {
    setIsPaymentSchedule(true);
    isPaymentScheduleRef.current = true;
    selectedLoanRef.current = loan;
    setLatestInflowAmount(`${loan.installment}`);
    setLatestInflowRemark(`From ${loan.borrower_name}`);
    setLoanId(`${loan.loan_id}`);
  };


  const addCashFlow = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `${token}` };
      const firmId = firmData.firm_id;
      const newCashBalance = parseFloat(latestCashflowBalance) + parseFloat(inflowsTotal) - parseFloat(outflowsTotal);
      const entryData = {
        entry_date: newPaymentDate.toISOString().split("T")[0],
        inflows_total: inflowsTotal,
        outflows_total: outflowsTotal,
        cash_balance: newCashBalance,
        previous_cash_balance: parseFloat(latestCashflowBalance),
        previous_loans_payable: parseFloat(latestLoansPayable),
        user_id: userId,
        entry_details: [
          ...inflows.map((inflow) => ({
            type: "inflow",
            amount: parseFloat(inflow.amount),
            remark: inflow.remark,
            is_payment_schedule: inflow.is_payment_schedule,
            ...(inflow.is_payment_schedule && {
              loan_id: inflow.loan_id,
            }),
          })),
          ...outflows.map((outflow) => ({
            type: "outflow",
            amount: parseFloat(outflow.amount),
            remark: outflow.remark,
          })),
        ],
      };
      // console.log("entryData: ", entryData);

      const response = await axios.post(`${API_URL}/cashflows/${firmId}`, entryData, { headers });

      if (response.status === 200) {
        console.log(response.data.entries);

        Alert.alert("Successfully created cash flow entry!");
        setInflows([])
        setOutflows([])
      }
    } catch (error) {
      console.log("Error adding cash flow:", error);
      Alert.alert("Failed to create cash flow entry!");
    }
  };

  const renderCashFlows = () => (
    <View style={styles.tableContainer}>
      <View>
        {isLoading ? (
          <View style={{ alignItems: 'center', paddingTop: 20 }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <>
            {cashFlows.length > 0 ? (
              cashFlows.map((item, index) => (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() => toggleCashFlowItem(item.entry_id)}
                    style={[
                      styles.tableBody,
                      index % 2 === 0 ? styles.evenRow : styles.oddRow,
                    ]}
                  >
                    <Text style={styles.columnItem}>
                      {new Date(item.entry_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text>
                    <Text style={[styles.columnItem, { textAlign: 'right'}]}>
                      Rs {item.cash_balance}
                    </Text>
                    <Text style={[styles.columnItem, { textAlign: 'right' }]}>
                      Rs {item.previous_loans_payable}
                    </Text>
                  </TouchableOpacity>

                  {showCashFlowItem[item.entry_id] && (
                    <>

                      <View style={styles.detailContainer}>

                        <View style={styles.wrapper}>
                          <View style={[styles.itemContainer, { paddingHorizontal: 0 }]}>
                            <Text style={styles.detailItem}>inflows Total: </Text>
                            <Text style={styles.detailItem}>Rs {item.inflows_total}</Text>
                          </View>

                          <Text style={styles.detailItem}>Inflow Entries:</Text>
                          {item.entry_details
                            .filter((detail) => detail.type === 'inflow')
                            .map((detail, ind) => (
                              <View style={styles.detailItemContainer} key={ind}>
                                <Text style={styles.detailItem}>{ind + 1}. {`Amount: Rs ${detail.amount}`}</Text>
                                <Text style={styles.detailItem}>{"     "}Remark: {detail.remark}</Text>
                              </View>
                            ))}
                        </View>

                        <View style={styles.wrapper}>
                          <View style={[styles.itemContainer, { paddingHorizontal: 0 }]}>
                            <Text style={styles.detailItem}>Outflows Total: </Text>
                            <Text style={styles.detailItem}>Rs {item.outflows_total}</Text>
                          </View>

                          <Text style={styles.detailItem}>Outflow Entries: </Text>
                          {item.entry_details
                            .filter((detail) => detail.type === 'outflow')
                            .map((detail, ind) => (
                              <View style={styles.detailItemContainer} key={ind}>
                                <Text style={styles.detailItem}>{ind + 1}. {`Amount: Rs ${detail.amount}`}</Text>
                                <Text style={styles.detailItem}>{"     "}Remark: {detail.remark}</Text>
                              </View>
                            ))}
                        </View>
                      </View>
                    </>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.itemContainer}>
                <Text>No Cashflow Entry Found</Text>
              </View>
            )}
          </>
        )}

      </View>
    </View>
  )




  const renderDate = () => (
    <View style={styles.inflowContainer}>
      <View style={styles.DatePayment}>
        <Pressable style={styles.dateButton} onPress={() => setOpen(true)}>
          <Text style={styles.button}>Pick a New Date</Text>
        </Pressable>
        <DatePicker
          modal
          open={open}
          date={newPaymentDate}
          onConfirm={(date) => {
            setOpen(false);
            setNewPaymentDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </View>
      <View style={styles.itemContainer}>
      <Text style={styles.item}>SelectedDate: </Text>
        <Text style={styles.item}>{newPaymentDate.toISOString().split('T')[0]}</Text>
        {/* <Text style={styles.item}>Previous CashBalance: </Text>
        <Text style={styles.item}>Rs {latestCashflowBalance}</Text> */}
      </View>
    </View>
  )

  const renderAddInflow = () => (
    <View style={styles.inflowContainer}>
      <View style={styles.itemContainer}>
        <Text style={styles.item}>Previous CashBalance: </Text>
        <Text style={styles.item}>Rs {latestCashflowBalance}</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.item}>Outstanding Loan Payable: </Text>
        <Text style={styles.item}>Rs {latestLoansPayable}</Text>
      </View>

      <View style={styles.itemContainer}>
        <Text style={styles.item}>inflowsTotal: </Text>
        <Text style={styles.item}>Rs {inflows.reduce((acc, item) => acc + parseFloat(item.amount), 0)}</Text>
      </View>

      {renderLoanSelector()}

      {inflows.length > 0 && (
        <View style={styles.entriesContainer}>
          {inflows.map((inflow, index) => (
            <View key={`inflow${index}`} style={styles.itemContainer}>
              <Text style={[styles.loanItem, { fontWeight: '400' }]}>{index + 1}. </Text>
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={[styles.loanItem, { fontWeight: '400' }]}>Amount: {inflow.amount}</Text>
                <Text style={[styles.loanItem, { fontWeight: '400' }]}>Remark: {inflow.remark}</Text>
                {/* <Text style={[styles.loanItem, { fontWeight: '400' }]}>isPaymentSchedule: {inflow.is_payment_schedule}</Text> */}
              </View>
              <TouchableOpacity style={[styles.iconContainer, { backgroundColor: 'pink' }]} onPress={() => removeInflow(index)}>
                <Feather
                  name="x-square"
                  color="#fff"
                  size={40}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.inflowItem}>

        <View style={styles.inputs}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Add an inflow"
            value={latestInflowAmount}
            onChangeText={(text) => setLatestInflowAmount(text)}
            keyboardType="numeric"
            placeholderTextColor={'black'}
          />
          <TextInput
            style={styles.descriptionInput}
            placeholder="Remark"
            value={latestInflowRemark}
            onChangeText={(text) => setLatestInflowRemark(text)}
            placeholderTextColor={'black'}
          />
        </View>

        <TouchableOpacity style={styles.iconContainer} onPress={addInflow}>
          <Feather
            name="plus-square"
            color="#fff"
            size={40}
          />
        </TouchableOpacity>
      </View>
    </View>
  );



  const renderAddOutflow = () => (
    <View style={styles.inflowContainer}>

      <View style={styles.itemContainer}>
        <Text style={styles.item}>Outflows Total:</Text>
        <Text style={styles.item}>Rs {outflows.reduce((acc, item) => acc + parseFloat(item.amount), 0)}</Text>
      </View>

      {outflows.length > 0 && (
        <View style={styles.entriesContainer}>
          {outflows.map((outflow, index) => (
            <View key={`outflow${index}`} style={styles.itemContainer}>
              <Text style={[styles.item, { fontWeight: '400' }]}>
                {index + 1}. Amount: {outflow.amount}; Remark: {outflow.remark}
              </Text>
              <TouchableOpacity style={[styles.iconContainer, { backgroundColor: 'pink' }]} onPress={() => removeOutflow(index)}>
                <Feather
                  name="x-square"
                  color="#fff"
                  size={40}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.inflowItem}>

        <View style={styles.inputs}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Add an outflow"
            value={latestOutflowAmount}
            onChangeText={(text) => setLatestOutflowAmount(text)}
            keyboardType="numeric"
            placeholderTextColor={'black'}
          />
          <TextInput
            style={styles.descriptionInput}
            placeholder="Remark"
            value={latestOutflowRemark}
            onChangeText={(text) => setLatestOutflowRemark(text)}
            placeholderTextColor={'black'}
          />
        </View>

        <TouchableOpacity style={styles.iconContainer} onPress={addOutflow}>
          <Feather
            name="plus-square"
            color="#fff"
            size={40}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLoanSelector = () => (
    <View style={styles.loanContainer}>
      {loanData.map((loan, index) => (
        <TouchableOpacity onPress={() => handleLoan(loan)} key={index} style={styles.loanSelectorContainer}>
          <Text style={[
            styles.loanSelector,
            {
              fontWeight: selectedLoan === loan.loan_id ? 'bold' : 'normal',
            }
          ]}>{loan.borrower_name.split(' ')[1].substring(0, 5)}</Text>
          <Text style={[
            styles.loanSelector,
            {
              fontWeight: selectedLoan === loan.loan_id ? 'bold' : 'normal',
            }
          ]}>{`P${loan.installment}`}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )


  return (
    <ScrollView style={styles.cashFlowContainer}>
      <TouchableOpacity onPress={toggleCashFlow}>
        <Text style={styles.headerText}>CashFlow</Text>
      </TouchableOpacity>
      {showDetails && (
        <>
          <View style={styles.tableRow}>
            <Text style={styles.columnHeader}>Date</Text>
            <Text style={styles.columnHeader}>Cash Balance</Text>
            <Text style={styles.columnHeader}>Loans Amt</Text>
          </View>
          {renderCashFlows()}
          {cashFlows.length > 10 && (
            <Button title="Load More" onPress={handleLoadMore} />
          )}

          <View style={styles.formContainer}>
            <View style={styles.tableContainer}>
              <Text style={styles.cashFlowHeader}>Add A CashFlow Entry</Text>
            </View>
            {renderDate()}
            {renderAddInflow()}
            {renderAddOutflow()}

            <TouchableOpacity onPress={takePermission} style={styles.addPaymentButton}>
              <Text style={styles.button}>Add Cash Flow Entry</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  )
}

const mapStateToProps = (state) => ({
  userRole: state.auth.userData.role,
  userId: state.auth.userData.user_id, // Assuming 'id' is the key for user ID in your userData object
});

export default connect(mapStateToProps)(CashFlowEmployeeScreen)

const styles = StyleSheet.create({
  cashFlowContainer: {
    padding: 10,
    backgroundColor: 'rgba(52, 152, 210, 0.1)',
    paddingBottom: 200
  },
  headerText: {
    color: COLORS.black,
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: COLORS.tungfamGrey,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    elevation: 5,
  },
  cashFlowTableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    backgroundColor: COLORS.tungfamBgColor,
    elevation: 5
  },
  columnHeader: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 2,
    paddingVertical: 10,
  },
  tableBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    // elevation: 5
  },
  columnItem: {
    flex: 1,
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.2)',
    paddingHorizontal: 2,
    paddingVertical: 8,
  },
  detailContainer: {
    backgroundColor: 'rgba(52, 152, 219, 0.05)',
    borderColor: 'rgba(52, 152, 219, 0.2)',
    padding: 4,
    flexDirection: 'row'
  },
  wrapper: {
    flex: 1,
  },
  detailItem: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  detailItemContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(52, 152, 219, 0.2)',
    padding: 4,
    borderWidth: 1
  },
  formContainer: {
    // alignItems: 'center',
    margin: 0,
    padding: 0,
  },
  tableContainer: {
    margin: 0,
    padding: 0,
  },
  cashFlowHeader: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 16,
    color: COLORS.black
  },
  tableInput: {
    flexDirection: "column",
    marginTop: 10,
    justifyContent: 'space-between',
    width: '100%',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    padding: 10,
    marginBottom: 40,
  },
  DatePayment: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    width: 140,
    height: 40,
  },
  dateButton: {
    backgroundColor: COLORS.tungfamBgColor,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    margin: 0,
    padding: 0,
    elevation: 5
  },
  button: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  },
  inflowContainer: {
    marginTop: 10,
  },
  entriesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    borderRadius: 6,
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  loanContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  loanSelectorContainer: {
    backgroundColor: COLORS.tungfamBgColor,
    borderRadius: 8,
    paddingVertical: 3,
    margin: 2,
  },
  loanSelector: {
    textAlign: 'center',
    color: "white",
    fontSize: 12,
    paddingHorizontal: 6,
  },
  loanItem: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: 'bold',
  },
  item: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 6,
  },
  inflowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    borderRadius: 6,
  },
  inputs: {
    // backgroundColor: 'green',
    flex: 1,
    color: COLORS.black,
  },
  descriptionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    height: 40,
    color: COLORS.black,
  },
  iconContainer: {
    backgroundColor: COLORS.tungfamBgColor,
    borderRadius: 8,
    // width: 40,
    marginHorizontal: 10
  },
  addPaymentButton: {
    marginBottom: 200,
    fontSize: 16,
    backgroundColor: COLORS.tungfamBgColor,
    borderRadius: 5,
    padding: 10,
    // marginLeft: 10,
    // backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  evenRow: {
    backgroundColor: 'rgba(52, 152, 219, 0.45)'
  },
  oddRow: {
    backgroundColor: 'rgba(52, 152, 219, 0.30)'
  },
})