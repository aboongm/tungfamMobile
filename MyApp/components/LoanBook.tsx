import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, FlatList, Alert, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';

const LoanBook = ({ firmDetails }) => {
    const employees = useSelector(state => state.employees.employees)

    const [showDetails, setShowDetails] = useState(false);
    const [loan, setLoan] = useState([]);
    const [loading, setLoading] = useState(true);

    const toggleDetails = () => {
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
                    if (response.status === 200) {
                        const loanData = response.data.filter((loan) => loan.lender_firm_id === firmDetails.firm_id)
                        setLoan(response.data);
                        setLoading(false);
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

            console.log("updatedLoan: ", updatedLoan);
            
            const token = await AsyncStorage.getItem('token');
            const headers = {
                Authorization: `${token}`,
            };
            const response = await axios.put(`${API_URL}/loans/${item.loan_id}`, updatedLoan, { headers });
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

    const renderItem = ({ item }) => (
        <View style={styles.container}>
            <View style={styles.item}>
                <Text style={styles.title}>{`Status: ${item.status}`}</Text>
                <Text style={styles.text}>{`Borrower: ${item.borrower_id}`}</Text>
                <Text style={styles.text}>{`LoanType: ${item.loan_type}`}</Text>
                <Text style={styles.text}>{`LoanOfficer: ${item.loan_officer_id}`}</Text>
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
                <Button
                    title="Approve"
                    onPress={() => handleApproveLoan(item)}
                    disabled={!item.loanOfficer} 
                />
            </View>
        </View>
    );

    return (
        <>
            <TouchableOpacity onPress={toggleDetails}>
                <Text style={styles.headerText}>LoanBook</Text>
            </TouchableOpacity>
            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
                showDetails && (

                    <FlatList
                        scrollEnabled={false}
                        data={loan}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.loan_id.toString()}
                    />
                )
            )}
        </>
    );
};

export default LoanBook;

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
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
    },
});
