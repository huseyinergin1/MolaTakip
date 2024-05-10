import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Register from "./screens/Register";
import AdminPanel from "./screens/AdminPanel";
import Timer from "./screens/Timer";
import AdminMola from "./screens/AdminMola";
import DrawerContent from "@react-navigation/drawer"; // Burada, sol menü içeriğini oluşturduğunuz komponentin yolunu belirtin

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={DrawerContent}>
        <Drawer.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="AdminPanel"
          component={AdminPanel}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="AdminMola"
          component={AdminMola}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="Timer"
          component={Timer}
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
