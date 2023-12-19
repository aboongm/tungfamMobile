import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from 'react-native';
import { COLORS } from '../constants';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import EmployeeList from './EmployeeList';

const Employee = ({ firmDetails }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedFirm, setSelectedFirm] = useState(null);
    const [selectedDesignation, setSelectedDesignation] = useState('');
    const [roles, setRoles] = useState([]);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const fetchUsers = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const headers = {
                Authorization: `${token}`,
            };

            const response = await axios.get(`${API_URL}/users`, { headers });

            if (response.status === 200) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchDesignation = async () => {
    };

    const searchUser = () => {
        try {
            const foundUser = users.find(
                (user) =>
                    user.aadhar === searchQuery ||
                    user.email === searchQuery ||
                    user.user_name === searchQuery
            );

            setSelectedUser(foundUser);
            console.log("foundUser: ", foundUser);
            
        } catch (error) {
            console.error(error);
        }
    };

    const designations = ['HeadProducts', 'SeniorLoanOfficer', 'LoanOfficer']; 
    
    const addEmployee = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token || !selectedUser || !firmDetails || !selectedDesignation) {
                throw new Error('Invalid data for adding employee');
            }
    
            const headers = {
                Authorization: `${token}`,
            };
           
            const response = await axios.post(
                `${API_URL}/employeefirm`,
                {
                    user_id: selectedUser.user_id,
                    firm_id: firmDetails.firm_id,
                    position: selectedDesignation,
                },
                { headers }
            );
    
            if (response.status === 200) {
                const userResponse = await axios.get(`${API_URL}/users/${selectedUser.user_id}`, { headers });
                const updatedUserData = {
                    ...userResponse.data,
                    role: 'employee', 
                    firm_id: firmDetails.firm_id,
                };
    
                const updateUserResponse = await axios.put(`${API_URL}/users/${selectedUser.user_id}`, updatedUserData, { headers });
                // Logic for handling successful addition of employee
                console.log('Employee added successfully');
                setSelectedUser(null);
                setSelectedDesignation('');
                setSearchQuery("");
                Alert.alert('Employee added successfully');
            } else {
                // Logic for handling failure in adding employee
                console.error('Failed to add employee');
                Alert.alert('Failed to add employee');
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            Alert.alert('Error adding employee. Please try again.');
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchDesignation();
    }, []);

    return (
        <TouchableOpacity onPress={toggleDetails}>
            <Text style={styles.headerText}>Employee</Text>
            {showDetails && (
                <View style={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Aadhar or Email"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Button title="Search" onPress={searchUser} />
                    {selectedUser && (
                        <View style={styles.selectedUser}>
                            <Text style={styles.selectedUserInfo}>
                                {selectedUser.name} - {selectedUser.role}
                            </Text>
                            <View style={styles.pickerContainer}>
                                <Text>{firmDetails.firm_name}</Text>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedDesignation}
                                    onValueChange={(itemValue) => setSelectedDesignation(itemValue)}
                                    mode="dropdown"
                                >
                                    <Picker.Item label="Select Designation" value="" />
                                    {designations.map((designation, index) => (
                                        <Picker.Item
                                            key={index}
                                            label={designation}
                                            value={designation}
                                        />
                                    ))}
                                </Picker>
                            </View>
                            <Button title="Add Employee" onPress={addEmployee} />
                        </View>
                    )}
                    <EmployeeList firmDetails={firmDetails} />
                </View>
            )}
        </TouchableOpacity>
    );
};

export default Employee;


const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        padding: 10,
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
    input: {
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        padding: 8,
        marginBottom: 10,
    },
    selectedUser: {
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        padding: 10,
        marginTop: 20,
    },
    selectedUserInfo: {
        fontSize: 16,
        marginBottom: 10,
    },
});
