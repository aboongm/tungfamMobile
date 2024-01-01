import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, FlatList, Alert, ActivityIndicator, Pressable } from 'react-native';
import { COLORS } from '../constants';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const Analytic = ({ firmDetails, userRole, userId }) => {
    const navigation = useNavigation();

    const [showDetails, setShowDetails] = useState(false);
    const [displayOption, setDisplayOption] = useState('Financials');

    // Financial data state
    const [totalInvestments, setTotalInvestments] = useState([]);
    const [totalOutstandingAmount, setTotalOutstandingAmount] = useState(0);
    const [cashBalance, setCashBalance] = useState(0);
    const [showTotalInvestments, setShowTotalInvestments] = useState(true);

    useEffect(() => {
        // Fetch financial data
        fetchFinancialData();
    }, [firmDetails]);

    const toggleAnalytics = () => {
        setShowDetails(!showDetails);
    };

    const toggleTotalInvestment = () => {
        setShowTotalInvestments(!showTotalInvestments);
    };

    const toggleDisplayOption = (option) => {
        setDisplayOption(option);
    };

    const fetchFinancialData = async () => {
        try {
            // Fetch investors' total investments (Replace with actual API call)
            const investorsData = await getInvestorsTotalInvestments();

            // Fetch total outstanding amount from LoanBook (Replace with actual API call)
            const outstandingAmount = await getTotalOutstandingAmount();

            // Fetch cash balance (Replace with actual API call)
            const cash = await getCashBalance();

            // Update state with fetched data
            if (investorsData && outstandingAmount && cash) {

                setTotalInvestments(investorsData);
                setTotalOutstandingAmount(outstandingAmount);
                setCashBalance(cash);
            }
        } catch (error) {
            console.error('Error fetching financial data:', error);
        }
    };

    const getInvestorsTotalInvestments = () => {
        return [{
            name: 'Mayengbam Ranjit Luwang',
            investments: [
                {
                    date: '10Oct23',
                    amount: '27000',
                },
                {
                    date: '20Nov23',
                    amount: '50000',
                },
            ],
        },
        {
            name: 'Mayengbam Ranjita Chanu',
            investments: [
                {
                    date: '10Oct23',
                    amount: '27000',
                },
                {
                    date: '20Nov23',
                    amount: '50000',
                },
            ],
        }]
    };


    const getTotalOutstandingAmount = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const headers = { Authorization: `${token}`}

            
            const response = await axios.get(`${API_URL}/loans`, { headers })
            const filteredLoans = response.data.filter(
                (loan) => loan.lender_firm_id === firmDetails.firm_id && loan.status === "approved"
            );
                
            // console.log("filteredLoans: ", filteredLoans);
            // const paymentResponse = await axios.get(`${API_URL}/loans/9/paymentschedules`, { headers })
            // console.log("Payments: ", paymentResponse);
            
            const totalOutstanding = filteredLoans.reduce(
                (total, loan) => total + loan.amount,
                0
            );
                console.log(totalOutstanding);
                
            return totalOutstanding;
        } catch (error) {
            console.error(error)
        }
    }

    const getCashBalance = () => {
        return 10000
    }

    const calculateTotalInvestments = () => {
        let total = 0;
        totalInvestments.forEach((investor) => {
            investor.investments.forEach((investment) => {
                total += parseInt(investment.amount);
            });
        });
        return total;
    };

    const firmValue = totalOutstandingAmount + cashBalance;

    return (
        <>
            <TouchableOpacity onPress={toggleAnalytics}>
                <Text style={styles.headerText}>Investments & Analytics</Text>
            </TouchableOpacity>
            {showDetails && (
                <>
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[
                                styles.buttonOptions,
                                displayOption === 'Financials' && {
                                    backgroundColor: COLORS.TungfamBgColor,
                                },
                            ]}
                            onPress={() => toggleDisplayOption('Financials')}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    displayOption === 'Financials' && { color: COLORS.white },
                                ]}
                            >
                                Financials
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.buttonOptions,
                                displayOption === 'Expenses' && {
                                    backgroundColor: COLORS.TungfamBgColor,
                                },
                            ]}
                            onPress={() => toggleDisplayOption('Expenses')}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    displayOption === 'Expenses' && { color: COLORS.white },
                                ]}
                            >
                                Expenses
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.buttonOptions,
                                displayOption === 'TrendChart' && {
                                    backgroundColor: COLORS.TungfamBgColor,
                                },
                            ]}
                            onPress={() => toggleDisplayOption('TrendChart')}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    displayOption === 'TrendChart' && { color: COLORS.white },
                                ]}
                            >
                                TrendChart
                            </Text>
                        </Pressable>
                    </View>

                    {displayOption === 'Financials' && (
                        <View style={styles.financialsContainer}>
                            <Text style={styles.financialsTitle}>Financials</Text>
                            <View style={styles.financialsData}>

                                <View style={styles.itemContainer}>
                                    <Text style={styles.item}>Total Outstanding Amount:</Text>
                                    <Text style={styles.item}>Rs {totalOutstandingAmount}</Text>
                                </View>

                                <TouchableOpacity onPress={toggleTotalInvestment}>
                                    <View style={styles.toggelInvestmentItemContainer}>
                                        <Text style={styles.item}>Total Investments:</Text>
                                        <Text style={styles.item}>Rs {calculateTotalInvestments()}</Text>
                                    </View>
                                </TouchableOpacity>
                                
                                {showTotalInvestments && (
                                    <View style={{ marginBottom: 10 }}>
                                        {totalInvestments.map((investor, index) => (
                                            <View key={index} style={styles.investmentsContainer}>
                                                <Text style={styles.item}>{index + 1}. {investor.name}</Text>
                                                {investor.investments.map((investment, i) => (
                                                    <View key={i} style={styles.investmentItemContainer}>
                                                        <Text style={styles.investmentItem}>{investment.date}</Text>
                                                        <Text style={styles.investmentItem}>Rs {investment.amount}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        ))}
                                    </View>
                                )}
                               
                                <View style={styles.itemContainer}>
                                    <Text style={styles.item}>Cash Balance:</Text>
                                    <Text style={styles.item}>Rs {cashBalance}</Text>
                                </View>
                                <View style={[styles.itemContainer, { paddingVertical: 1}]}>
                                    <Text style={[styles.item, { fontWeight: '500', fontSize: 20 }]}>FIRM VALUE:</Text>
                                    <Text style={[styles.item, { fontWeight: '500', fontSize: 20, color: COLORS.TungfamBgColor }]}>Rs {firmValue}</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {displayOption === 'Expenses' && (
                        <View style={styles.expensesContainer}>
                            <Text style={styles.sectionTitle}>expensesContainer Section Skeleton</Text>
                            {/* Add skeleton structure for Investors section */}
                        </View>
                    )}

                    {displayOption === 'TrendChart' && (
                        <View style={styles.trendChartContainer}>
                            <Text style={styles.sectionTitle}>TrendChart Section Skeleton</Text>
                            {/* Add skeleton structure for TrendChart section */}
                        </View>
                    )}
                </>
            )
            }
        </>
    );
};

export default Analytic;

const styles = StyleSheet.create({
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    buttonOptions: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        backgroundColor: COLORS.white,
    },
    buttonText: {
        fontSize: 16,
    },
    financialsContainer: {
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        borderRadius: 6,
    },
    financialsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    financialsData: {
        // Style financial data as needed
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        borderRadius: 6,
        paddingVertical: 4
    },
    toggelInvestmentItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        borderRadius: 50,
        paddingVertical: 4,
        marginVertical: 4,
    },
    investmentsContainer: {
        padding: 4,
        // backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        borderRadius: 6,
    },
    investmentItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    investmentItem: {
        paddingHorizontal: 10,
        paddingVertical: 2
    },
    item: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 6,
        paddingHorizontal: 14,
    },
    expensesContainer: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        borderRadius: 6,
    },
    investorsContainer: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        borderRadius: 6,
    },
    trendChartContainer: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        borderRadius: 6,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
});
