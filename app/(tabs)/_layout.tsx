import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#888",

        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopWidth: 0,
          elevation: 10,
          backgroundColor: "#ffffff",
        },

        tabBarItemStyle: {
          borderRadius: 12,
          marginHorizontal: 5,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="Yarn"
        options={{
          title: "Yarn",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="cut-outline"
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Production"
        options={{
          title: "Production",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="settings-outline"
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Final"
        options={{
          title: "Final",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="calculator-outline"
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="History"
        options={{
          title: "History",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="time-outline"
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="person-outline"
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}