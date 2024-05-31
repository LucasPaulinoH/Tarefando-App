import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import Login from "./src/screens/general/Login";
import Register from "./src/screens/general/Register";
import { UserRole } from "./src/types/Types";
import GuardianHome from "./src/screens/guardian/Home";
import TutorHome from "./src/screens/tutor/Home";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <AuthProvider>
        <ApplicationProvider {...eva} theme={eva.light}>
          <Layout />
        </ApplicationProvider>
      </AuthProvider>
    </>
  );
}

export const Layout = () => {
  const { authState } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authState?.authenticated ? (
          authState.user?.role === UserRole.GUARDIAN ? (
            <Stack.Screen name="GuardianHome" component={GuardianHome} />
          ) : (
            <Stack.Screen name="TutorHome" component={TutorHome} />
          )
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
