import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ReceivedAnnouncementDTO } from "../../../services/Announcement/type";
import announcementApi from "../../../services/Announcement";
import { useAuth } from "../../../context/AuthContext";
import { Card, Text } from "@ui-kitten/components";
import userApi from "../../../services/User";
import { UserCard } from "../../../services/User/type";
import { StudentsIcon } from "../../../theme/Icons";

const GuardianAnnouncements = () => {
  const { authState } = useAuth();

  const [announcements, setAnnouncements] = useState<ReceivedAnnouncementDTO[]>(
    []
  );
  const [authorCards, setAuthorCards] = useState<UserCard[]>([]);

  const fetchAnnouncements = async () => {
    try {
      const announcementsResponse =
        await announcementApi.getReceiverAnnouncements(authState?.user?.id!);
      setAnnouncements(announcementsResponse);

      const authorCardArray = [];
      let iterableAuthorCard = null;
      let iterableAnnouncement = null;

      for (let i = 0; i < announcementsResponse.length; i++) {
        iterableAnnouncement = announcementsResponse[i];

        iterableAuthorCard = await userApi.getUserCard(
          iterableAnnouncement.authorId
        );
        authorCardArray.push(iterableAuthorCard);
      }

      setAuthorCards(authorCardArray);
    } catch (error) {
      console.log("Error fetching announcements: ", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <ScrollView>
      {announcements.map(
        (announcement: ReceivedAnnouncementDTO, index: number) => (
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
              <Text>{`enviado por: ${authorCards[index].userName ?? "Carregando..."}`}</Text>
            </View>
          </Card>
        )
      )}
    </ScrollView>
  );
};

export default GuardianAnnouncements;
