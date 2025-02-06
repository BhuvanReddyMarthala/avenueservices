import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
  FlatList,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from ".";

const categories = ["All", "OTG_Drugs", "Prescription_Drugs"] as const;
const menuItems: Record<string, { name: string; price: string; image: string }[]> = {
    OTG_Drugs: [
      { name: "Paracetamol", price: "Rs.60", image: "https://5.imimg.com/data5/SELLER/Default/2023/2/HR/CZ/QW/6918745/paracetamol-500mg-tablets-intemol-500-2-.jpeg" },
      { name: "Ibuprofen", price: "Rs.70", image: "https://5.imimg.com/data5/SELLER/Default/2023/9/344827499/TG/YT/FY/192270567/ibuprofen-tablet-400mg.png" },
      { name: "Aspirin", price: "Rs.50", image: "https://5.imimg.com/data5/SELLER/Default/2023/7/330506870/UM/GZ/QO/135658020/aspirin-dispersible-tablets.jpg" },
      { name: "Naproxen", price: "Rs.50", image: "https://www.gnova.co.in/wp-content/uploads/Naproxen-and-Domperidone-Tablets.jpeg" },
      { name: "Diclofenac Gel", price: "Rs.80", image: "https://image.made-in-china.com/2f0j00oRFcliWMnebT/Diclofenac-Diethylamine-Gel-1-16-30g-Diclofenac-Sodium-Gel-1-30g.webp" },
      { name: "Multivitamins", price: "Rs.60", image: "https://inlifehealthcare.com/cdn/shop/files/Frontwb_1_30215729-eb83-4dac-9e54-5b04b7569af3.webp?v=1734413301&width=2048" },
      { name: "Artificial Tears", price: "Rs.70", image: "https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/3e17ca09069e4933b7891bda4373fddf.jpg?dpr=2.625&format=auto" },
      { name: "Carbamide Peroxide", price: "Rs.40", image: "https://nulifepharma.com/admin/images/product_img/165097071388Soliwax-CP-Ear-Drops-product.png" },
    ],
    Prescription_Drugs: [
      { name: "Amoxicillin", price: "Rs.150", image: "https://5.imimg.com/data5/SELLER/Default/2023/4/302374024/JI/DV/MR/25738186/amoxicillin-500mg-capsule-500x500.png" },
      { name: "Cephalexin (Keflex)", price: "Rs.150", image: "https://www.grxstatic.com/d4fuqqd5l3dbz/products/Package_28944.JPG" },
      { name: "Fluoxetine (Prozac)", price: "Rs.100", image: "https://5.imimg.com/data5/SELLER/Default/2023/7/326568545/DE/RN/WT/193024635/prozac.jpg" },
      { name: "Insulin Glargine (Lantus)", price: "Rs.90", image: "https://5.imimg.com/data5/SELLER/Default/2020/12/QT/YX/VR/115213003/lantus-insulin-glargine-injection-500x500.jpg" },
      { name: "Ciprofloxacin (Cipro)", price: "Rs.80", image: "https://5.imimg.com/data5/FA/SB/FW/SELLER-71371632/cipro-tablets-500x500.png" },
  
    ]
  };

type CategoryType = keyof typeof menuItems | "All";
type NavigationProp = StackNavigationProp<RootStackParamList, "Restaurant">;

const MedicalScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const { width } = useWindowDimensions();
  const navigation = useNavigation<NavigationProp>();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const isWideScreen = width > 800;
  const numColumns = isWideScreen ? 3 : 1;

  const handleAddItem = (itemName: string) => {
    setCart((prev) => ({ ...prev, [itemName]: (prev[itemName] || 0) + 1 }));
  };

  const handleRemoveItem = (itemName: string) => {
    setCart((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemName] > 1) {
        updatedCart[itemName] -= 1;
      } else {
        delete updatedCart[itemName];
      }
      return updatedCart;
    });
  };

  // Filter selected items
  const selectedItems = Object.entries(cart)
    .filter(([_, quantity]) => quantity > 0)
    .map(([name, quantity]) => ({ name, quantity }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
            <Icon name="arrow-left" size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Menu</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.iconContainer}>
            <Icon name="home" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.tab, selectedCategory === category && styles.activeTab]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.tabText, selectedCategory === category && styles.activeTabText]}>
                {category}
              </Text>

            </TouchableOpacity>

          ))}
        </ScrollView>
      </View>

      {/* Display Menu Items with Section Headers */}
      <FlatList
        data={selectedCategory === "All" ? Object.values(menuItems).flat() : menuItems[selectedCategory]}
        keyExtractor={(item) => item.name}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : null}
        key={numColumns}
        ListHeaderComponent={<Text style={styles.sectionHeader}>Menu Items</Text>}
        renderItem={({ item }) => (
            <View style={styles.menuItem}>
            {/* Right Side - Name, Price, and Quantity Controls */}
            <View style={styles.rightContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
              </View>
          
              {/* Quantity Controls */}
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => handleRemoveItem(item.name)}>
                  <Icon name="minus" size={16} color="#333" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{cart[item.name] || 0}</Text>
                <TouchableOpacity onPress={() => handleAddItem(item.name)}>
                  <Icon name="plus" size={16} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
          
            {/* Left Side - Image */}
            <Image source={{ uri: item.image }} style={styles.itemImage} />
          </View>
          
        )}
      />

      {/* Checkout Button */}
      {selectedItems.length > 0 && (
        <TouchableOpacity style={styles.checkoutButton} onPress={() => setCheckoutVisible(true)}>
          <Text style={styles.checkoutText}>Checkout ({selectedItems.length} items)</Text>
        </TouchableOpacity>
      )}
       <Modal visible={checkoutVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Order</Text>
            {selectedItems.map((item) => (
              <View key={item.name} style={styles.cartItem}>
                <Text style={styles.cartItemText}>
                  {item.name} x {item.quantity}
                </Text>
              </View>
            ))}
            <TouchableOpacity style={styles.confirmButton} onPress={() => {
              setCheckoutVisible(false);
              setConfirmVisible(true);
            }}>
              <Text style={styles.confirmText}>Confirm Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setCheckoutVisible(false)}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={confirmVisible} animationType="slide" transparent>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Choose Order Type</Text>
      {["Takeaway", "Delivery"].map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.optionButton}
          onPress={() => {
            setConfirmVisible(false);
            setSuccessMessage(`Order placed successfully for ${option}!`);
          }}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.closeButton} onPress={() => setConfirmVisible(false)}>
        <Text style={styles.closeText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
<Modal visible={!!successMessage} animationType="slide" transparent>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>{successMessage}</Text>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          setSuccessMessage("");
          navigation.navigate("Home"); // Navigate to Home after pressing OK
        }}
      >
        <Text style={styles.confirmText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  checkoutButton: { backgroundColor: "#4A90E2", padding: 15, alignItems: "center", margin: 10, borderRadius: 5 },
  checkoutText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  cartItem: { fontSize: 16, padding: 5, fontWeight: "bold" },
  menuItem: {
    flexDirection: "row-reverse", // Puts the image on the right
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 8,
    width:360,
    padding: 10,
    height: 100, // Equal size for all grid items
    justifyContent: "space-between",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight:10,
    marginLeft: 10, // Space between text and image
  },
  rightContainer: {
    flex: 1, // Takes up the remaining space
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1, // Makes sure the text takes up full space
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 4, // Small gap between name and price
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  gridItem: {
    width: "48%", // Ensures equal size for all grid items
    marginBottom: 12,
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  confirmButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5, marginTop: 10, width: "100%", alignItems: "center" },
  leftContainer: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1, // Ensures the left side gets proper space
  },  cartItemText: { fontSize: 16, fontWeight: "bold" },
  closeButton: { padding: 10, marginTop: 10 },

  container: { flex: 1, backgroundColor: "#F9FAFA", paddingTop: 100 },
  sectionHeader: { fontSize: 18, fontWeight: "bold", textAlign: "center", paddingVertical: 10 },
  headerContainer: { position: "absolute", top: 0, width: "100%", backgroundColor: "#fff", zIndex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 16 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  iconContainer: { padding: 8 },
  optionButton: { padding: 10, width: "100%", alignItems: "center" },
  optionText: { fontSize: 18 },
  tabsContainer: { flexDirection: "row", padding: 10, backgroundColor: "#fff" },
  tab: { padding: 10, marginRight: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#FF5722" },
  tabText: { fontSize: 14, color: "#333" },
  activeTabText: { fontWeight: "bold" },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  closeText: { fontSize: 16, color: "red" },
  row: { justifyContent: "space-between" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: 300, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalOption: { padding: 10 },
  
});

export default MedicalScreen;