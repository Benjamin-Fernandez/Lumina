import React, {
useState,
useContext,
useCallback,
useRef,
useEffect,
} from "react";
import {
View,
Text,
TextInput,
TouchableOpacity,
ScrollView,
KeyboardAvoidingView,
Platform,
Image,
TouchableWithoutFeedback,
Keyboard,
Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { useLocalSearchParams, router } from "expo-router";
import { useUser } from "../../context/UserContext";
import axios from "../../config/axiosConfig";
import Markdown from "react-native-markdown-display";
































const ChatScreen = ({ navigation }) => {
const params = useLocalSearchParams();
const [messages, setMessages] = useState([]); // Start with zero messages
const [input, setInput] = useState("");
const [conversationId, setConversationId] = useState(params.id); // Get conversation ID from params
const [chatbotId, setChatbotId] = useState(params.chatbotId);
const [chatbot, setChatbot] = useState({});
const [loading, setLoading] = useState(true);
const [generating, setGenerating] = useState(false);
const isProcessingRef = useRef(false); // Prevent multiple simultaneous calls
const { email } = useUser(); // Get email from context
const scrollViewRef = useRef(null);



const fetchConversation = async () => {
try {
 const response = await axios.get(
   "message/conversation/" + conversationId
 );
 // console.log("Messages fetched from the database: ", response.data);




 // Assuming response.data contains the array of message objects
 const messages = response.data;






 // Set the messages directly to the state
 setMessages(messages);
} catch (error) {
 console.error("Error fetching messages:", error);
} finally {
 setLoading(false);
}
};




const fetchChatbot = async () => {
try {
 const response = await axios.get("/chatbot/" + chatbotId);
 // console.log("Chatbot details:", response.data);
 setChatbot(response.data.chatbot);
} catch (error) {
 console.error("Error fetching chatbot details:", error);
}
};






// Fetch messages on initial render
React.useEffect(() => {
// console.log("Conversation ID: ", conversationId);
// console.log("params: ", params);
if (chatbotId !== "0") {
 fetchChatbot();
}
if (conversationId !== "new") {
 fetchConversation();
} else {
 setLoading(false);
}
}, []);






const getResponse = useCallback(async (messagesToSend) => {
// Prevent multiple simultaneous calls
if (isProcessingRef.current) {
 console.log("Already processing a response, skipping...");
 return;
}




isProcessingRef.current = true;




// Use the messages passed as argument (avoids stale closure issues)
const currentMessages = messagesToSend;




// Add "Fetching response..." placeholder
setMessages((prevMessages) => [
 ...prevMessages,
 {
   content: "Fetching response...",
   fromSelf: false,
 },
]);






if (chatbotId === "0") {
 // If the chatbot is Lumina GPT-4o
 console.log("Getting response from OpenAI...");
 console.log("Messages being sent:", currentMessages);





 try {
   const response = await axios.post("/openai", {
     messages: currentMessages,
   });






   console.log(
     "Response from OpenAI: ",
     response.data.response.choices[0].message.content
   );





   // Update UI FIRST (so user sees response immediately and we don't trigger infinite loop)
   setMessages((prevMessages) =>
     prevMessages.map((msg, index) =>
       index === prevMessages.length - 1 &&
       msg.content === "Fetching response..."
         ? {
             ...msg,
             content: response.data.response.choices[0].message.content,
           }
         : msg
     )
   );








   // Now try to save to database (in background, don't fail if it errors)
   try {
     await axios.post("/message", {
       conversationId: conversationId,
       fromSelf: false,
       content: response.data.response.choices[0].message.content,
     });








     console.log("Conversation updated: ", conversationId);
     await axios.put("/conversation/" + conversationId, {
       lastMessage: response.data.response.choices[0].message.content,
     });
   } catch (dbError) {
     console.warn("Failed to save to database (throughput limit?), but message displayed:", dbError.message);
     // Continue anyway - user can still see the response
   }








   setGenerating(false);
   isProcessingRef.current = false; // Reset the flag
   return response.data;
 } catch (error) {
   console.error("Error calling OpenAI:", error);
   console.error("Error response:", error.response?.data);
   console.error("Error status:", error.response?.status);








   // Replace "Fetching response..." with error message (don't remove it, or it will trigger infinite loop)
   setMessages((prevMessages) =>
     prevMessages.map((msg, index) =>
       index === prevMessages.length - 1 &&
       msg.content === "Fetching response..."
         ? {
             ...msg,
             content: "Error: Failed to get response. Please try again.",
           }
         : msg
     )
   );
   setGenerating(false);
   isProcessingRef.current = false; // Reset the flag
   // Don't throw error - just log it
 }
} else {
 console.log(
   "Getting response from Custom Chatbot..., schema: ",
   chatbot.schema
 );
 try {
   // Build conversation history for context (exclude the "Fetching response..." placeholder)
   const conversationHistory = currentMessages
     .filter(msg => msg.content !== "Fetching response..." && !msg.content.startsWith("Error:"))
     .map(msg => ({
       role: msg.fromSelf ? "user" : "assistant",
       content: msg.content,
     }));


   const response = await axios.post("/custom", {
     message: currentMessages[currentMessages.length - 1].content,
     schema: chatbot.schema,
     // New fields for flexible plugin execution
     path: chatbot.path || "/getResponse",
     conversationHistory: conversationHistory,
     userEmail: email,
     conversationId: conversationId,
     authType: chatbot.authType,
     apiKey: chatbot.apiKey,
     pluginName: chatbot.name,
   });
   console.log("Response from Custom Chatbot: ", response.data.response);








   // Update UI FIRST (so user sees response immediately and we don't trigger infinite loop)
   setMessages((prevMessages) =>
     prevMessages.map((msg, index) =>
       index === prevMessages.length - 1 &&
       msg.content === "Fetching response..."
         ? {
             ...msg,
             content: response.data.response,
           }
         : msg
     )
   );








   // Now try to save to database (in background, don't fail if it errors)
   try {
     await axios.post("/message", {
       conversationId: conversationId,
       fromSelf: false,
       content: response.data.response,
     });








     console.log("Conversation updated: ", conversationId);
     await axios.put("/conversation/" + conversationId, {
       lastMessage: response.data.response,
     });
   } catch (dbError) {
     console.warn("Failed to save to database (throughput limit?), but message displayed:", dbError.message);
     // Continue anyway - user can still see the response
   }








   setGenerating(false);
   isProcessingRef.current = false; // Reset the flag
   return response.data.response;
 } catch (error) {
   console.error("Error fetching response from custom chatbot:", error);








   // Replace "Fetching response..." with error message (don't remove it, or it will trigger infinite loop)
   setMessages((prevMessages) =>
     prevMessages.map((msg, index) =>
       index === prevMessages.length - 1 &&
       msg.content === "Fetching response..."
         ? {
             ...msg,
             content: "Error: Failed to get response. Please try again.",
           }
         : msg
     )
   );
   setGenerating(false);
   isProcessingRef.current = false; // Reset the flag
   // Don't throw error - just log it
 }
}
}, [conversationId, chatbot]); // Removed 'messages' from dependencies - we now capture it inside the function








React.useEffect(() => {
console.log("Messages: ", messages);
if (messages.length > 0) {
 const lastMessage = messages[messages.length - 1];
 // Only trigger if:
 // 1. Last message is from user (fromSelf: true)
 // 2. Not already processing (isProcessingRef prevents duplicate calls)
 // 3. Not a "Fetching response..." or error message placeholder
 if (
   lastMessage.fromSelf &&
   !isProcessingRef.current &&
   lastMessage.content !== "Fetching response..." &&
   !lastMessage.content.startsWith("Error:")
 ) {
   console.log("Triggering getResponse for message:", lastMessage.content);
   // Pass the current messages array to avoid stale closure issues
   getResponse([...messages]);
 }
}
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [messages]); // Only depend on messages, not getResponse (prevents infinite loop)
// Handle sending a message
const handleSend = async () => {
setGenerating(true);
console.log("Sending message: ", input);
if (input.trim()) {
 const messageContent = input;



 // Update UI FIRST (so user sees their message immediately)
 setMessages([...messages, { content: messageContent, fromSelf: true }]);
 setInput("");




 // Now save to database in background (don't fail if it errors)
 if (messages.length === 0) {
   // Create new conversation
   try {
     const res = await axios.post("conversation/", {
       userEmail: email,
       chatbotId: chatbotId,
       firstMessage: messageContent,
       chatbotName: chatbot.name || "Lumina GPT-4o",
     });
     console.log("Conversation created with: ", chatbot.name);
     setConversationId(res.data.conversation._id);
     const currentConversationId = res.data.conversation._id;




     // Save the message to database
     try {
       await axios.post("/message", {
         conversationId: currentConversationId,
         fromSelf: true,
         content: messageContent,
       });
     } catch (dbError) {
       console.warn("Failed to save message to database:", dbError.message);
       // Continue anyway - user can still see the message in UI
     }
   } catch (error) {
     console.error("Error creating conversation:", error);
     // User still sees the message in UI, but it's not saved to database
   }
 } else {
   // Existing conversation - just save the message
   try {
     console.log("Conversation exists: ", conversationId);
     await axios.post("/message", {
       conversationId: conversationId,
       fromSelf: true,
       content: messageContent,
     });
   } catch (error) {
     console.warn("Failed to save message to database:", error.message);
     // Continue anyway - user can still see the message in UI
   }
 }
}
};






const handleBack = () => {
const previousRoute = params.previousRoute;
console.log("Previous route in cid: ", previousRoute);
if (previousRoute) {
 router.push(previousRoute);
} else {
 router.back();
}
};





useEffect(() => {
const keyboardDidShowListener = Keyboard.addListener(
 "keyboardDidShow",
 () => {
   if (scrollViewRef.current) {
     scrollViewRef.current.scrollToEnd({ animated: true });
   }
 }
);





return () => {
 keyboardDidShowListener.remove();
};
}, []);
const { width, height } = Dimensions.get("window");





return chatbot ? (
loading ? (
 <KeyboardAvoidingView
   className="flex-1"
   behavior={Platform.OS === "ios" ? "padding" : "height"} // Use "position" for more predictable input handling
   keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0} // Adjust offset as needed for iOS
 >
   <View className="bg-white p-5 flex-1">
     <View
       className="relative flex-row justify-center items-center mb-6 mx-2"
       style={{ marginTop: height * 0.05 }}
     >
       <TouchableOpacity
         className="absolute left-2 h-16 w-16 align-middle justify-center"
         onPress={handleBack}
       >
         <Icon name="chevron-left" size={24} color="black" />
       </TouchableOpacity>
       <Text
         className="font-llight text-lg"
         numberOfLines={1}
         style={{ maxWidth: width * 0.6 }}
       >
         {chatbotId === "0" ? "Lumina GPT-4o" : chatbot.name}
       </Text>
     </View>
     <ScrollView className="flex-1 ">
       <View className="flex-1 translate-y-72 items-center justify-center">
         <Icon name="database" size={24} color="black" />
         <Text className="text-center font-llight text-lg mt-3">
           Loading messages...
         </Text>
       </View>
     </ScrollView>
   </View>
 </KeyboardAvoidingView>
) : (
 <KeyboardAvoidingView
   className="flex-1"
   behavior={Platform.OS === "ios" ? "padding" : "height"}
   keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0} // Adjust offset as needed for iOS
 >
   <View className="bg-white p-5 flex-1">
     <View
       className="relative flex-row justify-center items-center mb-6 mx-2"
       style={{ marginTop: height * 0.05 }}
     >
       <TouchableOpacity
         className="absolute left-2 h-16 w-16 align-middle justify-center"
         onPress={handleBack}
       >
         <Icon name="chevron-left" size={24} color="black" />
       </TouchableOpacity>
       <Text
         className="font-llight text-lg "
         numberOfLines={1}
         style={{ maxWidth: width * 0.6 }}
       >
         {chatbotId === "0" ? "Lumina GPT-4o" : chatbot.name}
       </Text>
     </View>




     {/* Messages or No Messages */}
     {messages.length === 0 ? (
       <View className="h-[80%] justify-center align-middle items-center flex-1 ">
         <Image
           source={require("../../assets/images/icon.png")}
           className="w-[100px] h-[100px]"
         />
         <Text className="font-llight text-2xl">Lumina</Text>
       </View>
     ) : (
       <ScrollView
         ref={scrollViewRef}
         className="flex-1"
         contentContainerStyle={{ flexGrow: 1 }} // Ensures content takes full height
         showsVerticalScrollIndicator={false}
         keyboardShouldPersistTaps="handled" // Ensures the scroll view handles taps when the keyboard is up
         onContentSizeChange={() =>
           scrollViewRef.current.scrollToEnd({ animated: true })
         }
       >
         {messages.map((message, index) => (
           <View
             key={message._id || index}
             className={`mb-2 max-w-[80%] ${
               message.fromSelf
                 ? "self-end bg-gray-100 rounded-3xl p-4"
                 : "self-start flex-row items-center"
             }`}
           >
             {!message.fromSelf && (
               <Image
                 source={require("../../assets/images/icon.png")}
                 className="w-9 h-9 rounded-full mr-2"
               />
             )}
             <Markdown className="font-llight text-base ">
               {message.content}
             </Markdown>
           </View>
         ))}
       </ScrollView>
     )}





     {/* Input Box */}
     <View className="h-16 flex-row items-center p-4 bg-gray-100 my-2 mx-2 rounded-full">
       <TextInput
         className="flex-1 px-4 py-4 mr-9 h-16 rounded-full text-base font-llight"
         placeholder="Ask me anything..."
         value={input}
         multiline={true}
         numberOfLines={4}
         onChangeText={(text) => setInput(text)}
       />






       <TouchableOpacity
         className="absolute right-5"
         onPress={handleSend}
         disabled={!input || generating}
       >
         <Icon name="paper-airplane" size={24} color="gray" />
       </TouchableOpacity>
     </View>
   </View>
 </KeyboardAvoidingView>
)
) : (
<KeyboardAvoidingView
 className="flex-1"
 behavior={Platform.OS === "ios" ? "padding" : "height"} // Use "position" for more predictable input handling
 keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0} // Adjust offset as needed for iOS
>
 <View className="bg-white p-5 flex-1">
   <View className="relative flex-row justify-center items-center mt-12 mb-6 mx-2">
     <TouchableOpacity
       className="absolute left-2 h-16 w-16 align-middle justify-center"
       onPress={handleBack}
     >
       <Icon name="chevron-left" size={24} color="black" />
     </TouchableOpacity>
   </View>
   <ScrollView className="flex-1 ">
     <View className="flex-1 translate-y-72 items-center justify-center">
       <Icon name="dependabot" size={24} color="black" />
       <Text className="text-center font-llight text-lg mt-3">
         This chatbot may have been disabled. Please try using other
         chatbots, or come back later!
       </Text>
     </View>
   </ScrollView>
 </View>
</KeyboardAvoidingView>
);
};



export default ChatScreen;



