import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux';
import { COLORS } from '../../constants';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { API_URL } from '@env';
import { RootState } from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CashFlowScreen = ({ userRole, userId }) => {
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
  const [showCashFlowItem, setShowCashFlowItem] = useState(false);
  const [entryId, setEntryId] = useState("");

  const firmData = useSelector((state: RootState) => state.loanSlice.firm)

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
        const cashFlowReponse = await axios.get(
          `${API_URL}/cashflows/${firmId.toString()}`,
          { headers }
        );

        if (cashFlowReponse.status === 200) {
          setCashFlows(cashFlowReponse.data);
          setIsLoading(false)
        } else {
          console.log("Cashflow entry not found!");
          setIsLoading(false)
        }
      } catch (error) {
        console.log("Error fetching latest cash flow:", error);
        setIsLoading(false)
      }
    };

    fetchCashFlows();

  }, [firmData]);

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
        const token = await AsyncStorage.getItem("token");
        const headers = {
          Authorization: `${token}`
        };

        const firmId = firmData.firm_id;
        const latestCashFlowResponse = await axios.get(
          `${API_URL}/cashflows/latest/${firmId.toString()}`,
          { headers }
        );

        if (latestCashFlowResponse.status === 200) {
          setLatestCashflowBalance(latestCashFlowResponse.data.cash_balance);
        } else {
          console.log("Cashflow entry not found!");
        }
      } catch (error) {
        console.log("Error fetching latest cash flow:", error);
      }
    };

    fetchLatestCashFlow();
  }, []);


  const addCashFlow = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `${token}` };
      const firmId = firmData.firm_id;
      const newCashBalance = latestCashflowBalance + inflowsTotal - outflowsTotal;
      const entryData = {
        entry_date: newPaymentDate.toISOString().split("T")[0],
        inflows_total: inflowsTotal,
        outflows_total: outflowsTotal,
        cash_balance: newCashBalance,
        entry_details: [
          ...inflows.map((inflow) => ({
            type: "inflow",
            amount: parseFloat(inflow.amount),
            remark: inflow.remark
          })),
          ...outflows.map((outflow) => ({
            type: "outflow",
            amount: parseFloat(outflow.amount),
            remark: outflow.remark
          })),
        ],
      };

      const response = await axios.post(`${API_URL}/cashflows/${firmId}`, entryData, { headers });

      if (response.status === 200) {
        Alert.alert("Successfully created cash flow entry!");
      }
    } catch (error) {
      console.log("Error adding cash flow:", error);
      Alert.alert("Failed to create cash flow entry!");
    }
  };


  const takePermission = () => {
    Alert.alert(
      'Confirm Payment',
      `Are you sure you want to add this CashFlow Entry for ${newPaymentDate.toISOString().split('T')[0]}?`,
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
  }

  const addInflow = () => {
    setInflows((prevInflows) => [...prevInflows, { amount: latestInflowAmount, remark: latestInflowRemark }]);
    setLatestInflowAmount('');
    setLatestInflowRemark('');
  };

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
                    <Text style={styles.columnItem}>
                      {item.cash_balance}
                    </Text>
                  </TouchableOpacity>

                  {showCashFlowItem[item.entry_id] && (
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
      </View>
    </View>
  )

  const renderAddInflow = () => (
    <View style={styles.inflowContainer}>

      <View style={styles.itemContainer}>
        <Text style={styles.item}>inflowsTotal: </Text>
        <Text style={styles.item}>Rs {inflows.reduce((acc, item) => acc + parseFloat(item.amount), 0)}</Text>
      </View>

      {inflows.length > 0 && (
        <View style={styles.entriesContainer}>
          {inflows.map((inflow, index) => (
            <View key={`inflow${index}`} style={styles.itemContainer}>
              <Text style={[styles.item, { fontWeight: '400' }]}>{index + 1}. Amount: {inflow.amount}; Remark: {inflow.remark}</Text>
              <TouchableOpacity style={[styles.iconContainer, {backgroundColor: 'pink'}]} onPress={() => removeInflow(index)}>
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
          />
          <TextInput
            style={styles.descriptionInput}
            placeholder="Remark"
            value={latestInflowRemark}
            onChangeText={(text) => setLatestInflowRemark(text)}
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
              <TouchableOpacity style={[styles.iconContainer, {backgroundColor: 'pink'}]} onPress={() => removeOutflow(index)}>
                <Feather
                  name="x-square"
                  color="fff"
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
          />
          <TextInput
            style={styles.descriptionInput}
            placeholder="Remark"
            value={latestOutflowRemark}
            onChangeText={(text) => setLatestOutflowRemark(text)}
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


  return (
    <ScrollView style={styles.cashFlowContainer}>
      <TouchableOpacity onPress={toggleCashFlow}>
        <Text style={styles.headerText}>CashFlow</Text>
      </TouchableOpacity>
      {showDetails && (
        <>
          <View style={styles.tableRow}>
            <Text style={styles.columnHeader}>Date</Text>
            <Text style={styles.columnHeader}>CashBalance</Text>
          </View>
          {renderCashFlows()}

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

export default connect(mapStateToProps)(CashFlowScreen)

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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 14,
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