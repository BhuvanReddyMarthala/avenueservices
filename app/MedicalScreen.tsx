import React, { useState,useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    Modal,
    TextInput,
    useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MedicalScreen = ({ navigation }) => {
    const [cart, setCart] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [quantity, setQuantity] = useState('1');
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

    const { width } = useWindowDimensions();
    const isMobile = width < 768; // Detect mobile
    const [numColumns, setNumColumns] = useState(isMobile ? 1 : 3);
    const [listKey, setListKey] = useState(String(numColumns));
    
    useEffect(() => {
        const newNumColumns = isMobile ? 1 : 3;
        if (newNumColumns !== numColumns) {
            setNumColumns(newNumColumns);
            setListKey(String(newNumColumns)); // Force re-render when layout changes
        }
    }, [width]);



    const medicines = [
        { id: '1', name: 'Paracetamol', price: 50, image: 'https://www.stelonbiotech.com/wp-content/uploads/2022/04/PYREMUST-650-TAB.jpg', description: 'Used to reduce fever and relieve mild to moderate pain.' },
        { id: '2', name: 'Ibuprofen', price: 100, image: 'https://5.imimg.com/data5/SELLER/Default/2023/7/325863554/WI/JM/SY/135658020/ibuprofen-tablets-ip-200-mg-.jpg', description: 'Pain reliever and anti-inflammatory.' },
        { id: '3', name: 'Cough Syrup', price: 120, image: 'https://images.apollo247.in/pub/media/catalog/product/b/e/ben0006_2.jpg', description: 'Relieves cough and soothes the throat.' },
        { id: '4', name: 'Vitamin C Tablets', price: 150, image: 'https://media.istockphoto.com/id/158324666/photo/vitamin-c-pills.jpg?s=612x612&w=0&k=20&c=ANJohnSd2bNsj3Wb5NJam-HjeLh-EaGrQG-t5MgX3Vk=', description: 'Boosts immunity and improves overall health.' },
        { id: '5', name: 'Antacid Tablets', price: 80, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Antacid-L478.jpg/1200px-Antacid-L478.jpg', description: 'Neutralizes stomach acid and relieves heartburn.' },
        { id: '6', name: 'Pain Relief Gel', price: 200, image: 'https://m.media-amazon.com/images/I/61jp6Cug86L.jpg', description: 'Provides quick relief from joint and muscle pain.' },
        { id: '7', name: 'Antiseptic Liquid', price: 130, image: 'https://m.media-amazon.com/images/I/511ulL82q3L._AC_UF894,1000_QL80_.jpg', description: 'Disinfects wounds and prevents infections.' },
        { id: '8', name: 'Antibiotic Ointment', price: 250, image: 'https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/c2a7dfcf88b44212afe2acf32534de57.jpg', description: 'Used to prevent and treat skin infections.' },
        { id: '9', name: 'Oral Rehydration Salts (ORS)', price: 30, image: 'https://www.biobrickpharma.com/wp-content/uploads/2024/06/BIKOFULL-ORS.jpg', description: 'Restores fluids and electrolytes lost due to dehydration.' },
        { id: '10', name: 'Multivitamin Tablets', price: 180, image: 'https://cdn01.pharmeasy.in/dam/products_otc/205923/maxirich-multivitamin-minerals-antioxidant-calcium-box-10-softgels-6.2-1726646418.jpg', description: 'Helps in fulfilling daily vitamin and mineral requirements.' },
        { id: '11', name: 'Cold and Flu Capsules', price: 160, image: 'https://5.imimg.com/data5/SELLER/Default/2022/7/XX/YZ/IO/8949361/cold-and-flu-capsules.jpg', description: 'Relieves symptoms of cold, fever, and flu.' },
        { id: '12', name: 'Anti-Allergy Tablets', price: 120, image: 'https://5.imimg.com/data5/SELLER/Default/2022/10/YT/KM/GM/147515487/cetirizine-tablets.jpg', description: 'Relieves allergy symptoms like sneezing and runny nose.' },
        { id: '13', name: 'Antifungal Cream', price: 220, image: 'https://5.imimg.com/data5/SELLER/Default/2022/3/LS/WB/PI/64204638/antifungal-cream.jpg', description: 'Used to treat skin fungal infections like ringworm and athlete’s foot.' },
        { id: '14', name: 'Nasal Spray', price: 140, image: 'https://5.imimg.com/data5/SELLER/Default/2022/5/SJ/HJ/NH/17775009/nasal-spray.jpg', description: 'Provides relief from nasal congestion and allergies.' },
        { id: '15', name: 'Laxative Tablets', price: 90, image: 'https://5.imimg.com/data5/SELLER/Default/2022/3/QJ/ER/PH/107915961/laxative-tablets.jpg', description: 'Used for relieving constipation and improving bowel movement.' },
    ];
    

    const addToCart = () => {
        if (!selectedMedicine) return;

        const quantityNumber = parseInt(quantity, 10);
        if (isNaN(quantityNumber) || quantityNumber <= 0) {
            Alert.alert('Invalid Quantity', 'Please enter a valid quantity.');
            return;
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === selectedMedicine.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === selectedMedicine.id
                        ? { ...item, quantity: item.quantity + quantityNumber }
                        : item
                );
            } else {
                return [...prevCart, { ...selectedMedicine, quantity: quantityNumber }];
            }
        });

        Alert.alert('Added to Cart', `${quantityNumber} x ${selectedMedicine.name} added.`);
        setModalVisible(false);
        setQuantity('1');
    };

    const removeFromCart = (medicineId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== medicineId));
        Alert.alert('Removed from Cart', `Medicine has been removed.`);
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleCheckout = () => {
        setCheckoutModalVisible(true);
    };
    
    const confirmCheckout = () => {
        setCheckoutModalVisible(false);
        Alert.alert("Order Placed", "Your order has been successfully placed!");
        setCart([]); // Clear cart after checkout
        navigation.navigate("Home"); // Redirect after checkout
    };
    
    return (
        <View style={styles.container}>
            {/* 🔹 Back Button on Top */}
           
                <View style={styles.header}>
                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Medical Store</Text>

                    {/* Home Button */}
                    <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("Home")}>
                        <Ionicons name="home" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

            <TextInput
    style={styles.searchBar}
    placeholder="Search for medicines..."
    value={searchQuery}
    onChangeText={setSearchQuery}
