import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View, Image } from "react-native";
import { ReceivedAnnouncementDTO } from "../../../services/Announcement/type";
import announcementApi from "../../../services/Announcement";
import { useAuth } from "../../../context/AuthContext";
import { Avatar, Card, Text, useTheme } from "@ui-kitten/components";
import { UserCard } from "../../../services/User/type";
import { StyleSheet } from "react-native";
import userApi from "../../../services/User";
import { useFocusEffect } from "@react-navigation/native";

const GuardianAnnouncements = () => {
  const { authState } = useAuth();

  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<ReceivedAnnouncementDTO[]>(
    []
  );
  const [authorCards, setAuthorCards] = useState<UserCard[]>([]);

  const fetchAuthorCards = async () => {
    try {
      const authorCardPromises = announcements.map((announcement) =>
        userApi.getUserCard(announcement.authorId)
      );

      const authorCardsData = await Promise.all(authorCardPromises);
      setAuthorCards(authorCardsData);
    } catch (error) {
      console.log("Error fetching author cards: ", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const announcementsResponse =
        await announcementApi.getReceiverAnnouncements(authState?.user?.id!);
      setAnnouncements(announcementsResponse);
    } catch (error) {
      console.log("Error fetching announcements: ", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAnnouncements();
    }, [])
  );

  useEffect(() => {
    if (announcements.length > 0) fetchAuthorCards();
  }, [announcements]);

  return (
    <ScrollView style={{ backgroundColor: theme["color-primary-100"] }}>
      <View style={styles.mainContainer}>
        <Text category="h6">Comunicados</Text>
        {!loading ? (
          <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {announcements.length > 0 ? (
              announcements.map((announcement, index) => (
                <>
                  <Card
                    key={`${announcement.title}${index}`}
                    style={{
                      ...styles.announcementCard,
                      borderWidth: 0,
                      backgroundColor: theme["color-primary-200"],
                    }}
                  >
                    <View>
                      <Text category="h6">{announcement.title}</Text>
                      <Text>{announcement.description}</Text>
                    </View>
                    <View style={styles.announcementAuthorInfo}>
                      <Avatar
                        src={authorCards[index]?.profileImage ?? null}
                        style={styles.authorAvatar}
                      />
                      <Text>
                        {authorCards[index]?.userName ?? "Carregando autor..."}
                      </Text>
                    </View>
                  </Card>
                </>
              ))
            ) : (
              <View style={{ ...styles.studentInfo, marginTop: 175, gap: 30 }}>
                <Image
                  source={require("../../../../assets/noAnnouncements.png")}
                  style={styles.image}
                />
                <Text style={{ textAlign: "center" }} category="h6">
                  Nenhum comunicado recebido
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.mainContainer}>
            <ActivityIndicator
              size="large"
              color={theme["color-primary-500"]}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default GuardianAnnouncements;

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    marginTop: 20,
    marginBottom: 50,
    paddingLeft: 15,
    paddingRight: 15,
    gap: 20,
  },

  announcementCard: {
    display: "flex",
    flexDirection: "column",
  },

  studentInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  image: {
    width: 160,
    height: 160,
    resizeMode: "contain",
  },

  announcementAuthorInfo: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "flex-end",
  },

  authorAvatar: {
    width: 24,
    height: 24,
  },
});
