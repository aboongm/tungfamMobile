import React, { useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../constants';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { connect, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setCategoryStyling } from '../redux/slices/headerSlice';
import { getFirmData } from '../redux/actions/firmActions';
import FirmDetails from './Firm';
import userLogo from '../assets/images/userImage.jpeg';

const HeaderUser = ({ userRole, userId, headerBackgroundColor, descriptors }: { headerBackgroundColor?: string, descriptors: any }) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const route = useRoute();
    const isHomeFocused = useIsFocused();

    const selectedCategory = useSelector((state: RootState) => state.headerSlice.selectedCategory)
    const [colors, setColors] = useState(['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 240, 0.65)']);
    const [activities, setActivities] = useState(['LoanApplication', "CreateFirm"])
    const [firm, setFirm] = useState({})
    const userData = useSelector((state: RootState) => state.auth.userData)


    console.log("userData: ", userData);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const firmData = await getFirmData(userId);
                setFirm(firmData)
                // dispatch(setFirmData(firmData));
            } catch (error) {
                console.error("Error fetching firm data:", error);
            }
        };

        fetchData();
    }, [dispatch, userId]);

    useEffect(() => {
        if (descriptors) {
            const isFocusedArray = Object.values(descriptors).map(
                (descriptor) => descriptor.navigation.isFocused()
            );
            const routeNames = Object.values(descriptors).map(
                (descriptor) => descriptor.route.name
            );

            const focusedIndex = isFocusedArray.findIndex((focused) => focused);

            if (focusedIndex !== -1) {
                const currentCategory = routeNames[focusedIndex];
                dispatch(setCategoryStyling(currentCategory));
            }
        }
    }, [descriptors, dispatch]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e) => {
            if (isHomeFocused) {
                const currentTab = route.name;
                const currentCategory = '';

                if (currentCategory !== 'LoanApplication') {
                    navigation.navigate('LoanApplication');
                    e.preventDefault();
                }
            }
        });

        return unsubscribe;
    }, [isHomeFocused, navigation]);

    const categories = useSelector((state: RootState) => state.headerSlice.categories)

    const handleCategoryPress = (category: string) => {
        dispatch(setCategoryStyling(category))
        navigation.navigate(category, { category });
    };

    return (
        <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
                styles.containerBackground,
                // { backgroundColor: headerBackgroundColor || 'transparent' },
            ]}
        >
            <View style={styles.userContainer}>
                {userLogo && (
                    <View style={styles.imageContainer}>
                        <Image source={userLogo} style={styles.image} />
                    </View>
                )}
                <View style={styles.textContainer}>
                    <Text style={styles.userName}>{userData.name}</Text>
                    <Text style={[styles.text, {color: COLORS.black}]}>{userData.address}</Text>
                </View>
            </View>

            <View style={styles.categoriesWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
                    {activities.map((activity, index) => (
                        <TouchableOpacity onPress={() => handleCategoryPress(activity)} key={index} style={styles.categoryItem}>
                            <Text style={[styles.text, {
                                fontWeight: selectedCategory === activity ? 'bold' : '400'
                            }]}>{activity}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </LinearGradient>
    );
};

export default HeaderUser;

const styles = StyleSheet.create({
    containerBackground: {
        margin: 0,
        padding: 0,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.tungfamGrey,
        backgroundColor: 'rgba(241,246,249, 0.98)',
    },
    container: {
        // height: 80,
        // justifyContent: 'flex-end',
        // paddingHorizontal: 20,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(241,246,249, 0.98)',
        // backgroundColor: 'red',
        borderRadius: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey,
        paddingTop: 30,
    },
    textContainer: {
        flex: 1,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        // marginBottom: 6,
        textAlign: "left",
        color: 'black',
    },
    imageContainer: {
        // backgroundColor: COLORS.tungfamBgColor,
        // borderRadius: 50,
        // padding: 8,
        marginRight: 10
    },
    image: {
        width: 70,
        height: 70,
        objectFit: "fill",
        borderRadius: 50,
    },
    categoriesWrapper: {
        maxHeight: 50,
    },
    categoryContainer: {
        flexDirection: 'row',
        padding: 6,
        borderWidth: 1,
        borderColor: 'grey',
    },
    categoryItem: {
        marginHorizontal: 2,
        backgroundColor: 'rgba(52, 152, 210, 1)',
        borderRadius: 50,
        paddingHorizontal: 14,
        elevation: 5,
    },
    text: {
        fontSize: 16,
        fontWeight: '400',
        color: COLORS.white,
        paddingVertical: 4,
    },
});
