import { StyleSheet, View } from 'react-native'

const PageContainer = (props) => {
  return (
    <View style={{...styles.container, ...props.style}}>
      {props.children}
    </View>
  )
}

export default PageContainer

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: 'white',
    }
})