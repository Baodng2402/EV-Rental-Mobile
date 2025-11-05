import { askAboutElectricVehicles } from "@/api/gemini";
import { aiChatStyles } from "@/styles/aiChat.styles";
import { showToast } from "@/utils/toast";
import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIChatBubbleProps {
  vehiclesData: any[];
}

const AIChatBubble: React.FC<AIChatBubbleProps> = ({ vehiclesData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Xin chào! 👋 Tôi là trợ lý AI chuyên về xe điện. Bạn có thể hỏi tôi về các dòng xe điện, giá thuê, hoặc tư vấn chọn xe phù hợp. Hãy đặt câu hỏi nhé!",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Auto scroll to bottom when new message
  useEffect(() => {
    if (isOpen && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isOpen]);

  // Pulse animation for chat button
  useEffect(() => {
    if (!isOpen) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else {
      scaleAnim.setValue(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const aiResponse = await askAboutElectricVehicles(
        userMessage.text,
        vehiclesData
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("AI Error:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: error?.message || "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      showToast("error", "Lỗi", "Không thể kết nối với AI");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) {
    return (
      <Animated.View style={[aiChatStyles.floatingButton, { transform: [{ scale: scaleAnim }] }]}>
        <Pressable onPress={toggleChat} style={aiChatStyles.chatButton}>
          <Feather name="message-circle" size={28} color="#fff" />
          <View style={aiChatStyles.badge}>
            <Text style={aiChatStyles.badgeText}>AI</Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={aiChatStyles.chatContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={aiChatStyles.header}>
        <View style={aiChatStyles.headerLeft}>
          <View style={aiChatStyles.aiAvatar}>
            <Feather name="cpu" size={20} color="#fff" />
          </View>
          <View>
            <Text style={aiChatStyles.headerTitle}>Trợ lý AI Xe Điện</Text>
            <Text style={aiChatStyles.headerSubtitle}>
              Gemini AI • Trực tuyến
            </Text>
          </View>
        </View>
        <Pressable onPress={toggleChat} style={aiChatStyles.closeButton}>
          <Feather name="x" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={aiChatStyles.messagesContainer}
        contentContainerStyle={aiChatStyles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              aiChatStyles.messageBubble,
              message.sender === "user"
                ? aiChatStyles.userBubble
                : aiChatStyles.aiBubble,
            ]}
          >
            {message.sender === "ai" && (
              <View style={aiChatStyles.aiIcon}>
                <Feather name="cpu" size={16} color="#2563eb" />
              </View>
            )}
            <View style={aiChatStyles.messageContent}>
              <Text
                style={[
                  aiChatStyles.messageText,
                  message.sender === "user" && aiChatStyles.userMessageText,
                ]}
              >
                {message.text}
              </Text>
              <Text
                style={[
                  aiChatStyles.messageTime,
                  message.sender === "user" && aiChatStyles.userMessageTime,
                ]}
              >
                {formatTime(message.timestamp)}
              </Text>
            </View>
          </View>
        ))}
        
        {isLoading && (
          <View style={[aiChatStyles.messageBubble, aiChatStyles.aiBubble]}>
            <View style={aiChatStyles.aiIcon}>
              <Feather name="cpu" size={16} color="#2563eb" />
            </View>
            <View style={aiChatStyles.loadingBubble}>
              <ActivityIndicator size="small" color="#2563eb" />
              <Text style={aiChatStyles.loadingText}>Đang suy nghĩ...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={aiChatStyles.inputContainer}>
        <TextInput
          style={aiChatStyles.input}
          placeholder="Hỏi về xe điện..."
          placeholderTextColor="#9CA3AF"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          editable={!isLoading}
          onSubmitEditing={handleSendMessage}
        />
        <Pressable
          onPress={handleSendMessage}
          style={[
            aiChatStyles.sendButton,
            (!inputText.trim() || isLoading) && aiChatStyles.sendButtonDisabled,
          ]}
          disabled={!inputText.trim() || isLoading}
        >
          <Feather
            name="send"
            size={20}
            color={inputText.trim() && !isLoading ? "#fff" : "#9CA3AF"}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AIChatBubble;
