import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const images: Record<string, string> = {
    GatePass: 'https://avenuenxt.s3.ap-southeast-1.amazonaws.com/gatepass_clipart.jpg',
    Restaurant: 'https://static.vecteezy.com/system/resources/previews/049/237/459/non_2x/restaurant-cafe-front-flat-style-illustration-building-exterior-vector.jpg',
    Groceries: 'https://img.freepik.com/free-vector/delicious-meat-vegetable-wooden-crate_1308-161743.jpg',
    Pharmacy: 'https://img.freepik.com/premium-vector/modern-interior-pharmacy-male-pharmacist_169241-3431.jpg',
    'Club House': 'https://png.pngtree.com/png-clipart/20230917/original/pngtree-house-in-thin-line-style-in-a-flat-color-vector-png-image_12274371.png',
    Saloon: 'https://static.vecteezy.com/system/resources/previews/036/325/659/non_2x/cowboy-saloon-cartoon-colored-clipart-illustration-free-vector.jpg',
    Laundry: 'https://static.vecteezy.com/system/resources/previews/043/535/402/non_2x/laundry-machine-with-washing-clothing-and-linen-illustration-flat-cartoon-style-washer-with-baskets-of-linen-and-detergent-concept-of-domestic-housework-service-clipart-vector.jpg',
    Gym: 'https://media.istockphoto.com/id/1197037605/vector/fitness-center-gym-illustration.jpg?s=612x612&w=0&k=20&c=YBBUB8mYioZMxSVSmQBPZ0aj2T0m52iIPBVm-QuQjGc=',
};

const HomeScreen: React.FC = () => {
    const { width } = useWindowDimensions(); // Get screen width
    const isMobile = width < 768;
    const isTabletOrDesktop = width >= 768;
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState(Object.keys(images));

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text === '') {
            setFilteredItems(Object.keys(images));
        } else {
            const filtered = Object.keys(images).filter(item =>
                item.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredItems(filtered);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header: Logo & Request Service Button */}
            <View style={styles.headerContainer}>
                <Image
                    source={require('../assets/images/cropped-Avenue-reality-logo.webp')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <TouchableOpacity style={styles.serviceButton} onPress={() => navigation.navigate('MaintenanceScreen')}>
                    <Text style={styles.serviceButtonText}>Request Service</Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Icon name="search" size={18} color="#777" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    placeholderTextColor="#777"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            {/* Grid Items */}
            <ScrollView>
                <View style={[styles.gridContainer, { justifyContent: isTabletOrDesktop ? 'center' : 'space-between' }]}>
                    {filteredItems.map((item, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={[styles.gridItem, { width: isMobile ? '45%' : '21%' }]} // 2 grids for mobile, 4 grids for large screens
                            onPress={() => {
                                if (item == 'GatePass') navigation.navigate('GatePass');
                                else if (item === 'Restaurant') navigation.navigate('Restaurant');
                                else if (item === 'Groceries') navigation.navigate('Grocery');
                                else if (item === 'Pharmacy') navigation.navigate('Medical');
                                else if (item === 'Club House') navigation.navigate('ClubHouse');
                                else if (item === 'Saloon') navigation.navigate('Saloon');
                                else if (item === 'Laundry') navigation.navigate('LaundryScreen');
                                else if (item === 'Gym') navigation.navigate('Gym');
                                else if (item === 'MaintenanceScreen') navigation.navigate('MaintenanceScreen')
                            }}>
                            <Image
                                source={{ uri: images[item] || 'https://example.com/default.jpg' }}
                                style={styles.gridImage}/>
                            <Text style={styles.gridText}>{item}</Text>
                        </TouchableOpacity> ))}
                </View>
            </ScrollView>
            <View style={styles.footer}>
                {['Home', 'Search', 'Item', 'Account'].map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.footerItem}
                        onPress={() => {
                            if (item === 'Home') {
                                navigation.navigate('Home');
                            } else if (item === 'Search') {
                                navigation.navigate('Search');
                            } else if (item === 'Item') {
                                navigation.navigate('Item');
                            } else if (item === 'Account') {
                                navigation.navigate('LoginPage'); // Navigate to Login page
                            }
                        }}
                    >
                        <Icon
                            name={item === 'Home' ? 'home' : item === 'Search' ? 'search' : item === 'Item' ? 'tasks' : 'user'}
                            size={24}
                            color="#5a5a5c"
                            style={styles.footerIcon}
                        />
                        <Text style={styles.footerText}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#FFFFFF', 
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#f8f8f8',
    },
    logo: {
        width: 140, 
        height: 40, 
    },
    serviceButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 8, 
        paddingHorizontal: 14,
        borderRadius: 8,
        alignItems: 'center', 
        justifyContent: 'center',
    },
    serviceButtonText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginHorizontal: 16,
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 38,
        fontSize: 15,
        color: '#333',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        paddingTop: 16,
    },
    gridItem: {
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'white',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f9f9f9',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#EAEAEA',
    },
    footerItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerIcon: {
        marginBottom: 5,
    },
    footerText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333333',
    },
    gridImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        backgroundColor: '#e3dfde',
    },
    gridText: {
        marginTop: 6,
        fontSize: 14,
        fontWeight: '600',
        color: '#4f4f4f',
        textAlign: 'center',
    },
});

export default HomeScreen;