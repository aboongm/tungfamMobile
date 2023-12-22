import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import PageTitle from '../../components/PageTitle';
import PageContainer from '../../components/PageContainer';
import { COLORS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { updateUserRole } from '../../redux/slices/auth/authSlice';
import { Picker } from '@react-native-picker/picker';

const LoanApplicationScreen = () => {

    const disptach = useDispatch();
    const [firms, setFirms] = useState([]);
    const [selectedFirm, setSelectedFirm] = useState(null);
    const [loanTypes, setLoanTypes] = useState([]);
    const [selectedLoanType, setSelectedLoanType] = useState('');
    const [borrowerName, setBorrowerName] = useState('');
    const [noOfPayments, setNoOfPayments] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [installment, setInstallment] = useState('');
    const [amount, setAmount] = useState('');
    const [totalPayable, setTotalPayable] = useState('');
    
    const navigation = useNavigation();

    useEffect(() => {
        const fetchFirms = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found');
                }

                const headers = {
                    Authorization: `${token}`,
                };

                const firmsResponse = await axios.get(`${API_URL}/firms`, { headers });

                if (firmsResponse.status === 200) {
                    setFirms(firmsResponse.data);
                }
            } catch (error) {
                console.error('Error fetching firms:', error);
            }
        };

        const fetchLoanTypes = async () => {
            // console.log("selectedFirm: ", selectedFirm);
            
            if (selectedFirm !== null && loanTypes.length === 0) {
                try {
                    const token = await AsyncStorage.getItem('token');
                    if (!token) {
                        throw new Error('Token not found');
                    }

                    const headers = {
                        Authorization: `${token}`,
                    };

                    const loanTypesResponse = await axios.get(`${API_URL}/firms/${selectedFirm}/loantypes`, { headers });
                    // console.log("loanTypesResponse data: ", loanTypesResponse.data);
                    
                    if (loanTypesResponse.status === 200) {
                        setLoanTypes(loanTypesResponse.data);
                    }

                } catch (error) {
                    console.error('Error fetching loan types:', error);
                }
            }
        };

        fetchFirms();
        fetchLoanTypes();
    }, [selectedFirm]);

    const handleLoanTypeChange = (itemValue) => {
        setSelectedLoanType(itemValue);
        
        // Find the selected loan type object from loanTypes array
        const selectedType = loanTypes.find((type) => type.loan_type_id === itemValue);
        
        // Update the states based on the selected loan type
        if (selectedType) {
            setNoOfPayments(selectedType.no_of_payments);
            setPaymentType(selectedType.payment_type);
            setInstallment(selectedType.installment);
            setAmount(selectedType.amount);
            setTotalPayable(selectedType.total_payable);
        }
    };

    const handleSubmit = async () => {

        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('user_id');
        if (!token && !userId) {
            throw new Error('Token or userId not found');
        }

        const headers = {
            Authorization: `${token}`,
        };

        const userResponse = await axios.get(`${API_URL}/users/${userId}`, { headers });
        const updatedUserData = {
            ...userResponse.data,
            role: 'borrower',
        };

        const selectedType = loanTypes.find((type) => type.loan_type_id === selectedLoanType);
        
        const formData = {
            loan_officer_id: null, // Will be set when loan is approved
            lender_firm_id: selectedFirm,
            borrower_id: await AsyncStorage.getItem('user_id'), 
            loan_type: selectedType.loan_type,
            start_date: new Date().toISOString().slice(0, 10), 
            borrower_name: updatedUserData.name,
            no_of_payments: noOfPayments,
            payment_type: paymentType,
            total_payable: totalPayable,
            amount: amount,
            installment: installment
        };
        console.log("formData: ", formData);
        
        
        const response = await axios.post(`${API_URL}/loans`, formData, { headers });
        // console.log("responseLoan: ", response.data);

        const updateRoleResponse = await axios.put(`${API_URL}/users/${userId}`, updatedUserData, { headers });
        // console.log("roleUpdate: ", updateRoleResponse.data);
        
        if (updateRoleResponse.status === 200) {
            disptach(updateUserRole(updatedUserData));
        } else {
            throw new Error('Failed to update user role');
        }

        
        if (response.status === 200 && updateRoleResponse.status === 200) {
            navigation.navigate('Home');
            Alert.alert("Loan was created successfully")
            console.log('Loan was created successfully');
        } else {
            throw new Error('Failed to create firm');
        }
    };

    return (
        <PageContainer style={styles.container}>
            <PageTitle text="Apply For A Loan" />
            <ScrollView contentContainerStyle={styles.formContainer}>
                <View style={{ width: '100%' }}>
                    <Text>Select Firm:</Text>
                    <Picker
                        selectedValue={selectedFirm}
                        onValueChange={(itemValue) => setSelectedFirm(itemValue)}
                        mode="dropdown"
                    >
                        {firms.map((firm) => (
                            <Picker.Item key={firm.firm_id} label={firm.firm_name} value={firm.firm_id} />
                        ))}
                    </Picker>

                    <Text>Select A LoanType:</Text>
                    <Picker
                        selectedValue={selectedLoanType}
                        onValueChange={handleLoanTypeChange} // Update the handler to handle loan type change
                    >
                        {loanTypes.map((type) => (
                            <Picker.Item key={type.loan_type_id} label={type.loan_type} value={type.loan_type_id} />
                        ))}
                    </Picker>

                    <Text>Loan Amount</Text>
                    <Text>{amount}</Text>

                    <Text>Installment</Text>
                    <Text>{installment}</Text>

                    <Text>Number of Payments</Text>
                    <Text>{noOfPayments}</Text>

                    <Text>Payment Type</Text>
                    <Text>{paymentType}</Text>

                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Apply for Loan</Text>
                    </TouchableOpacity>
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
    },
    formContainer: {
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: 'blue',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoanApplicationScreen;
