import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoanBook = ({ firmDetails }) => {
    const navigation = useNavigation();
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const approveLoan = () => {
        navigation.navigate('AprroveLoan', { firm_id: firmDetails.firm_id });
    };

    const fetchLoan = async () => {
        // try {
        //     const token = await AsyncStorage.getItem('token');
        //     if (!token) {
        //         throw new Error('Token not found');
        //     }

        //     const headers = {
        //         Authorization: `${token}`,
        //     };

        //     if (firmDetails && firmDetails.firm_id) {
        //         const response = await axios.get(`${API_URL}/firms/${firmDetails.firm_id}/loantypes`, { headers });
        //         if (response.status === 200) {
        //             setLoanTypes(response.data);
        //         }
        //     }
        // } catch (error) {
        //     console.error('Error fetching loan types:', error);
        // }
    };

    useEffect(() => {
        fetchLoan();
    }, [firmDetails]);

    // const renderItem = ({ item }) => (
    //     <View style={styles.item}>
    //         <Text style={styles.title}>
    //             LOAN{item.amount}
    //             {item.payment_type.toUpperCase()}
    //             {item.total_payment}
    //             PAY{item.pay_installment}
    //         </Text>
    //     </View>
    // );

    return (
        <TouchableOpacity onPress={toggleDetails}>
            <Text style={styles.headerText}>LoanBook</Text>
            {showDetails && (
                <View style={styles.container}>
                    <TouchableOpacity style={styles.addButton}>
                        <Button title="Approve Loan" onPress={approveLoan} />
                    </TouchableOpacity>
                    {/* <FlatList
                        data={loanTypes}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.loan_type_id.toString()}
                    /> */}
                </View>
            )}
        </TouchableOpacity>
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
