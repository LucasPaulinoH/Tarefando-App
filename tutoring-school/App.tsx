import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import Home from "./src/screens/Home";
import Login from "./src/screens/general/Login";
import Register from "./src/screens/general/Register";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <ApplicationProvider {...eva} theme={eva.light}>
        <Layout />
      </ApplicationProvider>
    </AuthProvider>
  );
}

export const Layout = () => {
  const { authState } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authState?.authenticated ? (
          <Stack.Screen name="Home" component={Home}></Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login}></Stack.Screen>
            <Stack.Screen name="Register" component={Register}></Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
