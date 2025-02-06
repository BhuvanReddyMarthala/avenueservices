import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
  useWindowDimensions,
  FlatList,
  Platform,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Icon from "react-native-vector-icons/FontAwesome";
import { Calendar } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";
import { TextField } from "@mui/material";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import { captureRef } from "react-native-view-shot";
import { Image } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import Ionicons from "react-native-vector-icons/Ionicons";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";



const GatePassScreen = () => {
  const [step, setStep] = useState(1); // Default to Step 1 (Select Category)
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visitorName, setVisitorName] = useState("");
  const [visitorNameError, setVisitorNameError] = useState(false);
  const { width } = useWindowDimensions(); // Detect screen width
  
  

  // const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);
  
  const [visitorPhone, setVisitorPhone] = useState("");
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<{
    hours: number;
    minutes: number;
    period: string;
  } | null>(null);
  const [expiry, setExpiry] = useState("1 Hour");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const qrCodeRef = useRef<ViewShot | null>(null);
  const categories = [
    {
      name: "Guest",
      image:
        "https://www.shutterstock.com/image-vector/hotel-check-in-man-luggage-260nw-2253236591.jpg",
      value: "Issue for Guest",
    },
    {
      name: "Delivery",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPokS4qUHZgFtcdm0VwmNy-nX5qRPmM_2kuA&s",
      value: "Issue for Home Delivery",
    },
    {
      name: "Cab",
      image:
        "https://www.shutterstock.com/image-vector/taxi-car-passenger-auto-transport-600nw-2426043867.jpg",
      value: "Issue for Cab",
    },
    {
      name: " Visiting help",
      image:
        "https://img.freepik.com/free-vector/carpet-cleaning-concept-illustration_114360-24721.jpg",
      value: "Issue for Visiting Help",
    },
  ];
  
  const expiryOptions = ["1 Hour", "3 Hours", "6 Hours", "12 Hours", "24 Hours"];
    // Generate 24 one-hour slots
    const generateTimeSlots = (selectedDate: string | null) => {
      const currentHour = new Date().getHours();
      const todayDate = new Date().toISOString().split("T")[0];
      return Array.from({ length: 24 }, (_, i) => i)
        .filter((hour) => (selectedDate === todayDate ? hour >= currentHour : true))
        .map((hour) => `${hour.toString().padStart(2, "0")}:00`);
    };
    
  interface QRData {
    name: string;
    phone: string;
    category: string;
    date: string;
    time: string;
    expiry: string;
  }
  const handleTimeChange = (event: any, date?: Date) => {
    if (!date) return; // Ensure `date` is defined before using it

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format

    setSelectedTime({ hours: formattedHours, minutes, period });
  };




  const renderTimeSlots = () => {
    return timeSlots.map((time, index) => (
      <TouchableOpacity
        key={index}
        style={styles.timeSlot}
        onPress={() => {
          setSelectedTime({ hours: index, minutes: 0, period: index >= 12 ? "PM" : "AM" });
          setShowTimePicker(false); // Hide time picker when a time is selected
        }}
      >
        <Text style={styles.timeSlotText}>{time}</Text>
      </TouchableOpacity>
    ));
  };




  const numColumns = width > 800 ? 4 : 2; // 4 icons per row for desktop, 2 for mobile
  const itemSize = width / numColumns - 40; // Ensure spacing and full width

  const [timeSlots, setTimeSlots] = useState<string[]>(generateTimeSlots(null));

  const handleConfirmTime = (time: Date) => {
    setTimePickerVisible(false);

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

    setSelectedTime({ hours: formattedHours, minutes, period });
  };

  const handleTimeConfirm = (newTime: dayjs.Dayjs | null) => {
    if (!newTime) return;
    setSelectedTime({
      hours: newTime.hour() % 12 || 12, // Convert 0 to 12 for 12-hour format
      minutes: newTime.minute(),
      period: newTime.hour() >= 12 ? "PM" : "AM",
    });
    setShowTimePicker(false); // Close the modal after selection
  };

  const handleCategorySelection = (category: string) => {
    console.log("Selected category:", category);
    setSelectedCategory(category);
    setStep(2);
    console.log("Modal should be opening... Modal State:", modalVisible);
  };


    // Handle time selection from the time slots
    const handleTimeSlotSelection = (time: string) => {
      const [hours, minutes] = time.split(":");
      setSelectedTime({
        hours: parseInt(hours),
        minutes: 0, // Always set minutes to 0 for hourly selection
        period: parseInt(hours) >= 12 ? "PM" : "AM",
      });
      setShowTimePicker(false); // Close the modal after selection
    };

    
  const generateAndDownloadPDF = async (qrData: any, qrBase64: string) => {
    try {
      console.log("Generating PDF...");

      // ✅ Ensure QR data exists
      if (!qrData || !qrBase64) {
        Alert.alert("Error", "Invalid QR data, please try again.");
        return;
      }

      // ✅ Define the HTML for the PDF
      const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            .container { border: 2px solid #000; padding: 20px; border-radius: 10px; }
            .qr-code { margin-top: 20px; }
            .details { font-size: 16px; margin-top: 20px; text-align: left; }
            .label { font-weight: bold; color: #007BFF; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Gate Pass</h1>
            <div class="qr-code">
              <img src="data:image/png;base64,${qrBase64}" width="200" height="200"/>
            </div>
            <div class="details">
              <p><span class="label">👤 Name:</span> ${qrData.name}</p>
              <p><span class="label">📞 Phone:</span> ${qrData.phone}</p>
              <p><span class="label">🏷️ Category:</span> ${qrData.category}</p>
              <p><span class="label">📅 Date:</span> ${qrData.date}</p>
              <p><span class="label">⏰ Time:</span> ${qrData.time}</p>
              <p><span class="label">⌛ Expiry:</span> ${qrData.expiry}</p>
            </div>
          </div>
        </body>
      </html>
    `;

      // ✅ Generate the PDF file
      const pdfFile = await Print.printToFileAsync({ html: htmlContent });

      // ✅ Check if the PDF file was actually generated
      if (!pdfFile || !pdfFile.uri) {
        throw new Error("Failed to generate PDF.");
      }

      console.log("PDF saved at:", pdfFile.uri);

      // ✅ Define a local file path for saving the PDF
      const fileName = `GatePass_${qrData.name.replace(/\s/g, "_")}.pdf`;
      const pdfPath = `${FileSystem.documentDirectory}${fileName}`;

      // ✅ Move the generated PDF to the local file system
      await FileSystem.moveAsync({
        from: pdfFile.uri,
        to: pdfPath,
      });

      console.log("PDF moved to:", pdfPath);

      // ✅ **For Mobile:** Open Share Dialog (For Download)
      if (Platform.OS !== "web") {
        await Sharing.shareAsync(pdfPath, {
          mimeType: "application/pdf",
          dialogTitle: "Download Gate Pass",
        });
      } else {
        // ✅ **For Web:** Trigger a Download
        const downloadLink = document.createElement("a");
        downloadLink.href = pdfPath;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }

      Alert.alert("Success", "PDF has been downloaded successfully.");
    } catch (error) {
      console.error("Error generating and downloading PDF:", error);
      Alert.alert("Error", "Unable to generate and download the QR PDF.");
    }
  };

  const getBase64FromQR = async () => {
    try {
      if (!qrCodeRef.current) {
        throw new Error("QR Code reference not found.");
      }

      // ✅ Capture the QR Code View as a base64 image
      const base64 = await captureRef(qrCodeRef, {
        format: "png",
        quality: 1,
        result: "base64",
      });

      return base64;
    } catch (error) {
      console.error("Error capturing QR code:", error);
      return null;
    }
  };

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

    // Convert `selectedTime` object to a formatted string
    const formattedTime = `${selectedTime.hours}:${selectedTime.minutes
      .toString()
      .padStart(2, "0")} ${selectedTime.period}`;

    const qrDetails: QRData = {
      name: visitorName,
      phone: visitorPhone || "Not Provided",
      category: selectedCategory!,
      date: selectedDate,
      time: formattedTime, // ✅ FIX: Convert time object to string
      expiry,
    };

    console.log("Generated QR Data: ", qrDetails);
    setQrData(qrDetails);
    setModalVisible(false);
    setStep(3);

    // ✅ Clear the form after generating the QR code
    setVisitorName("");
    setVisitorPhone("");
    setSelectedDate(null);
    setSelectedTime(null);
    setExpiry("1 Hour");
  };

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.container}>
        {/* 🔹 Navigation Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={() => {
              if (step === 1) {
                navigation.goBack();
              } else {
                setStep(step - 1); // Go to the previous step
              }
            }}
          >
              <Ionicons name="arrow-back-outline" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gate Pass</Text>

          <TouchableOpacity onPress={() => navigation.navigate("Home")} >
                      <Icon name="home" size={22} color="#333" />
                    </TouchableOpacity>
        </View>



        {/* 🔹 Step 1: Category Selection */}
        {step === 1 && (
          <FlatList
            data={categories}
            numColumns={numColumns}
            keyExtractor={(item) => item.value}
            contentContainerStyle={styles.gridContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  { width: itemSize, height: itemSize },
                ]}
                onPress={() => handleCategorySelection(item.value)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.categoryImage}
                />
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* 🔹 Step 2: Form Input */}
{/* 🔹 Step 2: Form Input */}
{step === 2 && (
  <View style={styles.formContainer}>
    <Text style={styles.title}>{selectedCategory}</Text>

    {/* Visitor Name Input */}
    <TextField
      label="Visitor Name"
      value={visitorName}
      onChange={(e) => setVisitorName(e.target.value)}
      error={visitorNameError}
      helperText={visitorNameError ? "Visitor Name is required" : ""}
      style={styles.input}
    />

    {/* Visitor Phone Input */}
    <TextField
      label="Visitor Phone (Optional)"
      value={visitorPhone}
      onChange={(e) => setVisitorPhone(e.target.value)}
      style={styles.input}
    />

    {/* Calendar for Date Selection */}
    <Text style={styles.sectionTitle}>Select Date</Text>
    <Calendar
      minDate={new Date().toISOString().split("T")[0]}
      onDayPress={(day) => {
        setSelectedDate(day.dateString);
        setTimeSlots(generateTimeSlots(day.dateString)); // Update time slots based on selected date
      }}
      markedDates={
        selectedDate
          ? { [selectedDate]: { selected: true, selectedColor: "#007BFF" } }
          : {}
      }
      theme={{
        selectedDayBackgroundColor: "#007BFF",
        todayTextColor: "#00adf5",
      }}
      style={styles.calendar}
    />

    {/* Time Slots */}
    {selectedDate && (
      <>
        <Text style={styles.sectionTitle}>Select Time Slot</Text>
        <View style={styles.timeSlotGrid}>
          {timeSlots.map((time, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeSlotItem,
                selectedTime?.hours === index ? styles.selectedTimeSlot : {},
              ]}
              onPress={() => handleTimeSlotSelection(time)}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  selectedTime?.hours === index ? styles.selectedTimeSlotText : {},
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </>
    )}

    {/* Expiry Options */}
    <Text style={styles.sectionTitle}>Set Expiry</Text>
    <View style={styles.expiryOptions}>
      {expiryOptions.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.expiryButton,
            expiry === option && styles.selectedExpiry,
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
      ))}
    </View>

    {/* Generate QR Code Button */}
    <TouchableOpacity style={styles.button} onPress={handleGenerateQR}>
      <Text style={styles.buttonText}>Generate QR Code</Text>
    </TouchableOpacity>
  </View>
)}


        {/* 🔹 Step 3: Show QR Code */}
        {step === 3 && qrData && (
          <View style={styles.qrContainer}>
            <Text style={styles.modalTitle}>Your Gate Pass</Text>
            <View style={styles.qrCodeWrapper}>
              <ViewShot ref={qrCodeRef} options={{ format: "png", quality: 1 }}>
                <QRCode value={JSON.stringify(qrData)} size={200} />
              </ViewShot>
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>👤 Name:</Text> {qrData.name}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>📞 Phone:</Text> {qrData.phone}
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

            {/* Download PDF */}
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                const qrBase64 = await getBase64FromQR();
                if (qrBase64) generateAndDownloadPDF(qrData, qrBase64);
              }}
            >
              <Text style={styles.buttonText}>📥 Download PDF</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
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

  timeInputField: {
    width: 50, // ✅ Reduce width
    paddingHorizontal: 5,
    textAlign: "center",
    fontSize: 16,
  },

  // backButtonContainer: {
  //   position: "absolute",
  //   left: 10,
  //   padding: 10, // Increased padding to make the touch area larger
  //   zIndex: 10, // Ensure it stays above other elements
  // },
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
    width: "200%", // ✅ Ensure it spans full width
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly", // ✅ Ensures items are evenly spaced
    paddingHorizontal: 10, // ✅ Some spacing on edges
    alignItems: "center",
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 20,
  },

  gridContainer: { justifyContent: "center", alignItems: "center" },

  categoryItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
    padding: 1,
    elevation: 4, // Adds shadow
  },
  homeButtonContainer: {
    position: "absolute",
    right: 15,
    padding: 5,
  },
  categoryImage: {
    width: "80%", // Ensures image scales with the box
    height: "80%",
    resizeMode: "contain",
  },
  categoryText: { fontSize: 16, fontWeight: "bold", marginTop: 10 },

  closeButton: {
    backgroundColor: "#d9534f",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  timePickerButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  categoryHeader: {
    alignItems: "center",
    marginBottom: 10, // Adds spacing
  },

  categoryImageLarge: {
    width: 200, // Adjust size as needed
    height: 150, // Adjust size as needed
    resizeMode: "contain",
    borderRadius: 10, // Optional: Rounded corners
  },

  timeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
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
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 20 },

  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    width: "100%",
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
  dateText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
    fontWeight: "bold",
  },
  dateTimePicker: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginBottom: 10,
  },

  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
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

  downloadButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  timeSlotModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
  },
  timeSlotModalContent: {
    backgroundColor: "#fff",
    width: "85%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  timeSlotList: {
    flexDirection: "column",
    alignItems: "center",
  },
  timeSlotItem: {
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80, // Ensures consistent size
    maxWidth: 100, // Prevents the buttons from being too large
  },
  timeSlotText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  selectedTimeSlot: {
    backgroundColor: "#007BFF", // Highlight selected time slot
    borderColor: "#007BFF",
    borderWidth: 1,
  },
  selectedTimeSlotText: {
    color: "#fff",
  },

  timeSlotHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  timeSlotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10, // Adds space between rows and columns
  },
  backButtonContainer: {
    position: "absolute",
    left: 15,
    padding: 5,
    zIndex: 10,
  },
  formContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
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
    marginBottom: 20,
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
    width: "90%",
    elevation: 10, // Add shadow effect for Android
    zIndex: 9999, // Increase the zIndex
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
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
  screen: { flex: 1, backgroundColor: "#fff", padding: 20 },
  selectedExpiry: {
    backgroundColor: "#f5f5f5",
    borderColor: "#0056b3",
    borderWidth: 2,
    color: "#fff",
  },
  selectedExpiryText: {
    fontWeight: "bold",
  },
  shareButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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

  timeSlotsContainer: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#333",
  },
  calendar: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },

 

  // timeSlotModal: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
  // },
  // timeSlotModalContent: {
  //   backgroundColor: "#fff",
  //   width: "85%",
  //   padding: 20,
  //   borderRadius: 15,
  //   alignItems: "center",
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 8,
  //   elevation: 5,
  // },
  // timeSlotHeader: {
  //   fontSize: 20,
  //   fontWeight: "bold",
  //   color: "#333",
  //   marginBottom: 15,
  // },
  // timeSlotList: {
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  //   justifyContent: "center",
  // },
  // timeSlotItem: {
  //   backgroundColor: "#f5f5f5",
  //   paddingVertical: 12,
  //   paddingHorizontal: 20,
  //   borderRadius: 25,
  //   margin: 5,
  //   width: "30%",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // timeSlotText: {
  //   fontSize: 16,
  //   fontWeight: "bold",
  //   color: "#333",
  // },
  // selectedTimeSlot: {
  //   backgroundColor: "#007BFF", // Highlight selected time slot
  //   borderColor: "#0056b3",
  //   borderWidth: 1,
  // },
  // selectedTimeSlotText: {
  //   color: "#fff",
  // },
  // closeButton: {
  //   marginTop: 15,
  //   backgroundColor: "#d9534f",
  //   padding: 12,
  //   borderRadius: 8,
  //   width: "80%",
  //   alignItems: "center",
  // },
  // closeButtonText: {
  //   color: "#fff",
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
});

export default GatePassScreen;