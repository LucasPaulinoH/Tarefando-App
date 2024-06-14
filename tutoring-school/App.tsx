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
import AddSchool from "./src/screens/tutor/AddSchool";
import SchoolDetails from "./src/screens/tutor/SchoolDetails";
import EditSchool from "./src/screens/tutor/EditSchool";
import AddStudent from "./src/screens/guardian/AddStudent";
import EditStudent from "./src/screens/guardian/EditStudent";
import StudentDetails from "./src/screens/guardian/StudentDetails";
import TaskDetails from "./src/screens/guardian/TaskDetails";
import AddTask from "./src/screens/guardian/AddTask";
import EditTask from "./src/screens/guardian/EditTask";

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
            <>
              <Stack.Screen name="GuardianHome" component={GuardianHome} />
              <Stack.Screen name="AddStudent" component={AddStudent} />
              <Stack.Screen name="EditStudent" component={EditStudent} />
              <Stack.Screen name="StudentDetails" component={StudentDetails} />
              <Stack.Screen name="TaskDetails" component={TaskDetails} />
              <Stack.Screen name="AddTask" component={AddTask} />
              <Stack.Screen name="EditTask" component={EditTask} />
            </>
          ) : (
            <>
              <Stack.Screen name="TutorHome" component={TutorHome} />
              <Stack.Screen name="AddSchool" component={AddSchool} />
              <Stack.Screen name="EditSchool" component={EditSchool} />
              <Stack.Screen name="SchoolDetails" component={SchoolDetails} />
            </>
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
