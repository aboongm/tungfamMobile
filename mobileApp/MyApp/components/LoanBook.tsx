import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, FlatList, Alert, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const LoanBook = ({ firmDetails, userRole, userId }) => {
    const navigation = useNavigation();
    const employees = useSelector(state => state.employees.employees)

    const [showDetails, setShowDetails] = useState(false);
    const [loan, setLoan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openItems, setOpenItems] = useState({});

    const toggleLoanBook = () => {
        setShowDetails(!showDetails);
    };

    const fetchLoan = async () => {
        try {
            if (firmDetails) {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found');
                }

                const headers = {
                    Authorization: `${token}`,
                };

                if (firmDetails && firmDetails.firm_id) {
                    const response = await axios.get(`${API_URL}/loans`, { headers });
                    console.log("responseLoans: ", response.data);
                    
                    if (response.status === 200) {
                        if (userRole === 'firmOwner') {
                            const loanData = response.data.filter((loan) => loan.lender_firm_id === firmDetails.firm_id)
                            setLoan(loanData);
                            setIsLoading(false);
                        } else if (userRole === 'employee') {
                            const loanData = response.data.filter((loan) => loan.lender_firm_id === firmDetails.firm_id)
                            const finalLoans = loanData.filter(loan => loan.loan_officer_id = userId)
                            console.log('finalLoans: ', finalLoans);
                            setLoan(loanData);
                            setIsLoading(false);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching loan types:', error);
        }
    };

    const handleLoanOfficerChange = (loanOfficerId: any, loanId: any) => {
        const updatedLoanList = loan.map((loanItem) => {
            if (loanItem.loan_id === loanId) {
                return { ...loanItem, loanOfficer: loanOfficerId };
            }
            return loanItem;
        });
        setLoan(updatedLoanList);
    };

    const handleApproveLoan = async (item: any) => {
        try {
            const updatedLoan = {
                ...item,
                loan_officer_id: item.loanOfficer,
                status: 'approved',
            };

            const token = await AsyncStorage.getItem('token');
            const headers = {
                Authorization: `${token}`,
            };
            console.log("Approved");
            const response = await axios.put(`${API_URL}/loans/${item.loan_id}`, updatedLoan, { headers });
            console.log("response: ", response);
            if (response.status === 200) {
                Alert.alert("Loan approved successfully!")
                console.log('Loan approved successfully!');

                const updatedLoanList = loan.map((loanItem) => {
                    if (loanItem.loan_id === item.loan_id) {
                        return { ...loanItem, ...updatedLoan };
                    }
                    return loanItem;
                });

                setLoan(updatedLoanList);
            } else {
                console.error('Error updating loan details:', response.data);
            }
        } catch (error) {
            console.error('Error approving loan:', error);
        }
    };

    useEffect(() => {
        fetchLoan();
    }, [firmDetails]);

    const toggleLoanItem = (loanId: string | number) => {
        setOpenItems((prevOpenItems) => ({
            ...prevOpenItems,
            [loanId]: !prevOpenItems[loanId],
        }));
    };

    const goPaymentSchedule = (loan: any) => {
        console.log("loanItem in loanBook: ", loan);
        navigation.navigate("PaymentSchedule", { loan });

    };

    const renderItem = ({ item }) => {
        const isPending = item.status === 'pending';
        const isApproved = item.status === 'approved';
        const isOpen = openItems[item.loan_id];

        return (
            <View>
                <TouchableOpacity onPress={() => toggleLoanItem(item.loan_id)}>
                    <View style={styles.loanItemContainer}>
                        <Text style={styles.loanItem}>{`${item.borrower_name}`}</Text>
                        <Text style={styles.loanItem}>{`${item.loan_type}`}</Text>
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

                            {isPending && (
                                <Picker
                                    selectedValue={item.loanOfficer}
                                    onValueChange={(itemValue) => handleLoanOfficerChange(itemValue, item.loan_id)}
                                >
                                    <Picker.Item label="Select Loan Officer" value="" />
                                    {employees.map((employee: { employee_firm_id: { toString: () => React.Key | null | undefined; }; userDetails: { name: string | undefined; }; user_id: { toString: () => any; }; }) => (
                                        <Picker.Item
                                            key={employee.employee_firm_id.toString()}
                                            label={employee.userDetails.name}
                                            value={employee.user_id.toString()}
                                        />
                                    ))}
                                </Picker>
                            )}
                        </View>

                        <View style={styles.buttonContainer}>
                            {isPending && (
                                <>
                                    <Button
                                        title="Approve"
                                        onPress={() => handleApproveLoan(item)}
                                        disabled={!item.loanOfficer}
                                    />
                                    <Button
                                        title="Reject"
                                        onPress={() => { }}
                                        disabled={!item.loanOfficer}
                                    />
                                </>
                            )}
                            {isApproved && (
                                <Button
                                    title="Complete"
                                    onPress={() => { }}
                                    disabled={!item.loanOfficer}
                                />
                            )}
                        </View>
                    </View>
                )}

                {isApproved && (
                    <View style={styles.button}>
                        <Button
                            title="PaymentSchedule"
                            onPress={() => goPaymentSchedule(item)}
                        />
                    </View>
                )}
            </View>
        )
    }

    return (
        <>
            <TouchableOpacity onPress={toggleLoanBook}>
                <Text style={styles.headerText}>LoanBook</Text>
            </TouchableOpacity>
            {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
                showDetails && (
                    <FlatList
                        scrollEnabled={false}
                        data={loan}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.loan_id.toString()}
                        contentContainerStyle={styles.list}
                    />
                )
            )}
        </>
    );
};

export default LoanBook;

const styles = StyleSheet.create({
    list: {
        // flexGrow: 1,
        // backgroundColor: 'rgba(255, 255, 255, 0.6)',
        // borderWidth: 1,
        // borderColor: COLORS.tungfamGrey,
        // borderRadius: 6,
    },
    container: {
        // borderWidth: 1,
        // borderColor: COLORS.tungfamGrey,
        // paddingVertical: 6,
        // paddingHorizontal: 10,
        // backgroundColor: "red"
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        elevation: 5,
    },
    loanItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        borderRadius: 6,
        paddingVertical: 4
    },
    loanItem: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    item: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        borderRadius: 6,
        padding: 8,
        marginVertical: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    text: {
        fontSize: 14,
        marginBottom: 5,
    },
    button: {
        flex: 1,
        marginBottom: 4,
    },
    buttonContainer: {
        flexDirection: 'row', // Arrange items horizontally
        justifyContent: 'space-around', // Space evenly between items
        marginTop: 10,
    }
});
