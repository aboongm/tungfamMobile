import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { connect } from 'react-redux';
import { COLORS } from '../../constants';

const ExpenseScreen = ({ userRole, userId }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleAnalytics = () => {
    setShowDetails(!showDetails);
  };

  return (
    <ScrollView style={styles.cashFlowContainer}>
      <TouchableOpacity onPress={toggleAnalytics}>
        <Text style={styles.headerText}>Expenses</Text>
      </TouchableOpacity>
      {showDetails && (
        <View style={styles.financialsContainer}>
          <Text style={styles.financialsTitle}>On {new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}:</Text>




          <Pressable
            style={styles.buttonInvestment}
            // onPress={addInvestmentRecord}
          >
            <Text style={styles.buttonInvestmentText}>Add A Weekly InvestmentRecord</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  )
}

const mapStateToProps = (state) => ({
  userRole: state.auth.userData.role,
  userId: state.auth.userData.user_id, // Assuming 'id' is the key for user ID in your userData object
});

export default connect(mapStateToProps)(ExpenseScreen)

const styles = StyleSheet.create({
  cashFlowContainer: {
    padding: 10,
    backgroundColor: 'rgba(52, 152, 210, 0.1)',
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
})