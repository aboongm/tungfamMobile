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
    const [displayOption, setDisplayOption] = useState('Investors');

    // Financial data state
    const [totalInvestments, setTotalInvestments] = useState([]);
    const [totalOutstandingAmount, setTotalOutstandingAmount] = useState(0);
    const [cashBalance, setCashBalance] = useState(0);

    useEffect(() => {
        // Fetch financial data
        fetchFinancialData();
    }, [firmDetails]);

    const toggleAnalytics = () => {
        setShowDetails(!showDetails);
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

            console.log(investorsData, outstandingAmount, cash);

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
        return [200000]
    }

    const getTotalOutstandingAmount = () => {
        return 300000
    }

    const getCashBalance = () => {
        return 10000
    }

    const firmValue = totalInvestments.reduce((acc, investment) => acc + investment.amount, 0) + totalOutstandingAmount + cashBalance;

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
                                displayOption === 'Investors' && {
                                    backgroundColor: COLORS.TungfamBgColor,
                                },
                            ]}
                            onPress={() => toggleDisplayOption('Investors')}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    displayOption === 'Investors' && { color: COLORS.white },
                                ]}
                            >
                                Investors
                            </Text>
                        </Pressable>
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

                    {displayOption === 'Investors' && (
                        <View style={styles.investorsContainer}>
                            <Text style={styles.sectionTitle}>Investors Section Skeleton</Text>
                            {/* Add skeleton structure for Investors section */}
                        </View>
                    )}

                    {/* Render Financials section */}
                    {displayOption === 'Financials' && (
                        <View style={styles.financialsContainer}>
                        <Text style={styles.financialsTitle}>Financials</Text>
                        <View style={styles.financialsData}>
                            <Text>Total Investments from Investors:</Text>
                            {totalInvestments.map((investment, index) => (
                                <View key={index}>
                                    <Text>Investor {index + 1}</Text>
                                    <Text>Investment Amount: {investment}</Text>
                                </View>
                            ))}

                            <Text>Total Outstanding Amount from LoanBook: {totalOutstandingAmount}</Text>

                            <Text>Cash Balance: {cashBalance}</Text>

                            <Text>Firm Value: {firmValue}</Text>
                        </View>
                    </View>
                    )}

                    {/* Render TrendChart section */}
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
        marginHorizontal: 1,
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
        marginVertical: 10,
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
