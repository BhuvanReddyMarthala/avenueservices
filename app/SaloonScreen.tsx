import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Modal,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SaloonScreen: React.FC = () => {
    const navigation = useNavigation();
    const [selectedService, setSelectedService] = useState<any | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const services = [
        {
            id: '1',
            name: 'Haircut',
            icon: 'https://avenuenxt.s3.ap-southeast-1.amazonaws.com/haircut.jpg',
            description: 'Get a professional haircut tailored to your style.',
            price: '₹500',
        },
        {
            id: '2',
            name: 'Shaving',
            icon: 'https://avenuenxt.s3.ap-southeast-1.amazonaws.com/shaving(1).jpg',
            description: 'A clean and smooth shave for a fresh look.',
            price: '₹300',
        },
        {
            id: '3',
            name: 'Hair Spa',
            icon: 'https://avenuenxt.s3.ap-southeast-1.amazonaws.com/hair_spa.jpg',
            description: 'Relaxing hair spa for nourishment and care.',
            price: '₹1000',
        },
        {
            id: '4',
            name: 'Beard Care',
            icon: 'https://avenuenxt.s3.ap-southeast-1.amazonaws.com/beard_care.jpg',
            description: 'Expert beard grooming and maintenance.',
            price: '₹700',
        },
        {
            id: '6',
            name: 'Facial',
            icon: 'https://avenuenxt.s3.ap-southeast-1.amazonaws.com/facial_new.jpg',
            description: 'Rejuvenating facial treatment for glowing skin.',
            price: '₹1200',
        },
        {
            id: '7',
            name: 'Nail Care',
            icon: 'https://avenuenxt.s3.ap-southeast-1.amazonaws.com/nail_care_new.jpg',
            description: 'Complete hand and foot care for a polished look.',
            price: '₹1500',
        },
        {
            id: '9',
            name: 'Hair Coloring',
            icon: 'https://avenuenxt.s3.ap-southeast-1.amazonaws.com/hair_coloring.jpg',
            description: 'Professional hair coloring with premium dyes.',
            price: '₹2000',
        },
    ];
    const bookedSlots = ["10:30 AM", "15:00 PM", "14:30 PM"]; 
    // Generate time slots dynamically from 9:00 AM to 9:00 PM, excluding 1:00 PM - 2:00 PM
const generateTimeSlots = () => {
    const timeSlots = [];
    let start = 9 * 60; // Start at 9:00 AM in minutes
    const end = 20 * 60; // End at 9:00 PM in minutes

    while (start < end) {
        const hours = Math.floor(start / 60);
        const minutes = start % 60;
        const formattedTime = `${hours}:${minutes === 0 ? "00" : "30"} ${hours < 12 ? "AM" : "PM"}`;

        // Exclude 1:00 PM to 2:00 PM
        if (!(hours === 13 || (hours === 12 && minutes === 30))) {
            timeSlots.push(formattedTime);
        }

        start += 30; // Increment by 30 minutes
    }

    return timeSlots;
};

const timeSlots = generateTimeSlots();


    const handleConfirmAppointment = () => {
        if (!selectedService || !selectedDate || !selectedTime) {
            return;
        }
        setModalVisible(true);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Home")}
                    style={styles.iconContainer}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <Text style={styles.header}>{selectedService ? selectedService.name : 'Select a Service'}</Text>

                <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.iconContainer}>
                    <Ionicons name="home" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {!selectedService ? (
                <FlatList
                    data={services}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.serviceCard}
                            onPress={() => setSelectedService(item)}
                        >
                            <ImageBackground source={{ uri: item.icon }} style={styles.serviceImageBackground}>
                                <View style={styles.serviceTextContainer}>
                                    <Text style={styles.serviceText}>{item.name}</Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <>
                    <ImageBackground source={{ uri: selectedService.icon }} style={styles.serviceDetailImage} />
                    <Text style={styles.serviceDetailDescription}>{selectedService.description}</Text>
                    <Text style={styles.serviceDetailPrice}>Price: {selectedService.price}</Text>

                    <Text style={styles.subHeader}>Select Date</Text>
                    <Calendar
                        onDayPress={(day) => setSelectedDate(day.dateString)}
                        markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: '#007BFF' } } : {}}
                        theme={{ selectedDayBackgroundColor: '#007BFF' }}
                    />

{selectedDate && (
    <>
        <Text style={styles.subHeader}>Select Time Slot</Text>
        <View style={styles.timeSlotsContainer}>
            {timeSlots.map((time) => {
                const isBooked = bookedSlots.includes(time);
                return (
                    <TouchableOpacity
                        key={time}
                        style={[
                            styles.timeSlot,
                            selectedTime === time && styles.selectedTimeSlot,
                            isBooked && styles.bookedTimeSlot, // Apply booked style
                        ]}
                        onPress={() => !isBooked && setSelectedTime(time)} // Disable click for booked slots
                        disabled={isBooked} // Prevent clicking on booked slots
                    >
                        <Text
                            style={[
                                styles.timeSlotText,
                                selectedTime === time && styles.selectedTimeSlotText,
                                isBooked && styles.bookedTimeSlotText, // Change text color for booked slots
                            ]}
                        >
                            {time}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    </>
)}



                    {selectedDate && selectedTime && (
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmAppointment}>
                            <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
                        </TouchableOpacity>
                    )}

                    {/* Success Modal */}
                    <Modal visible={modalVisible} transparent animationType="fade">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalBox}>
                                <Text style={styles.modalText}>
                                    Your appointment for {selectedService?.name} on {selectedDate} at {selectedTime} has been successfully booked.
                                </Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </>
            )}
        </ScrollView>
    );
};

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F8FA', padding: 20 },
    headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    header: { fontSize: 24, fontWeight: 'bold', color: '#333', flex: 1, textAlign: 'center' },
    iconContainer: { padding: 10 },
    serviceCard: { flex: 1, margin: 10, height: 150, borderRadius: 15, overflow: 'hidden' },
    serviceImageBackground: { flex: 1, justifyContent: 'flex-end' },
    serviceTextContainer: { backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10 },
    serviceText: { fontSize: 16, fontWeight: '700', color: '#fff', textAlign: 'center' },
    serviceDetailImage: { width: '100%', height: 200, borderRadius: 15, marginBottom: 20 },
    serviceDetailDescription: { fontSize: 16, color: '#555', marginBottom: 10 },
    serviceDetailPrice: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    subHeader: { fontSize: 18, fontWeight: 'bold', color: '#555', marginVertical: 10 },
    timeSlotsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',marginVertical:10, },
    timeSlot: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginVertical: 5,
        marginHorizontal: 5,
        backgroundColor: '#E8F0FF', // Default color for available slots
        borderWidth: 1,
        borderColor: '#007BFF',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28%', // Adjust width for better spacing
    },
    selectedTimeSlot: {
        backgroundColor: '#007BFF', // Blue for selected slot
        borderColor: '#007BFF',
    },
    selectedTimeSlotText: {
        color: "#fff",
    },
    bookedTimeSlot: {
        backgroundColor: '#CCC', // Gray for booked slot
        borderColor: '#AAA',
    },
    bookedTimeSlotText: {
        color: '#666', // Dimmed text color for booked slot
    },
    confirmButton: { marginTop: 20, backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center' },
    confirmButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalBox: { backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center', width: '80%' },
    modalText: { fontSize: 16, textAlign: 'center', marginBottom: 15 },
    modalButton: { backgroundColor: '#007BFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginTop: 10 },
    modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default SaloonScreen;
