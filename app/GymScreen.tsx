import React, { useState ,useRef, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal,ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const timeSlots = [
    "06:00 AM - 07:00 AM",
    "07:00 AM - 08:00 AM",
    "08:00 AM - 09:00 AM",
    "05:00 PM - 06:00 PM",
    "06:00 PM - 07:00 PM",
    "07:00 PM - 08:00 PM"
];

const GymScreen: React.FC = () => {
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const scrollViewRef = useRef<ScrollView>(null);


    const handleConfirmBooking = () => {
        setModalVisible(true);
    };

    return (
        <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>


        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.title}>Select a Date</Text>

            {/* Calendar View */}
            <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: "#007BFF" } } : {}}
                theme={{
                    selectedDayBackgroundColor: "#007BFF",
                    todayTextColor: "#007BFF",
                    arrowColor: "#007BFF",
                    textMonthFontWeight: "bold",
                    textDayFontWeight: "bold",
                    textDayHeaderFontWeight: "bold",
                }}
            />

            {/* Time Slots */}
            {selectedDate && (
                <>
                    <Text style={styles.subTitle}>Select a Time Slot</Text>
                    <View style={styles.slotContainer}>
                        {timeSlots.map((slot, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.slot,
                                    selectedSlot === slot ? styles.selectedSlot : {},
                                ]}
                                onPress={() => setSelectedSlot(slot)}
                            >
                                <Text
                                    style={[
                                        styles.slotText,
                                        selectedSlot === slot ? styles.selectedSlotText : {},
                                    ]}
                                >
                                    {slot}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Confirm Button */}
                    {selectedSlot && (
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
                            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                        </TouchableOpacity>
                    )}
                </>
            )}

            {/* Booking Confirmation Modal */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Booking Confirmed!</Text>
                        <Text style={styles.modalText}>Your gym slot for {selectedDate} at {selectedSlot} has been confirmed.</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    backButton: {
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10,
        padding: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 20,
        color: "#333",
    },
    subTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
        color: "#333",
    },
    slotContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    slot: {
        backgroundColor: "#F0F0F0",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        margin: 8,
    },
    selectedSlot: {
        backgroundColor: "#007BFF",
    },
    slotText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "bold",
    },
    selectedSlotText: {
        color: "#fff",
    },
    confirmButton: {
        backgroundColor: "#007BFF",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    confirmButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        width: "80%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    modalText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    modalButton: {
        backgroundColor: "#007BFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    modalButtonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
});

export default GymScreen;