import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../Profile/ProfileScreen";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchScreen from "../screens/SearchScreen";
import { useSelector } from "react-redux";
import AllUserScreen from "../Admin/AllUserScreen";

const Tab = createBottomTabNavigator();
export default function MainTabs() {
  const user = useSelector(state => state.user.data);
  const currentUserId = user?.id;
  return (
    <Tab.Navigator initialRouteName="Main">
      <Tab.Screen name="Main" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      {user?.role === "admin" && (
        <Tab.Screen name="AllUser" component={AllUserScreen} options={{ headerShown: true }} />
      )}
      
    </Tab.Navigator>
  );
}