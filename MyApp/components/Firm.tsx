import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const FirmDetails = ({ firmDetails }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!firmDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.status}>No firm details available</Text>
      </View>
    )
  }

  const renderAdditionalDetails = () => {
    if (showDetails) {
      return (
        <View style={styles.additionalDetails}>
          <Text style={styles.text}>Address: {firmDetails.address}</Text>
          <Text style={styles.text}>Contact Person: {firmDetails.contact_person}</Text>
          <Text style={styles.text}>Mobile: {firmDetails.mobile}</Text>
          <Text style={styles.text}>Registration: {firmDetails.registration}</Text>
          <Text style={styles.text}>Email: {firmDetails.email}</Text>
          <Text style={styles.text}>Website: {firmDetails.website}</Text>
          <Text style={styles.text}>Status: {firmDetails.status}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <>
      <TouchableOpacity onPress={toggleDetails} style={styles.container}>
        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
          <Text style={styles.firmName}>{firmDetails.firm_name}</Text>
          {firmDetails.status !== 'approved' && (
            <Text style={styles.status}>Status: {firmDetails.status}</Text>
          )}
        </View>
      </TouchableOpacity>
      {renderAdditionalDetails()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 5,
  },
  firmName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: "center",
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: "center",
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  additionalDetails: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.tungfamGrey,
  },
  text: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '500'
  },
});

export default FirmDetails;
