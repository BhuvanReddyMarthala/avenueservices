import React, { useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal, ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { MessageSquare, Heart, Plus, ArrowLeft, Home, X, Camera } from "lucide-react-native";
import { Dimensions ,StyleSheet} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/FontAwesome";

interface Post {
  liked: boolean;
  id: string;
  user: string;
  category: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  commentList: { id: string; text: string }[];
}

const categories = ['Events', 'Lost & Found', 'Buy & Sell', 'Announcements'];
const screenWidth = Dimensions.get("window").width; // Get screen width
const BroadCastScreen: React.FC = ({ navigation }: any) => {
  const [posts, setPosts] = useState<Post[]>([
    {
        id: "1",
        user: "Amit Sharma",
        category: "Events",
        content: "Join us for the Holi celebrations at the community hall! Snacks and activities for all ages!",
        image: "https://static.toiimg.com/thumb/63039736.cms?resizemode=75&width=1200&height=900", // Example placeholder image
        likes: 12,
        comments: 3,
        liked: false,
        commentList: [],
      },
      {
        id: "2",
        user: "Priya Verma",
        category: "Lost & Found",
        content: "Lost my Car Keys near the clubhouse. Please contact me if found!",
        likes: 8,
        comments: 2,
        liked: false,
        commentList: [],
      },
      {
        id: "3",
        user: "Rahul Mehta",
        category: "Buy & Sell",
        content: "Selling a brand-new washing machine. Contact me for details. Price is negotiable!",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI1y0VQo3v5llkP_TOqPdnE4Eywf6uSsMfuw&s",
        likes: 15,
        comments: 4,
        liked: false,
        commentList: [],
      },
      {
        id: "4",
        user: "Neha Kapoor",
        category: "Announcements",
        content: "Community meeting scheduled for Sunday at 5 PM in the main hall. Please join!",
        likes: 10,
        comments: 1,
        liked: false,
        commentList: [],
      },
      {
        id: "5",
        user: "Vikas Patel",
        category: "Events",
        content: "Cricket match this Saturday at 7 AM on the community ground. All players welcome!",
        likes: 20,
        comments: 5,
        liked: true,
        commentList: [],
      },
      {
        id: "6",
        user: "Anjali Singh",
        category: "Lost & Found",
        content: "Found a pair of sunglasses near the park bench. DM me to claim it!",
        likes: 5,
        comments: 1,
        liked: false,
        commentList: [],
      },
      {
        id: "7",
        user: "Rohan Das",
        category: "Buy & Sell",
        content: "Selling my old study table and chair. Both are in great condition. DM me for pictures and price.",
        likes: 9,
        comments: 3,
        liked: false,
        commentList: [],
      },
      {
        id: "8",
        user: "Pooja Malhotra",
        category: "Announcements",
        content: "Water supply will be interrupted tomorrow between 10 AM and 2 PM for maintenance work.",
        likes: 4,
        comments: 0,
        liked: false,
        commentList: [],
      },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [commentModalVisible, setCommentModalVisible] = useState<boolean>(false);
  const [newPost, setNewPost] = useState<string>("");
  const [newPostCategory, setNewPostCategory] = useState<string>("Events");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>("");

  const handleLikePost = useCallback((postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post
      )
    );
  }, []);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleAddPost = () => {
    if (newPost.trim()) {
      setPosts([
        { id: Math.random().toString(), user: 'You', category: newPostCategory, content: newPost, image: selectedImage || undefined, likes: 0, comments: 0, liked: false, commentList: [] },
        ...posts
      ]);
      setNewPost("");
      setSelectedImage(null);
      setModalVisible(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f4f4f4" }}>
      {/* Header */}
      <View style={styles.headerContainer}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
    <Ionicons name="arrow-back-outline" size={26} color="#333" />
  </TouchableOpacity>
  <Text style={styles.header}>Community Broadcast</Text>
  <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.iconContainer}>
   <Icon name="home" size={22} color="#333" />
  </TouchableOpacity>
</View>



      {/* Categories */}
      <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={{ marginBottom: 20, maxHeight: 100 }} // Explicitly control height
  contentContainerStyle={{
    alignItems: 'center', // Align content vertically
    paddingHorizontal: 10, // Add consistent horizontal padding
  }}
>
  {['All', ...categories].map((category) => (
    <TouchableOpacity
      key={category}
      onPress={() => setSelectedCategory(category)}
      style={{
        backgroundColor: selectedCategory === category ? '#6200EE' : '#E0E0E0',
        height: 50, // Set a fixed button height
        paddingHorizontal: 16, // Set consistent horizontal padding
        borderRadius: 30, // Make buttons pill-shaped
        marginRight: 8, // Add space between buttons
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        
      }}
    >
      <Text
        style={{
          color: selectedCategory === category ? 'white' : 'black',
          fontWeight: 'bold',
          fontSize: 14,
        }}
        numberOfLines={1} // Prevent text overflow
      >
        {category}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>




      {/* Posts */}
      <FlatList
        data={selectedCategory === 'All' ? posts : posts.filter(post => post.category === selectedCategory)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: "white", padding: 16, borderRadius: 12, marginBottom: 12 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.user}</Text>
            <Text style={{ color: "gray", fontSize: 14, marginBottom: 8 }}>{item.category}</Text>
            <Text style={{ fontSize: 16 }}>{item.content}</Text>
            {item.image && <Image source={{ uri: item.image }} style={{ width: "100%", height: 200, marginTop: 0, borderRadius: 10 }} />}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
              <TouchableOpacity onPress={() => handleLikePost(item.id)} style={{ flexDirection: "row", alignItems: "center" }}>
                <Heart size={20} color={item.liked ? "#ff5252" : "gray"} />
                <Text> {item.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setSelectedPostId(item.id);
                setCommentModalVisible(true);
              }} style={{ flexDirection: "row", alignItems: "center" }}>
                <MessageSquare size={20} color="#007AFF" />
                <Text> {item.comments}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Floating Add Button */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ position: "absolute", bottom: 20, right: 20, backgroundColor: "#007AFF", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", elevation: 5 }}>
  <Plus size={32} color="white" />
</TouchableOpacity>
{/* Add Post Modal */}
<Modal visible={modalVisible} transparent animationType="slide">
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
    <View style={{ backgroundColor: "white", padding: 20, borderRadius: 12, width: "90%" }}>
      <TouchableOpacity onPress={() => setModalVisible(false)} style={{ alignSelf: "flex-end" }}>
        <X size={24} />
      </TouchableOpacity>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Create a New Post</Text>

      {/* Text Input for Post Content */}
      <TextInput
        placeholder="What's on your mind?"
        value={newPost}
        onChangeText={setNewPost}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          fontSize: 16,
          marginBottom: 10,
        }}
        multiline
      />

      {/* Category Selection */}
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>Select Category:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setNewPostCategory(category)}
            style={{
              backgroundColor: newPostCategory === category ? "#6200EE" : "#E0E0E0",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
              marginRight: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: newPostCategory === category ? "white" : "black",
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Image Upload */}
      <TouchableOpacity
        onPress={handlePickImage}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
          backgroundColor: "#f0f0f0",
          borderRadius: 10,
          marginBottom: 10,
        }}
      >
        <Camera size={20} style={{ marginRight: 5 }} />
        <Text style={{ fontSize: 16 }}>Upload Image</Text>
      </TouchableOpacity>
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={{
            width: "100%",
            height: 150,
            borderRadius: 10,
            marginBottom: 10,
          }}
        />
      )}

      {/* Post Button */}
      <TouchableOpacity
        onPress={handleAddPost}
        style={{
          backgroundColor: "#007AFF",
          paddingVertical: 12,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Post</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      {/* Comment Modal */}
      <Modal visible={commentModalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 12, width: "80%" }}>
            <TouchableOpacity onPress={() => setCommentModalVisible(false)} style={{ alignSelf: "flex-end" }}>
              <X size={24} />
            </TouchableOpacity>
            {selectedPostId && posts.find(p => p.id === selectedPostId)?.commentList.map(c => (
              <Text key={c.id} style={{ fontSize: 16, padding: 4 }}>{c.text}</Text>
            ))}
            <TextInput placeholder="Add a comment..." onChangeText={setNewComment} style={{ borderWidth: 1, padding: 8, marginTop: 10 }} />
            <TouchableOpacity onPress={handleAddPost} style={{ backgroundColor: "#007AFF", padding: 10, marginTop: 10, borderRadius: 8 }}>
              <Text style={{ color: "white", textAlign: "center" }}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
  
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainer: { padding: 8 },
    row: { justifyContent: "space-between" }, // For window view (3 per row)
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    backButton: {
        padding: 8,
        backgroundColor: '#007BFF',
        borderRadius: 50,
        marginRight: 10,
    },
    optionCard: {
        marginVertical: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    optionImageBackground: {
        height: 200,
        justifyContent: 'flex-end',
    },
    optionOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    optionDescription: {
        fontSize: 14,
        color: '#fff',
    },
    timeSlotsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginVertical: 10,
    },
    timeSlot: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#E8F0FF',
        borderRadius: 20,
        margin: 5,
        borderWidth: 1,
        borderColor: '#007BFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedTimeSlot: {
        backgroundColor: '#007BFF',
        borderColor: '#007BFF',
    },
    timeSlotText: {
        color: '#007BFF',
        fontSize: 14,
        fontWeight: '600',
    },
    selectedTimeSlotText: {
        color: '#fff',
    },
    confirmButton: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green',
    },
    modalText: {
        fontSize: 16,
        marginVertical: 5,
    },
    modalItem: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#007BFF',
    },
    modalButtons: {
        flexDirection: 'row',
        marginTop: 20,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    cancelButton: {
        backgroundColor: 'red',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default BroadCastScreen;
