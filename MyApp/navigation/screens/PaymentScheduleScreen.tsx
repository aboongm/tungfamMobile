import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Button } from 'react-native';
import { useDispatch } from 'react-redux';

import PageTitle from '../../components/PageTitle';
import PageContainer from '../../components/PageContainer';
import { COLORS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { updateUserRole } from '../../redux/slices/auth/authSlice';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker'

const PaymentScheduleScreen = () => {

    const disptach = useDispatch();
    const [firms, setFirms] = useState([]);
    const [selectedFirm, setSelectedFirm] = useState(null);
    const [loanTypes, setLoanTypes] = useState([]);
    const [selectedLoanType, setSelectedLoanType] = useState('');
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

    const [payments, setPayments] = useState([
        // Dummy data for payments (replace this with your actual data structure)
        {
            date: '21 Dec 2023',
            payment: 'Rs 1700',
            description: 'On time',
        },
        {
            date: '21 Dec 2023',
            payment: 'Rs 1700',
            description: 'Late',
        },
        {
            date: '21 Dec 2023',
            payment: 'Rs 1700',
            description: 'Late',
        },
        {
            date: '21 Dec 2023',
            payment: 'Rs 1700',
            description: 'Late',
        },
    ]);

    const [newPaymentDate, setNewPaymentDate] = useState(new Date());
    const [selectedPayment, setSelectedPayment] = useState('');
    const [remark, setRemark] = useState('');

    const addPayment = () => {
        console.log("payments: ", payments);
        
        const newPayment = {
            date: newPaymentDate.toLocaleDateString(), 
            payment: selectedPayment, 
            description: remark || 'No remarks provided', 
        };

        setPayments([...payments, newPayment]);
        console.log("payments: ", payments);
        console.log("newPayment: ", newPayment);

        setNewPaymentDate(new Date());
        setSelectedPayment('');
        setRemark('');
    };


    useEffect(() => {
    }, [selectedFirm]);

    return (
        <PageContainer style={styles.container}>
            <PageTitle text="Payment Schedule" />
            <View style={styles.infoContainer}>
                <View style={styles.infoBlock}>
                    <Text style={styles.infoHeader}>John Doe</Text>
                    <Text style={styles.infoHeader}>L50000W48P1700</Text>
                </View>
                <View style={styles.infoBlock}>
                    <View style={styles.blockContainer}>
                        <Text style={styles.infoText}>NoOfPayments</Text>
                        <Text style={styles.infoText}>12</Text>
                    </View>
                    <View style={styles.blockContainer}>
                        <Text style={styles.infoText}>TotalPayment</Text>
                        <Text style={styles.infoText}>$12000</Text>
                    </View>
                    <View style={styles.blockContainer}>
                        <Text style={styles.infoText}>OutPayment</Text>
                        <Text style={styles.infoText}>Rs 6000</Text>
                    </View>
                </View>
            </View>

            <View style={styles.tableRow}>
                <Text style={styles.columnHeader}>Date</Text>
                <Text style={styles.columnHeader}>Payment</Text>
                <Text style={styles.columnHeader}>Description</Text>
            </View>
            <ScrollView contentContainerStyle={styles.formContainer}>
                <View style={{ width: '100%' }}>
                    <View style={styles.tableContainer}>
                        <View>
                            {payments.map((payment, index) => (
                                <View style={[
                                        styles.tableBody,
                                        index % 2 === 0 ? styles.evenRow : styles.oddRow,
                                    ]} key={index}>
                                    <Text style={styles.columnItem}>{payment.date}</Text>
                                    <Text style={styles.columnItem}>{payment.payment}</Text>
                                    <Text style={styles.columnItem}>{payment.description}</Text>
                                </View>
                            ))}
                        </View>

                        <Text style={styles.paymentHeader}>Add A Payment</Text>
                        <View style={styles.tableInput}>
                            <View style={styles.DatePayment}>
                                <View style={styles.dateButton}>
                                    <Button color="green" title="Pick Date" onPress={() => setOpen(true)} />
                                </View>
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
                                <Picker
                                    style={styles.paymentPicker}
                                    selectedValue={selectedPayment}
                                    onValueChange={(itemValue) => setSelectedPayment(itemValue)}
                                >
                                    <Picker.Item label="Rs 1700" value="1700" />
                                    <Picker.Item label="Rs 1400" value="1400" />
                                </Picker>
                            </View>

                            <TextInput
                                style={styles.descriptionInput}
                                placeholder="Enter remarks"
                                value={remark}
                                onChangeText={(text) => setRemark(text)}
                            />
                            <TouchableOpacity onPress={addPayment}>
                                <Text style={styles.addPaymentButton}>Add Payment</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        margin: 4,
        padding: 10
    },
    infoContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: 0,
        padding: 0
    },
    infoBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        borderRadius: 5,
        marginBottom: 6,
        paddingHorizontal: 6,
        paddingVertical: 4,
        margin: 0,
        backgroundColor: 'lightgrey'
    },
    blockContainer: {
        flexDirection: 'column',
        // borderWidth: 1,
        // borderColor: COLORS.tungfamGrey,
        margin: 0,
        padding: 0
    },
    infoHeader: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: "center",
        margin: 0,
        padding: 0,
    },
    infoText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: "center",
        margin: 0,
        padding: 0
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
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        backgroundColor: 'lightblue'
    },
    tableBody: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
    },
    columnHeader: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 18,
    },
    columnItem: {
        flex: 1,
        fontWeight: '500',
        fontSize: 16,
    },
    paymentHeader: {
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
    },
    dateButton: {
        backgroundColor: "green",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        margin: 0,
        padding: 0,
    },
    paymentPicker: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        backgroundColor: "lightgrey"
        // paddingHorizontal: 10,

        // backgroundColor: 'red'
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
        backgroundColor: 'green',
        color: 'white',
        borderRadius: 5,
        padding: 14,
        textAlign: 'center',
        flex: 1,
    },
    evenRow: {
        backgroundColor: COLORS.tungfamPurple,
    },
    oddRow: {
        backgroundColor: 'lightgrey',
    },
});

export default PaymentScheduleScreen;
