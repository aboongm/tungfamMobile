import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import PageTitle from '../components/PageTitle';
import PageContainer from '../components/PageContainer';
import { COLORS } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { updateUserRole } from '../redux/slices/auth/authSlice';
import { Picker } from '@react-native-picker/picker';

const LoanApplicationScreen = () => {

    const disptach = useDispatch();
    const [firms, setFirms] = useState([]);
    const [selectedFirm, setSelectedFirm] = useState(null);
    const [loanTypes, setLoanTypes] = useState([]);
    const [selectedLoanType, setSelectedLoanType] = useState('');
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

                const users = await axios.get(`${API_URL}/users`, { headers });
                console.log("usersList: ", users.data);
                

                const firmsResponse = await axios.get(`${API_URL}/firms`, { headers });

                if (firmsResponse.status === 200) {
                    setFirms(firmsResponse.data);
                }
            } catch (error) {
                console.error('Error fetching firms:', error);
            }
        };

        const fetchLoanTypes = async () => {
            if (selectedFirm !== null) {
                try {
                    const token = await AsyncStorage.getItem('token');
                    if (!token) {
                        throw new Error('Token not found');
                    }

                    const headers = {
                        Authorization: `${token}`,
                    };

                    const loanTypesResponse = await axios.get(`${API_URL}/firms/${selectedFirm}/loantypes`, { headers });
                    if (loanTypesResponse.status === 200) {
                        setLoanTypes(loanTypesResponse.data);
                    }

                } catch (error) {
                    console.error('Error fetching loan types:', error);
                }
            }
        };
        console.log("loanTypes: ", loanTypes);
        
        fetchFirms();
        fetchLoanTypes();
    }, [selectedFirm]);

    const handleLoanTypeChange = (itemValue) => {
        setSelectedLoanType(itemValue);
        console.log("itemValue: ", itemValue);
        
        

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
        console.log("selectedFirm & loantypes: ", selectedFirm, loanTypes);
        
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

        if (response.status === 200 && updateRoleResponse.status === 200) {
            navigation.navigate('Loan');
            Alert.alert("Loan was created successfully")
            console.log('Loan was created successfully');
        } else {
            throw new Error('Failed to create firm');
        }
    };

    return (
        <PageContainer style={styles.container}>
            <PageTitle text="Apply For A Business Loan" />
            <ScrollView contentContainerStyle={styles.formContainer}>
                <View style={styles.formSection}>
                    <View style={styles.pickerContainer}>
                        <Text style={styles.heading}>Select A Lending Firm:</Text>
                        <Picker
                            selectedValue={selectedFirm}
                            onValueChange={(itemValue) => setSelectedFirm(itemValue)}
                            mode="dropdown"
                            style={styles.picker}
                        >
                            {firms.map((firm) => (
                                <Picker.Item key={firm.firm_id} label={firm.firm_name} value={firm.firm_id} />
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.pickerContainer}>
                        <Text style={styles.heading}>Select A LoanType:</Text>
                        <Picker
                            selectedValue={selectedLoanType}
                            onValueChange={handleLoanTypeChange}
                            mode="dropdown"
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                        >
                            {loanTypes.map((type) => (
                                <Picker.Item key={type.loan_type_id} label={type.loan_type} value={type.loan_type_id} />
                            ))}
                        </Picker>
                    </View>
                </View>
                <View style={styles.formSection}>
                    <View style={styles.pickerContainer}>
                        <Text style={styles.heading}>Loan Details:</Text>
                        <View style={styles.detailContainer}>
                            <Text style={styles.label}>Loan Amount:</Text>
                            <Text style={styles.value}>{amount}</Text>
                        </View>
                   
                        <View style={styles.detailContainer}>
                            <Text style={styles.label}>Installment:</Text>
                            <Text style={styles.value}>{installment}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text style={styles.label}>Number of Payments:</Text>
                            <Text style={styles.value}>{noOfPayments}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text style={styles.label}>Payment Type:</Text>
                            <Text style={styles.value}>{paymentType}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Apply for Loan</Text>
                </TouchableOpacity>
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
        paddingHorizontal: 10,
        paddingTop: 0,
        paddingBottom: 80,
    },
    formContainer: {
        padding: 0,
    },
    formSection: {
        width: '100%',
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        // borderWidth: 1,
        // borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 10
    },
    picker: {
        borderWidth: 1,
        borderColor: COLORS.lightGrey,
        borderRadius: 4,
        padding: 0,
        // marginBottom: 6,
        backgroundColor: COLORS.tungfamLightBlue,
        // height: 20,
        width: '100%',
        paddingHorizontal: 10,
    },
    pickerItem: {
        backgroundColor: 'red'
    },
    detailContainer: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "flex-start",
        padding: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 16,
        paddingHorizontal: 10
    },
    button: {
        backgroundColor: COLORS.tungfamBgColor,
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
