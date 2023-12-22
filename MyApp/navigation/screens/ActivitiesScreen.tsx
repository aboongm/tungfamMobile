import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { COLORS } from '../../constants';
import PageContainer from '../../components/PageContainer';
import ApplyToFirm from '../../components/ApplyToFirm';
import AdminApprovalScreen from './AdminApprovalScreen';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Firm from '../../components/Firm';
import LoanType from '../../components/LoanType';
import Employee from '../../components/Employee';
import LoanBook from '../../components/LoanBook';
import ApplyLoan from '../../components/ApplyLoan';

const ActivitiesScreen = ({ userRole, userId }) => {

  const navigation = useNavigation();
  const userData = useSelector(state => state.auth.userData);

  const [userFirm, setUserFirm] = useState(null);
  const [firmDetails, setFirmDetails] = useState(null);
  const [employeeFirm, setEmployeeFirm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const headers = {
          Authorization: `${token}`,
        };

        const userFirmResponse = await axios.get(`${API_URL}/userfirm`, { headers });

        if (userFirmResponse.status === 200 && userFirmResponse.data.length > 0) {
          const userFirms = userFirmResponse.data;
          const userFirmForId = userFirms.find((userFirm) => userFirm.user_id === userId);

          if (userFirmForId) {
            setUserFirm(userFirmForId);
            const firmId = userFirmForId.firm_id;
            const firmDetailsResponse = await axios.get(`${API_URL}/firms/${firmId}`, { headers });

            if (firmDetailsResponse.status === 200) {
              setFirmDetails(firmDetailsResponse.data);

              const employeeFirmResponse = await axios.get(`${API_URL}/firms/${firmId}`, { headers });

              if (employeeFirmResponse.status === 200) {
                setEmployeeFirm(employeeFirmResponse.data);
                setIsLoading(false); // Data fetching complete
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    const fetchEmployeeFirm = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const headers = {
          Authorization: `${token}`,
        };

        const employeeFirmResponse = await axios.get(`${API_URL}/employeefirm`, { headers });

        if (employeeFirmResponse.status === 200 && employeeFirmResponse.data.length > 0 && firmDetails) {
          const userEmployeeFirm = employeeFirmResponse.data.find((empFirm) => empFirm.firm_id === firmDetails.firm_id);

          if (userEmployeeFirm) {
            const employeeFirmId = userEmployeeFirm.firm_id;
            const employeeFirmDetailsResponse = await axios.get(`${API_URL}/firms/${employeeFirmId}`, { headers });

            if (employeeFirmDetailsResponse.status === 200) {
              setEmployeeFirm(employeeFirmDetailsResponse.data);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchEmployeeFirm();
  }, [userId]);

  const applyLoan = async () => {
    try {
      navigation.navigate('LoanApplication');
    } catch (error) {
      console.error(error)
    }
  }

  const applyToFirm = async () => {
    try {
      navigation.navigate('CreateFirm');
    } catch (error) {
      console.error(error)
    }
  }


  const renderActions = () => {
    switch (userRole) {
      case 'admin':
        return (
          <View>
            <AdminApprovalScreen />
          </View>
        );
      case 'firmOwner':
        return (
          <View>
            <Firm firmDetails={firmDetails} />
            <LoanType firmDetails={firmDetails} />
            <Employee firmDetails={firmDetails} />
            <LoanBook firmDetails={firmDetails} />
          </View>
        );
      case 'employee':
        return (
          <View>
            <Firm firmDetails={employeeFirm} />
            <Text>Update LoanBook</Text>
            <Text>Update PaymentSchedule</Text>
          </View>
        );
      case 'borrower':
        return (
          <View>
            {/* Actions for borrower */}
            <Text>View LoanBook</Text>
            <Text>View LoanType</Text>
            <Text>Read PaymentSchedule</Text>
          </View>
        );
      case 'user':
        return (
          <View style={styles.activitiesContainer}>
            <ApplyLoan onPress={applyLoan} />
            <ApplyToFirm onPress={applyToFirm} />
          </View>
        );
      default:
        return (
          <View>
            {/* Default actions for unknown role */}
            <Text>No actions available for this role</Text>
          </View>
        );
    }
  };

  return (
    <PageContainer style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) :
        (
          <ScrollView>
            <View style={styles.content}>
              <View style={styles.userInfo}>
                <Text style={styles.userInfoText}>
                  Signed in as: {userData.user_name} {/* Display the user's name or relevant field */}
                </Text>
              </View>
              {/* <Text style={styles.title}>Dashboard</Text> */}
              {renderActions()}
            </View>
          </ScrollView>
        )}

    </PageContainer>
  );
};

// Map state to props to access userRole and userId from Redux store
const mapStateToProps = (state) => ({
  userRole: state.auth.userData.role,
  userId: state.auth.userData.user_id, // Assuming 'id' is the key for user ID in your userData object
});

export default connect(mapStateToProps)(ActivitiesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    margin: 4,
    padding: 0
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 120,
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
  userInfo: {
    backgroundColor: '#fff',
    padding: 10,
    // marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
  },
  userInfoText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
