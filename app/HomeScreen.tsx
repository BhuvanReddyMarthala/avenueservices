import React, { useState,useRef,useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, useWindowDimensions,Modal,Animated,Easing } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const images: Record<string, string> = {
    'Service Request': 'https://static.vecteezy.com/system/resources/previews/000/180/372/non_2x/repair-man-vector.jpg',
    GatePass: 'https://avenuenxt.s3.ap-southeast-1.amazonaws.com/gatepass_clipart.jpg',
    Restaurant: 'https://static.vecteezy.com/system/resources/previews/049/237/459/non_2x/restaurant-cafe-front-flat-style-illustration-building-exterior-vector.jpg',
    Groceries: 'https://img.freepik.com/free-vector/delicious-meat-vegetable-wooden-crate_1308-161743.jpg',
    Pharmacy: 'https://img.freepik.com/premium-vector/modern-interior-pharmacy-male-pharmacist_169241-3431.jpg',
    'Club House': 'https://png.pngtree.com/png-clipart/20230917/original/pngtree-house-in-thin-line-style-in-a-flat-color-vector-png-image_12274371.png',
    Saloon: 'https://static.vecteezy.com/system/resources/previews/036/325/659/non_2x/cowboy-saloon-cartoon-colored-clipart-illustration-free-vector.jpg',
    Laundry: 'https://static.vecteezy.com/system/resources/previews/043/535/402/non_2x/laundry-machine-with-washing-clothing-and-linen-illustration-flat-cartoon-style-washer-with-baskets-of-linen-and-detergent-concept-of-domestic-housework-service-clipart-vector.jpg',
    Gym: 'https://media.istockphoto.com/id/1197037605/vector/fitness-center-gym-illustration.jpg?s=612x612&w=0&k=20&c=YBBUB8mYioZMxSVSmQBPZ0aj2T0m52iIPBVm-QuQjGc=',
    'Broad Cast': 'https://img.lovepik.com/free-png/20211210/lovepik-broadcast-speaker-png-image_401472556_wh1200.png',
};

