import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from 'react-native';
import { COLORS } from '../../constants';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const AddSubscriberScreen = ({ firmDetails }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [roles, setRoles] = useState([]);
  const [selectedMaroop, setSelectedMaroop] = useState('');
  const [selectedMaroopName, setSelectedMaroopName] = useState('');

  const maroops = useSelector((state: RootState) => state.maroops.maroops)
  const firmId = useSelector((state: RootState) => state.headerSlice.firmData.firm_id)

  useEffect(() => {
    fetchUsers();
  }, [firmId]);

  const fetchUsers = async () => {
    try {
      if (firmId) {
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
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const searchUser = () => {
    console.log("searchUser??");

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

  const addSubcriber = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `${token}`, };

      const maroopData = {
        maroop: maroops[selectedMaroop],
        user: selectedUser,

      }
      console.log("maroopData: ", maroopData);

      const response = await axios.post(`${API_URL}/maroopusers`, maroopData, { headers });

      if (response.status === 200) {
        console.log('Subscriber added successfully');
        setSelectedUser(null);
        setSearchQuery("");
        Alert.alert('Subscriber added successfully');
      } else {
        // Logic for handling failure in adding employee
        console.error('Failed to add Subscriber');
        Alert.alert('Failed to add Subscriber');
      }
    } catch (error) {
      console.error('Error adding Subscriber:', error);
      Alert.alert('Error adding Subscriber. Please try again.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [firmId]);

  const handleMaroop = (itemValue) => {
    if (itemValue) {
      setSelectedMaroop(itemValue - 1);
      const maroop = maroops[itemValue-1]
      console.log("itemValue: ", itemValue-1);
      console.log("maroops: ", maroops);
      setSelectedMaroopName(maroop.name)
    }
  };
  console.log("selectedMaroop: ", selectedMaroop);

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Text style={styles.headerText}>Select A Maroop:</Text>
        <Picker
          selectedValue={selectedMaroop}
          onValueChange={handleMaroop}
          mode="dropdown"
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {maroops.map((type) => (
            <Picker.Item key={type.maroop_id} label={type.name} value={type.maroop_id} />
          ))}
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter Aadhar or Email"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={searchUser} />
      {selectedUser && (
        <>
          <Text style={styles.headerText}>Selected Maroop: {selectedMaroopName}</Text>
          <View style={styles.selectedUser}>
            <Text style={styles.headerText}>Subscriber Details:</Text>
            <Text style={styles.selectedUserInfo}>Name: {selectedUser.name}</Text>
            <Text style={styles.selectedUserInfo}>Address: {selectedUser.address}</Text>
            <Text style={styles.selectedUserInfo}>Mobile: {selectedUser.mobile}</Text>
          </View>
          <Button title="Add Subscriber" onPress={addSubcriber} />
        </>
      )}
    </View>
  );
};

export default AddSubscriberScreen;


const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
  },
  headerText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  picker: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 4,
    padding: 0,
    // marginBottom: 6,
    backgroundColor: COLORS.tungfamLightBlue,
    // height: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  pickerItem: {
    backgroundColor: 'red'
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
    color: COLORS.black,
    fontSize: 16,
    marginBottom: 10,
  },
});
