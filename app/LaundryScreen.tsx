import React, { useState,useEffect } from 'react';
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
import { useNavigation, } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const LaundryScreen: React.FC = () => {
    const navigation = useNavigation();
    const [selectedService, setSelectedService] = useState<any | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const [numColumns, setNumColumns] = useState(isMobile ? 2 : 4);
    const [listKey, setListKey] = useState(String(numColumns)); // Forces re-render when changing layout
    useEffect(() => {
        const newNumColumns = isMobile ? 1 : 4;
        if (newNumColumns !== numColumns) {
            setNumColumns(newNumColumns);
            setListKey(String(newNumColumns)); // Ensures re-rendering
        }
    }, [width]);



    // 🔹 Laundry Services Data
    const services = [
        { id: '1', name: 'Washing', price: 50, image: 'https://avenuenxt.s3.ap-southeast-1.amazonaws.com/laundry_washing_clipart.jpg', description: 'Complete washing service for clothes.' },
        { id: '2', name: 'Ironing', price: 30, image: 'https://avenuenxt.s3.ap-southeast-1.amazonaws.com/ironing_clipart.jpg', description: 'Neatly pressed and wrinkle-free clothes.' },
        { id: '3', name: 'Dry Cleaning', price: 120, image: 'https://media.istockphoto.com/id/526560652/vector/dry-cleaning-clothes-hanger-shirt-concept.jpg?s=612x612&w=0&k=20&c=mF8ef3vs-MxvP1__JDj_UmFfI-iM1bFuZ8jYGt1s1Ys=', description: 'Professional dry cleaning for delicate fabrics.' },
        { id: '4', name: 'Stain Removal', price: 70, image: 'https://static.vecteezy.com/system/resources/previews/003/381/050/non_2x/stain-removal-blue-and-yellow-rgb-color-icon-vector.jpg', description: 'Removes tough stains and restores clothing.' },
    ];

    if (selectedService) {
        // 📌 Show Calendar when a service is selected
        return (
            
            <View style={styles.container}>
                {/* 🔹 Custom Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setSelectedService(null)} style={styles.iconContainer}>
                        <Icon name="arrow-left" size={22} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{selectedService.name}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.iconContainer}>
                        <Icon name="home" size={22} color="#333" />
                    </TouchableOpacity>
                </View>
                {/* <FlatList
                key={listKey} // ✅ Forces re-render when switching views
                data={services}
                keyExtractor={(item) => item.id}
                numColumns={numColumns} // ✅ Dynamically set columns
                columnWrapperStyle={numColumns > 1 ? styles.serviceRow : undefined}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.serviceCard, { width: numColumns === 1 ? "100%" : "22%" }]}
                        onPress={() => setSelectedService(item)}
                    >
                        <ImageBackground
                            source={{ uri: item.image }}
                            style={styles.serviceImage}
                            imageStyle={{ borderRadius: 10 }}
                        >
                     <View style={styles.optionOverlay}>
                            <View style={styles.overlay}>
                                <Text style={styles.serviceText}>{item.name}</Text>
                            </View>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                )}
            /> */}

                {/* Show Price and Description */}
                <View style={styles.serviceDetails}>
                    <Text style={styles.servicePrice}>₹{selectedService.price}</Text>
                    <Text style={styles.serviceDescription}>{selectedService.description}</Text>
                </View>

                <Text style={styles.subHeader}>Select a Date</Text>

                <Calendar
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                    markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: '#007BFF' } } : {}}
                    theme={{
                        selectedDayBackgroundColor: '#007BFF',
                        todayTextColor: '#FF5722',
                        arrowColor: '#007BFF',
                        textDayFontWeight: '500',
                        textMonthFontWeight: 'bold',
                    }}
                />

                {selectedDate && (
                    <View style={styles.bookingDetails}>
                        <Text style={styles.confirmText}>Booking for:</Text>
                        <Text style={styles.serviceName}>{selectedService.name}</Text>
                        <Text style={styles.dateText}>Date: {selectedDate}</Text>

                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={() => setModalVisible(true)} // Open Modal instead of alert
                        >
                            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                        </TouchableOpacity>

                    </View>
                )}
                

<Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
>
    <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Booking Confirmation</Text>
            <Text style={styles.modalText}>
                You are booking <Text style={{ fontWeight: 'bold' }}>{selectedService?.name}</Text> on <Text style={{ fontWeight: 'bold' }}>{selectedDate}</Text>.
            </Text>

            <View style={styles.modalButtons}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.confirmModalButton}
                    onPress={() => {
                        setModalVisible(false);
                        setSelectedService(null);
                        setSelectedDate(null);
                    }}
                >
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
        <ScrollView style={styles.container}>

            {/* 🔹 Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
                    <Icon name="arrow-left" size={22} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Laundry Services</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.iconContainer}>
                    <Icon name="home" size={22} color="#333" />
                </TouchableOpacity>
            </View>

            {/* 🔹 List of Laundry Services as Cards */}
            <FlatList
                key={selectedService ? 'calendar-view' : 'grid-view'} // ✅ Forces re-render when switching views
                data={services}
                keyExtractor={(item) => item.id}
                numColumns={2} // ✅ Keeps a fixed grid layout
                columnWrapperStyle={styles.serviceRow}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.serviceCard}
                        onPress={() => setSelectedService(item)}
                    >
                        <ImageBackground
                            source={{ uri: item.image }}
                            style={styles.serviceImage}
                            imageStyle={{ borderRadius: 15 }}
                        >
                            <View style={styles.overlay}>
                                <Text style={styles.serviceText}>{item.name}</Text>
                                {/* <Text style={styles.servicePrice}>₹{item.price}</Text> */}
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                )}
            />

        
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F8FA', padding: 15 },

    // 🔹 Header Styles
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
    },

    // 🔹 Services in Grid (Two Columns)
    serviceRow: {
        justifyContent: 'space-between',
    },
    serviceCard: {
        flex: 1,
        margin: 8,
        height: 140,
        borderRadius: 15,
        overflow: 'hidden',
    },
    serviceImage: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    optionOverlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10 },

    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 🔹 Dark overlay for better readability
        padding: 10,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
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

    // 🔹 Calendar Page Styles
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
        fontSize: 14,
        color: '#777',
        marginTop: 10,
        textAlign: 'center',
    },
    bookingDetails: {
        marginTop: 20,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 3,
    },
    confirmText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    dateText: {
        fontSize: 14,
        color: '#007BFF',
        marginVertical: 10,
    },
    confirmButton: {
        marginTop: 15,
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    modalText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#555',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    confirmModalButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
    },
    
});

export default LaundryScreen;
