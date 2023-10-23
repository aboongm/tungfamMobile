import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS} from '../constants';

const PageTitle = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  );
};

export default PageTitle;

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
    fontSize: 28,
    color: COLORS.TungfamBgColor,
    letterSpacing: 0.3,
  },
});
