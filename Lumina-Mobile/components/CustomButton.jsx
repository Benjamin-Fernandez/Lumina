import {TouchableOpacity, Text, Image, View} from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Octicons'

const CustomButton = ({title, icon: IconComponent, iconProps, handlePress, containerStyles, textStyles, isLoading}) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}
    activeOpacity={0.7}
    className = {`bg-primaryButton rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading? 'opacity-50': ''}`}
    disabled={isLoading}
    >
        <View className="flex-row">
            {
                IconComponent && (
                    <IconComponent 
                    {...iconProps}
                    className="mr-2"
                    />
                )
            }
            <Text className={`font-lregular text-white text-custom-subheader ${textStyles}`}>
                {title}
            </Text>
        </View>
    </TouchableOpacity>
  )
}

export default CustomButton