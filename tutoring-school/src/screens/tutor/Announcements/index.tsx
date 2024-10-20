import { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";
import announcementApi from "../../../services/Announcement";
import { useAuth } from "../../../context/AuthContext";
import { Announcement } from "../../../services/Announcement/type";
import { useFocusEffect } from "@react-navigation/native";
import { Button, Card, Text, useTheme } from "@ui-kitten/components";
import { AddIcon, StudentsIcon } from "../../../theme/Icons";
import * as SecureStore from "expo-secure-store";
import { StyleSheet } from "react-native";

const TutorAnnouncements = ({ navigation }: any) => {
  const { authState } = useAuth();

  const theme = useTheme();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const fetchAnnouncementsFromUser = async () => {
    try {
      const userAnnouncementsResponse =
        await announcementApi.getAnnouncementsFromUser(authState?.user?.id!);
      setAnnouncements(userAnnouncementsResponse);
    } catch (error) {
      console.log("Error fetching announcements from user: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAnnouncementsFromUser();
    }, [authState?.user?.id])
  );

  const handleAnnouncementDetailsClick = (announcement: Announcement) => {
    SecureStore.setItem("selectedAnnouncement", JSON.stringify(announcement));
    navigation.navigate("AnnouncementDetails");
  };

  return (
    <ScrollView style={{ backgroundColor: theme["color-primary-100"] }}>
      <View style={styles.mainContent}>
        <Button
          accessoryLeft={AddIcon}
          onPress={() => navigation.navigate("AddAnnouncement")}
        >
          <Text>Adicionar comunicado</Text>
        </Button>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            height: "100%",
            marginTop: 20,
          }}
        >
          {announcements.map((announcement: Announcement) => (
            <Card
              key={announcement.id}
              onPress={() => handleAnnouncementDetailsClick(announcement)}
              style={{
                borderWidth: 0,
                backgroundColor: theme["color-primary-200"],
              }}
            >
              <View>
                <Text category="h6">{announcement.title}</Text>
                <Text>{announcement.description}</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                    alignItems: "center",
                  }}
                >
                  <StudentsIcon
                    style={{ width: 17, height: 17 }}
                    fill={theme["color-primary-500"]}
                  />
                  <Text>
                    {announcement.receiverIds
                      ? announcement.receiverIds.length
                      : 0}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default TutorAnnouncements;

const styles = StyleSheet.create({
  mainContent: {
    width: "100%",
    height: "100%",
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },
});
