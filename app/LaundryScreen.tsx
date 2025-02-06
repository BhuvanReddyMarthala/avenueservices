import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Modal,
    useWindowDimensions,
    ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const LaundryScreen: React.FC = () => {
    const navigation = useNavigation();
    const [selectedService, setSelectedService] = useState<any | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { width } = useWindowDimensions();
    const scrollViewRef = useRef<ScrollView>(null);

    // 🔹 Responsive Check
    const isMobile = width < 768;
    const iconSize = isMobile ? 22 : 28; // Dynamic icon size

    // 🔹 Laundry Services Data
    const services = [
        { id: '1', name: 'Wash & Dry', price: 50, image: 'https://i.pinimg.com/736x/37/f8/3b/37f83b5a28f151e655d0f95213b8d10c.jpg', description: 'Complete washing service for clothes.' },
        { id: '2', name: 'Wash & Iron ', price: 30, image: 'https://img.freepik.com/premium-vector/laundry-illustration-washing-machine-with-iron-ironing-board-clean-clothes_600323-89.jpg', description: 'Neatly pressed and wrinkle-free clothes.' },
        { id: '3', name: 'Dry Cleaning', price: 120, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcVFdabz-5Cn_HsAMBg51zGCguA2XDTQz8LrC5vrTuwiVp6sGp2bJxXEfXx6zLQ65g8_w&usqp=CAU', description: 'Professional dry cleaning for delicate fabrics.' },
        { id: '4', name: 'Express Service', price: 170, image: 'https://static.vecteezy.com/system/resources/previews/011/427/726/non_2x/express-laundry-services-concept-illustration-free-vector.jpg', description: 'Removes tough stains and restores clothing.' },
    ];

    if (selectedService) {
        return (
            <View style={styles.container}>
                {/* 🔹 Custom Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setSelectedService(null)} style={styles.iconContainer}>
                        <Icon name="arrow-left" size={iconSize} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{selectedService.name}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.iconContainer}>
                        <Icon name="home" size={iconSize} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Show Price and Description */}
                <View style={styles.serviceDetails}>
                    <Text style={styles.servicePrice}>₹{selectedService.price}</Text>
                    <Text style={styles.serviceDescription}>{selectedService.description}</Text>
                </View>

                <Text style={styles.subHeader}>Select a Date</Text>

                <View style={styles.calendarWrapper}>
                    <Calendar
                        onDayPress={(day) => setSelectedDate(day.dateString)}
                        markedDates={
                            selectedDate ? { [selectedDate]: { selected: true, selectedColor: "#6c63ff", selectedTextColor: "#fff" } } : {}
                        }
                        theme={{
                            backgroundColor: "transparent",
                            calendarBackground: "transparent",
                            textSectionTitleColor: "#333",
                            selectedDayBackgroundColor: "#6c63ff",
                            selectedDayTextColor: "#fff",
                            todayTextColor: "#6c63ff",
                            arrowColor: "#6c63ff",
                            monthTextColor: "#333",
                            textDayFontWeight: "500",
                            textMonthFontWeight: "bold",
                            textDayHeaderFontWeight: "600",
                            textDayFontSize: 16,
                            textMonthFontSize: 18,
                            textDayHeaderFontSize: 14,
                        }}
                        style={styles.calendar}
                    />
                </View>

                {selectedDate && (
                    <View style={styles.bookingDetails}>
                        <Text style={styles.confirmText}>Booking for:</Text>
                        <Text style={styles.serviceName}>{selectedService.name}</Text>
                        <Text style={styles.dateText}>Date: {selectedDate}</Text>

                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* 🔹 Booking Confirmation Modal */}
                <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Booking Confirmation</Text>
                            <Text style={styles.modalText}>
                                You are booking <Text style={{ fontWeight: 'bold' }}>{selectedService?.name}</Text> on <Text style={{ fontWeight: 'bold' }}>{selectedDate}</Text>.
                            </Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                    <Icon name="times-circle" size={iconSize} color="#fff" />
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.confirmModalButton}
                                    onPress={() => {
                                        setModalVisible(false);
                                        setSelectedService(null);
                                        setSelectedDate(null);
                                        navigation.navigate("Home")
                                    }}
                                >
                                    <Icon name="check-circle" size={iconSize} color="#fff" />
                                    <Text style={styles.confirmButtonText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }}>
            {/* 🔹 Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
                    <Icon name="arrow-left" size={iconSize} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Laundry Services</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.iconContainer}>
                    <Icon name="home" size={iconSize} color="#333" />
                </TouchableOpacity>
            </View>

            {/* 🔹 List of Laundry Services */}
            <FlatList
    key={'grid-view'}
    data={services}
    keyExtractor={(item) => item.id}
    numColumns={2}
    columnWrapperStyle={styles.serviceRow}
    renderItem={({ item }) => (
        <TouchableOpacity 
            style={styles.serviceCard} 
            onPress={() => setSelectedService(item)}
        >
            <ImageBackground 
    source={{ uri: item.image }} 
    style={styles.serviceImage} 
    imageStyle={{ borderRadius: 0, resizeMode: 'cover' }} // Ensures full image is displayed
/>
            <Text style={styles.serviceTextBelow}>{item.name}</Text>
        </TouchableOpacity>
    )}
/>


        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', paddingHorizontal: 15 },

    // 🔹 Header Styles (Aligned Properly)
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        elevation: 2,
    },
    iconContainer: {
        padding: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        flex: 1, // Ensures proper centering of title
    },

    // 🔹 Service Grid (Two Columns, Properly Aligned)
    serviceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        marginVertical: 10,
    },
    serviceCard: {
        width: "45%", // Fixes two-column layout
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        padding: 10,
        elevation: 3, // Small shadow for better visibility
        marginBottom: 15, // Adds spacing between rows
    },
    serviceImage: {
        width: 100, // Consistent size
        height: 100,
        borderRadius: 10,
        resizeMode: "cover",
    },
    serviceTextBelow: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginTop: 10,
    },

    // 🔹 Calendar Properly Centered
    calendarWrapper: {
        alignItems: "center",
        marginVertical: 20,
    },
    calendar: {
        borderRadius: 15,
        elevation: 3,
        backgroundColor: "#fff",
        width: "95%", // Ensures proper width on screens
    },

    // 🔹 Booking Details (Fixed Alignment)
    bookingDetails: {
        marginTop: 12,
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        elevation: 3,
    },
    confirmButton: {
        marginTop: 15,
        backgroundColor: "#007BFF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        width: "80%", // Ensures proper alignment
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },

    // 🔹 Modal (Centered Properly)
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    cancelButton: {
        backgroundColor: "#FF3B30",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        flex: 1,
        marginRight: 10,
    },
    confirmModalButton: {
        backgroundColor: "#007BFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        flex: 1,
    },
    serviceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    servicePrice: {
        fontSize: 14,
        color: '#FFD700', // 🔹 Gold color for price
        fontWeight: 'bold',
    },
    subHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
        marginVertical: 15,
        textAlign: 'center',
    },
    serviceDetails: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 10,
        elevation: 3,
        alignItems: 'center',
    },
    serviceDescription: {
        fontSize: 10,
        color: '#777',
        marginTop: 10,
        textAlign: 'center',
    },


});



export default LaundryScreen;
