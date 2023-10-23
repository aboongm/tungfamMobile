import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome"
import { COLORS } from '../../constants'
import PageContainer from '../../components/PageContainer'

const ActivitiesScreen = () => {
  return (
    <PageContainer style={styles.container}>
    <View>
      <Text style={{fontFamily: "system", fontSize: 22}}>Activities Screen</Text>
      <Text style={{fontFamily: "sans-serif", fontSize: 22}}>Activities Screen</Text>
      <Text style={{fontFamily: "serif", fontSize: 22}}>Activities Screen</Text>
      <Text style={{fontFamily: "monospace", fontSize: 22}}>Activities Screen</Text>
      <Text style={{fontFamily: "roboto", fontWeight: 800, fontSize: 22}}>Activities Screen</Text>
    </View>
    </PageContainer>
  )
}

export default ActivitiesScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    margin: 4
  },
})