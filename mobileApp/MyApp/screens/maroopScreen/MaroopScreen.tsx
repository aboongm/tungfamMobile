import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { getMaroopData } from '../../redux/actions/maroopActions';
import { setMaroops } from '../../redux/slices/maroopSlice';

const MaroopScreen = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [maroopId, setMaroopId] = useState("");
  const [openItems, setOpenItems] = useState({});
  const [maroopList, setMaroopList] = useState([]);
  const [selectedMaroop, setSelectedMaroop] = useState(null);
  const [selectedWinners, setSelectedWinners] = useState([]);
  const [displayOption, setDisplayOption] = useState('');

  const dispatch = useDispatch()
  const firmId = useSelector((state: RootState) => state.headerSlice.firmData.firm_id)

  const toggleLoanBook = () => {
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    const fetchData = async () => {
      const maroopData = await getMaroopData(firmId)
      dispatch(setMaroops(maroopData))
      setIsLoading(false)
      setMaroopList(maroopData)
    }

    fetchData()
  }, [firmId])

  const toggleMaroopItem = (maroopId: string | number) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [maroopId]: !prevOpenItems[maroopId],
    }));
    setMaroopId(maroopId)
  };

  const toggleDisplayOption = (option) => {
    setDisplayOption(option.name);
    setSelectedMaroop(option)
    // console.log("OPTION: ", option);

  };



  const maroopData = [
    {
      "maroop_id": 1,
      subscribers: [
        { "name": "Tomtom1", 'address': "address1" },
        { "name": "Tomtom2", 'address': "address2" },
        { "name": "Tomtom3", 'address': "address3" },
        { "name": "Tomtom4", 'address': "address4" },
        { "name": "Tomtom5", 'address': "address5" },
        { "name": "Tomtom6", 'address': "address6" },
      ],
      winners: [
        { 'month': "Jan", "winner": "Tomtom", 'amount': "15000" },
        { 'month': "Feb", "winner": "Tomtom", 'amount': "15000" },
        { 'month': "Mar", "winner": "Tomtom", 'amount': "15000" },
      ],
    },
    {
      "maroop_id": 2,
      subscribers: [
        { "name": "Tomtom1", 'address': "address1" },
        { "name": "Tomtom2", 'address': "address2" },
        { "name": "Tomtom3", 'address': "address3" },
        { "name": "Tomtom4", 'address': "address4" },
        { "name": "Tomtom5", 'address': "address5" },
        { "name": "Tomtom6", 'address': "address6" },
      ],
      winners: [
        { 'month': "Jan", "winner": "Tomtom", 'amount': "15000" },
        { 'month': "Feb", "winner": "Tomtom", 'amount': "15000" },
        { 'month': "Mar", "winner": "Tomtom", 'amount': "15000" },
      ],
    },
    {
      "maroop_id": 3,
      subscribers: [
        { "name": "Tomtom1", 'address': "address1" },
        { "name": "Tomtom2", 'address': "address2" },
        { "name": "Tomtom3", 'address': "address3" },
        { "name": "Tomtom4", 'address': "address4" },
        { "name": "Tomtom5", 'address': "address5" },
        { "name": "Tomtom6", 'address': "address6" },
      ],
      winners: [
        { 'month': "Jan", "winner": "Tomtom", 'amount': "15000" },
        { 'month': "Feb", "winner": "Tomtom", 'amount': "15000" },
        { 'month': "Mar", "winner": "Tomtom", 'amount': "15000" },
      ],
    },

  ];

  const renderWinners = (maroop) => {
    return (
      <View style={styles.subscribersContainer} >
        <View style={styles.list}>
          <Text style={styles.text}>WINNERS LIST</Text>
          <Text style={styles.text}>SUBSCRIBERS LIST</Text>
        </View>
        <View>
          <View style={styles.tableRow}>
            <Text style={styles.columnHeader}>Month</Text>
            <Text style={styles.columnHeader}>Winner</Text>
            <Text style={styles.columnHeader}>Amount</Text>
          </View>

          <FlatList
            data={maroopData}
            renderItem={({ item, index }) => {

              return (
                <View >
                  <View style={[
                    styles.tableBody,
                    index % 2 === 0 ? styles.evenRow : styles.oddRow,
                  ]}>
                    <Text style={[styles.buttonText, {padding: 10}]}>Month{item.winners.month}</Text>
                    <Text style={[styles.buttonText, {padding: 10}]}>Winner{item.winners.winner}</Text>
                    <Text style={[styles.buttonText, {padding: 10}]}>Amount{item.winners.amount}</Text>
                  </View>
                </View>
              )
            }}
            keyExtractor={(item) => item.maroop_id.toString()}
          />

        </View>
      </View>
    );
  };

  // const renderWinners = (maroop) => {
  //   console.log("Maroop: ", maroop);

  //   return (
  //     <FlatList
  //       data={subscribers}
  //       renderItem={({ item }) => (
  //         <View style={styles.subscribersContainer}>
  //           {/* Render subscriber information here */}
  //           {/* <Text>{item.month}</Text>
  //           <Text>{item.winner}</Text>
  //           <Text>{item.amount}</Text> */}
  //           <Text>Checkingggggg: {item.maroop_id}</Text>
  //         </View>
  //       )}
  //       keyExtractor={(item) => item.maroop_id.toString()}
  //     />
  //   );
  // };

  const renderItem = ({ item, index }) => {

    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          key={index}
          style={[styles.buttonOptions, displayOption === item.name && { backgroundColor: COLORS.tungfamBgColor }]}
          onPress={() => toggleDisplayOption(item)}
        >
          <Text style={[styles.buttonText, displayOption === item.name && { color: COLORS.white, fontWeight: 'bold' }]}>{index + 1}. {" "}</Text>
          <Text style={[styles.buttonText, displayOption === item.name && { color: COLORS.white, fontWeight: 'bold' }]}>{item.name}</Text>
        </TouchableOpacity>
        {selectedMaroop === item && renderWinners(item)}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleLoanBook}>
        <Text style={styles.headerText}>MaroopList</Text>
      </TouchableOpacity>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        showDetails && (
          <>
            <View style={styles.buttonContainer}>
              {maroopList.map((item, index) => (

                <TouchableOpacity
                  key={index}
                  style={[styles.buttonOptions, displayOption === item.name && { backgroundColor: 'rgba(52, 152, 219, 0.90)' }]}
                  onPress={() => toggleDisplayOption(item)}
                >
                  <Text style={[styles.buttonText, displayOption === item.name && { color: COLORS.white, fontWeight: 'bold' }]}>{index + 1}. {" "}</Text>
                  <Text style={[styles.buttonText, displayOption === item.name && { color: COLORS.white, fontWeight: 'bold' }]}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedMaroop && renderWinners(selectedMaroop)}
            {/* <FlatList
              // scrollEnabled={false}
              data={selectedMaroop.winners}
              renderItem={renderItem}
              keyExtractor={(item) => item.maroop_id.toString()}
              contentContainerStyle={styles.list}
            /> */}
          </>
        )
      )}
    </View>
  )
}

export default MaroopScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(52, 152, 210, 0.1)',
  },
  headerText: {
    color: COLORS.black,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: COLORS.tungfamGrey,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    elevation: 5,
  },
  list: {
    // flex: 0
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscribersContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 6,
    // padding: 10,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    color: COLORS.black,
    padding: 10
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    backgroundColor: COLORS.tungfamBgColor,
    elevation: 5
  },
  columnHeader: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 2,
    paddingVertical: 10,
  },
  tableBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    // elevation: 5
  },
  evenRow: {
    backgroundColor: 'rgba(52, 152, 219, 0.45)'
  },
  oddRow: {
    backgroundColor: 'rgba(52, 152, 219, 0.30)'
  },
  buttonContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    // padding: 4
  },
  buttonOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 2,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  buttonText: {
    fontSize: 16,
    color: COLORS.black,
    textAlign: 'center',
  },
})