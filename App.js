import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/pages/auth/LoginScreen.js';
import LoginUserNameScreen from './src/pages/auth/LoginUserNameScreen.js';
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
import ForgotPasswordScreen from './src/pages/auth/AuthPassword/ForgotPasswordScreen.js';
import ResetPasswordOTPScreen from './src/pages/auth/AuthPassword/ResetPasswordOTPScreen.js';
import DetailUserIDScreen from './src/pages/Admin/DetailUserIDScreen.js';
import { APP_COLOR } from "./src/utils/constant.js";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='HomeScreen'>
          {/* Auth */}
          <Stack.Screen
            name="HomeScreen"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoginUserName" component={LoginUserNameScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OtpCode" component={OtpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SuccessOtp" component={SuccessOtp} options={{ headerShown: false }} />
          {/* AuthPassword */}
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ResetPasswordOtp" component={ResetPasswordOTPScreen} options={{ headerShown: false }} />
          {/* End Auth */}

          {/* Recipe */}
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="RecipeDetail" component={RecipeDetail} options={{ headerShown: false }} />

          <Stack.Screen
            name="CreateRecipe"
            component={CreateRecipe}
            options={{
              headerShown: true,
              title: "Tạo công thức mới",
              headerStyle: {
                backgroundColor: APP_COLOR.ORANGE,   // nền cam nhạt
              },
              headerTintColor: APP_COLOR.WHITE,        // màu chữ
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 18,
              },
              headerBackTitleVisible: false,  // ẩn chữ "Back"
            }}
          />

          <Stack.Screen
            name="UpdateRecipe"
            component={UpdateRecipe}
            options={{
              headerShown: true,
              title: "Cập nhật công thức",
              headerStyle: {
                backgroundColor: APP_COLOR.ORANGE, // nền cam
              },
              headerTintColor: APP_COLOR.WHITE,       // màu chữ + icon back
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 18,
              },
              headerBackTitleVisible: false, // ẩn chữ "Back" trên iOS
            }}
          />

          {/* End Recipe */}

          {/* Profile */}
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{
              headerShown: true,
              title: "Chỉnh sửa hồ sơ",
              headerStyle: {
                backgroundColor: APP_COLOR.ORANGE, // nền cam
              },
              headerTintColor: APP_COLOR.WHITE,       // màu chữ + icon back
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 18,
              },
              headerBackTitleVisible: false, // ẩn chữ "Back" trên iOS
            }}
          />

          <Stack.Screen
            name="EditProfilePassword"
            component={EditProfilePassword}
            options={{
              headerShown: true,
              title: "Đổi mật khẩu",
              headerStyle: {
                backgroundColor: APP_COLOR.ORANGE, // nền cam
              },
              headerTintColor: APP_COLOR.WHITE,       // màu chữ + icon back
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 18,
              },
              headerBackTitleVisible: false, // ẩn chữ "Back" trên iOS
            }}
          />

          {/* End Profile */}
          {/* Admin */}
          <Stack.Screen
            name="DetailUserIDScreen"
            component={DetailUserIDScreen}
            options={{
              headerShown: true,
              title: "Chi tiết người dùng",
              headerStyle: {
                backgroundColor: APP_COLOR.ORANGE, // nền cam
              },
              headerTintColor: APP_COLOR.WHITE,       // màu chữ + icon back
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 18,
              },
              headerBackTitleVisible: false, // ẩn chữ "Back" trên iOS
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}