import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../Profile/ProfileScreen";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchScreen from "../screens/SearchScreen";
import { useSelector } from "react-redux";
import AllUserScreen from "../Admin/AllUserScreen";
import { Ionicons } from 'react-native-vector-icons';
import { APP_COLOR } from "../../utils/constant.js"
import { Alert, Text, TouchableOpacity, View } from "react-native";
import SavedRecipesScreen from "../screens/SavedRecipesScreen.js";
const Tab = createBottomTabNavigator();
export default function MainTabs({ navigation }) {
  const user = useSelector(state => state.user.data);

  return (
    <Tab.Navigator initialRouteName="Main" screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Main") iconName = focused ? "home" : "home-outline";
        else if (route.name === "Search") iconName = focused ? "search" : "search-outline";
        else if (route.name === "Profile") iconName = focused ? "person" : "person-outline";
        else if (route.name === "AllUser") iconName = focused ? "people" : "people-outline";
        else if (route.name === "CookHistory") iconName = focused ? "time" : "time-outline";

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: APP_COLOR.ORANGE,
      tabBarInactiveTintColor: "gray",
    })}>
      <Tab.Screen
        name="Main"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerTitle: "Recipes Book",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: APP_COLOR.ORANGE,
            shadowColor: "transparent",
          },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
          headerLeft: () => (
            <View style={{ flexDirection: "row", marginRight: 10 }}>
              <TouchableOpacity
                style={{ marginHorizontal: 10 }}
                onPress={() => navigation.navigate("MainTabs", { screen: "Search" })}
              >
                <Ionicons name="search" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row", marginRight: 10, alignItems: "center" }}>
              <TouchableOpacity
                style={{ marginLeft: 15 }}
                onPress={() => navigation.navigate("CreateRecipe")}
              >
                <Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>+</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{ marginHorizontal: 10 }}
                onPress={() => Alert.alert("Notifications", "No new notifications")}  // Thay bằng hàm xử lý thông báo
              >
                <Ionicons name="notifications" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Tab.Screen name="Search" component={SearchScreen} options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Search",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: APP_COLOR.ORANGE,
          shadowColor: "transparent",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        // headerLeft: Back hoặc clear icon
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 15 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        ),
        // headerRight: Filter hoặc thông báo
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => console.log("Filter clicked")}
          >
            <Ionicons name="filter" size={24} color="#fff" />
          </TouchableOpacity>
        ),
      })} />

      <Tab.Screen name="Profile" component={ProfileScreen} options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Profile",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: APP_COLOR.ORANGE,
          shadowColor: "transparent",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        // headerLeft: menu hoặc back
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 15 }}
            onPress={() => navigation.goBack()} // hoặc mở drawer
          >
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        ),
        // headerRight: chỉnh sửa profile
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate("EditProfileScreen")}
          >
            <Ionicons name="create-outline" size={24} color="#fff" />
          </TouchableOpacity>
        ),
      })} />
      <Tab.Screen name="CookHistory" component={SavedRecipesScreen} options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Cook History",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: APP_COLOR.ORANGE,
          shadowColor: "transparent",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        // headerLeft: menu hoặc back
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 15 }}
            onPress={() => navigation.goBack()} // hoặc mở drawer
          >
            <Ionicons name="receipt" size={24} color="#fff" />
          </TouchableOpacity>
        ),
        // headerRight: chỉnh sửa profile
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate("EditProfileScreen")}
          >
            <Ionicons name="list-outline" size={24} color="#fff" />
          </TouchableOpacity>
        ),
      })} />
      {user?.role === "admin" && (
        <Tab.Screen name="AllUser" component={AllUserScreen} options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "All Users",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: APP_COLOR.ORANGE,
            shadowColor: "transparent",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          // headerLeft: quay về tab trước
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()} // hoặc mở drawer
            >
              <Ionicons name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          // headerRight: nút thêm user
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => console.log("Add user")} // Thay bằng hàm thêm user
            >
              <Ionicons name="notifications" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })} />
      )}

    </Tab.Navigator>
  );
}