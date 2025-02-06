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
import { Ionicons } from "@expo/vector-icons";

const categories = ["All", "Vegetables", "Fruits", "Snacks", "Essentials"] as const;
const menuItems: Record<string, { name: string; price: string; image: string }[]> = {
  Vegetables: [
    { name: "Lady's Fingure", price: "Rs.50", image: "https://www.netmeds.com/images/cms/wysiwyg/blog/2022/03/1647423858_Okra_big_1.jpg" },
      { name: "Carrot", price: "Rs.50", image: "https://www.hhs1.com/hubfs/carrots%20on%20wood-1.jpg" },
      { name: "Beans", price: "Rs.60", image: "https://vgrgardens.com/wp-content/uploads/2024/11/Bush-Beans-%E0%AE%AA%E0%AF%80%E0%AE%A9%E0%AF%8D%E0%AE%B8%E0%AF%8D.jpg" },
      { name: "Cabbage", price: "Rs.50", image: "https://www.veggovilla.com/img/productimg/cabbage_0_5-240.webp" },
      { name: "Onion", price: "Rs.60", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgIxB4TqKd66zyoFXx9QiHPP_bsfzq6xLPHA&s" },
      { name: "Potato", price: "Rs.50", image: "https://static.toiimg.com/thumb/msid-110970125,width-1280,height-720,resizemode-4/110970125.jpg" },
      { name: "Chilli", price: "Rs.70", image: "https://planaplant.com/cdn/shop/products/Diy_Tshirts_MacramesShopify_11_1200x1200_crop_center.jpg?v=1636974942" },
      { name: "Brinjal", price: "Rs.60", image: "https://orgfarm.store/cdn/shop/files/brinjal-purple.jpg?v=1721624507&width=1214" },
      { name: "Tomato", price: "Rs.50", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/1200px-Tomato_je.jpg" },
    ],
    Fruits: [
      { name: "Apple", price: "Rs.150", image: "https://assets.clevelandclinic.org/transform/cd71f4bd-81d4-45d8-a450-74df78e4477a/Apples-184940975-770x533-1_jpg" },
      { name: "Orange", price: "Rs.70", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Orange-Fruit-Pieces.jpg/320px-Orange-Fruit-Pieces.jpg" },
      { name: "Banana", price: "Rs.70", image: "https://organicmandya.com/cdn/shop/files/BananaPachabale.jpg?v=1721369894&width=1000" },
      { name: "Grapes", price: "Rs.90", image: "https://onefield.in/wp-content/uploads/2021/03/green-grapes.jpg" },
      { name: "Mango", price: "Rs.170", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIZsfkc2zDCA423IfWyeg_FaRvFs_LyLeMUw&s" },
      { name: "Pomogranate", price: "Rs.160", image: "https://m.media-amazon.com/images/I/611a1wD9ZGL.jpg" },
      { name: "Kiwi", price: "Rs.200", image: "https://cdn.britannica.com/45/126445-050-4C0FA9F6/Kiwi-fruit.jpg" },
      { name: "Watermelon", price: "Rs.40", image: "https://c.ndtvimg.com/2024-04/fk1f0vf8_watermelon_625x300_09_April_24.jpg" },
    ],
    Snacks: [
      { name: "Lays", price: "Rs.20", image: "https://kumaribasket.com/wp-content/uploads/2020/10/Lays-Potato-Chips-American-Style-Cream-Onion-Flavor5.jpg" },
      { name: "kurkure", price: "Rs.20", image: "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/NI_CATALOG/IMAGES/CIW/2024/8/14/80010469-c8b7-4ae8-b907-a08ae9243dc9_717_1.png" },
      { name: "Chips", price: "Rs.20", image: "https://img.freepik.com/premium-photo/transparent-potato-chips-bag_1057389-53939.jpg" },
      { name: "Biscuit", price: "Rs.30", image: "https://www.srtgroceries.com/wp-content/uploads/2023/12/Bounce-orange-Biscuit.png" },
      { name: "jam", price: "Rs.60", image: "https://m.media-amazon.com/images/I/81QlwJRj53L.jpg" }, 
      { name: "Noodles", price: "Rs.60", image: "https://www.quickpantry.in/cdn/shop/products/maggi-masala-instant-noodles-pack-of-4-280-g-quick-pantry.jpg?v=1710538813&width=1500" },
      { name: "Cream Biscuits", price: "Rs.60", image: "https://www.quickpantry.in/cdn/shop/products/cadbury-oreo-creame-biscuit-vanilla-46-3-g-quick-pantry.jpg?v=1710538227&width=500" },
      { name: "Chocolates", price: "Rs.60", image: "https://www.bigbasket.com/media/uploads/p/xl/40019373_43-cadbury-dairy-milk-silk-chocolate-bar.jpg" },
    ],
    Essentials: [
      { name: "Soap", price: "Rs.45", image: "https://aasai.com/wp-content/uploads/2024/02/Medimix-min.png" },
      { name: "Tooth Paste", price: "Rs.80", image: "https://m.media-amazon.com/images/I/61QYq3SwS9L.jpg" },
      { name: "Cream", price: "Rs.120", image: "https://cosmocosmetics.ae/cdn/shop/files/Beauty-Cream-advanced.jpg?v=1722237528" },
      { name: "Vim Bar", price: "Rs.40", image: "https://www.quickpantry.in/cdn/shop/products/vim-dishwash-soap-quick-pantry-1.jpg?v=1710538684&width=800" },
      { name: "Surfcel", price: "Rs.30", image: "https://www.bigbasket.com/media/uploads/p/xl/100067490_13-surf-excel-detergent-bar.jpg" },
    ]
    
  };

type CategoryType = keyof typeof menuItems | "All";
type NavigationProp = StackNavigationProp<RootStackParamList, "Restaurant">;

const GroceryScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const { width } = useWindowDimensions();
  const navigation = useNavigation<NavigationProp>();
  const [confirmVisible, setConfirmVisible] = useState(false);

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
          <Ionicons name="arrow-back-outline" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Groceries</Text>
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
            {[ "Pick Up", "Delivery"].map((option) => (
              <TouchableOpacity key={option} style={styles.optionButton} onPress={() => setConfirmVisible(false)}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={() => setConfirmVisible(false)}>
              <Text style={styles.closeText}>Cancel</Text>
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


export default GroceryScreen;