import { ScrollView, View, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Announcement } from "../../../services/Announcement/type";
import { Button, Text, useTheme } from "@ui-kitten/components";
import { deleteImageFromFirebase } from "../../../utils/imageFunctions";
import announcementApi from "../../../services/Announcement";
import { useEffect, useState } from "react";
import userApi from "../../../services/User";
import { AssociatedGuardianCard } from "../../../services/User/type";
import { useAuth } from "../../../context/AuthContext";
import { DeleteIcon, EditIcon } from "../../../theme/Icons";
import BackPageButton from "../../../components/BackPageButton";

const AnnouncementDetails = ({ navigation }: any) => {
  const selectedAnnouncement: Announcement = JSON.parse(
    SecureStore.getItem("selectedAnnouncement")!
  );

  const { authState } = useAuth();

  const theme = useTheme();

  const [associatedGuardians, setAssociatedGuardians] = useState<
    AssociatedGuardianCard[]
  >([]);

  const handleDeleteAnnouncementClick = async () => {
    try {
      if (selectedAnnouncement.images?.length! > 0) {
        let iterableImageUrl = null;
        for (let i = 0; i < selectedAnnouncement.images!.length; i++) {
          iterableImageUrl = selectedAnnouncement.images![i];

          await deleteImageFromFirebase(iterableImageUrl);
        }
      }

      await announcementApi.deleteAnnouncement(selectedAnnouncement.id!);

      navigation.navigate("TutorAnnouncements");
    } catch (error: any) {
      console.log("Error deleting announcement: ", error.response);
    }
  };

  const handleEditAnnouncementClick = () => {
    SecureStore.setItem(
      "selectedAnnouncement",
      JSON.stringify(selectedAnnouncement)
    );
    navigation.navigate("EditAnnouncement");
  };

  const fetchAssociatedGuardians = async () => {
    try {
      const guardiansResponse = await userApi.getAllAssociatedGuardianCards(
        authState?.user?.id!
      );
      setAssociatedGuardians(guardiansResponse);
    } catch (error) {
      console.log("Error fetching associated guardians: ", error);
    }
  };

  useEffect(() => {
    fetchAssociatedGuardians();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: theme["color-primary-100"] }}>
      <BackPageButton onPress={() => navigation.goBack()} />
      <View style={styles.mainContent}>
        <Text category="h5">{selectedAnnouncement.title}</Text>

        <Text category="s1" style={{ textAlign: "justify" }}>
          {selectedAnnouncement.description}
        </Text>
        <View>
          {selectedAnnouncement.images?.length! > 0 &&
            selectedAnnouncement.images?.map((image, index) => (
              <Image
                source={{
                  uri: image,
                }}
                key={index}
                style={styles.image}
              />
            ))}
        </View>
        <Text category="s1" style={{ textAlign: "justify" }}>
          {`enviado para: ${associatedGuardians.map((guardian, index) =>
            index !== associatedGuardians.length - 1
              ? guardian.name + ", "
              : guardian.name
          )}`}
        </Text>
        <View>
          <Button
            onPress={handleEditAnnouncementClick}
            accessoryLeft={EditIcon}
          >
            <Text>Editar comunicado</Text>
          </Button>
          <Button
            onPress={handleDeleteAnnouncementClick}
            appearance="ghost"
            accessoryLeft={DeleteIcon}
          >
            <Text>Excluir comunicado</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default AnnouncementDetails;

const styles = {
  image: {
    width: 300,
    height: 300,
    borderRadius: 8,
  },

  mainContent: {
    width: "100%",
    height: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    display: "flex",
    flexDirection: "column",
    gap: 15,
    marginBottom: 30,
  },
};
