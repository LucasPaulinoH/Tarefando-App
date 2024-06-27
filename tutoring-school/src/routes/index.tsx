import { NavigationContainer } from "@react-navigation/native";
import { View, StatusBar } from "react-native";
import { useAuth } from "../context/AuthContext";
import Login from "../screens/general/Login";
import Register from "../screens/general/Register";
import AddStudent from "../screens/guardian/AddStudent";
import AddTask from "../screens/guardian/AddTask";
import EditStudent from "../screens/guardian/EditStudent";
import EditTask from "../screens/guardian/EditTask";
import GuardianHome from "../screens/guardian/Home";
import GuardianSchoolDetails from "../screens/guardian/SchoolDetails";
import StudentDetails from "../screens/guardian/StudentDetails";
import TaskDetails from "../screens/guardian/TaskDetails";
import AddSchool from "../screens/tutor/AddSchool";
import EditSchool from "../screens/tutor/EditSchool";
import TutorHome from "../screens/tutor/Home";
import TutorSchoolDetails from "../screens/tutor/SchoolDetails";
import { UserRole } from "../types/Types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GuardianAnnouncements from "../screens/guardian/Announcements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Me from "../screens/general/Me";
import TutorStudents from "../screens/tutor/Students";
import TutorAnnouncements from "../screens/tutor/Announcements";
import {
  AnnouncementIcon,
  PersonIcon,
  SchoolIcon,
  StudentsIcon,
} from "../theme/Icons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const SCREEN_OPTIONS = {
  header: () => <View style={{ marginTop: StatusBar.currentHeight }} />,
};

const TABBAR_ICON_SIZE = 25;

const Routes = () => {
  const { authState } = useAuth();

  const GuardianHomeStack = () => {
    return (
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        <Stack.Screen name="GuardianHome" component={GuardianHome} />
        <Stack.Screen name="AddStudent" component={AddStudent} />
        <Stack.Screen name="EditStudent" component={EditStudent} />
        <Stack.Screen name="StudentDetails" component={StudentDetails} />
        <Stack.Screen name="TaskDetails" component={TaskDetails} />
        <Stack.Screen name="AddTask" component={AddTask} />
        <Stack.Screen name="EditTask" component={EditTask} />
        <Stack.Screen name="SchoolDetails" component={GuardianSchoolDetails} />
      </Stack.Navigator>
    );
  };

  const GuardianAnnouncementsStack = () => {
    return (
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        <Stack.Screen name="Announcements" component={GuardianAnnouncements} />
      </Stack.Navigator>
    );
  };

  const TutorHomeStack = () => {
    return (
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        <Stack.Screen name="TutorHome" component={TutorHome} />
        <Stack.Screen name="AddSchool" component={AddSchool} />
        <Stack.Screen name="EditSchool" component={EditSchool} />
        <Stack.Screen name="SchoolDetails" component={TutorSchoolDetails} />
      </Stack.Navigator>
    );
  };

  const TutorStudentsStack = () => {
    return (
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        <Stack.Screen name="Students" component={TutorStudents} />
      </Stack.Navigator>
    );
  };

  const TutorAnnouncementsStack = () => {
    return (
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        <Stack.Screen name="Announcements" component={TutorAnnouncements} />
      </Stack.Navigator>
    );
  };

  const MeStack = () => {
    return (
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        <Stack.Screen name="Me" component={Me} />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <>
        {authState?.authenticated ? (
          authState.user?.role === UserRole.GUARDIAN ? (
            <Tab.Navigator
              screenOptions={{
                header: () => (
                  <View style={{ marginTop: StatusBar.currentHeight }} />
                ),
                tabBarInactiveTintColor: "grey",
              }}
            >
              <Tab.Screen
                name="GuardianHomeStack"
                component={GuardianHomeStack}
                options={{
                  title: "Alunos",
                  tabBarIcon: ({ color }) => (
                    <StudentsIcon
                      style={{
                        width: TABBAR_ICON_SIZE,
                        height: TABBAR_ICON_SIZE,
                      }}
                      fill={color}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="AnnouncementsStack"
                component={GuardianAnnouncementsStack}
                options={{
                  title: "Comunicados",
                  tabBarIcon: ({ color }) => (
                    <AnnouncementIcon
                      style={{
                        width: TABBAR_ICON_SIZE,
                        height: TABBAR_ICON_SIZE,
                      }}
                      fill={color}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="MeStack"
                component={MeStack}
                options={{
                  title: "Eu",
                  tabBarIcon: ({ color }) => (
                    <PersonIcon
                      style={{
                        width: TABBAR_ICON_SIZE,
                        height: TABBAR_ICON_SIZE,
                      }}
                      fill={color}
                    />
                  ),
                }}
              />
            </Tab.Navigator>
          ) : (
            <Tab.Navigator
              screenOptions={{
                header: () => (
                  <View style={{ marginTop: StatusBar.currentHeight }} />
                ),
              }}
            >
              <Tab.Screen
                name="TutorHomeStack"
                component={TutorHomeStack}
                options={{
                  title: "Escolas",
                  tabBarIcon: ({ color }) => (
                    <SchoolIcon
                      style={{
                        width: TABBAR_ICON_SIZE,
                        height: TABBAR_ICON_SIZE,
                      }}
                      fill={color}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="StudentsStack"
                component={TutorStudentsStack}
                options={{
                  title: "Estudantes",
                  tabBarIcon: ({ color }) => (
                    <StudentsIcon
                      style={{
                        width: TABBAR_ICON_SIZE,
                        height: TABBAR_ICON_SIZE,
                      }}
                      fill={color}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="AnnouncementsStack"
                component={TutorAnnouncementsStack}
                options={{
                  title: "Comunicados",
                  tabBarIcon: ({ color }) => (
                    <AnnouncementIcon
                      style={{
                        width: TABBAR_ICON_SIZE,
                        height: TABBAR_ICON_SIZE,
                      }}
                      fill={color}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="MeStack"
                component={MeStack}
                options={{
                  title: "Eu",
                  tabBarIcon: ({ color }) => (
                    <PersonIcon
                      style={{
                        width: TABBAR_ICON_SIZE,
                        height: TABBAR_ICON_SIZE,
                      }}
                      fill={color}
                    />
                  ),
                }}
              />
            </Tab.Navigator>
          )
        ) : (
          <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="Login" component={Login}></Stack.Screen>
            <Stack.Screen name="Register" component={Register}></Stack.Screen>
          </Stack.Navigator>
        )}
      </>
    </NavigationContainer>
  );
};

export default Routes;
