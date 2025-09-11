import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../Profile/ProfileScreen";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchScreen from "../screens/SearchScreen";


const Tab = createBottomTabNavigator();
export default function MainTabs() {
  return (
    <Tab.Navigator initialRouteName="Main">
      <Tab.Screen name="Main" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
      
    </Tab.Navigator>
  );
}