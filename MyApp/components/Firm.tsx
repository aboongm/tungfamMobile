import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
    <TouchableOpacity onPress={toggleDetails} style={styles.container}>
      <View>
        <Text style={styles.firmName}>{firmDetails.firm_name}</Text>
        {firmDetails.status !== 'approved' && (
          <Text style={styles.status}>Status: {firmDetails.status}</Text>
        )}
        {renderAdditionalDetails()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    marginBottom: 10
  },
  firmName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: "center"
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: "center"
  },
  additionalDetails: {
    padding: 10
  },
  text: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '500'
  },
});

export default FirmDetails;
