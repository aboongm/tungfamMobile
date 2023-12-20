import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setEmployees } from '../redux/reducers/employeesSlice';

const EmployeeList = ({ firmDetails }) => {
    const dispatch = useDispatch();
    const employees = useSelector((state) => state.employees.employees);

    const fetchEmployees = async () => {
        try {
            const token = await AsyncStorage.getItem("token")
            if (!token) {
                throw new Error('Token not found');
            }

            const headers = {
                Authorization: `${token}`
            }
            const response = await axios.get(`${API_URL}/employeefirm/`, { headers });

            if (response.status === 200) {
                const employeesData = response.data;
                const updatedEmployeesData = [];

                for (const employee of employeesData) {
                    if (firmDetails && employee.firm_id === firmDetails.firm_id) {
                        const userDetails = await fetchUserDetails(employee.user_id, headers);
                        if (userDetails) {
                            updatedEmployeesData.push({
                                ...employee,
                                userDetails: userDetails ? userDetails : {}
                            });
                        }
                    }
                }

                dispatch(setEmployees(updatedEmployeesData));
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchUserDetails = async (userId, headers) => {
        try {
            const userResponse = await axios.get(`${API_URL}/users/${userId}`, { headers });
            if (userResponse.status === 200) {
                return userResponse.data; // Return user details
            }
        } catch (error) {
            console.error(`Error fetching user details for user ID ${userId}:`, error);
            return null;
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [firmDetails]);

    return (
        <>
            {employees.length > 0 && (
                <View style={styles.container}>
                    <Text style={styles.headerText}>Employees</Text>
                    <FlatList
                        data={employees}
                        keyExtractor={(item) => item.employee_firm_id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.employeeItem}>
                                <Text style={styles.text}>{item.userDetails.name}</Text>
                                <Text style={styles.text}>{item.position}</Text>
                            </View>
                        )}
                    />
                </View>
            )}
        </>
    );
};

export default EmployeeList;

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        padding: 10,
        marginTop: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    employeeItem: {
        display: "flex",
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        marginVertical: 5,
    },
    text: {
        fontWeight: '400',
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 6


    }
});
