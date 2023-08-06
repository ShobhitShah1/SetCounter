import React, { useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Login } from "./Src/Login/Login";
import { Register } from "./Src/Register/Register";
import { Main } from "./Src/Main";
import { LoadingScreen } from "./Src/Login/LoadingScreen";
import AppConfig from "./Src/Components/Firebase/AppConfig";

export default function App() {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    InitApp();
  }, []);

  const InitApp = async () => {
    const FirebaseAppConfig = await AppConfig();
    console.log("FirebaseAppConfig:", FirebaseAppConfig);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoadingScreen"
          component={LoadingScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Main"
          component={Main}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
