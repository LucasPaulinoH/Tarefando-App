import { NavigationContainer } from "@react-navigation/native";
import { View, StatusBar } from "react-native";
import { useAuth } from "../context/AuthContext";
import Login from "../screens/general/Login";
import Register from "../screens/general/Register";
import AddStudent from "../screens/guardian/AddStudent";
import AddTask from "../screens/general/AddTask";
import EditStudent from "../screens/guardian/EditStudent";
import EditTask from "../screens/general/EditTask";
import GuardianHome from "../screens/guardian/Home";
import StudentDetails from "../screens/general/StudentDetails";
import TaskDetails from "../screens/general/TaskDetails";
import AddSchool from "../screens/tutor/AddSchool";
import EditSchool from "../screens/tutor/EditSchool";
import TutorHome from "../screens/tutor/Home";
import SchoolDetails from "../screens/general/SchoolDetails";
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
import AddAnnouncement from "../screens/tutor/AddAnnouncement";
import AnnouncementDetails from "../screens/tutor/AnnouncementDetails";
import EditAnnouncement from "../screens/tutor/EditAnnouncement";
import { useTheme } from "@ui-kitten/components";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const SCREEN_OPTIONS = {
  header: () => <View style={{ marginTop: StatusBar.currentHeight }} />,
};

const TABBAR_ICON_SIZE = 25;

const Routes = () => {
  const { authState } = useAuth();
  const theme = useTheme();

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
        <Stack.Screen name="SchoolDetails" component={SchoolDetails} />
      </Stack.Navigator>
    );
  };

  const GuardianAnnouncementsStack = () => {
    return (
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        <Stack.Screen
          name="GuardianAnnouncements"
          component={GuardianAnnouncements}
        />
      </Stack.Navigator>
    );
  };

  const TutorHomeStack = () => {
    return (
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        <Stack.Screen name="TutorHome" component={TutorHome} />
        <Stack.Screen name="AddSchool" component={AddSchool} />
        <Stack.Screen name="EditSchool" component={EditSchool} />
        <Stack.Screen name="AddTask" component={AddTask} />
        <Stack.Screen name="SchoolDetails" component={SchoolDetails} />
        <Stack.Screen name="StudentDetails" component={StudentDetails} />
        <Stack.Screen name="Students" component={TutorStudents} />
        <Stack.Screen name="TaskDetails" component={TaskDetails} />
        <Stack.Screen name="EditTask" component={EditTask} />
      </Stack.Navigator>
    );
  };

  const TutorAnnouncementsStack = () => {
    return (
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        <Stack.Screen
          name="TutorAnnouncements"
          component={TutorAnnouncements}
        />
        <Stack.Screen name="AddAnnouncement" component={AddAnnouncement} />
        <Stack.Screen
          name="AnnouncementDetails"
          component={AnnouncementDetails}
        />
        <Stack.Screen name="EditAnnouncement" component={EditAnnouncement} />
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
                  <View
                    style={{
                      marginTop: StatusBar.currentHeight,
                    }}
                  />
                ),
                tabBarStyle: {
                  backgroundColor: theme["color-primary-900"],
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                },
                tabBarLabelStyle: {
                  fontWeight: "bold",
                },
                tabBarActiveTintColor: theme["color-primary-200"],
                tabBarInactiveTintColor: theme["color-primary-600"],
              }}
            >
              <Tab.Screen
                name="GuardianHomeStack"
                component={GuardianHomeStack}
                options={{
                  title: "Estudantes",
                  tabBarIcon: ({ focused, color, size }) => (
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
                  tabBarIcon: ({ focused, color, size }) => (
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
                  tabBarIcon: ({ focused, color, size }) => (
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
                  <View
                    style={{
                      marginTop: StatusBar.currentHeight,
                    }}
                  />
                ),
                tabBarStyle: {
                  backgroundColor: theme["color-primary-900"],
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                },
                tabBarLabelStyle: {
                  fontWeight: "bold",
                },
                tabBarActiveTintColor: theme["color-primary-200"],
                tabBarInactiveTintColor: theme["color-primary-600"],
              }}
            >
              <Tab.Screen
                name="TutorHomeStack"
                component={TutorHomeStack}
                options={{
                  title: "Escolas",
                  tabBarIcon: ({ focused, color, size }) => (
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
                name="AnnouncementsStack"
                component={TutorAnnouncementsStack}
                options={{
                  title: "Comunicados",
                  tabBarIcon: ({ focused, color, size }) => (
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
                  tabBarIcon: ({ focused, color, size }) => (
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
