import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminApprovalScreen = () => {
    const [pendingFirms, setPendingFirms] = useState([]);

    useEffect(() => {
        fetchFirms();
    }, []);

    const fetchFirms = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const headers = {
                Authorization: `${token}`,
            };

            const response = await axios.get(`${API_URL}/firms`, { headers });

            if (response.status === 200) {
                setPendingFirms(response.data);
            } else {
                throw new Error('Failed to fetch pending firms');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const approveFirm = async (firmId) => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            throw new Error('Token not found');
          }
      
          const headers = {
            Authorization: `${token}`,
          };
      
          const fetchResponse = await axios.get(`${API_URL}/firms/${firmId}`, { headers });
          const firmData = fetchResponse.data;
          firmData.status = 'approved';
          const responseFirm = await axios.put(`${API_URL}/firms/${firmId}`, firmData, { headers });
      
          if (responseFirm.status === 200) {
            fetchFirms();
          } else {
            throw new Error('Failed to approve firm');
          }
        } catch (error) {
          console.error(error);
        }
      };
      
    return (
        <View style={styles.content}>
            <Text style={styles.title}>Admin Firm Approval</Text>
            <View>
                {pendingFirms.map((firm) => (

                    <View key={firm.firm_id} style={styles.firmItem}>
                        <Text>{firm.firm_name}</Text>
                        <Text>{firm.contact_person}</Text>
                        <Text>{firm.address}</Text>
                        <Text>{firm.registration}</Text>
                        <Text>{firm.mobile}</Text>
                        <Text>{firm.email}</Text>
                        <Text>{firm.website}</Text>
                        <Text>{firm.status}</Text>

                        <TouchableOpacity onPress={() => approveFirm(firm.firm_id)}>
                            <Text style={styles.approveButton}>Approve</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
};


export default AdminApprovalScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        margin: 4,
    },
    content: {
        padding: 20, // Adjust as needed
    },
    title: {
        fontFamily: 'roboto',
        fontWeight: '800',
        fontSize: 22,
    },
    activitiesContainer: {
        // backgroundColor: COLORS.lightGrey,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1
    },
    firmItem: {
    },
    approveButton: {
        backgroundColor: 'lightblue',
        textAlign: 'center',
        paddingVertical: 6
    }
});
