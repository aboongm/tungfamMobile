import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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
    const [amount, setAmount] = useState(50000);
    const [paymentType, setPaymentType] = useState('week');
    const [payInstallment, setPayInstallment] = useState(1700);
    const [totalPayment, setTotalPayment] = useState(48);

    const navigation = useNavigation();

    const handleSubmit = async () => {
        const formData = {
            amount,
            payment_type: paymentType,
            pay_installment: payInstallment,
            total_payment: totalPayment,
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
        console.log('response', response);
        
        if (response.status === 200) {
            try {
                const userId = await AsyncStorage.getItem('user_id');

                if (!userId) {
                    throw new Error('userId not found');
                }

                const userResponse = await axios.get(`${API_URL}/users/${userId}`, { headers });
                const updatedUserData = {
                    ...userResponse.data,
                    role: 'firmOwner',
                };

                const updateRoleResponse = await axios.put(`${API_URL}/users/${userId}`, updatedUserData, { headers });

                if (updateRoleResponse.status === 200) {
                    disptach(updateUserRole(updatedUserData));
                } else {
                    throw new Error('Failed to update user role');
                }
            } catch (error) {
                console.error(error);
            }

            navigation.navigate('Home');
            console.log('Firm was created successfully');
        } else {
            throw new Error('Failed to create firm');
        }
    };

    return (
        <PageContainer style={styles.container}>
            <PageTitle text="Add LoanType" />
            <ScrollView contentContainerStyle={styles.formContainer}>
            <View style={{ width: '100%' }}>
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
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Add LoanType</Text>
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
