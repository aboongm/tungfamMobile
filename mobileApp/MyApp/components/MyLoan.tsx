import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Button, Alert, Pressable, ActivityIndicator, FlatList } from 'react-native';

import PageContainer from './PageContainer';
import { COLORS } from '../constants';

const MyLoan = ({ userId }) => {
    const [loan, setLoan] = useState([]);
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [showPaymentSchedule, setShowPaymentSchedule] = useState(false);
    const [openItems, setOpenItems] = useState({});
    const [selectedLoanId, setSelectedLoanId] = useState(null);

    const toggleLoanBook = () => {
        setShowDetails(!showDetails);
    };

    const togglePaymentSchedule = (loanId) => {
        if (selectedLoanId === loanId) {
            setShowPaymentSchedule(false);
            setSelectedLoanId(null);
        } else {
            setSelectedLoanId(loanId);
            setShowPaymentSchedule(true);
        }

        // setShowPaymentSchedule(!showPaymentSchedule);
    };

    const fetchLoans = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const headers = {
                Authorization: `${token}`,
            };

            const response = await axios.get(`${API_URL}/loans`, { headers });


            if (response.status === 200) {
                const loanData = response.data.filter(loan => loan.borrower_id === userId)
                // console.log("loanData: ", loanData);
                setLoan(response.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching loan types:', error);
        }
    };


    const fetchPayments = async () => {
        try {
            const token = await AsyncStorage.getItem("token")
            const headers = {
                Authorization: `${token}`
            }

            const response = await axios.get(`${API_URL}/loans/${selectedLoanId}/paymentschedules`, { headers }); // Replace :loanId with the actual loan ID
            console.log("fetchPayments: ", response.data)
            setPayments(response.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    const filteredLoan = loan.filter(item => item.borrower_id === userId)
    const filteredPayments = payments.filter(item => item.loan_id === selectedLoanId);

    useEffect(() => {
        fetchLoans()
        fetchPayments()
    }, [selectedLoanId]);

    const toggleLoanItem = (loanId: string | number) => {
        setOpenItems((prevOpenItems) => ({
            ...prevOpenItems,
            [loanId]: !prevOpenItems[loanId],
        }));
    };

    const renderItem = ({ item, index }) => {
        const isOpen = openItems[item.loan_id];
        const isCurrentLoanSelected = selectedLoanId === item.loan_id;

        return (
            <View style={{ marginBottom: 10 }}>
                <TouchableOpacity onPress={() => toggleLoanItem(item.loan_id)}>
                    <View style={styles.loanItemContainer}>
                        <Text style={styles.loanItem}>{`${index + 1}.`} {`${item.status.toUpperCase()}`}</Text>
                        <Text style={styles.loanItem}>Rs {`${item.amount}`}</Text>
                        <Text style={styles.loanItem}>{new Date(item.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}</Text>
                    </View>
                </TouchableOpacity>

                {isOpen && (
                    <View style={styles.item}>
                        <View>
                            <Text style={styles.title}>{`Status: ${item.status}`}</Text>
                            <Text style={styles.text}>{`LoanType: ${item.loan_type}`}</Text>
                            <Text style={styles.text}>{`Created At: ${item.created_at}`}</Text>
                            <Text style={styles.text}>{`Borrower: ${item.borrower_id}`}</Text>
                            <Text style={styles.text}>{`Start Date: ${item.start_date}`}</Text>
                            <Text style={styles.text}>{`LoanOfficer: ${item.loan_officer_id}`}</Text>
                            <Text style={styles.text}>{`Lender Firm Id: ${item.lender_firm_id}`}</Text>
                            <Text style={styles.text}>{`Loan Id: ${item.loan_id}`}</Text>

                        </View>
                    </View>
                )}

                <TouchableOpacity onPress={() => togglePaymentSchedule(item.loan_id)}>
                    <Text style={styles.payScheduleText}>PAYMENT SCHEDULE</Text>
                </TouchableOpacity>
                {isCurrentLoanSelected && showPaymentSchedule && (
                    <View style={styles.container}>
                        <View style={styles.infoContainer}>
                            <View style={styles.infoBlock}>
                                <View style={styles.blockContainer}>
                                    <Text style={styles.infoText}>TotalPayable</Text>
                                    <Text style={styles.infoText}>{item.total_payable}</Text>
                                </View>
                                <View style={styles.blockContainer}>
                                    <Text style={styles.infoText}>PaidAmount</Text>
                                    <Text style={styles.infoText}>Rs {filteredPayments[filteredPayments.length - 1]?.paid_amount || 0}</Text>
                                </View>
                                <View style={styles.blockContainer}>
                                    <Text style={styles.infoText}>OutsPayable</Text>
                                    <Text style={styles.infoText}>Rs {filteredPayments[filteredPayments.length - 1]?.outstanding_payable || loan.total_payable} </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.tableRow}>
                            <Text style={styles.columnHeader}>Date</Text>
                            <Text style={styles.columnHeader}>Payment</Text>
                            <Text style={styles.columnHeader}>Remarks</Text>
                        </View>
                        <ScrollView contentContainerStyle={styles.formContainer}>
                            <View style={{ width: '100%' }}>
                                <View style={styles.tableContainer}>
                                    <View>
                                        {payments
                                            .filter(item => item.loan_id === selectedLoanId)
                                            .map((payment, index) => (
                                            <View style={[
                                                styles.tableBody,
                                                index % 2 === 0 ? styles.evenRow : styles.oddRow,
                                            ]} key={index}>
                                                <Text style={styles.columnItem}>
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
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                )}
            </View>
        )
    }

    return (
        <PageContainer style={styles.container}>
            <TouchableOpacity onPress={toggleLoanBook}>
                <Text style={styles.headerText}>MyLoans</Text>
            </TouchableOpacity>

            {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
                showDetails && (

                    <FlatList
                        scrollEnabled={false}
                        data={filteredLoan}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.loan_id.toString()}
                    />
                )
            )}

        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: COLORS.tungfamGrey,
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        elevation: 5,
    },
    loanItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
    },
    loanItem: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    item: {
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        padding: 8,
        marginVertical: 5,
        borderRadius: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    text: {
        fontSize: 14,
        marginBottom: 5,
    },
    addButton: {
        // margin: 10,
        flex: 1
    },
    buttonContainer: {
        flexDirection: 'row', // Arrange items horizontally
        justifyContent: 'space-around', // Space evenly between items
        marginTop: 10,
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
        backgroundColor: 'lightgrey',
        elevation: 5
    },
    blockContainer: {
        flexDirection: 'column',
        margin: 0,
        padding: 0
    },
    infoHeader: {
        fontSize: 16,
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
        backgroundColor: COLORS.TungfamBgColor,
        elevation: 5
    },
    tableBody: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        elevation: 5
    },
    columnHeader: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white'
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
        marginBottom: 40,
    },
    DatePayment: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    },
    dateButton: {
        backgroundColor: COLORS.TungfamBgColor,
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
    paymentPicker: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        backgroundColor: "lightgrey",
        elevation: 5
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
        backgroundColor: COLORS.TungfamBgColor,
        color: 'white',
        borderRadius: 5,
        padding: 14,
        textAlign: 'center',
        flex: 1,
        elevation: 5
    },
    evenRow: {
        backgroundColor: COLORS.tungfamPurple,
    },
    oddRow: {
        backgroundColor: 'lightblue',
    },
    payScheduleText: {
        fontSize: 16,
        fontWeight: "bold",
        backgroundColor: COLORS.TungfamBgColor,
        color: 'white',
        borderRadius: 5,
        padding: 10,
        textAlign: 'center',
        flex: 1,
        elevation: 5
    },
});

export default MyLoan;
