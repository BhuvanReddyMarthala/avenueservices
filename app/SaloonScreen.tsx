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
            icon: 'https://static.vecteezy.com/system/resources/thumbnails/019/525/238/small/cartoon-flat-style-drawing-handsome-bearded-man-is-looking-forward-while-having-his-hair-cut-by-hairdresser-at-barbershop-grooming-of-real-man-successful-business-graphic-design-illustration-vector.jpg',
            description: 'Get a professional haircut tailored to your style.',
            price: '₹500',
        },
        {
            id: '2',
            name: 'Shaving',
            icon: 'https://static.vecteezy.com/system/resources/thumbnails/019/525/344/small_2x/graphic-flat-design-drawing-grooming-of-real-man-side-view-of-bearded-man-getting-beard-haircut-at-hairdresser-while-sitting-in-chair-at-barbershop-professional-barber-cartoon-illustration-vector.jpg',
            description: 'A clean and smooth shave for a fresh look.',
            price: '₹300',
        },
        {
            id: '3',
            name: 'Hair Spa',
            icon: 'https://cdni.iconscout.com/illustration/premium/thumb/hairdresser-washes-client-hair-before-cutting-illustration-download-in-svg-png-gif-file-formats--washing-woman-getting-job-fashion-at-salon-pack-spa-illustrations-3937390.png',
            description: 'Relaxing hair spa for nourishment and care.',
            price: '₹1000',
        },
        // {
        //     id: '4',
        //     name: 'Beard Care',
        //     icon: 'https://avenuenxt.s3.ap-southeast-1.amazonaws.com/beard_care.jpg',
        //     description: 'Expert beard grooming and maintenance.',
        //     price: '₹700',
        // },
        {
            id: '6',
            name: 'Facial',
            icon: 'https://media.istockphoto.com/id/1500808152/vector/young-woman-enjoying-relaxing-facial-massage-treatment-woman-lying-on-back-while-masseur.jpg?s=612x612&w=0&k=20&c=iHTqcUJCDIfirPVubk6PP796gdvkEYBAaZuSg7qutNg=',
            description: 'Rejuvenating facial treatment for glowing skin.',
            price: '₹1200',
        },
        {
            id: '7',
            name: 'Nail Care',
            icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRseZtw7NZWNekcQTBGtdlQPjk_17dwp9njnglRH9UzF281_l8q3kqZySjrErm-8jCzY1w&usqp=CAU',
            description: 'Complete hand and foot care for a polished look.',
            price: '₹1500',
        },
        {
            id: '9',
            name: 'Hair Coloring',
            icon: 'https://static.vecteezy.com/system/resources/thumbnails/025/390/664/small/hairdresser-cutting-womans-hair-illustration-vector.jpg',
            description: 'Professional hair coloring with premium dyes.',
            price: '₹2000',
        },
    ];
    const bookedSlots = ["10:30 AM", "3:00 PM", "4:00 PM"]; 
    // Generate time slots dynamically from 9:00 AM to 9:00 PM, excluding 1:00 PM - 2:00 PM
    const generateTimeSlots = () => {
        const timeSlots = [];
        let start = 9; // Start at 9 AM
        const end = 20; // End at 8 PM
    
        while (start < end) {
            let period = start < 12 ? "AM" : "PM";
            let displayHour = start > 12 ? start - 12 : start; // Convert 13 to 1 PM
    
            // Exclude 1:00 PM
            if (start !== 13) {
                timeSlots.push(`${displayHour}:00 ${period}`);
            }
    
            start += 1; // Increment by 1 hour
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

                <Text style={styles.header}>{selectedService ? selectedService.name : 'Book a Service'}</Text>

                <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.iconContainer}>
                    <Ionicons name="home" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {!selectedService ? (
               <FlatList
               data={services}
               keyExtractor={(item) => item.id}
               numColumns={2} // Two-column layout
               columnWrapperStyle={styles.serviceRow}
               renderItem={({ item }) => (
                   <TouchableOpacity 
                       style={styles.serviceCard} 
                       onPress={() => setSelectedService(item)}
                   >
                       <ImageBackground 
                           source={{ uri: item.icon }} 
                           style={styles.serviceImageBackground} 
                           imageStyle={{ borderRadius: 10 }} // Consistent border radius
                       />
                       <Text style={styles.serviceTextBelow}>{item.name}</Text> 
                   </TouchableOpacity>
               )}
           />
           
           
            
            ) : (
                <>
                    <ImageBackground source={{ uri: selectedService.icon }} style={styles.serviceDetailImage} />
                    <Text style={styles.serviceDetailDescription}>{selectedService.description}</Text>
                    <Text style={styles.serviceDetailPrice}>Price: {selectedService.price}</Text>

                    <Text style={styles.sectionTitle}>Select Date</Text>
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
    <>
        <Text style={styles.sectionTitle}>Select Time Slot</Text>
        <View style={styles.timeSlotGrid}>
            {timeSlots.map((time, index) => {
                const isBooked = bookedSlots.includes(time);
                return (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.timeSlot,
                            selectedTime === time && styles.selectedTimeSlot,
                            isBooked && styles.bookedTimeSlot,
                        ]}
                        onPress={() => !isBooked && setSelectedTime(time)}
                        disabled={isBooked}
                    >
                        <Text
                            style={[
                                styles.timeSlotText,
                                selectedTime === time && styles.selectedTimeText,
                                isBooked && styles.bookedTimeSlotText,
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
    container: { flex: 1, backgroundColor: 'white', padding: 20 },
    headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    header: { fontSize: 24, fontWeight: 'bold', color: '#333', flex: 1, textAlign: 'center' },
    iconContainer: { padding: 10 },
    serviceCard: {
        flex: 1,
        margin: 10,
        alignItems: 'center', // Ensure content is centered
        justifyContent: 'flex-start', // Aligns items properly
        width: '45%', // Ensures consistent width
    },
    serviceImageBackground: {
        width: 100, // Same width as Home.tsx
        height: 100, // Same height as Home.tsx
        borderRadius: 10, // Same border radius for consistency
        resizeMode: 'cover', // Ensure images are properly scaled
        backgroundColor: '#e3dfde', // Placeholder color
    },
    calendarWrapper: {
        alignItems: "center", // Centers the calendar
        marginVertical: 20,
    },

    // Calendar Styling
    calendar: {
        borderRadius: 15, // Rounded edges
        elevation: 0, // Shadow for better visibility
        backgroundColor: "transparent", // White background for consistency
        width: "100%", // Full width
    },
    serviceTextContainer: { backgroundColor: 'white', padding: 10 },
    serviceText: { fontSize: 16, fontWeight: '700', color: '#fff', textAlign: 'center' },
    serviceDetailImage: { width: '100%', height: 200, borderRadius: 15, marginBottom: 20 },
    serviceDetailDescription: { fontSize: 16, color: '#555', marginBottom: 10 },
    serviceDetailPrice: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    subHeader: { fontSize: 18, fontWeight: 'bold', color: '#555', marginVertical: 10 },
    timeSlot: {
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: 5,
        width: "28%", // Adjust width for even spacing
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    selectedTimeSlot: {
        borderColor: "#6c63ff",
        backgroundColor: "#6c63ff",
    },

    selectedTimeSlotText: {
        color: "#fff",
    },
    timeSlotText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },
    serviceRow: {
        justifyContent: 'space-between', // Ensures equal spacing between columns
        marginBottom: 10, // Adds spacing between rows
    },
    
    bookedTimeSlot: {
        backgroundColor: "#CCC",
        borderColor: "#AAA",
    },
    bookedTimeSlotText: {
        color: "#666",
    },
    confirmButton: { marginTop: 20, backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center' },
    confirmButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalBox: { backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center', width: '80%' },
    modalText: { fontSize: 16, textAlign: 'center', marginBottom: 15 },
    modalButton: { backgroundColor: '#007BFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginTop: 10 },
    modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    serviceTextBelow: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 8, // Ensures space between image and text
        width: 100, // Forces text to fit within image width
        height: 40, // Ensures uniform text box height
        overflow: 'hidden', // Prevents excessive wrapping
        alignSelf: 'center',
    },    
    calendarContainer: {
        borderRadius: 10,
        overflow: "hidden",
        elevation: 3,
        // backgroundColor: "transperent",
        marginBottom: 20,
        width: "90%",
        alignSelf: "center",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginVertical: 10,
        textAlign: "center",
    },
    // calendarTheme: {
        
       
    //     textSectionTitleColor: "#007bff",
    //     selectedDayBackgroundColor: "#007bff",
    //     selectedDayTextColor: "#ffffff",
    //     todayTextColor: "#007bff",
    //     dayTextColor: "#333",
    //     textDisabledColor: "#d9e1e8",
    //     dotColor: "#007bff",
    //     arrowColor: "#007bff",
    //     monthTextColor: "#333",
    //     textDayFontWeight: "500",
    //     textMonthFontWeight: "bold",
    //     textDayHeaderFontWeight: "600",
    //     textDayFontSize: 16,
    //     textMonthFontSize: 18,
    //     textDayHeaderFontSize: 14,
    // },
    timeSlotScroll: {
        maxHeight: 100,
        alignSelf: "center",
        width: "90%",
    },
    timeSlotGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
    selectedTimeText:{
        color: "#fff",
    }
    
    
});

export default SaloonScreen;
