import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FirmDetails = ({ firmDetails }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!firmDetails) {
    return <Text style={styles.noDetailsText}>No firm details available</Text>;
  }

  const renderAdditionalDetails = () => {
    if (showDetails) {
      return (
        <View style={styles.additionalDetails}>
          <Text>Firm Name: {firmDetails.firm_name}</Text>
          <Text>Address: {firmDetails.address}</Text>
          <Text>Contact Person: {firmDetails.contact_person}</Text>
          <Text>Mobile: {firmDetails.mobile}</Text>
          <Text>Registration: {firmDetails.registration}</Text>
          <Text>Email: {firmDetails.email}</Text>
          <Text>Website: {firmDetails.website}</Text>
          {/* Add other details as needed */}
        </View>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity onPress={toggleDetails} style={styles.container}>
      <View>
        <Text style={styles.status}>Status: {firmDetails.status}</Text>
        <Text style={styles.firmName}>Firm Name: {firmDetails.firm_name}</Text>
        {/* Render only firm name and status by default */}
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
  },
  status: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  firmName: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  additionalDetails: {
    marginTop: 10,
  },
  noDetailsText: {
    fontStyle: 'italic',
  },
});

export default FirmDetails;
