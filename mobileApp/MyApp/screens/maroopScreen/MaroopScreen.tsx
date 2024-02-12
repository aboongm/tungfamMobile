import { ActivityIndicator, Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { getMaroopData, getMaroopUserData } from '../../redux/actions/maroopActions';
import { setMaroops } from '../../redux/slices/maroopSlice';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';

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

  const [open, setOpen] = useState(false)

  const [newWinnerDate, setNewWinnerDate] = useState(new Date());
  const [selectedWinner, setSelectedWinner] = useState('');
  const [remark, setRemark] = useState('');
  const [totalMonth, setTotalMonth] = useState('');

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
        }
      }
    };

    fetchMaroopUserData();
  }, [selectedMaroop]);
  console.log("selectedMaroop:", selectedMaroop);

  const toggleDisplayOption = async (option) => {
    setDisplayOption(option.name);
    setSelectedMaroop(option)
    setMaroopId(option.maroop_id)
  };

  const toggleListOption = async (option) => {
    setListOption(option.name);
  };

  const addWinner = async () => {
    const subscriber = subscribers.find(item => item.user_name === selectedWinner);
    console.log("subscriber: ", subscriber);
    
    const maroop_id = selectedMaroop.maroop_id;
    const user_name = selectedWinner    
    const user_id = subscriber.user_id;
    const amount = selectedMaroop.maroopamount;
    const totalMonthlyInterestAmount = selectedMaroop.monthlyinterestamount;
    const totalMonthCount = totalMonth;
    const totalPayable = parseInt(amount) + parseInt(totalMonth) * parseInt(totalMonthlyInterestAmount)
    const hasWon = true;
    const monthWon = newWinnerDate.toISOString().split('T')[0]

    try {
      const updatedData = {
        maroop_id,
        user_id,
        user_name,
        amount,
        totalPayable,
        totalMonthlyInterestAmount,
        totalMonthCount,
        hasWon,
        monthWon,
      }
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `${token}` };
      const maroopUserId  = subscriber.maroop_user_id
      const maroopResponse = await axios.put(`${API_URL}/maroopusers/${maroopId}/${maroopUserId}`, updatedData, { headers });

      if (maroopResponse.status === 200) {
        setSelectedWinner("")
        setTotalMonth("")
        Alert.alert("Winner now in the Winner List!")
      }

    } catch (error) {
      console.log('error: ', error);

      Alert.alert("Failed to create Winner!")
    }
  };

  const takePermission = () => {
    // const date = new Date();
    // const localizedDate = date.toLocaleString(); 

    Alert.alert(
      'Confirm Payment',
      `Are you sure you want to add this payment for `,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: addWinner
        }
      ]
    );
  }

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
              scrollEnabled={false}
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
            {renderAddWinner()}
          </>
        ) : listOption === 'SUBSCRIBERS LIST' && subscribers.length > 0 ? (
          <>
            <View style={styles.tableRow}>
              <Text style={[styles.columnHeader, { flex: 0, width: 60 }]}>Sl. No</Text>
              <Text style={styles.columnHeader}>Subscriber</Text>
            </View>

            <FlatList
              scrollEnabled={false}
              data={subscribers}
              renderItem={({ item, index }) => (
                <View>
                  <View
                    style={[
                      styles.tableBody,
                      index % 2 === 0 ? styles.evenRow : styles.oddRow,
                    ]}
                  >
                    <Text style={[styles.buttonText, { padding: 10, width: 60 }]}>{index + 1}. {" "}</Text>
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

  const renderAddWinner = () => (
    <View style={styles.tableInput}>
      <View style={styles.DateWinner}>
        <Pressable style={styles.dateButton} onPress={() => setOpen(true)}>
          <Text style={styles.button}>Pick Date</Text>
        </Pressable>
        <DatePicker
          modal
          open={open}
          date={newWinnerDate}
          onConfirm={(date) => {
            setOpen(false);
            setNewWinnerDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <Picker
          style={styles.winnerPicker}
          selectedValue={selectedWinner}
          onValueChange={(itemValue) => setSelectedWinner(itemValue)}
        >
          <Picker.Item label="Select a Winner" value="" />
          {subscribers.map((type, index) => (
            <Picker.Item key={index} label={type.user_name} value={type.user_name} />
          ))}
        </Picker>
      </View>

      <TextInput
        style={styles.descriptionInput}
        placeholder="Add the Total Month"
        value={totalMonth}
        onChangeText={(text) => setTotalMonth(text)}
        keyboardType="numeric"
        placeholderTextColor={'black'}
      />

      <View style={styles.itemContainer}>
        <Text style={styles.item}>Month:</Text>
        <Text style={styles.item}>{newWinnerDate.toISOString().split('T')[0]}</Text>
      </View>

      <View style={styles.itemContainer}>
        <Text style={styles.item}>Winner:</Text>
        {selectedWinner && (
          <Text style={styles.item}>{selectedWinner}</Text>
        )}
      </View>

      <View style={styles.itemContainer}>
        <Text style={styles.item}>Amount (without Interest):</Text>
        <Text style={styles.item}>Rs {selectedMaroop.maroopamount}</Text>
      </View>

      <View style={styles.itemContainer}>
        <Text style={styles.item}>MonthlyInterestAmount:</Text>
        <Text style={styles.item}>Rs {selectedMaroop.monthlyinterestamount}</Text>
      </View>

      <View style={styles.itemContainer}>
        <Text style={styles.item}>TotalInterest:</Text>
        <Text style={styles.item}>Rs {selectedMaroop.monthlyinterestamount * totalMonth} </Text>
      </View>

      <View style={styles.itemContainer}>
        <Text style={styles.item}>TotalPayable:</Text>
        <Text style={styles.item}>Rs {selectedMaroop.monthlyinterestamount * totalMonth + parseInt(selectedMaroop.maroopamount)}</Text>
      </View>

      <TouchableOpacity onPress={takePermission}>
        <Text style={styles.addPaymentButton}>Add a Winner</Text>
      </TouchableOpacity>
    </View>
  );


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
    </ScrollView>
  )
}

export default MaroopScreen

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,  // Make the content container grow to fill the ScrollView
  },
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
  tableInput: {
    flexDirection: "column",
    marginTop: 10,
    justifyContent: 'space-between',
    width: '100%',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    marginBottom: 180,
  },
  DateWinner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    backgroundColor: COLORS.tungfamBgColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    margin: 0,
    padding: 0,
    elevation: 5
  },
  button: {
    color: 'white',
    fontSize: 16,
    padding: 10,
  },
  winnerPicker: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    backgroundColor: "lightgrey",
    elevation: 5
  },
  descriptionInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    height: 60,
    marginVertical: 10,
  },
  addPaymentButton: {
    fontSize: 16,
    backgroundColor: COLORS.tungfamBgColor,
    color: 'white',
    borderRadius: 5,
    padding: 10,
    textAlign: 'center',
    // flex: 1,
    elevation: 5
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    borderRadius: 6,
    paddingVertical: 4
  },
  item: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
})