const dropdownOptions = ['SG 1', 'SG 2', 'SG 3', 'SG 4'];
const HomeScreen: React.FC = () => {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const isTabletOrDesktop = width >= 768;
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [filteredItems, setFilteredItems] = useState(Object.keys(images));
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [sosVisible, setSosVisible] = useState(false);

    const handleSOSPress = () => {
        setSosVisible(true);
    };
    const closeModal = () => {
        setSosVisible(false);
    };
    
    const handleConfirmSOS = () => {
        setSosVisible(false);
        // Add further logic (like sending an emergency request) here
        console.log("SOS Triggered! Sending emergency request...");
    };
    
    const handleCancelSOS = () => {
        setSosVisible(false);
    };

const scaleAnimation = useRef(new Animated.Value(1)).current;
useEffect(() => {
    Animated.loop(
        Animated.sequence([
            Animated.timing(scaleAnimation, {
                toValue: 1.2, // Slightly increase the button size
                duration: 800,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnimation, {
                toValue: 1,
                duration: 800,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
        ])
    ).start();
}, []);
    return (
        <View style={styles.container}>
            {/* Header: Logo & Dropdown */}
            <View style={styles.headerContainer}>
                <Image
                    source={{ uri: 'https://avenuenxt.s3.ap-southeast-1.amazonaws.com/serene+grand+logo/serene_grand_cropped_image-removebg-preview.png' }}
                    style={styles.logo}
                    resizeMode="contain"
                />
                {/* Dropdown Icon Only */}
                <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)} style={styles.dropdownIconContainer}>
                    <Icon name={dropdownVisible ? 'chevron-up' : 'chevron-down'} size={13} color="#333" />
                </TouchableOpacity>
                {/* Second Logo */}
                <Image
                    source={require('../assets/images/cropped-Avenue-reality-logo.webp')}
                    style={styles.logo1}
                    resizeMode="contain"
                />
            </View>
            {/* Dropdown List (Positioned Over Images) */}
            {dropdownVisible && (
                <View style={styles.dropdownList}>
                    {dropdownOptions.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => {
                                setSelectedOption(option);
                                setDropdownVisible(false);
                            }}
                        >
                            <Text style={styles.dropdownItemText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            {/* Grid Items */}
            <ScrollView contentContainerStyle={styles.gridScroll}>
                <View style={[styles.gridContainer, { justifyContent: isTabletOrDesktop ? 'center' : 'space-between' }]}>
                    {filteredItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.gridItem, { width: isMobile ? '45%' : '21%' }]} // 2 grids for mobile, 4 grids for large screens
                            onPress={() => {
                                 if (item === 'Service Request') navigation.navigate('Maintenance');
                                else  if (item === 'GatePass') navigation.navigate('GatePass');
                                else if (item === 'Restaurant') navigation.navigate('Restaurant');
                                else if (item === 'Groceries') navigation.navigate('Grocery');
                                else if (item === 'Pharmacy') navigation.navigate('Medical');
                                else if (item === 'Club House') navigation.navigate('ClubHouse');
                                else if (item === 'Saloon') navigation.navigate('Saloon');
                                else if (item === 'Laundry') navigation.navigate('laundry');
                                else if (item === 'Gym') navigation.navigate('Gym');
                                else if (item === 'Broad Cast') navigation.navigate('BroadCast');
                            }}>
                            <Image source={{ uri: images[item] || 'https://example.com/default.jpg' }} style={styles.gridImage} />
                            <Text style={styles.gridText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
<Modal
    animationType="fade"
    transparent={true}
    visible={sosVisible}
    onRequestClose={closeModal}
>
    <View style={styles.modalOverlay}>
        <View style={styles.enhancedModalContainer}>
            <Icon name="bell" size={30} color="#D32F2F" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Emergency Alert</Text>
            <Text style={styles.modalMessage}>
                Your emergency message has been successfully sent to the Admin.
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>OK</Text>
            </TouchableOpacity>
        </View>
    </View>
</Modal>



                </View>

                

            </ScrollView>
            <View style={styles.sosContainer}>
    <TouchableOpacity style={styles.sosOuterCircle } onPress={handleSOSPress} >
        <View style={styles.sosInnerCircle}>
            <Text style={styles.sosText}>SOS</Text>
        </View>
    </TouchableOpacity>
</View>





        </View>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5, // REDUCED SPACE BETWEEN HEADER AND GRID
    },
    logo: { width: 170, height: 100 },
    logo1: { width: 80, height: 50,marginRight:15 },
    dropdownIconContainer: {
        padding: 10, // Makes touchable area bigger
        marginLeft: -90, // Adjust position closer to first logo
    },
    dropdownList: {
        position: 'absolute',
        top: 90, // Move it BELOW the header but OVER the images
        left: '50%',
        transform: [{ translateX: -50 }],
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 5,
        width: 80,
        zIndex: 1000, // Bring to the front
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 10,
    },
    dropdownItem: {
        padding: 10,
        alignItems: 'center',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#333',
    },
    gridScroll: {
        paddingTop: 5, // Reducing space between header and grid
    },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
    gridItem: { marginBottom: 8, alignItems: 'center', justifyContent: 'space-around', borderRadius: 10, padding: 10, backgroundColor: 'white' },
    gridImage: { width: 90, height: 75, borderRadius: 10, backgroundColor: '#e3dfde' },
    gridText: { marginTop: 4, fontSize: 14, fontWeight: '600', color: '#4f4f4f', textAlign: 'center' },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#D32F2F',
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#B0BEC5',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginRight: 10,
    },
    sosIcon: {
        width: 30, // Adjust size of the icon
        height: 30, // Adjust size of the icon
        resizeMode: 'contain', // Keep the original aspect ratio
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#D32F2F',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sosContainer: {
        position: 'absolute',
        bottom: 20, // Position it at the bottom of the screen
        left: 20,   // Align it to the left side of the screen
        zIndex: 1000, // Make sure it floats above all other elements
    },
    sosOuterCircle: {
        width: 50, // Outer circle width (smaller size)
        height: 50, // Outer circle height
        borderRadius: 25, // Half of width/height for a perfect circle
        backgroundColor: '#E0E0E0', // Light gray border
        alignItems: 'center', // Center the inner circle horizontally
        justifyContent: 'center', // Center the inner circle vertically
        elevation: 5, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    sosInnerCircle: {
        width: 40, // Inner circle width (smaller size)
        height: 40, // Inner circle height
        borderRadius: 20, // Half of width/height for a perfect circle
        backgroundColor: '#D32F2F', // Red background for the inner circle
        alignItems: 'center', // Center the text horizontally
        justifyContent: 'center', // Center the text vertically
    },
    enhancedModalContainer: {
        width: '85%',
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 10, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
    },
    
    
    sosButton: {
        width: 40, // Set width for a round shape
        height: 40, // Set height for a round shape
        borderRadius: 30, // Half of the width/height for a perfect circle
        backgroundColor: '#D32F2F', // Emergency red background
        alignItems: 'center', // Center the text horizontally
        justifyContent: 'center', // Center the text vertically
        elevation: 10, // Add a shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    sosText: {
        color: 'white', // White text color for contrast
        fontSize: 14, // Smaller font size for the text
        fontWeight: 'bold', // Bold text for emphasis
        textTransform: 'uppercase', // Ensure the text is all caps
    },
    closeButton: {
        backgroundColor: '#D32F2F',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalIcon: {
        marginBottom: 10, // Add space between the icon and the title
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    
});
export default HomeScreen;