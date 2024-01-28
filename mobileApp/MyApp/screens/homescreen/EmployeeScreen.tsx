import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Employee from '../../components/Employee'
import { connect, useDispatch } from 'react-redux'
import { getFirmData } from '../../redux/actions/firmActions'
import { setFirmData } from '../../redux/slices/loanSlice'

const EmployeeScreen = ({userRole, userId}) => {
  const dispatch = useDispatch()
  const [firm, setFirm] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firm = await getFirmData(userId);
        setFirm(firm)
        dispatch(setFirmData(firm));
        } catch (error) {
            console.error("Error fetching firm data:", error);
        }
    };

    fetchData();
}, [dispatch, userId]);

  return (
    <ScrollView style={styles.employeeContainer}>
      <Employee firmDetails={firm} />
    </ScrollView>
  )
}

const mapStateToProps = (state) => ({
  userRole: state.auth.userData.role,
  userId: state.auth.userData.user_id, // Assuming 'id' is the key for user ID in your userData object
});

export default connect(mapStateToProps)(EmployeeScreen)

const styles = StyleSheet.create({
  employeeContainer: {
    padding: 10,
    backgroundColor: 'rgba(52, 152, 210, 0.1)',
  }
})