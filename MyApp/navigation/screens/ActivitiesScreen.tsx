import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { COLORS } from '../../constants';
import PageContainer from '../../components/PageContainer';
import ApplyToFirm from '../../components/ApplyToFirm';

const ActivitiesScreen = ({ userRole, navigation }) => {

  const applyToFirm = async () => {
    console.log("apply to firm");
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
            {/* Action for admin */}
            <Text>Approve/Delete Firm</Text>
            <Text>Update firmOwner role</Text>
          </View>
        );
      case 'firmOwner':
        return (
          <View>
            {/* Actions for firmOwner */}
            <Text>Create/Update/Delete LoanOfficer</Text>
            <Text>Create/Update/Delete LoanBook</Text>
            <Text>Create/Update/Delete LoanType</Text>
            <Text>Create/Update/Delete PaymentSchedule</Text>
            {/* Add other actions for firmOwner */}
          </View>
        );
      case 'loanOfficer':
        return (
          <View>
            {/* Actions for loanOfficer */}
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
            {/* Actions for user */}
            <Text>Apply for a loan</Text>
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
      <View style={styles.content}>
        <Text style={styles.title}>Dashboard</Text>
        {renderActions()}
      </View>
    </PageContainer>
  );
};

// Map state to props to access userRole from Redux store
const mapStateToProps = (state) => ({
  userRole: state.auth.userData.role, // Assuming 'role' is the key for user role in your userData object
});

export default connect(mapStateToProps)(ActivitiesScreen);

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
  }
});
