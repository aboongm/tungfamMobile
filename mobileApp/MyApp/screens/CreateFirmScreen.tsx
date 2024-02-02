import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';

import PageTitle from '../components/PageTitle';
import PageContainer from '../components/PageContainer';
import { COLORS } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { updateUserRole } from '../redux/slices/auth/authSlice';

const CreateFirmScreen = () => {
    const disptach = useDispatch();
    const [firmName, setFirmName] = useState('');
    const [address, setAddress] = useState('');
    const [mobile, setMobile] = useState('');
    const [registration, setRegistration] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');

    const navigation = useNavigation();

    const handleSubmit = async () => {
        const formData = {
            firm_name: firmName,
            address,
            mobile,
            registration,
            contact_person: contactPerson,
            email,
            website,
        };

        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }

        const headers = {
            // Authorization: `Bearer ${token}`,
            Authorization: `${token}`,
        };

        const response = await axios.post(`${API_URL}/firms`, formData, { headers });

        if (response.status === 200) {
            try {
                const userId = await AsyncStorage.getItem('user_id');

                if (!userId) {
                    throw new Error('userId not found');
                }

                const userResponse = await axios.get(`${API_URL}/users/${userId}`, { headers });
                const updatedUserData = {
                    ...userResponse.data,
                    role: 'firmOwner',
                };

                const updateRoleResponse = await axios.put(`${API_URL}/users/${userId}`, updatedUserData, { headers });

                if (updateRoleResponse.status === 200) {
                    disptach(updateUserRole(updatedUserData));
                } else {
                    throw new Error('Failed to update user role');
                }
            } catch (error) {
                console.error(error);
            }

            navigation.navigate('Loan');
            console.log('Firm was created successfully');
        } else {
            throw new Error('Failed to create firm');
        }
    };

    return (
        <PageContainer style={styles.container}>
            <PageTitle text="Create A Firm Account" />
            <ScrollView contentContainerStyle={styles.formContainer}>
                <View style={{ width: '100%' }}>
                    <TextInput
                        style={styles.input}
                        placeholder="Firm Name"
                        value={firmName}
                        onChangeText={setFirmName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Address"
                        value={address}
                        onChangeText={setAddress}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mobile"
                        value={mobile}
                        onChangeText={setMobile}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Registration"
                        value={registration}
                        onChangeText={setRegistration}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Contact Person"
                        value={contactPerson}
                        onChangeText={setContactPerson}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Website"
                        value={website}
                        onChangeText={setWebsite}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Create Account</Text>
                    </TouchableOpacity>
                </View>
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
    },
    formContainer: {
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
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

export default CreateFirmScreen;
