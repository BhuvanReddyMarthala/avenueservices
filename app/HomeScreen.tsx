import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const images: Record<string, string> = {
    Restaurant: 'https://popmenucloud.com/cdn-cgi/image/width%3D1200%2Cheight%3D1200%2Cfit%3Dscale-down%2Cformat%3Dauto%2Cquality%3D60/evuzicja/30c66189-6e7e-4cf5-af09-6797484fbe00.jpg',
    Saloon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXF6O-yDd7p2e8S8g6d-uIR5G0Yz-ERXwq-A&s',
    'Medical Shop': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBtjgc6UBvMVSoax5oheXMCmqXQ7orHPo0bg&s',
    Vegetables: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxtDVvuJ9K9Ls6FEtZ1KUB6bgEDthsIDoXXg&s',
    Laundry: 'https://www.styku.com/hubfs/gym-interior-with-equipments-2.jpg',
    'Club House': 'https://www.styku.com/hubfs/gym-interior-with-equipments-2.jpg',
    Gym: 'https://www.styku.com/hubfs/gym-interior-with-equipments-2.jpg',
    GatePass: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJL41ZNqHYrF0gPH0hV1EmCe5jX4riQxFFEg&s'
};

const HomeScreen: React.FC = () => {
    const { width } = useWindowDimensions();  // Dynamically updates width
    const isMobile = width < 768;
    const navigation = useNavigation<StackNavigationProp<any>>(); // Navigation Hook

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
            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/images/cropped-Avenue-reality-logo.webp')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#777" style={styles.searchIcon} />
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
                <View style={styles.gridContainer}>
                    {filteredItems.map((item, index) => (
                        <View key={index} style={[styles.gridItem, { width: isMobile ? '47%' : '23%' }]}>
                            <TouchableOpacity onPress={() => {
                    if (item === 'Restaurant') {
                        navigation.navigate('Restaurant');
                    } else if (item === 'Saloon') {
                        navigation.navigate('Saloon');
                    } else if (item === 'Medical Shop') {
                        navigation.navigate('Medical');
                    } else if (item === 'Vegetables') {
                        navigation.navigate('Vegetables');
                    } else if (item === 'Laundry') {
                    navigation.navigate('laundry');
                } else if (item === 'Club House') {
                    navigation.navigate('ClubHouse');
                } else if (item === 'Gym') {
                    navigation.navigate('Gym');
                }else if (item === 'GatePass') {
                    navigation.navigate('GatePass');
                }
                }}>
                                <Image
                                    source={{ uri: images[item] || 'https://example.com/default.jpg' }}
                                    style={[styles.gridImage, { height: isMobile ? 120 : 130 }]}
                                />
                                <Text style={styles.gridText}>{item}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    logoContainer: {
        marginTop: 10,
        marginLeft: 20,
    },
    logo: {
        width: 120,
        height: 40,
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
        height: 40,
        fontSize: 16,
        color: '#333',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
        paddingTop: 16,
        justifyContent: 'space-between',
    },
    gridItem: {
        marginBottom: 16,
    },
    gridImage: {
        borderRadius: 12,
        width: '100%',
        backgroundColor: '#e3dfde',
        borderWidth: 2,
        borderColor: '#ccc',
    },
    gridText: {
        marginTop: 6,
        fontSize: 16,
        fontWeight: '600',
        color: '#4f4f4f',
        textAlign: 'center',
    },
});

export default HomeScreen;
