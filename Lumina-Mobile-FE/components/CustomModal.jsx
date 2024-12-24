import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Platform } from "react-native";

const isAndroid = Platform.OS === "android";

const CustomModal = ({
  visible,
  icon,
  content,
  actionButtonText,
  actionButtonColor,
  actionButtonFunction,
  onClose,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      {isAndroid ? (
        <BlurView
          className="flex-1 justify-center items-center"
          intensity={100}
        >
          <View className="w-4/5 bg-white rounded-lg py-7 px-5 items-center justify-between">
            <View className="mb-5">{icon}</View>
            <View className="mb-5">
              <Text className="text-center font-llight text-lg">{content}</Text>
            </View>
            <View className="flex-row justify-between w-full">
              <TouchableOpacity
                className="flex-1 p-2 mx-1 rounded-full items-center"
                style={{ backgroundColor: actionButtonColor }}
                onPress={actionButtonFunction}
              >
                <Text className="text-white font-llight text-lg">
                  {actionButtonText}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 p-2 mx-1 rounded-full items-center bg-slate-400"
                onPress={onClose}
              >
                <Text className="text-white font-llight text-lg">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      ) : (
        <BlurView className="flex-1 justify-center items-center" intensity={50}>
          <View className="w-4/5 bg-white rounded-lg py-7 px-5 items-center justify-between">
            <View className="mb-5">{icon}</View>
            <View className="mb-5">
              <Text className="text-center font-llight text-lg">{content}</Text>
            </View>
            <View className="flex-row justify-between w-full">
              <TouchableOpacity
                className="flex-1 p-2 mx-1 rounded-full items-center"
                style={{ backgroundColor: actionButtonColor }}
                onPress={actionButtonFunction}
              >
                <Text className="text-white font-llight text-lg">
                  {actionButtonText}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 p-2 mx-1 rounded-full items-center bg-slate-400"
                onPress={onClose}
              >
                <Text className="text-white font-llight text-lg">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      )}
    </Modal>
  );
};

export default CustomModal;
