import { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";
import announcementApi from "../../../services/Announcement";
import { useAuth } from "../../../context/AuthContext";
import { Announcement } from "../../../services/Announcement/type";
import { useFocusEffect } from "@react-navigation/native";
import { Button, Card, Text } from "@ui-kitten/components";
import { AddIcon, StudentsIcon } from "../../../theme/Icons";

const TutorAnnouncements = ({ navigation }: any) => {
  const { authState } = useAuth();

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

  return (
    <ScrollView>
      <Button
        accessoryLeft={AddIcon}
        onPress={() => navigation.navigate("AddAnnouncement")}
      >
        <Text>Adicionar comunicado</Text>
      </Button>

      {announcements.map((announcement: Announcement) => (
        <Card key={announcement.id}>
          <Text category="h6">{announcement.title}</Text>
          <Text>{announcement.description}</Text>
          <View  style={{ display: "flex", flexDirection: "row" , gap: 5, alignItems: "center" }}>
            <StudentsIcon style={{ width: 17, height: 17 }} />
            <Text>
              {announcement.receiverIds ? announcement.receiverIds.length : 0}
            </Text>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
};

export default TutorAnnouncements;
