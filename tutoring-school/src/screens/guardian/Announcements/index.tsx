import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ReceivedAnnouncementDTO } from "../../../services/Announcement/type";
import announcementApi from "../../../services/Announcement";
import { useAuth } from "../../../context/AuthContext";
import { Card, Text } from "@ui-kitten/components";
import userApi from "../../../services/User";
import { UserCard } from "../../../services/User/type";

const GuardianAnnouncements = () => {
  const { authState } = useAuth();

  const [announcements, setAnnouncements] = useState<ReceivedAnnouncementDTO[]>(
    []
  );
  const [authorCards, setAuthorCards] = useState<UserCard[]>([
    { userName: "Carregando..." },
  ]);

  const fetchAnnouncements = async () => {
    try {
      const announcementsResponse =
        await announcementApi.getReceiverAnnouncements(authState?.user?.id!);
      setAnnouncements(announcementsResponse);
    } catch (error) {
      console.log("Error fetching announcements: ", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <ScrollView>
      {announcements.length > 0? announcements.map((announcement, index) => (
        <Card key={index}>
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
           
          </View>
        </Card>
      )) : null}
    </ScrollView>
  );
};

export default GuardianAnnouncements;
