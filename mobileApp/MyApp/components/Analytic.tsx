import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, FlatList, Alert, ActivityIndicator, Pressable, TextInput } from 'react-native';
import { COLORS } from '../constants';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const Analytic = ({ firmDetails, userRole, userId }) => {
    const navigation = useNavigation();

    const [showDetails, setShowDetails] = useState(false);
    const [displayOption, setDisplayOption] = useState('Financials');

    // Financial data state
    const [totalInvestments, setTotalInvestments] = useState([]);
    const [totalOutstandingAmount, setTotalOutstandingAmount] = useState(0);
    const [cashBalance, setCashBalance] = useState(0);
    const [showTotalInvestments, setShowTotalInvestments] = useState(false);
    const [showCashBalance, setShowCashBalance] = useState(false);
    const [newCashBalance, setNewCashBalance] = useState('');
    const [weeklyChartData, setWeeklyChartData] = useState([]);

    useEffect(() => {
        // Fetch financial data
        // fetchFinancialData();
        if (firmDetails) {
            fetchFinancialData();
        }
    }, [firmDetails]);

    const toggleAnalytics = () => {
        setShowDetails(!showDetails);
    };

    const toggleTotalInvestment = () => {
        setShowTotalInvestments(!showTotalInvestments);
    };

    const toggleCashBalance = () => {
        setShowCashBalance(!showCashBalance);
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
                    date: '11 Sept 2023',
                    amount: '17500',
                },
                {
                    date: '26 Nov 2023',
                    amount: '10000',
                },
                {
                    date: '12 Dec 2023',
                    amount: '35000',
                },
                {
                    date: '14 Dec 2023',
                    amount: '15000',
                },
                {
                    date: '15 Dec 2023',
                    amount: '40000',
                },
                {
                    date: '18 Dec 2023',
                    amount: '15000',
                },
                {
                    date: '23 Dec 2023',
                    amount: '10000',
                },
            ],
        },
        {
            name: 'Mayengbam Ranjita Chanu',
            investments: [
                {
                    date: '11Sept 2023',
                    amount: '17380',
                },
            ],
        }]
    };


    const getTotalOutstandingAmount = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const headers = { Authorization: `${token}` }

            const response = await axios.get(`${API_URL}/loans`, { headers });
            const filteredLoans = response.data.filter(
                (loan) => loan.lender_firm_id === firmDetails.firm_id && loan.status === "approved"
            );

            let totalOutstanding = 0;

            for (const loan of filteredLoans) {
                const paymentResponse = await axios.get(`${API_URL}/loans/${loan.loan_id}/paymentschedules`, { headers });
                const filteredPayments = paymentResponse.data.filter((payment) => payment.loan_id === loan.loan_id);

                // Get the latest payment schedule (last entry)
                const latestPaymentSchedule = filteredPayments[filteredPayments.length - 1];

                // Assuming the outstanding amount is present in the latest payment schedule
                const outstandingPayable = parseFloat(latestPaymentSchedule.outstanding_payable);
                if (!isNaN(outstandingPayable)) {
                    totalOutstanding += outstandingPayable;
                }
            }

            setTotalOutstandingAmount(totalOutstanding);
            return totalOutstanding;
        } catch (error) {
            console.error(error);
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

    const updateCashBalance = async () => {
        try {
            // Make an API call to update the cash balance here
            // Use the newCashBalance state value to update the cash balance

            // Example API call using Axios
            const token = await AsyncStorage.getItem('token');
            const headers = { Authorization: `${token}` };

            const updatedBalance = parseInt(newCashBalance); // Convert the new cash balance to an integer if necessary

            // Example API call using POST method to update cash balance
            // await axios.post(`${API_URL}/updateCashBalance`, { cashBalance: updatedBalance }, { headers });

            // Update the state with the new cash balance value
            setCashBalance(updatedBalance);
            console.log("newCashBalance: ", newCashBalance);

            // Clear the input field after successful update
            setNewCashBalance('');
        } catch (error) {
            console.error('Error updating cash balance:', error);
        }
    };

    const firmValue = totalOutstandingAmount + cashBalance;

    useEffect(() => {
        if (displayOption === 'TrendChart') {
            // Fetch weekly chart data for two months (Placeholder data)
            const dataForTwoMonths = generateChartData();
            setWeeklyChartData(dataForTwoMonths);
        }
    }, [displayOption]);

    const generateChartData = () => {
        // Placeholder data - Replace with actual data from the API or calculations
        const twoMonthsData = [];
        // Generate data for 8 weeks (2 months)
        for (let i = 1; i <= 8; i++) {
            twoMonthsData.push({
                week: `Week ${i}`,
                value: Math.floor(Math.random() * 1000) + 500, // Placeholder random value
            });
        }
        return twoMonthsData;
    };

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
                                    <View style={styles.toggelItemContainer}>
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

                                <TouchableOpacity onPress={toggleCashBalance}>
                                    <View style={styles.toggelItemContainer}>
                                        <Text style={styles.item}>Cash Balance:</Text>
                                        <Text style={styles.item}>Rs {cashBalance}</Text>
                                    </View>
                                    {showCashBalance && (
                                        <View style={{ marginBottom: 10 }}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter new cash balance"
                                                value={newCashBalance}
                                                onChangeText={(text) => setNewCashBalance(text)}
                                                keyboardType="numeric"
                                            />
                                            <Button title="Update Cash Balance" onPress={updateCashBalance} />
                                        </View>
                                    )}
                                </TouchableOpacity>

                                <View style={[styles.itemContainer, { paddingVertical: 1 }]}>
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
                            <Text style={styles.sectionTitle}>FirmValue Trend</Text>
                            <LineChart
                                data={{
                                    labels: ["January", "February", "March", "April", "May", "June"],
                                    datasets: [
                                        {
                                            data: [
                                                Math.random() * 100,
                                                Math.random() * 100,
                                                Math.random() * 100,
                                                Math.random() * 100,
                                                Math.random() * 100,
                                                Math.random() * 100
                                            ],
                                            color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`
                                        },
                                        {
                                            data: [
                                                Math.random() * 100,
                                                Math.random() * 100,
                                                Math.random() * 100,
                                                Math.random() * 100,
                                                Math.random() * 100,
                                                Math.random() * 100
                                            ],
                                            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red color
                                        },
                                        {
                                            data: [
                                                Math.random() * 100,
                                                Math.random() * 100,
                                                Math.random() * 100,
                                                Math.random() * 100,
                                                Math.random() * 100,
                                                Math.random() * 100
                                            ],
                                            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                                        },
                                    ],
                                    // legend: ["firmVal", "totalInvestments", "totalOutstandingAmt"]
                                }}
                                width={Dimensions.get("window").width - 60} // from react-native
                                height={220}
                                yAxisLabel="$"
                                yAxisSuffix="k"
                                yAxisInterval={1} // optional, defaults to 1
                                chartConfig={{
                                    backgroundColor: "#3498db",
                                    backgroundGradientFrom: "#0184db",
                                    backgroundGradientTo: "#4db1f3",
                                    decimalPlaces: 2, // optional, defaults to 2dp
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 16,
                                    },
                                    propsForDots: {
                                        r: "6",
                                        strokeWidth: "2",
                                        stroke: "#ffa726"
                                    }
                                }}
                                bezier
                                style={{
                                    marginVertical: 4,
                                    borderRadius: 8
                                }}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 4, backgroundColor: "#4db1f3", borderRadius: 6 }}>
                                <Text style={{ marginRight: 10, color: 'green', fontWeight: 'bold' }}>FirmValue</Text>
                                <Text style={{ marginRight: 10, color: 'red', fontWeight: 'bold' }}>TotalInvestments</Text>
                                <Text style={{ marginRight: 10, color: 'blue', fontWeight: 'bold' }}>TotalOutstanding</Text>
                            </View>
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
    toggelItemContainer: {
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
    input: {
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        backgroundColor: COLORS.tungfamLightBlue,
        borderRadius: 5,
        paddingHorizontal: 14,
        paddingVertical: 4,
        marginBottom: 4,
        fontSize: 16,
    },
    tableContainer: {
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.tungfamGrey,
    },
    tableHeader: {
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    tableData: {
        flex: 1,
        textAlign: 'center',
    },
});
