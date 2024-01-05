import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Button, Alert, Pressable, ActivityIndicator } from 'react-native';

import PageTitle from '../../components/PageTitle';
import PageContainer from '../../components/PageContainer';
import { COLORS } from '../../constants';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker'
import { useNavigation } from '@react-navigation/native';

const InvestmentsScreen = ({ route }) => {
    const navigation = useNavigation();

    const { totalOutstandingAmount, totalInvestments, firmValue, firmId } = route.params
    const [open, setOpen] = useState(false)
    const [newInvestmentDate, setNewInvestmentDate] = useState(new Date());
    const [cashBalance, setCashBalance] = useState('');
    const [selectedInvestment, setSelectedInvestment] = useState('');
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(false);

    const addInvestmentRecord = async () => {
        try {
            const token = await AsyncStorage.getItem("token")
            const headers = {
                Authorization: `${token}`
            }

            const formData = {
                total_outstanding: totalOutstandingAmount,
                total_investments: totalInvestments,
                firm_value: firmValue,
                date_recorded: newInvestmentDate.toISOString().split('T')[0],
                cash_balance: cashBalance
            }

            console.log("formData: ", formData);

            const response = await axios.post(`${API_URL}/firms/${firmId}/investmentrecords`, formData, { headers })
            console.log("response.data: ", response.data);

            if (response.status === 200) {
                navigation.navigate("Home")
                Alert.alert("Successfully created InvestmentRecord!")
                console.log("Successfully created InvestmentRecord!")
            }

        } catch (error) {
            console.log('error: ', error);
            Alert.alert("Failed to create InvestmentRecord!")
        }
    };


    const takePermission = () => {
        Alert.alert(
            'Confirm Payment',
            `Are you sure you want to add this InvestmentRecord for ${newInvestmentDate.toISOString().split('T')[0]}?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: addInvestmentRecord
                }
            ]
        );
    }

    return (
        <PageContainer style={styles.container}>
            <PageTitle text="Add An Investment Record" />

            <ScrollView contentContainerStyle={styles.formContainer}>
                <View style={{ width: '100%' }}>
                    <View style={styles.tableContainer}>

                        <View style={styles.tableInput}>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>TotalOutstanding: </Text>
                                <Text style={styles.text}>Rs {totalOutstandingAmount}</Text>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>TotalInvestments: </Text>
                                <Text style={styles.text}>Rs {totalInvestments}</Text>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>FirmValue: </Text>
                                <Text style={styles.text}>Rs {firmValue}</Text>
                            </View>
                            <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input} // Add this style for TextInput
                                placeholder="Enter CashBalance"
                                keyboardType="numeric"
                                value={cashBalance} // Set value to cashBalance state
                                onChangeText={(text) => setCashBalance(text)} // Set the state when text changes
                            />
                            </View>
                            

                            <View style={styles.DateInvestment}>
                                <Pressable style={styles.dateButton} onPress={() => setOpen(true)}>
                                    <Text style={styles.button}>Pick Date</Text>
                                </Pressable>
                                <DatePicker
                                    modal
                                    open={open}
                                    date={newInvestmentDate}
                                    onConfirm={(date) => {
                                        setOpen(false);
                                        setNewInvestmentDate(date);
                                    }}
                                    onCancel={() => {
                                        setOpen(false);
                                    }}
                                />
                            </View>

                            <TouchableOpacity onPress={takePermission}>
                                <Text style={styles.addInvestmentButton}>Add An InvestmentRecord</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {},
    formContainer: {},
    tableContainer: {},
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
    DateInvestment: {
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
        elevation: 5,
    },
    button: {
        color: 'white',
        fontSize: 16,
        padding: 14,
    },
    addInvestmentButton: {
        fontSize: 16,
        backgroundColor: COLORS.TungfamBgColor,
        color: 'white',
        borderRadius: 5,
        padding: 14,
        textAlign: 'center',
        flex: 1,
        elevation: 5,
        marginTop: 10,
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        borderRadius: 5,
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: COLORS.tungfamLightBlue,
        elevation: 5,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    inputContainer: {
        marginBottom: 10,
        borderColor: COLORS.tungfamGrey,
        borderWidth: 1,
        borderRadius: 5,
        // padding: 4,
        backgroundColor: COLORS.tungfamLightBlue,
    },
    input: {
        fontSize: 16,
        fontWeight: '600',
        backgroundColor: 'rgba(255,255,255,0.55)',
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
});

export default InvestmentsScreen;
