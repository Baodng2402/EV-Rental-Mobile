import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#333333",
        tabBarInactiveTintColor: "#8e8e93ff",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarActiveBackgroundColor: "#f0f0f0",
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: () => <Feather name="home" size={28} color="black" />,
        }}
      />
      <Tabs.Screen
        name="favoriteList"
        options={{
          title: "Yêu thích",
          tabBarIcon: () => <Feather name="heart" size={28} color="black" />,
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: "Đơn đặt",
          tabBarIcon: () => <MaterialIcons name="car-rental" size={28} color="black" />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Tài khoản",
          tabBarIcon: () => <Feather name="user" size={28} color="black" />,
        }}
      />
    </Tabs>
  );
}
