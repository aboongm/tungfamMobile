import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS } from '../constants';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { connect, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setCategories, setCategoryStyling, setFirmData } from '../redux/slices/HeaderSlice';
import { API_URL } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirmData } from '../redux/actions/firmActions';
import FirmDetails from './Firm';

const Header = ({ userRole, userId, headerBackgroundColor, descriptors }: { headerBackgroundColor?: string, descriptors: any }) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const route = useRoute();
    const isHomeFocused = useIsFocused();

    const selectedCategory = useSelector((state: RootState) => state.headerSlice.selectedCategory)
    const scrolledPosition = useSelector((state: RootState) => state.headerSlice.scrolledPosition);
    const [colors, setColors] = useState(['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 240, 0.65)']);
    const [textColor, setTextColor] = useState(COLORS.black);
    const [searchQuery, setSearchQuery] = useState('');
    const [activities, setActivities] = useState(['LoanBook', "Investments", 'Employee', "LoanType"])
    const [firm, setFirm] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            console.log("fetchData!!!!");

            try {
                const firmData = await getFirmData(userId);
                console.log("firm: ", firmData);

                setFirm(firmData)
                dispatch(setFirmData(firmData));
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

                if (currentCategory !== 'All') {
                    navigation.navigate('All');
                    e.preventDefault();
                }
            }
        });

        return unsubscribe;
    }, [isHomeFocused, navigation]);

    useEffect(() => {
        if (selectedCategory === "All") {
            setColors(['rgba(52, 152, 219, 0.9)', 'rgba(52, 152, 210, 0.65)'])
            setTextColor(COLORS.tungfamTorquoiseLight)
            if (scrolledPosition > 250) {
                setColors(['rgba(241,246,249, 0.98)', 'rgba(241,246,249, 0.98)'])
                setTextColor(COLORS.black)
            }
        } else {
            setColors(['rgba(241,246,249, 0.98)', 'rgba(241,246,249, 0.98)'])
            setTextColor(COLORS.black)
        }
    }, [scrolledPosition, selectedCategory]);


    const categories = useSelector((state: RootState) => state.headerSlice.categories)

    const handleCategoryPress = (category: string) => {
        dispatch(setCategoryStyling(category))
        switch (category) {
            case 'All':
                navigation.navigate('All');
                break;
            default:
                navigation.navigate(category, { category });
                break;
        }
    };

    return (
        <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
                styles.containerBackground,
                { backgroundColor: headerBackgroundColor || 'transparent' },
            ]}
        >
            <FirmDetails firmDetails={firm} />

            <View style={styles.categoriesWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
                    {activities.map((activity, index) => (
                        <TouchableOpacity onPress={() => handleCategoryPress(activity)} key={index} style={styles.categoryItem}>
                            <Text style={[styles.text, {
                                color: textColor,
                                fontWeight: selectedCategory === activity ? 'bold' : '400'
                            }]}>{activity}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </LinearGradient>
    );
};

const mapStateToProps = (state) => ({
    userRole: state.auth.userData.role,
    userId: state.auth.userData.user_id,
})

export default connect(mapStateToProps)(Header);

const styles = StyleSheet.create({
    containerBackground: {
        margin: 0,
        padding: 0,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.tungfamGrey
    },
    container: {
        // height: 80,
        // justifyContent: 'flex-end',
        // paddingHorizontal: 20,
    },
    firmContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderRadius: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: COLORS.tungfamGrey
    },
    searchIcon: {
        marginLeft: 10,
        backgroundColor: "rgba(255, 255, 255, 0.75)",
    },
    categoriesWrapper: {
        maxHeight: 40,
    },
    categoryContainer: {
        flexDirection: 'row',
        padding: 6,
        borderWidth: 1,
        borderColor: 'grey',
    },
    categoryItem: {
        marginHorizontal: 9,
    },
    text: {
        fontSize: 16,
        fontWeight: '400',
        color: COLORS.black,
        paddingVertical: 2,
        marginBottom: 2,
    },
});
