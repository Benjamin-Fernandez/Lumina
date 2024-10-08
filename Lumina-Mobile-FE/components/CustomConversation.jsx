import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Icon from "react-native-vector-icons/Octicons"; // Assuming you're using Material Icons
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import CustomModal from "./CustomModal";

const CustomConversation = ({ id, lastMessage, date, time }) => {
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

  const handleConversation = () => {
    if (!isSwipeActive) {
      // Only navigate if swipe is not active
      console.log("Navigating to conversation with ID: " + id);
      router.push("/conversation/" + id); // Navigate to the conversation screen
    }
  };
  // Handle delete action (show modal)
  const handleDeletePress = () => {
    setIsModalVisible(true); // Show the modal when delete icon is pressed
  };

  const closeModal = () => {
    setIsModalVisible(false); // Hide the modal
  };

  const confirmDelete = () => {
    setIsModalVisible(false);
    // Handle the delete logic here (e.g., delete conversation)
    console.log("Conversation deleted!");
  };
  const renderRightActions = (progress, dragX) => {
    return (
      <TouchableOpacity
        className="bg-red-500 w-1/4 justify-center items-center h-[70px] mt-4 rounded-r-lg"
        onPress={handleDeletePress} // Open modal on trash icon press
      >
        <Icon name="trash" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  const handleSwipeableWillOpen = () => {
    setIsSwipeActive(true);
  };

  const handleSwipeableWillClose = () => {
    setIsSwipeActive(false);
  };

  // PanResponder to detect swipe vs tap
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const { dx } = gestureState;
      if (Math.abs(dx) > 10) {
        // If horizontal movement is detected
        setIsDragging(true); // Mark as dragging/swiping
        return true; // Allow pan gestures
      }
      return false; // Otherwise, treat it as a tap
    },
    onPanResponderRelease: () => {
      setIsDragging(false); // Reset dragging after the gesture ends
    },
  });

  return (
    <GestureHandlerRootView {...panResponder.panHandlers}>
      <Swipeable
        renderRightActions={renderRightActions}
        onSwipeableWillOpen={handleSwipeableWillOpen}
        onSwipeableWillClose={handleSwipeableWillClose}
      >
        <TouchableOpacity
          onPress={handleConversation}
          disabled={isSwipeActive} // Disable press when swipe is active
          activeOpacity={isSwipeActive ? 1 : 0.2} // Change opacity when swipe is active to prevent accidental navigation
        >
          <View className="mt-4 rounded-l-lg w-[100%] h-[70px] flex-col bg-white p-3 justify-around">
            <Text
              className="font-llight text-[17px] font-bold"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {lastMessage}
            </Text>
            <Text className="font-llight text-[17px] text-gray-500">
              {date} | {time}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
      {/* Render the CustomModal */}
      <CustomModal
        visible={isModalVisible}
        icon={<Icon name="trash" size={34} color="red" />} // Example of icon
        content="Are you sure you want to delete this conversation?" // Content of the modal
        actionButtonText="Delete"
        actionButtonColor="red"
        actionButtonFunction={confirmDelete} // Function to handle deletion
        onClose={closeModal} // Function to close the modal
      />
    </GestureHandlerRootView>
  );
};

export default CustomConversation;
