import React, { useState,useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Alert,
    Modal,
    useWindowDimensions,
} from 'react-native';
import { Calendar,DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';



const ClubHouseScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [selectedOption, setSelectedOption] = useState<any | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { width } = useWindowDimensions();
    const isMobile = width < 768; // Detect mobile or window
    const [numColumns, setNumColumns] = useState(isMobile ? 1 : 3); // Default value
    const [listKey, setListKey] = useState(String(numColumns));
    useEffect(() => {
        const newNumColumns = width < 768 ? 1 : 3;
        if (newNumColumns !== numColumns) {
            setNumColumns(newNumColumns);
            setListKey(String(newNumColumns)); // Change key to force re-render
        }
    }, [width]);

    type RootStackParamList = {
        Home: undefined;
        ClubHouse: undefined;
      };
      
      type NavigationProp = StackNavigationProp<RootStackParamList, 'ClubHouse'>;
      
    
      
    // List of screens and party halls
    const options = [
        {
            id: '1',
            name: 'Screen 1',
            description: 'Large screen for movies or presentations.',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlYwZv26XNYzHfS7RcXz46aOEFT5XyudtXJQ&s',
        },
        {
            id: '2',
            name: 'Screen 2',
            description: 'Medium-sized screen for casual gatherings.',
            image: 'https://www.thespruce.com/thmb/I65rNGaSWVaRgnwj2QamIGxb2hU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1295944148-59e6a06bd83b4bb7be0da8d954c99efe.jpg',
        },
        {
            id: '3',
            name: 'Party Hall 1',
            description: 'Spacious party hall for large events.',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2mjpNXsQYQVd2vHE92_6cjoWuuWN51AP4fg&s',
        },
        {
            id: '4',
            name: 'Party Hall 2',
            description: 'Elegant hall for weddings and celebrations.',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzvutsmXwaI5iWdZHMEx07JdI8VxYfo9GN1g&s',
        },
    ];
    const handleDayPress = (day: DateData) => {
        setSelectedDate(day.dateString);
      };
      

    // Generate time slots dynamically from 9:00 AM to 9:00 PM
    const generateTimeSlots = () => {
        const timeSlots = [];
        let start = 9 * 60; // Start at 9:00 AM in minutes
        const end = 21 * 60; // End at 9:00 PM in minutes
        while (start <= end) {
            const hours = Math.floor(start / 60);
            const minutes = start % 60;
            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}`;
            timeSlots.push(formattedTime);
            start += 30; // Increment by 30 minutes
        }
        return timeSlots;
    };

    const timeSlots = generateTimeSlots();

    if (!selectedOption) {
        // **Select a Screen or Party Hall Page**
        return (
            <View style={styles.container}>
                {/* Back & Home Buttons */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    <Text style={styles.header}>Select a Screen or Party Hall</Text>

                    <TouchableOpacity onPress={() => navigation.navigate("Home")} >
                        <Ionicons name="home" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={options}
                    key={listKey} // Force re-render when numColumns changes
                    numColumns={numColumns}
                    columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.optionCard, { width: numColumns === 1 ? "100%" : "30%" }]}
                            onPress={() => setSelectedOption(item)}
                        >
                            <ImageBackground
                                source={{ uri: item.image }}
                                style={styles.optionImageBackground}
                                imageStyle={{ borderRadius: 10 }}
                            >
                                <View style={styles.optionOverlay}>
                                    <Text style={styles.optionTitle}>{item.name}</Text>
                                    <Text style={styles.optionDescription}>{item.description}</Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    )}
                />
            </View>
        );
    }

    // **Booking Page**
    return (
        <ScrollView style={styles.container}>
            {/* Back & Home Buttons */}
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedOption(null); // Return to selection page
                        setSelectedDate(null);
                        setSelectedTime(null);
                    }}
                  
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <Text style={styles.header}>{selectedOption.name}</Text>

                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="home" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ImageBackground
                source={{ uri: selectedOption.image }}
                
                imageStyle={{ borderRadius: 10 }}
            />
            <Text>{selectedOption.description}</Text>

            <Text >Select Date</Text>
            <Calendar onDayPress={handleDayPress} />;

            {selectedDate && (
                <>
                    <Text >Selected Date: {selectedDate}</Text>
                    <Text >Select Time Slot</Text>
                    <View style={styles.timeSlotsContainer}>
                        {timeSlots.map((time) => (
                            <TouchableOpacity
                                key={time}
                                style={[
                                    styles.timeSlot,
                                    selectedTime === time && styles.selectedTimeSlot,
                                ]}
                                onPress={() => setSelectedTime(time)}
                            >
                                <Text
                                    style={[
                                        styles.timeSlotText,
                                        selectedTime === time && styles.selectedTimeSlotText,
                                    ]}
                                >
                                    {time}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}

            {selectedDate && selectedTime && (
               <TouchableOpacity
               style={styles.confirmButton}
               onPress={() => {
                   setModalVisible(true); // Show modal
                   setTimeout(() => {
                       setModalVisible(false); // Auto-close modal after 2 seconds
                       setSelectedOption(null); // Reset selection
                       setSelectedDate(null);
                       setSelectedTime(null);
                   }, 2000);
               }}
           >
               <Text style={styles.confirmButtonText}>Confirm Booking</Text>
           </TouchableOpacity>
           
           
            )}
            
            {modalVisible && (
    <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Booking Successful!</Text>
            </View>
        </View>
    </Modal>
)}



        </ScrollView>
        
        
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainer: { padding: 8 },
    row: { justifyContent: "space-between" }, // For window view (3 per row)
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    backButton: {
        padding: 8,
        backgroundColor: '#007BFF',
        borderRadius: 50,
        marginRight: 10,
    },
    optionCard: {
        marginVertical: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    optionImageBackground: {
        height: 200,
        justifyContent: 'flex-end',
    },
    optionOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    optionDescription: {
        fontSize: 14,
        color: '#fff',
    },
    timeSlotsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginVertical: 10,
    },
    timeSlot: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#E8F0FF',
        borderRadius: 20,
        margin: 5,
        borderWidth: 1,
        borderColor: '#007BFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedTimeSlot: {
        backgroundColor: '#007BFF',
        borderColor: '#007BFF',
    },
    timeSlotText: {
        color: '#007BFF',
        fontSize: 14,
        fontWeight: '600',
    },
    selectedTimeSlotText: {
        color: '#fff',
    },
    confirmButton: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green',
    },
    modalText: {
        fontSize: 16,
        marginVertical: 5,
    },
    modalItem: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#007BFF',
    },
    modalButtons: {
        flexDirection: 'row',
        marginTop: 20,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    cancelButton: {
        backgroundColor: 'red',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ClubHouseScreen;
