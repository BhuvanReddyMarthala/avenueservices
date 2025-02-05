import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Icon from "react-native-vector-icons/FontAwesome";
import { Calendar } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";
import { TextField } from "@mui/material";

const categories = [
  { name: "Guest", icon: "user", value: "Guest" },
  { name: "Delivery", icon: "truck", value: "Home Delivery" },
  { name: "Cab", icon: "car", value: "Cab" },
  { name: "Visiting Help", icon: "briefcase", value: "Visiting Help" },
];

const expiryOptions = ["1 Hour", "3 Hours", "6 Hours", "12 Hours", "24 Hours"];

interface QRData {
  name: string;
  phone: string;
  category: string;
  date: string;
  time: string;
  expiry: string;
}

// Generate 24 one-hour slots
const generateTimeSlots = (selectedDate: string | null) => {
  const currentHour = new Date().getHours();
  const todayDate = new Date().toISOString().split("T")[0];
  return Array.from({ length: 24 }, (_, i) => i)
    .filter((hour) => (selectedDate === todayDate ? hour >= currentHour : true))
    .map((hour) => `${hour.toString().padStart(2, "0")}:00`);
};

const GatePassScreen = () => {

  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visitorName, setVisitorName] = useState("");
  const [visitorNameError, setVisitorNameError] = useState(false);

  const [visitorPhone, setVisitorPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [expiry, setExpiry] = useState("1 Hour");
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  const [timeSlots, setTimeSlots] = useState<string[]>(generateTimeSlots(null));
  const handleCategorySelection = (category: string) => {
    console.log("Selected category: ", category);
    setSelectedCategory(category);
    setModalVisible(true);
  };

  // ✅ FIXED: Closing bracket for `handleGenerateQR` function was missing
  const handleGenerateQR = () => {
    console.log("Generating QR Code...");

    if (!visitorName.trim()) {
      console.error("Visitor name is required");
      setVisitorNameError(true);
      Alert.alert("Error", "Visitor Name is required");
      return;
    }
    setVisitorNameError(false);

    if (!selectedDate || !selectedTime) {
      console.error("Date and Time selection required");
      Alert.alert("Error", "Please select a date and time");
      return;
    }

    if (!selectedCategory) {
      console.error("Category selection required");
      Alert.alert("Error", "Please select a category");
      return;
    }

    const qrDetails: QRData = {
      name: visitorName,
      phone: visitorPhone || "Not Provided",
      category: selectedCategory,
      date: selectedDate,
      time: selectedTime,
      expiry,
    };

    console.log("Generated QR Data: ", qrDetails);
    setQrData(qrDetails);
    setModalVisible(false);
    setQrModalVisible(true);
  };

  return (
    <ScrollView style={styles.screen}>


      <View style={styles.header}>



      <TouchableOpacity
    style={styles.backButtonContainer} // New style to make it a larger tap area
    onPress={() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        Alert.alert("No previous screen", "You are already at the first screen.");
      }
    }}
  >
    <Icon name="arrow-left" size={24} color="#333" />
  </TouchableOpacity>



        <Text style={styles.headerTitle}>Gate Pass</Text>
      </View>

      <Text style={styles.label}></Text>
      <View style={styles.categoryGrid}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={styles.categoryItem}
            onPress={() => handleCategorySelection(item.value)}
          >
            <Icon name={item.icon} size={30} color="#333" />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedCategory}</Text>
            <TextField
              label="Visitor Name"
              variant="outlined"
              fullWidth
              required
              value={visitorName}
              onChange={(e) => {
                setVisitorName(e.target.value);
                setVisitorNameError(false); // Reset error when user starts typing
              }}
              error={visitorNameError} // 🔹 This highlights the field in red
              helperText={visitorNameError ? "Visitor Name is required" : ""} // 🔹 This shows the error message
              // style={styles.input}
            />

            <TextField
              label="Visitor Phone (Optional)"
              variant="outlined"
              fullWidth
              value={visitorPhone}
              onChange={(e) => setVisitorPhone(e.target.value)}
              style={styles.input}
            />

            {/* Date Picker */}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(!showDatePicker)}
            >
              <Icon name="calendar" size={18} color="#333" />
              <Text style={styles.dateText}>
                {selectedDate ? selectedDate : "Select Date"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <Calendar
                minDate={new Date().toISOString().split("T")[0]} // ✅ Disable past dates
                onDayPress={(day: { dateString: string }) => {
                  setSelectedDate(day.dateString);
                  setTimeSlots(generateTimeSlots(day.dateString)); // ✅ Update time slots dynamically
                  setShowDatePicker(false);
                }}
                markedDates={
                  selectedDate
                    ? {
                        [selectedDate]: {
                          selected: true,
                          selectedColor: "#007BFF",
                        },
                      }
                    : {}
                }
                theme={{
                  selectedDayBackgroundColor: "#007BFF",
                  todayTextColor: "#FF5722",
                  arrowColor: "#007BFF",
                  textDayFontWeight: "500",
                  textMonthFontWeight: "bold",
                }}
              />
            )}

            {/* Time Slots */}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowTimeSlots(!showTimeSlots)}
            >
              <Icon name="clock-o" size={18} color="#333" />
              <Text style={styles.dateText}>
                {selectedTime ? selectedTime : "Select Time"}
              </Text>
            </TouchableOpacity>

            {showTimeSlots && (
              <View style={styles.timeSlotsContainer}>
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      selectedTime === time && styles.selectedTimeSlot,
                    ]}
                    onPress={() => {
                      setSelectedTime(time);
                      setShowTimeSlots(false);
                    }}
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
            )}

            <Text style={styles.expiryTitle}>Set Expiry</Text>

            <View style={styles.expiryOptions}>
              {["1 Hour", "3 Hours", "6 Hours", "12 Hours", "24 Hours"].map(
                (option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.expiryButton,
                      expiry === option && styles.selectedExpiry, // Highlight selected item
                    ]}
                    onPress={() => setExpiry(option)}
                  >
                    <Text
                      style={[
                        styles.expiryText,
                        expiry === option && styles.selectedExpiryText,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleGenerateQR}>
              <Text style={styles.buttonText}>Generate QR Code</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      {/* ✅ Fix: Properly closing JSX elements */}
      {qrData && (
        <Modal visible={qrModalVisible} transparent animationType="slide">
          <View style={styles.qrModalContainer}>
            <View style={styles.qrModalContent}>
              <Text style={styles.modalTitle}>Your Gate Pass</Text>
              <View style={styles.qrCodeWrapper}>
                <QRCode value={JSON.stringify(qrData)} size={200} />
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>👤 Name:</Text> {qrData.name}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>📞 Phone:</Text>{" "}
                  {qrData.phone}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>🏷️ Category:</Text>{" "}
                  {qrData.category}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>📅 Date:</Text> {qrData.date}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>⏰ Time:</Text> {qrData.time}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>⌛ Expiry:</Text>{" "}
                  {qrData.expiry}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setQrModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView> // ✅ Ensure that `ScrollView` is properly closed
  );
};

/** STYLES - FULL UPDATED VERSION */
const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 10,
  },
  backButtonContainer: {
    position: "absolute",
    left: 10,
    padding: 10, // Increased padding to make the touch area larger
    zIndex: 10, // Ensure it stays above other elements
  },  
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 10,
  },
  categoryItem: {
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    margin: 10,
    width: "40%",
  },
  categoryText: { fontSize: 16, marginTop: 5 },
  closeButton: {
    backgroundColor: "#d9534f",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  datePickerButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    marginTop: 10,
  },
  datePickerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  datePickerModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  datePickerText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  dateText: { fontSize: 16, color: "#333", marginLeft: 10 },
  dateTimePicker: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginBottom: 10,
  },

  detailsContainer: {
    backgroundColor: "#f9f9f9", // Light gray background for better contrast
    padding: 15, // Adds spacing inside the container
    borderRadius: 10, // Rounded corners
    width: "100%", // Ensures it takes full width
    alignItems: "flex-start", // Aligns text to the left
    marginTop: 10, // Adds spacing above the container
  },

  detailText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#333", // Dark gray for readability
  },

  detailLabel: {
    fontWeight: "bold",
    color: "#007BFF", // Blue to highlight labels
  },

  expiryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  expiryOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  expiryText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  expiryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 1,
    marginTop: 15,
    color: "#333",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f4f6f9",
    position: "relative",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1D22",
    textAlign: "center",
    flex: 1,
  },
  iconContainer: {
    position: "absolute",
    left: 16,
    padding: 8,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    marginTop: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  qrCodeWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  qrModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  qrModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  screen: { flex: 1, backgroundColor: "#f4f6f9", padding: 20 },
  selectedExpiry: {
    backgroundColor: "#f5f5f5",
    borderColor: "#0056b3",
    borderWidth: 2,
    color: "#fff",
  },
  selectedExpiryText: {
    fontWeight: "bold",
  },
  selectedTimeSlot: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  selectedTimeSlotText: {
    color: "#fff",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginVertical: 10,
  },
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  timePickerText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  timeSlot: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    maxWidth: "30%",
  },
  timeSlotText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default GatePassScreen;