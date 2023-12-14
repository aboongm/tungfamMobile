import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import React, {useCallback, useState, useReducer} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PageTitle from '../../components/PageTitle';
import PageContainer from '../../components/PageContainer';
import Input from '../../components/Input';
import {validateInput} from '../../redux/actions/formAction';
import {useDispatch, useSelector} from 'react-redux';
import SubmitButton from '../../components/SubmitButton';
import {COLORS} from '../../constants';
import {
  updateSignInUserData,
  userLogout,
} from '../../redux/actions/authActions';
import {updateLoggedInSignInUserData} from '../../store/authSlice';
import {reducer} from '../../redux/reducers/formReducer';
import ProfileImage from '../../components/ProfileImage';

const ProfileScreen = props => {
  const dispatch = useDispatch();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector(state => state.auth.userData);

  const firstName = userData.firstName || '';
  const lastName = userData.lastName || '';
  const email = userData.email || '';
  const about = userData.about || '';
  const initialState = {
    inputValues: {
      firstName,
      lastName,
      email,
      about,
    },
    inputValidities: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      about: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const inputChangeHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({inputId, validationResult: result, inputValue});
    },
    [dispatchFormState],
  );

  const saveHandler = useCallback(async () => {
    const updateValues = formState.inputValues;
    try {
      setIsLoading(true);
      await updateSignInUserData(userData.userId, updateValues);
      dispatch(updateLoggedInSignInUserData({newData: updateValues}));

      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [formState, dispatch]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;
    return (
      currentValues.firstName !== firstName ||
      currentValues.lastName !== lastName ||
      currentValues.email !== email ||
      currentValues.about !== about
    );
  };

  return (
    <PageContainer style={styles.container}>
      <PageTitle text="Personal" />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.profileContainer}>
          <ProfileImage
            size={100}
            userId={userData.userId}
            uri={userData.profilePicture}
          />

          <View style={{marginTop: 20}}>
            {showSuccessMessage && <Text>Saved</Text>}

            {isLoading ? (
              <ActivityIndicator
                style={{marginTop: 10}}
                size={'small'}
                color={COLORS.tungfamLightBlue}
              />
            ) : (
              hasChanges() && (
                <SubmitButton
                  title="Save"
                  onPress={saveHandler}
                  disabled={!formState.formIsValid}
                  style={styles.button}
                />
              )
            )}
          </View>
        </View>

        <View>
          <Text>Edit yout personal details</Text>
        </View>
        <SubmitButton
          title="Logout"
          onPress={() => dispatch(userLogout())}
          style={styles.button}
          color={COLORS.TungfamBgColor}
        />
      </ScrollView>
    </PageContainer>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    margin: 4,
  },
  formContainer: {
    alignItems: 'center',
  },
  profileContainer: {
    flex: 1,
    // alignItems: "center",
    marginBottom: 12,
  },
  button: {
    marginTop: 80,
  }
});
