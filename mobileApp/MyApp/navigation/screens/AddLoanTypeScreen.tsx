import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import PageTitle from '../../components/PageTitle';
import PageContainer from '../../components/PageContainer';
import { COLORS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { updateUserRole } from '../../redux/slices/auth/authSlice';

const AddLoanType = ({ route }) => {
    const firmId = route.params.firm_id;
    console.log("firmId: ", firmId);
    
    const disptach = useDispatch();
    const [loantype, setLoantype] = useState("LN10000WK17PY700");
    const [amount, setAmount] = useState(10000);
    const [paymentType, setPaymentType] = useState('week');
    const [payInstallment, setPayInstallment] = useState(700);
    const [totalPayment, setTotalPayment] = useState(11900);
    const [noOfPayment, setNoOfPayment] = useState(17);

    const navigation = useNavigation();

    const handleSubmit = async () => {
        const formData = {
            loan_type: loantype,
            amount,
            payment_type: paymentType,
            installment: payInstallment,
            total_payable: totalPayment,
            no_of_payments: noOfPayment,
        };
        console.log("formData: ", formData);
        
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }

        const headers = {
            // Authorization: `Bearer ${token}`,
            Authorization: `${token}`,
        };

        const response = await axios.post(`${API_URL}/firms/${firmId}/loantypes`, formData, { headers });
        
        if (response.status === 200) {

            navigation.navigate('Home');
            Alert.alert("LoanType was created successfully")
            console.log('LoanType was created successfully');
        } else {
            throw new Error('Failed to create LoanType');
        }
    };

    return (
        <PageContainer style={styles.container}>
            <PageTitle text="Add A LoanType" />
            <ScrollView contentContainerStyle={styles.formContainer}>
            <View style={{ width: '100%' }}>
                <TextInput
                    style={styles.input}
                    placeholder="LN20000WK17PY1400"
                    value={loantype}
                    onChangeText={setLoantype}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    value={amount.toString()}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Payment Type"
                    value={paymentType}
                    onChangeText={setPaymentType}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Pay Installment"
                    value={payInstallment.toString()}
                    onChangeText={setPayInstallment}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Total Payment"
                    value={totalPayment.toString()}
                    onChangeText={setTotalPayment}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Number of Payments"
                    value={noOfPayment.toString()}
                    onChangeText={setNoOfPayment}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Add A LoanType</Text>
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

export default AddLoanType;
