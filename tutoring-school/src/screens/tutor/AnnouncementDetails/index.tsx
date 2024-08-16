import { ScrollView, View, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Announcement } from "../../../services/Announcement/type";
import { Button, Text } from "@ui-kitten/components";
import { deleteImageFromFirebase } from "../../../utils/imageFunctions";
import announcementApi from "../../../services/Announcement";
import { useEffect, useState } from "react";
import userApi from "../../../services/User";
import { AssociatedGuardianCard } from "../../../services/User/type";
import { useAuth } from "../../../context/AuthContext";

const AnnouncementDetails = ({ navigation }: any) => {
  const selectedAnnouncement: Announcement = JSON.parse(
    SecureStore.getItem("selectedAnnouncement")!
  );

  const { authState } = useAuth();

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
    SecureStore.setItem("selectedAnnouncement", JSON.stringify(selectedAnnouncement));
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
    <ScrollView>
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
      <Button onPress={handleEditAnnouncementClick}>
        <Text>Editar comunicado</Text>
      </Button>
      <Button onPress={handleDeleteAnnouncementClick} appearance="outline">
        <Text>Excluir comunicado</Text>
      </Button>
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
};
