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

const categories = ["All", "Breakfast", "Lunch", "Snacks", "Starters"] as const;
const menuItems: Record<string, { name: string; price: string; image: string }[]> = {
    Breakfast: [
      { name: "Idly", price: "Rs.60", image: "https://as2.ftcdn.net/jpg/02/60/51/73/1000_F_260517396_bCih8Ps9bRf0WBB0zmwtvMYiUvQNSwMu.jpg" },
      { name: "Dosa", price: "Rs.70", image: "https://media.istockphoto.com/id/1205482290/photo/masala-dosa-on-banana-leaf-with-both-sambar-and-coconut-chutney-south-indian-vegetarian-snack.jpg?s=612x612&w=0&k=20&c=FcujJMpizSvYEj5-2jspq5woZ4F5HloXuOX33CD1MeI=" },
      { name: "Upma", price: "Rs.50", image: "https://thumbs.dreamstime.com/b/upma-uppumavu-uppittu-dish-indian-subcontinent-most-common-south-maharashtrian-sri-lankan-tamil-breakfast-119700026.jpg" },
      { name: "Pongal", price: "Rs.50", image: "https://thumbs.dreamstime.com/b/indian-food-south-pongal-banana-leaf-side-dish-wooden-background-69504012.jpg" },
      { name: "Classic Pancake", price: "Rs.80", image: "https://cdn.usegalileo.ai/sdxl10/08373328-2d7f-46da-9491-d841bc1623c3.png" },
      { name: "Rice Bath", price: "Rs.60", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlEiNeaEsnMUR9P5KVxbXkvHMwREcdNIZ06A&s" },
      { name: "Poori", price: "Rs.70", image: "https://thumbs.dreamstime.com/b/poori-set-puri-chnnay-veg-curry-chutney-raita-sauce-served-dish-isolated-banana-leaf-top-view-indian-280171358.jpg" },
      { name: "Omlet", price: "Rs.40", image: "https://media.istockphoto.com/id/485040276/photo/herb-omelette-with-chives-and-oregano.jpg?s=612x612&w=0&k=20&c=gWzwd_-neHOmCgirxaaGCwEJElbuYPzY917oWPWp6kI=" },
    ],
    Lunch: [
      { name: "South Indian Meals", price: "Rs.150", image: "https://media.istockphoto.com/id/481149282/photo/south-indian-food.jpg?s=612x612&w=0&k=20&c=w43naq0743XDvzCi5FW_ROvzw4_KaCkuam16sfy3hTc=" },
      { name: "North Indian Meals", price: "Rs.150", image: "https://c8.alamy.com/comp/2DJC372/north-indian-thali-top-view-roti-pappad-rice-and-variety-of-curries-in-a-meal-indian-meal-for-lunch-and-Starters-2DJC372.jpg" },
      { name: "Roti Curry", price: "Rs.100", image: "https://www.rotinrice.com/wp-content/uploads/2011/04/RotiCanai-1-500x375.jpg" },
      { name: "Parota", price: "Rs.90", image: "https://media.istockphoto.com/id/1205482203/photo/kerala-parotta-popularly-known-as-paratha-or-porotta-is-a-delicacy-from-the-state-of-kerala.jpg?s=612x612&w=0&k=20&c=Yv6GQkzNErLM7NUA4q6S27FnFMT7yuC6RSCij5e2m0Y=" },
      { name: "Mini Meals", price: "Rs.80", image: "https://yazhli.com/wp-content/uploads/2019/11/images-3-1.jpg" },
  
    ],
    Snacks: [
      { name: "Bajji", price: "Rs.40", image: "https://t4.ftcdn.net/jpg/03/52/76/31/360_F_352763157_dSOfaW1frStnd65u9nzezth22A9PNE6q.jpg" },
      { name: "Bonda", price: "Rs.40", image: "https://t4.ftcdn.net/jpg/11/39/91/23/360_F_1139912357_VHNpeA8F4zZDsZXlXfDth1YcUJ352USJ.jpg" },
      { name: "Samosa", price: "Rs.40", image: "https://www.shutterstock.com/image-photo/veg-samosa-crispy-spicy-indian-260nw-2067201449.jpg" },
      { name: "Burger", price: "Rs.40", image: "https://www.nomeatathlete.com/wp-content/uploads/2012/08/burger.jpg" },
      { name: "Sandwich", price: "Rs.80", image: "https://www.shutterstock.com/image-photo/closeup-two-sandwiches-bacon-salami-260nw-2487875261.jpg" }, 
      { name: "Pizza", price: "Rs.140", image: "https://img.pikbest.com/origin/10/14/03/204pIkbEsT3Yj.jpg!w700wp" },
      { name: "Pani Puri", price: "Rs.60", image: "https://t3.ftcdn.net/jpg/04/94/92/18/360_F_494921881_UCVG7kgihpMUbbDC5VxuufeI7B5TQBr0.jpg" },
      { name: "Malasa Puri", price: "Rs.60", image: "https://i.ytimg.com/vi/xric8J7sm94/sddefault.jpg" },
    ],
    Starters: [
      { name: "Gobi ", price: "Rs.150", image: "https://img.freepik.com/premium-photo/gobi-manchurian-tasty-platter-photo_1036998-345025.jpg" },
      { name: "Mushroom ", price: "Rs.160", image: "https://cdn2.foodviva.com/static-content/food-images/chinese-recipes/mushroom-manchurian-recipe/mushroom-manchurian-recipe.jpg" },
      { name: "Paneer ", price: "Rs.160", image: "https://c8.alamy.com/comp/WWC34W/paneer-manchurian-or-paneer-65-in-bowl-at-black-concrete-background-paneer-manchurian-is-indian-chinese-cuisine-dish-with-panner-cheese-tomatoes-on-WWC34W.jpg" },
    ]
  };

type CategoryType = keyof typeof menuItems | "All";
type NavigationProp = StackNavigationProp<RootStackParamList, "Restaurant">;

const RestaurantScreen: React.FC = () => {
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
            {["Dine In", "Takeaway", "Delivery"].map((option) => (
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

export default RestaurantScreen;