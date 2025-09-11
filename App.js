import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/pages/auth/LoginScreen.js';
import RegisterScreen from './src/pages/auth/RegisterScreen.js';
import RecipeDetail from './src/pages/RecipeBook/RecipeDetail.js';
import Home from './src/pages/auth/Home.js';
import MainTabs from './src/pages/Tab/MainTabs.js';
import VerifyCodeScreen from './src/pages/OtpScreen/VerifyCodeScreen.js';
import OtpScreen from './src/pages/OtpScreen/OtpScreen.js';
import SuccessOtp from './src/pages/OtpScreen/SuccessOtp.js';
import EditProfile from './src/pages/Profile/EditProfile.js';
import { Provider } from 'react-redux';
import { store } from './src/store/store.js';
import EditProfilePassword from './src/pages/Profile/EditProfilePassword.js';
import CreateRecipe from './src/pages/RecipeBook/CreateRecipe.js';
import UpdateRecipe from './src/pages/RecipeBook/UpdateRecipe.js';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='HomeScreen'>
          <Stack.Screen
            name="HomeScreen"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OtpCode" component={OtpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SuccessOtp" component={SuccessOtp} options={{ headerShown: false }} />
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="RecipeDetail" component={RecipeDetail} options={{ headerShown: false }} />
          <Stack.Screen name="CreateRecipe" component={CreateRecipe} options={{ headerShown: true }} />
          <Stack.Screen name="UpdateRecipe" component={UpdateRecipe} options={{ headerShown: true }} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="EditProfilePassword" component={EditProfilePassword} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}