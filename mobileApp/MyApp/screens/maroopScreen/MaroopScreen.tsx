import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { getMaroopData, getMaroopUserData } from '../../redux/actions/maroopActions';
import { setMaroops } from '../../redux/slices/maroopSlice';

const MaroopScreen = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [maroopId, setMaroopId] = useState("");
  const [openItems, setOpenItems] = useState({});
  const [maroopList, setMaroopList] = useState([]);
  const [selectedMaroop, setSelectedMaroop] = useState(null);
  const [maroopUser, setMaroopUser] = useState([]);
  const [winners, setWinners] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [displayOption, setDisplayOption] = useState('');
  const [listOption, setListOption] = useState('');

  const dispatch = useDispatch()
  const firmId = useSelector((state: RootState) => state.headerSlice.firmData.firm_id)

  const toggleButtonMaroopList = () => {
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

  useEffect(() => {
    const fetchMaroopUserData = async () => {
      if (selectedMaroop) {
        const maroopUserData = await getMaroopUserData(selectedMaroop.maroop_id);
        if (maroopUserData) {
          const winnersList = maroopUserData.filter(item => {
            return item.haswon === true; // Add the return statement here
          });
  
          setWinners(winnersList);
          setSubscribers(maroopUserData);
          console.log(winnersList);
          
        }
      }
    };
  
    fetchMaroopUserData();
  }, [selectedMaroop]);

  const toggleDisplayOption = async (option) => {
    setDisplayOption(option.name);
    setSelectedMaroop(option)
    setMaroopId(option.maroop_id)
  };

  const toggleListOption = async (option) => {
    setListOption(option.name);
  };

  const renderList = () => (
    <View style={styles.subscribersContainer} >
      <View style={styles.list}>
        <TouchableOpacity onPress={() => toggleListOption({ name: 'WINNERS LIST' })}>
          <Text style={styles.text}>WINNERS LIST</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleListOption({ name: 'SUBSCRIBERS LIST' })}>
          <Text style={styles.text}>SUBSCRIBERS LIST</Text>
        </TouchableOpacity>
      </View>
      <View>

        {listOption === 'WINNERS LIST' && winners.length > 0 ? (
          <>
            <View style={styles.tableRow}>
              <Text style={styles.columnHeader}>Month</Text>
              <Text style={styles.columnHeader}>Winner</Text>
              <Text style={styles.columnHeader}>Amount</Text>
            </View>
            <FlatList
              data={winners}
              renderItem={({ item, index }) => (
                <View>
                  <View
                    style={[
                      styles.tableBody,
                      index % 2 === 0 ? styles.evenRow : styles.oddRow,
                    ]}
                  >
                    <Text style={[styles.buttonText, { padding: 10, flex: 1 }]}>{item.monthwon}</Text>
                    <Text style={[styles.buttonText, { padding: 10, flex: 1 }]}>{item.user_name}</Text>
                    <Text style={[styles.buttonText, { padding: 10, flex: 1 }]}>{item.totalpayable}</Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.maroop_user_id.toString()}
            />
            <View>
              <Text>Add a Winner</Text>
            </View>
          </>
        ) : listOption === 'SUBSCRIBERS LIST' && subscribers.length > 0 ? (
          <>
            <View style={styles.tableRow}>
              <Text style={[styles.columnHeader, {flex: 0, width: 60}]}>Sl. No</Text>
              <Text style={styles.columnHeader}>Subscriber</Text>
            </View>

            <FlatList
              data={subscribers}
              renderItem={({ item, index }) => (
                <View>
                  <View
                    style={[
                      styles.tableBody,
                      index % 2 === 0 ? styles.evenRow : styles.oddRow,
                    ]}
                  >
                    <Text style={[styles.buttonText, { padding: 10, width: 60 }]}>{index+1}. {" "}</Text>
                    <Text style={[styles.buttonText, { padding: 10, flex: 1 }]}>{item.user_name}</Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.maroop_user_id.toString()}
            />
          </>
        ) : (
          null
          // <Text style={styles.buttonText}>No data available</Text>
        )}

      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleButtonMaroopList}>
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
            {selectedMaroop && renderList(selectedMaroop)}
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