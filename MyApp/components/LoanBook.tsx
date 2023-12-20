import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';

const LoanBook = ({ firmDetails }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const employees = useSelector(state => state.employees.employees)

    const [showDetails, setShowDetails] = useState(false);
    const [loan, setLoan] = useState([]);
    const [selectedLoanId, setSelectedLoanId] = useState(null);
    const [selectedLoanOfficer, setSelectedLoanOfficer] = useState('');
    const [LoanOfficerData, setLoanOfficerData] = useState('');
    console.log(employees);
    
    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const fetchLoan = async () => {
        try {
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
                }
            }
        } catch (error) {
            console.error('Error fetching loan types:', error);
        }
    };

    const fetchLoanOfficer = async () => {
        
        try {
            if (employees) {
                return employees.filter(v => v.position === "LoanOfficer")
            }

        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleApproveLoan = async () => {
        try {
            // Logic to approve the loan using the selectedLoanId
            // This could involve an API call to update the loan status

            // Assign the loan officer (selectedLoanOfficer) to the approved loan
            console.log('Assigned loan officer:', selectedLoanOfficer);
        } catch (error) {
            console.error('Error approving loan:', error);
        }
    };

    useEffect(() => {
        fetchLoan();
        fetchLoanOfficer();
    }, [firmDetails]);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{`Status: ${item.status}`}</Text>
            <Text style={styles.text}>{`Borrower: ${item.borrower_id}`}</Text>
            <Text style={styles.text}>{`LoanType: ${item.loan_type}`}</Text>
            <Text style={styles.text}>{`LoanOfficer: ${item.loan_officer_id}`}</Text>
            <Picker
                selectedValue={selectedLoanOfficer}
                onValueChange={(itemValue) => setSelectedLoanOfficer(itemValue)}
            >
                <Picker.Item label="Select Loan Officer" value="" />
                {employees.map((employee) => (
                    <Picker.Item 
                        key={employee.employee_firm_id.toString()} 
                        label={employee.userDetails.name} 
                        value={employee.user_id.toString()} 
                    />
                ))}
            </Picker>
        </View>
    );

    return (
        <>
            <TouchableOpacity onPress={toggleDetails}>
                <Text style={styles.headerText}>LoanBook</Text>
            </TouchableOpacity>
            {showDetails && (
                <View style={styles.container}>
                    <FlatList
                        data={loan}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.loan_id.toString()}
                    />
                </View>
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
