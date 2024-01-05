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
import Slider from '@react-native-community/slider';

const Analytic = ({ firmDetails, userRole, userId }) => {
    const navigation = useNavigation();

    const [showDetails, setShowDetails] = useState(false);
    const [displayOption, setDisplayOption] = useState('Financials');

    // Financial data state
    const [totalInvestments, setTotalInvestments] = useState([]);
    const [totalInvestmentsList, setTotalInvestmentsList] = useState([]);
    const [totalInvestmentsListChart, setTotalInvestmentsListChart] = useState([]);
    const [totalOutstandingAmount, setTotalOutstandingAmount] = useState(0);
    const [cashBalance, setCashBalance] = useState(0);
    const [firmValue, setFirmValue] = useState(0);
    const [showTotalInvestments, setShowTotalInvestments] = useState(false);
    const [weeklyChartData, setWeeklyChartData] = useState([]);
    const [maxDisplayItems, setMaxDisplayItems] = useState(6);

    const [isLoadingChartData, setIsLoadingChartData] = useState(true);

    const [firmId, setFirmId] = useState(null);

    useEffect(() => {
        fetchFinancialData();
        if (firmDetails) {
            setFirmId(firmDetails.firm_id)
        }
    }, [firmDetails]);

    useEffect(() => {
        if (firmId !== null) {
            fetchFinancialData();
        }
    }, [firmId]);

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
            if (!firmId) {
                return;
            }

            const token = await AsyncStorage.getItem("token");
            const headers = { Authorization: `${token}` };

            const response = await axios.get(`${API_URL}/firms/${firmId}/investmentrecords`, { headers });
            const sortedRecords = response.data.sort((a, b) => new Date(b.date_recorded) - new Date(a.date_recorded));
            const unSortedRecords = response.data;
            const latestEntry = sortedRecords[0];
            const { total_investments, total_outstanding, firm_value, cash_balance } = latestEntry;

            setTotalInvestmentsList(sortedRecords)
            setTotalInvestmentsListChart(unSortedRecords.reverse())
            setTotalInvestments(total_investments);
            setTotalOutstandingAmount(total_outstanding);
            setFirmValue(firm_value);
            setCashBalance(cash_balance);
        } catch (error) {
            console.error('Error fetching financial data:', error);
        }
    };

    useEffect(() => {
        if (displayOption === 'TrendChart') {
            setIsLoadingChartData(true);
            const fetchChartData = async () => {
                try {
                    const datasets = {
                        total_investments: [],
                        total_outstanding: [],
                        firm_value: [],
                    };

                    let totalItems = totalInvestmentsListChart.length - 1;
                    let itemToDisplay = totalItems - maxDisplayItems
                    console.log("totalItems: ", itemToDisplay);
                    console.log("maxDisplayItems: ", maxDisplayItems);

                    const selectedInvestmentsList = totalInvestmentsListChart.slice(itemToDisplay);

                    const labels = selectedInvestmentsList.map((record) => {
                        const date = new Date(record.date_recorded);
                        return new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
                    });

                    selectedInvestmentsList.forEach((record) => {
                        datasets.total_investments.push(record.total_investments);
                        datasets.total_outstanding.push(record.total_outstanding);
                        datasets.firm_value.push(record.firm_value);
                    });

                    const updatedChartData = {
                        labels: labels.slice(1), // Exclude the first label if needed
                        datasets: [
                            {
                                data: datasets.total_investments.slice(1), // Exclude the first data if needed
                                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                            },
                            {
                                data: datasets.total_outstanding.slice(1), // Exclude the first data if needed
                                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                            },
                            {
                                data: datasets.firm_value.slice(1), // Exclude the first data if needed
                                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                            },
                        ],
                    };

                    console.log("updatedChart: ", updatedChartData.datasets);
                    console.log("updatedChart: ", updatedChartData.labels);


                    setWeeklyChartData(updatedChartData);
                    setIsLoadingChartData(false);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setIsLoadingChartData(false);
                }
            };

            fetchChartData();
        }
    }, [displayOption, totalInvestmentsList, maxDisplayItems]);


    const addInvestmentRecord = async () => {
        const firmId = firmDetails.firm_id

        navigation.navigate("Investments", {
            totalOutstandingAmount,
            totalInvestments,
            firmValue,
            firmId
        })
    }

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
                        {/* <Pressable
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
                        </Pressable> */}
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
                            <Text style={styles.financialsTitle}>Financials as on : {new Date().toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })}</Text>
                            <View style={styles.financialsData}>
                                <View style={[styles.itemContainer, { paddingVertical: 1 }]}>
                                    <Text style={[styles.item, { fontWeight: '500', fontSize: 20 }]}>FIRM VALUE:</Text>
                                    <Text style={[styles.item, { fontWeight: '500', fontSize: 20, color: COLORS.TungfamBgColor }]}>Rs {firmValue}</Text>
                                </View>

                                <View style={styles.itemContainer}>
                                    <Text style={styles.item}>Cash Balance:</Text>
                                    <Text style={styles.item}>Rs {cashBalance}</Text>
                                </View>

                                <View style={styles.itemContainer}>
                                    <Text style={styles.item}>Total Outstanding Amount:</Text>
                                    <Text style={styles.item}>Rs {totalOutstandingAmount}</Text>
                                </View>

                                <TouchableOpacity onPress={toggleTotalInvestment}>
                                    <View style={styles.toggelItemContainer}>
                                        <Text style={styles.item}>Total Investments:</Text>
                                        <Text style={styles.item}>Rs {totalInvestments}</Text>
                                    </View>
                                </TouchableOpacity>

                                {/* {showTotalInvestments && (
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
                                )} */}



                                <Pressable
                                    style={styles.buttonInvestment}
                                    onPress={addInvestmentRecord}
                                >
                                    <Text style={styles.buttonInvestmentText}>Add A Weekly InvestmentRecord</Text>
                                </Pressable>
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
                            {isLoadingChartData ? (
                                <ActivityIndicator size="large" color={COLORS.TungfamBgColor} />
                            ) : (
                                weeklyChartData &&
                                <>
                                    <View style={styles.sliderContainer}>
                                        <Text style={styles.sliderText}>
                                            Display for {maxDisplayItems} Weeks
                                        </Text>
                                        <Slider
                                            style={styles.slider}
                                            minimumValue={6} // Set minimum value
                                            maximumValue={totalInvestmentsList.length - 1} // Set maximum value based on total data
                                            step={1} // Set step size
                                            minimumTrackTintColor={COLORS.TungfamBgColor}
                                            maximumTrackTintColor="#000000"
                                            thumbTintColor={COLORS.TungfamBgColor}
                                            value={maxDisplayItems} // Set initial value
                                            onValueChange={(value) => setMaxDisplayItems(value)} // Set value on change
                                            />
                                    </View>
                                    
                                    <LineChart
                                        data={weeklyChartData}
                                        width={Dimensions.get("window").width - 60} // from react-native
                                        height={260}
                                        yAxisLabel="Rs"
                                        // yAxisSuffix="k"
                                        yAxisInterval={1} // optional, defaults to 1
                                        horizontalLabelRotation={0}
                                        verticalLabelRotation={-45}
                                        xLabelsOffset={10} // Adjust the offset to your preference
                                        chartConfig={{
                                            backgroundColor: "#3498db",
                                            backgroundGradientFrom: "#0184db",
                                            backgroundGradientTo: "#4db1f3",
                                            // decimalPlaces: 2,
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
                                        yAxisLabelFormatter={(value) => `${value.toFixed(0)}`}
                                        bezier
                                        style={{
                                            marginVertical: 4,
                                            borderRadius: 8
                                        }}
                                    />
                                </>
                            )
                            }

                            <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 4, borderRadius: 6 }}>
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
    buttonInvestment: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        backgroundColor: COLORS.TungfamBgColor,
        marginTop: 8,
    },
    buttonInvestmentText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#ffffff"
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
    sliderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    sliderText: { 
        fontSize: 16,
        textAlign: 'center', 
        padding: 2
    },
    slider: { 
        width: '100%', 
        marginBottom: 8,
        padding: 2,
    }
    
});