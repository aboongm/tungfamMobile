import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { connect } from 'react-redux';
import { COLORS } from '../../constants';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';

const CashFlowScreen = ({ userRole, userId }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [inflow1, setInflow1] = useState(0);
  const [open, setOpen] = useState(false);
  const [newPaymentDate, setNewPaymentDate] = useState(new Date());
  const [inflows, setInflows] = useState(['']); // Array to store inflow entries
  const [outflows, setOutflows] = useState(['']);

  const toggleAnalytics = () => {
    setShowDetails(!showDetails);
  };

  const addCashFlow = async () => {
    try {
      // const token = await AsyncStorage.getItem("token")
      // const headers = {
      //     Authorization: `${token}`
      // }

      // const formData = {
      //     loan_id: loan.loan_id,
      //     loan_type: loan.loan_type,
      //     borrower_name: loan.borrower_name,
      //     no_of_payments: loan.no_of_payments,
      //     total_payable: loan.total_payable,
      //     paid_amount: paidAmount,
      //     outstanding_payable: outStandingPayable,
      //     // date: newPaymentDate.toLocaleDateString(),
      //     date: newPaymentDate.toISOString().split('T')[0],
      //     installment: loan.installment,
      //     remarks: remark || 'No remarks provided'
      // }

      // console.log("formData: ", formData);


      // const response = await axios.post(`${API_URL}/loans/${loan.loan_id}/paymentschedules`, formData, { headers })
      // console.log("response.data: ", response.data);

      // if (response.status === 200) {
      //     const updatedPayments = [...payments, response.data];
      //     setPayments(updatedPayments);

      //     setNewPaymentDate(new Date());
      //     setSelectedPayment('');
      //     setRemark('');
      //     Alert.alert("Successfully created payment!")
      //     console.log("Successfully created payment!")
      // }

    } catch (error) {
      console.log('error: ', error);

      Alert.alert("Failed to create payment!")
    }
  };

  const takePermission = () => {
    // Assuming inflows and outflows are arrays of numbers
    const totalInflows = inflows.reduce((acc, val) => acc + parseFloat(val), 0);
    const totalOutflows = outflows.reduce((acc, val) => acc + parseFloat(val), 0);

    // You can use the totals as needed, for example, post them to your API
    console.log('Total Inflows:', totalInflows);
    console.log('Total Outflows:', totalOutflows);

    // Clear the arrays after taking permission
    setInflows(['']);
    setOutflows(['']);
  }

  return (
    <ScrollView style={styles.cashFlowContainer}>
      <TouchableOpacity onPress={toggleAnalytics}>
        <Text style={styles.headerText}>CashFlow</Text>
      </TouchableOpacity>
      {showDetails && (
        <>
          <View style={styles.tableRow}>
            <Text style={styles.columnHeader}>Date</Text>
            <Text style={styles.columnHeader}>Inflows</Text>
            <Text style={styles.columnHeader}>Outflows</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={{ width: '100%' }}>
              <View style={styles.tableContainer}>
                <View>
                  {/* {loading ? (
                    <View style={{ alignItems: 'center', paddingTop: 20 }}>
                      <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                  ) : (
                    <>
                      {payments.filter(item => item.loan_id === loan.loan_id).map((payment, index) => (
                        <View style={[
                          styles.tableBody,
                          index % 2 === 0 ? styles.evenRow : styles.oddRow,
                        ]} key={index}>
                          <Text style={styles.columnItem}>
                            {`${index + 1}`}.{" "}
                            {new Date(payment.date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </Text>
                          <Text style={styles.columnItem}>Rs {payment.installment}</Text>
                          <Text style={styles.columnItem}>{payment.remarks}</Text>
                        </View>
                      ))}
                    </>
                  )} */}
                </View>

                <Text style={styles.cashFlowHeader}>Add A CashFlow Entry</Text>
                {inflows.map((inflow, index) => (
                  <View key={index} style={styles.tableInput}>
                    <View style={styles.DatePayment}>
                      <Pressable style={styles.dateButton} onPress={() => setOpen(true)}>
                        <Text style={styles.button}>Pick Date</Text>
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
                    <View>
                      <Text>{`Entry ${index + 1}`}</Text>
                      <TextInput
                        style={styles.descriptionInput}
                        placeholder={`Entry ${index + 1} (Inflow)`}
                        value={inflow}
                        onChangeText={(text) => {
                          const updatedInflows = [...inflows];
                          updatedInflows[index] = text;
                          setInflows(updatedInflows);
                        }}
                        keyboardType="numeric"
                      />
                    </View>
                    <TouchableOpacity onPress={takePermission}>
                      <Text style={styles.addPaymentButton}>Add Payment</Text>
                    </TouchableOpacity>

                    <View style={styles.tableRow}>
                      <Text style={styles.columnHeader}>Inflows</Text>
                    </View>
                    {inflows.map((inflow, index) => (
                      <View key={index} style={styles.tableRow}>
                        <Text style={styles.columnItem}>{`Entry ${index + 1}: Rs ${inflow}`}</Text>
                      </View>
                    ))}
                    <View style={styles.tableRow}>
                      {/* <Text style={styles.columnHeader}>{`Total Inflows: Rs ${totalInflows}`}</Text> */}
                    </View>
                  </View>
                ))}
              </View>
            </View>
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
    textAlign: 'center'
  },
  formContainer: {
    alignItems: 'center',
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
    // backgroundColor: 'green'
    marginBottom: 40,
  },
  DatePayment: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    width: 120,
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
  },
  descriptionInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    height: 60,
    marginVertical: 10,
  },
  addPaymentButton: {
    fontSize: 16,
    backgroundColor: COLORS.tungfamBgColor,
    color: 'white',
    borderRadius: 5,
    padding: 14,
    textAlign: 'center',
    flex: 1,
    elevation: 5
  },
  evenRow: {
    backgroundColor: 'rgba(52, 152, 219, 0.45)'
  },
  oddRow: {
    backgroundColor: 'rgba(52, 152, 219, 0.30)'
  },
})