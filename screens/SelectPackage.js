import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { COLORS, SIZES, icons } from "../constants";
import PackageItem from '../components/PackageItem';
import { useTheme } from '../theme/ThemeProvider';
import Header from '../components/Header';
import Button from '../components/Button';
// 1. Import LinearGradient
import LinearGradient from 'react-native-linear-gradient';

const SelectPackage = ({ navigation, route }) => {
    const { colors, dark } = useTheme();
    let { startedDate, selectedHour, doctorId, method } = route?.params;
    console.log('=========method=========', method);
    console.log('=========doctorId=========id', doctorId);
    const [selectedItem, setSelectedItem] = useState(null);

    const renderContent = () => {
        const handleCheckboxPress = (itemTitle) => {
            if (selectedItem === itemTitle) {
                setSelectedItem(null);
            } else {
                setSelectedItem(itemTitle);
            }
        };

        return (
            <View>
                <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Select Package</Text>
                <View style={{
             
                    backgroundColor: 'transparent',
                    paddingTop: 12
                }}>
                    <PackageItem
                        checked={selectedItem === 'home-visit'}
                        onPress={() => handleCheckboxPress('home-visit')}
                        title="Home Visit"
                        subtitle="Talk with Doctor"
                        icon={icons.home}
                    />
                    <PackageItem
                        checked={selectedItem === 'video'}
                        onPress={() => handleCheckboxPress('video')}
                        title="Video call"
                        subtitle="Video call with Doctor"
                        icon={icons.videoCamera}
                    />
                    <PackageItem
                        checked={selectedItem === 'in-person'}
                        onPress={() => handleCheckboxPress('in-person')}
                        title="In Person"
                        subtitle="In person visit with Doctor"
                        icon={icons.user}
                    />
                </View>
            </View>
        );
    };

    return (
 
        <LinearGradient
            colors={['#00b4db', '#fff', '#fff', '#fff', '#fff', '#fff']}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.area}>
                <View style={styles.container}>
                    {/* Note: You might need to change the header's icon and title color to white for better visibility */}
                    <Header
                        title="Select Package"
                        onBackPress={() => navigation.goBack()}
                    />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {renderContent()}
                    </ScrollView>
                </View>
                <View style={[styles.bottomContainer, {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.white
                }]}>
                    <Button
                        title="Next"
                        filled
                        style={styles.btn}
                        onPress={() => {
                            if (method === 'wallet') {
                                navigation.navigate('WalletPatientDetailScreen', {
                                    startedDate,
                                    selectedHour,
                                    selectedItem,
                                    doctorId,
                                });
                            } else {
                                navigation.navigate('PatientDetails', {
                                    startedDate,
                                    selectedHour,
                                    selectedItem,
                                    doctorId,
                                });
                            }
                        }}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    // 3. Removed backgroundColor from styles
    area: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 12
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 12,
        alignItems: "center"
    },
    headerIcon: {
        height: 50,
        width: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        backgroundColor: COLORS.gray
    },
    arrowLeft: {
        height: 24,
        width: 24,
        tintColor: COLORS.black
    },
    moreIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    separateLine: {
        marginVertical: 8,
        borderBottomWidth: .3,
        borderBottomColor: COLORS.grayscale200,
        width: "100%"
    },
    separateLine2: {
        borderBottomWidth: .3,
        borderBottomColor: COLORS.grayscale200,
        width: "100%",
        marginBottom: 6
    },
    h4: {
        fontSize: 16,
        fontFamily: "Urbanist Medium",
        color: COLORS.black,
        marginVertical: 6
    },
    subtitle: {
        textTransform: "uppercase",
        color: "gray",
        fontSize: 16,
        fontFamily: "Urbanist Regular",
        marginVertical: 12
    },
    subName: {
        fontSize: 16,
        fontFamily: "Urbanist Medium",
        color: COLORS.black,
        marginVertical: 6
    },
    btnContainer: {
        position: "absolute",
        bottom: 22,
        height: 72,
        width: "100%",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        alignItems: "center"
    },
    btn: {
        width: SIZES.width - 32
    },
    btnText: {
        fontSize: 16,
        fontFamily: "Urbanist Medium",
        color: COLORS.white
    },
    inputTitle: {
        fontSize: 18,
        fontFamily: "Urbanist Medium",
        color: COLORS.black,
        marginVertical: 12
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
        height: 52,
        backgroundColor: COLORS.tertiaryWhite,
    },
    icon: {
        marginRight: 10,
    },
    dropdownContainer: {
        flex: 1,
    },
    dropdown: {
        backgroundColor: 'white',
    },
    dropdownItem: {
        justifyContent: 'flex-start',
    },
    dropDown: {
        backgroundColor: 'white',
        zIndex: 1000,
    },
    picker: {
        flex: 1,
        height: 40,
    },
    title: {
        fontSize: 20,
        fontFamily: "Urbanist Bold",
        color: COLORS.black,
        marginVertical: 12,
   
    },
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 99,
        borderRadius: 32,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center"
    }
});
export default SelectPackage;