/>


<FlatList
                key={listKey} // Force re-render on layout change
                data={medicines.filter((item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                )}
                numColumns={numColumns}
                columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.medicineCard, { width: numColumns === 1 ? "100%" : "30%" }]}>
                        <Image source={{ uri: item.image }} style={styles.medicineImage} />
                        <View style={styles.medicineDetails}>
                            <Text style={styles.medicineName}>{item.name}</Text>
                            <Text style={styles.medicinePrice}>₹{item.price}</Text>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => {
                                    setSelectedMedicine(item);
                                    setModalVisible(true);
                                }}
                            >
                                <Text style={styles.addButtonText}>Add to Cart</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />



            {/* Quantity Input Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Enter Quantity</Text>
                        <View style={styles.quantityContainer}>
    <TouchableOpacity onPress={() => setQuantity(prev => Math.max(1, parseInt(prev) - 1))} style={styles.quantityButton}>
        <Text style={styles.quantityButtonText}>-</Text>
    </TouchableOpacity>
    <TextInput
        style={styles.quantityInput}
        keyboardType="numeric"
        placeholder="Enter quantity"
        value={quantity}
        onChangeText={setQuantity}
    />
    <TouchableOpacity onPress={() => setQuantity(prev => (parseInt(prev) + 1) || 1)} style={styles.quantityButton}>
        <Text style={styles.quantityButtonText}>+</Text>
    </TouchableOpacity>
</View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={addToCart}>
                                <Text style={styles.confirmButtonText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Cart Section */}
            <View style={styles.cartContainer}>
                <Text style={styles.cartHeader}>Your Cart</Text>
                {cart.length === 0 ? (
                    <Text style={styles.emptyCart}>Cart is empty</Text>
                ) : (
                    <ScrollView>
                        {cart.map((item) => (
                            <View key={item.id} style={styles.cartItem}>
                                <Text style={styles.cartItemText}>{item.name}</Text>
                                <Text style={styles.cartItemPrice}>
                                    ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                                </Text>
                                <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
                                    <Text style={styles.removeButtonText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <Text style={styles.totalPrice}>Total: ₹{calculateTotal()}</Text>
                        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
    <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
</TouchableOpacity>


                    </ScrollView>
                )}

                {/* Checkout Confirmation Modal */}
<Modal visible={checkoutModalVisible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Checkout</Text>
            <Text style={styles.modalMessage}>
                Your total bill is ₹{calculateTotal()}. Do you want to proceed with checkout?
            </Text>

            <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setCheckoutModalVisible(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmCheckout}>
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
</Modal>

            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F8FA', padding: 20 },

    // 🔹 Back Button Styling
    backButton: {
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 30,
        zIndex: 10,
    },
    homeButton: {
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 30,
        zIndex: 10,
        color: 'black',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transperent',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 15,
    },
    medicineCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, marginVertical: 10, borderRadius: 10, elevation: 3 },
    medicineImage: { width: 80, height: 80, borderRadius: 10 },
    medicineDetails: { flex: 1, marginLeft: 10 },
    medicineName: { fontSize: 18, fontWeight: 'bold' },
    medicinePrice: { fontSize: 16, color: '#007BFF' },
    addButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center' },
    addButtonText: { color: '#fff' },
    searchBar: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        fontSize: 16,
        marginTop:15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    
    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { width: 300, backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    modalMessage: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
    quantityInput: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, textAlign: 'center', marginBottom: 15 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    cancelButton: { padding: 10, backgroundColor: '#FF3B30', borderRadius: 5, flex: 1, marginRight: 5 },
    cancelButtonText: { color: '#fff', textAlign: 'center' },
    confirmButton: { padding: 10, backgroundColor: '#28A745', borderRadius: 5, flex: 1, marginLeft: 5 },
    confirmButtonText: { color: '#fff', textAlign: 'center' },

    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    quantityButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    quantityButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityInput: {
        width: 50,
        textAlign: 'center',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 5,
    },
    
    // Cart Styles
    cartContainer: { marginTop: 20, padding: 15, borderRadius: 10, backgroundColor: '#fff', elevation: 3 },
    cartHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    cartItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    cartItemImage: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
    cartItemDetails: { flex: 1 },
    cartItemText: { fontSize: 16, fontWeight: 'bold' },
    cartItemPrice: { fontSize: 14, color: '#007BFF' },
    
    removeButton: { backgroundColor: '#FF3B30', padding: 8, borderRadius: 5 },
    removeButtonText: { color: '#fff' },
    
    checkoutButton: { backgroundColor: '#28A745', padding: 12, borderRadius: 5, alignItems: 'center', marginTop: 10 },
    checkoutButtonText: { color: '#fff', fontSize: 16 },
});

export default MedicalScreen;