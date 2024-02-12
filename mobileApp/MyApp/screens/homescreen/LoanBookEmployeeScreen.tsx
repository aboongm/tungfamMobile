import { ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux';
import LoanBook from '../../components/LoanBook';
import { getEmployeeFirmData, getFirmData } from '../../redux/actions/firmActions';
import { setFirmData } from '../../redux/slices/loanSlice';
import LoanBookEmployee from '../../components/LoanBookEmployee';

const LoanBookEmployeeScreen = ({userRole, userId}) => {
  const dispatch = useDispatch()
  const [firm, setFirm] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firm = await getEmployeeFirmData(userId);
        setFirm(firm)
        dispatch(setFirmData(firm));
        } catch (error) {
            console.error("Error fetching firm data:", error);
        }
    };

    fetchData();
}, [dispatch, userId]);

  return (
    <ScrollView style={styles.loanBookContainer}>
      <LoanBookEmployee firmDetails={firm} userRole={userRole} userId={userId} />
    </ScrollView>
  )
}

const mapStateToProps = (state) => ({
  userRole: state.auth.userData.role,
  userId: state.auth.userData.user_id, // Assuming 'id' is the key for user ID in your userData object
});

export default connect(mapStateToProps)(LoanBookEmployeeScreen)

const styles = StyleSheet.create({
  loanBookContainer: {
    padding: 10,
    backgroundColor: 'rgba(52, 152, 210, 0.1)',
  }
})