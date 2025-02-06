import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";

// Services with images
const services = [
  { id: "1", name: "Plumber", image: "https://st5.depositphotos.com/20923550/70478/v/450/depositphotos_704781766-stock-illustration-plumber-plumber-uniform-vector-illustration.jpg" },
  { id: "2", name: "Electrician", image: "https://t4.ftcdn.net/jpg/08/33/30/49/360_F_833304917_fvkwLj50cEuUSFV9kbq9GX6HaxFpkdgp.jpg" },
  { id: "3", name: "Carpenter", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcZCG9W50Jda_7UlBA9dx_Cep2sNvo9AWH0FN8YKoU9uLGoIUCIgRvw2VcuVzM5kSQc0M&usqp=CAU" },
  { id: "4", name: "Maid", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh_ZTrJQLdGtnJ0K3PVNma3GgiF-7NXZ0jFw&s" },
  
];

// Hourly Time Slots
const timeSlots = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM", "8:00 PM"];

const MaintenanceScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedService, setSelectedService] = useState<{ name: string; image: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Confirm request
  const confirmRequest = () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      Alert.alert("Selection Required", "Please select a service, date, and time slot.");
      return;
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Book a Service</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.navButton}>
          <Ionicons name="home" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Service Grid */}
      {!selectedService && (
   <ScrollView contentContainerStyle={styles.gridContainer}>
   {services.map((service) => (
     <TouchableOpacity 
       key={service.id} 
       style={styles.serviceTab} 
       onPress={() => setSelectedService(service)}
     >
       <Image source={{ uri: service.image }} style={styles.serviceImage} />
       <Text style={styles.serviceTextBelow}>{service.name}</Text>
     </TouchableOpacity>
   ))}
 </ScrollView>
 
      )}

      {/* Service Details */}
      {selectedService && (
        <ScrollView>
          <View style={styles.detailsContainer}>
            <Image source={{ uri: selectedService.image }} style={styles.serviceDetailImage} />
            <Text style={styles.serviceName}>{selectedService.name} Service</Text>

            {/* Date Selection */}
            <Text style={styles.sectionTitle}>Select Date</Text>
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: "#007bff" } } : {}}
            />

            {/* Time Slot Selection */}
            {selectedDate && (
              <>
                <Text style={styles.sectionTitle}>Select Time Slot</Text>
                <ScrollView style={styles.timeSlotScroll} showsVerticalScrollIndicator={true}>
                  <View style={styles.timeSlotGrid}>
                    {timeSlots.map((slot, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.timeSlot, selectedTime === slot && styles.selectedTimeSlot]}
                        onPress={() => setSelectedTime(slot)}
                      >
                        <Text style={[styles.timeSlotText, selectedTime === slot && styles.selectedTimeText]}>{slot}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </>
            )}

            {/* Confirm Button */}
            {selectedDate && selectedTime && (
              <TouchableOpacity style={styles.confirmButton} onPress={confirmRequest}>
                <Text style={styles.confirmButtonText}>Confirm Request</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      )}

      {/* Confirmation Popup */}
<Modal visible={modalVisible} transparent animationType="fade">
  <View style={styles.modalContainer}>
    <View style={styles.modalBox}>
      <Text style={styles.modalText}>
        Your request for {selectedService?.name} on {selectedDate} at {selectedTime} has been raised successfully.
      </Text>
      <TouchableOpacity
  onPress={() => {
    setModalVisible(false);
    navigation.navigate("Home");
  }}
  style={styles.modalButton}
>
  <Text style={styles.modalButtonText}>OK</Text>
</TouchableOpacity>

    </View>
  </View>
</Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff", // Blue color (same as "Confirm Request" button)
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black", // White text for better visibility
  },
  

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
  },

  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",  // Adjust width for better UI
    elevation: 5,  // Add shadow for better visibility
  },

  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },

  modalButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },


  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", padding: 10 },
  serviceTab: {
    width: "42%", // Maintain consistency with Home screen
    alignItems: "center", // Centers image and text
    marginVertical: 12, 
    marginHorizontal: 8, 
},
  
serviceImage: { 
  width: 100, // Ensuring same image size as Home.tsx
  height: 100, 
  borderRadius: 10, 
  resizeMode: "cover",
  backgroundColor: "#e3dfde",
},
serviceTextBelow: {
  fontSize: 14,
  fontWeight: "bold",
  color: "#333",
  textAlign: "center",
  marginTop: 8, // Spacing between image and text
  width: 100, // Ensuring text aligns with image width
  height: 40, // Fixed height to avoid misalignment
  overflow: "hidden", // Ensures text doesn't overflow
},
  overlay: { position: "absolute", bottom: 0, width: "100%", backgroundColor: "rgba(0, 0, 0, 0.6)", paddingVertical: 8, alignItems: "center" },
  serviceText: { fontSize: 16, fontWeight: "bold", color: "#fff" },

  detailsContainer: { padding: 20, alignItems: "center" },
  serviceDetailImage: { width: 150, height: 150, borderRadius: 10 },
  serviceName: { fontSize: 20, fontWeight: "bold", marginTop: 10 },

  timeSlotScroll: { maxHeight: 300 },
  timeSlotGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },

  timeSlot: { padding: 12, borderWidth: 1, borderRadius: 8, margin: 5, width: 100, alignItems: "center" },
  selectedTimeSlot: { backgroundColor: "#007bff" },
  timeSlotText: { fontSize: 16 },
  selectedTimeText: { color: "#fff" },

  confirmButton: { backgroundColor: "#007bff", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
  confirmButtonText: { color: "#fff", fontSize: 18 },
});

export default MaintenanceScreen;