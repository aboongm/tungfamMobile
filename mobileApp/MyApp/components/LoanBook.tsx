import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, FlatList, Alert, ActivityIndicator, Pressable } from 'react-native';
import { COLORS } from '../constants';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setLoans, setSelectedLoan } from '../redux/slices/loanSlice';

const LoanBook = ({ firmDetails, userRole, userId }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const employees = useSelector(state => state.employees.employees)

    const [showDetails, setShowDetails] = useState(false);
    const [loan, setLoan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openItems, setOpenItems] = useState({});
    const [filteredLoan, setFilteredLoan] = useState([]);
    const [displayOption, setDisplayOption] = useState('all');
    const [loanId, setLoanId] = useState("")
    const [outstandingPayable, setOutstandingPayable] = useState(0);
    const [totalPayable, setTotalPayable] = useState(0);

    const toggleLoanBook = () => {
        setShowDetails(!showDetails);
    };

    useEffect(() => {
        fetchLoan();
        fetchLatestPayment();
    }, [firmDetails, loanId]);

    useEffect(() => {
        if (loan.length > 0) {
            fetchLatestPayment()
            let filtered = [];
            if (displayOption === 'all') {
                filtered = loan.filter((item) => item.status.toLowerCase() !== 'completed');
            } else {
                filtered = loan.filter(
                    (item) =>
                        item.payment_type.toLowerCase() === displayOption &&
                        item.status.toLowerCase() !== 'completed'
                );
            }
            setFilteredLoan(filtered);
            dispatch(setLoans(filtered))
        }
    }, [loan, displayOption]);
    
    const fetchLoan = async () => {
        try {
            if (firmDetails) {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found');
                }
                
                const headers = {
                    Authorization: `${token}`,
                };

                if (firmDetails && firmDetails.firm_id) {
                    const response = await axios.get(`${API_URL}/loans`, { headers });
                    console.log("firmDetails: ", firmDetails);
                    // console.log("firmDetails: ", firmDetails);

                    if (response.status === 200) {
                        if (userRole === 'firmOwner') {
                            const loanData = response.data.filter((loan) => loan.lender_firm_id === firmDetails.firm_id)
                            loanData.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
                            setLoan(loanData);
                            setIsLoading(false);
                        } else if (userRole === 'employee') {
                            const loanData = response.data.filter((loan) => loan.lender_firm_id === firmDetails.firm_id)
                            const finalLoans = loanData.filter(loan => loan.loan_officer_id = userId)
                            setLoan(loanData);
                            setIsLoading(false);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching loan types:', error);
        }
    };

    const handleLoanOfficerChange = (loanOfficerId: any, loanId: any) => {
        const updatedLoanList = loan.map((loanItem) => {
            if (loanItem.loan_id === loanId) {
                return { ...loanItem, loanOfficer: loanOfficerId };
            }
            return loanItem;
        });
        setLoan(updatedLoanList);
    };

    const handleApproveLoan = async (item: any) => {
        try {
            const updatedLoan = {
                ...item,
                loan_officer_id: item.loanOfficer,
                status: 'approved',
            };

            const token = await AsyncStorage.getItem('token');
            const headers = {
                Authorization: `${token}`,
            };

            const response = await axios.put(`${API_URL}/loans/${item.loan_id}`, updatedLoan, { headers });

            if (response.status === 200) {
                Alert.alert("Loan approved successfully!")
                console.log('Loan approved successfully!');

                const updatedLoanList = loan.map((loanItem) => {
                    if (loanItem.loan_id === item.loan_id) {
                        return { ...loanItem, ...updatedLoan };
                    }
                    return loanItem;
                });

                setLoan(updatedLoanList);
            } else {
                console.error('Error updating loan details:', response.data);
            }
        } catch (error) {
            console.error('Error approving loan:', error);
        }
    };

    const handleComplete = async (item: any) => {
        try {
            const token = await AsyncStorage.getItem("token");
            const headers = { Authorization: `${token}` };
            const updateData = {
                ...item,
                status: 'completed'
            }
            const response = await axios.put(`${API_URL}/loans/${loanId}`, updateData, { headers });
            console.log("response: ", response.data);

            if (response.status === 200) {
                Alert.alert("Loan is now completed!")
                console.log('Loan is now completed!');
            } else {
                console.error('Error updating loan details:', response.data);
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchLatestPayment = async () => {

        if (loanId !== "") {
            try {
                const token = await AsyncStorage.getItem("token");
                const headers = { Authorization: `${token}` };

                const responsePayments = await axios.get(`${API_URL}/loans/${loanId}/paymentschedules`, { headers });
                const paymentSchedules = responsePayments.data;

                if (paymentSchedules.length > 0) {
                    paymentSchedules.sort((a, b) => b.payment_id - a.payment_id);
                    const latestPayment = paymentSchedules[0];
                    setOutstandingPayable(latestPayment.outstanding_payable)
                    setTotalPayable(latestPayment.total_payable)
                    return latestPayment.outstanding_payable || 0;
                } else {
                    console.log("No payment schedules found.");
                    return 0;
                }
            } catch (error) {
                console.error(error);
                return 0;
            }
        }
    };


    const toggleLoanItem = (loanId: string | number) => {
        setOpenItems((prevOpenItems) => ({
            ...prevOpenItems,
            [loanId]: !prevOpenItems[loanId],
        }));
        setLoanId(loanId)
    };

    const goPaymentSchedule = (loan: any) => {
        console.log("loan: ", loan);
        dispatch(setSelectedLoan(loan))
        navigation.navigate("HomeStack");

    };

    const toggleDisplayOption = (option) => {
        setDisplayOption(option);
    };
// console.log("true: ", outstandingPayable === 0);
// console.log("outstandingPayable: ", outstandingPayable);

    const renderItem = ({ item, index }) => {
        const isPending = item.status === 'pending';
        const isApproved = item.status === 'approved';
        const isCompleted = item.status === 'completed';
        const isOpen = openItems[item.loan_id];

        const formatBorrowerName = (name) => {
            const nameParts = name.split(' ');
            if (nameParts.length >= 2) {
                const formattedName = `${nameParts[0].charAt(0).toUpperCase()} ${nameParts[1]}`;
                return formattedName;
            }
            return name;
        };

        return (
            <View>
                <TouchableOpacity onPress={() => toggleLoanItem(item.loan_id)}>
                    <View style={styles.container}>
                        <View style={styles.loanItemContainer}>
                            <Text style={styles.loanItem}>{`${index + 1}`}.{" "}{formatBorrowerName(item.borrower_name)}</Text>
                            <Text style={styles.loanItem}>{`${item.loan_type}`}</Text>
                        </View>
                        <View style={styles.loanItemContainer}>
                            <Text style={styles.loanItem}>{"    "}Start: {" "}
                                {new Date(item.start_date).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </Text>
                            <Text style={styles.loanItem}>PayAmt: Rs {`${item.total_payable}`}</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {isOpen && (
                    <View style={styles.item}>
                        <View>
                            <Text style={styles.title}>{`Status: ${item.status}`}</Text>
                            <Text style={styles.text}>{`LoanType: ${item.loan_type}`}</Text>
                            <Text style={styles.text}>{`Created At: ${item.created_at}`}</Text>
                            <Text style={styles.text}>{`Borrower: ${item.borrower_id}`}</Text>
                            <Text style={styles.text}>{`Start Date: ${item.start_date}`}</Text>
                            <Text style={styles.text}>{`LoanOfficer: ${item.loan_officer_id}`}</Text>
                            <Text style={styles.text}>{`Lender Firm Id: ${item.lender_firm_id}`}</Text>
                            <Text style={styles.text}>{`Loan Id: ${item.loan_id}`}</Text>

                            {isPending && (
                                <Picker
                                    selectedValue={item.loanOfficer}
                                    onValueChange={(itemValue) => handleLoanOfficerChange(itemValue, item.loan_id)}
                                >
                                    <Picker.Item label="Select Loan Officer" value="" />
                                    {employees.map((employee: { employee_firm_id: { toString: () => React.Key | null | undefined; }; userDetails: { name: string | undefined; }; user_id: { toString: () => any; }; }) => (
                                        <Picker.Item
                                            key={employee.employee_firm_id.toString()}
                                            label={employee.userDetails.name}
                                            value={employee.user_id.toString()}
                                        />
                                    ))}
                                </Picker>
                            )}
                        </View>

                        <View style={styles.buttonContainer}>
                            {isPending && (
                                <>
                                    <Button
                                        title="Approve"
                                        onPress={() => handleApproveLoan(item)}
                                        disabled={!item.loanOfficer}
                                    />
                                    <Button
                                        title="Reject"
                                        onPress={() => { }}
                                        disabled={!item.loanOfficer}
                                    />
                                </>
                            )}
                            {isApproved && (
                                <Button
                                    title="Complete"
                                    onPress={() => handleComplete(item)}
                                    disabled={isApproved ? Number(outstandingPayable) !== 0 : true}
                                />
                            )}
                        </View>
                    </View>
                )}

                {isApproved && (
                    <View style={styles.button}>
                        <Button
                            title="PaymentSchedule"
                            onPress={() => goPaymentSchedule(item)}
                        />
                    </View>
                )}
            </View>
        )
    }

    return (
        <View style={styles.loanContainer}>
            <TouchableOpacity onPress={toggleLoanBook}>
                <Text style={styles.headerText}>LoanBook</Text>
            </TouchableOpacity>
            {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
                showDetails && (
                    <>
                        <View style={styles.buttonContainer}>
                            <Pressable
                                style={[styles.buttonOptions, displayOption === 'all' && { backgroundColor: COLORS.tungfamBgColor }]}
                                onPress={() => toggleDisplayOption('all')}
                            >
                                <Text style={[styles.buttonText, displayOption === 'all' && { color: COLORS.white }]}>All</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.buttonOptions, displayOption === 'daily' && { backgroundColor: COLORS.tungfamBgColor }]}
                                onPress={() => toggleDisplayOption('daily')}
                            >
                                <Text style={[styles.buttonText, displayOption === 'daily' && { color: COLORS.white }]}>Daily</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.buttonOptions, displayOption === 'weekly' && { backgroundColor: COLORS.tungfamBgColor }]}
                                onPress={() => toggleDisplayOption('weekly')}
                            >
                                <Text style={[styles.buttonText, displayOption === 'weekly' && { color: COLORS.white }]}>Weekly</Text>
                            </Pressable>
                        </View>
                        <FlatList
                            scrollEnabled={false}
                            data={filteredLoan}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.loan_id.toString()}
                            contentContainerStyle={styles.list}
                        />
                    </>
                )
            )}
        </View>
    );
};

export default LoanBook;

const styles = StyleSheet.create({
    loanContainer: {
        marginBottom: 200
    },
    list: {
        // flexGrow: 1,
        // backgroundColor: 'rgba(255, 255, 255, 0.6)',
        // borderWidth: 1,
        // borderColor: COLORS.tungfamGrey,
        // borderRadius: 6,
    },
    container: {
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        borderRadius: 6,
        backgroundColor: COLORS.tungfamLightBlue,
        marginTop: 16,
    },
    headerText: {
        color: COLORS.black,
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
    loanItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'rgba(255, 255, 255, 0.8)',
        // borderWidth: 1,
        // borderColor: COLORS.tungfamGrey,
        // borderRadius: 6,
        paddingVertical: 0
    },
    loanItem: {
        color: COLORS.black,
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 4,
        paddingHorizontal: 6,
    },
    item: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        borderRadius: 6,
        padding: 8,
        marginVertical: 5,
    },
    title: {
        color: COLORS.black,
        fontWeight: 'bold',
        fontSize: 16,
    },
    text: {
        color: COLORS.black,
        fontSize: 14,
        marginBottom: 5,
    },
    button: {
        flex: 1,
        // marginBottom: 10,
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
        color: COLORS.black
    },
});
