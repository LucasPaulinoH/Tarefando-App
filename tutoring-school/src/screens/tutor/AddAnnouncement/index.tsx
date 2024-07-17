import { ScrollView, View, Image, StyleSheet } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CheckBox,
  Input,
  Modal,
  Text,
} from "@ui-kitten/components";
import { CloseIcon, SendMessageIcon } from "../../../theme/Icons";
import {
  handleSetMultipleSelectedImageState,
  uploadImageToFirebase,
} from "../../../utils/imageFunctions";
import userApi from "../../../services/User";
import { AssociatedGuardianCard } from "../../../services/User/type";
import { Announcement } from "../../../services/Announcement/type";
import announcementApi from "../../../services/Announcement";

const GALLERY_IMAGE_SIZE = 160;

const AddAnnouncement = ({ navigation }: any) => {
  const { authState } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [receiverIds, setReceiverIds] = useState<string[]>([]);

  const [associatedGuardians, setAssociatedGuardians] = useState<
    AssociatedGuardianCard[]
  >([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddAnnouncementClick = async () => {
    try {
      const newAnnouncement: Announcement = {
        userId: authState?.user?.id!,
        title,
        description,
        receiverIds,
      };

      const newAnnouncementResponse = await announcementApi.createAnnouncement(
        newAnnouncement
      );

      if (images.length > 0) {
        const updatedImageUrls = [];

        for (let i = 0; i < images.length; i++) {
          updatedImageUrls.push(
            await uploadImageToFirebase(
              images[i],
              `announcements/${newAnnouncementResponse.id}/${i + 1}`
            )
          );
        }

        await announcementApi.updateAnnouncementImages(
          newAnnouncementResponse.id!,
          updatedImageUrls
        );
      }

      navigation.navigate("TutorAnnouncements");
    } catch (error) {
      console.log("Error adding announcement: ", error);
    }
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

  const selectAGuardianToSendAnnouncement = (guardianId: string) => {
    if (!receiverIds.includes(guardianId)) {
      setReceiverIds((previousIds) => [...previousIds, guardianId]);
    } else
      setReceiverIds((previousIds) =>
        previousIds.filter((id) => id !== guardianId)
      );
  };

  useEffect(() => {
    fetchAssociatedGuardians();
  }, []);

  const associatedGuardiansModal = (
    <Modal
      backdropStyle={styles.backdrop}
      visible={isModalVisible}
      onBackdropPress={() => setIsModalVisible(false)}
    >
      <Card disabled={true}>
        <Text category="h6">Enviar para...</Text>
        {associatedGuardians.map((guardian: AssociatedGuardianCard) => (
          <Card key={guardian.guardianId}>
            <View>
              <View>
                <Avatar size="giant" src={guardian.profileImage} />

                <View>
                  <Text category="h6">{guardian.name}</Text>
                </View>
              </View>

              <View>
                <CheckBox
                  checked={receiverIds.includes(guardian.guardianId)}
                  onChange={() =>
                    selectAGuardianToSendAnnouncement(guardian.guardianId)
                  }
                />
              </View>
            </View>
          </Card>
        ))}
        <Button
          accessoryLeft={SendMessageIcon}
          onPress={handleAddAnnouncementClick}
        >
          Enviar
        </Button>
      </Card>
    </Modal>
  );

  return (
    <ScrollView>
      <Text category="h6">Novo comunicado</Text>
      <Input
        placeholder="Título *"
        value={title}
        onChangeText={(title) => setTitle(title)}
      />
      <Input
        placeholder="Descrição *"
        multiline={true}
        numberOfLines={5}
        value={description}
        onChangeText={(description) => setDescription(description)}
      />
      <Button onPress={() => handleSetMultipleSelectedImageState(setImages)}>
        <Text>Adicione imagens</Text>
      </Button>
      <Text>{` ${
        images?.length! > 0 ? `Imagens selecionadas (${images?.length}):` : ""
      }`}</Text>
      <View>
        {images?.length! > 0 &&
          images?.map((imageUrl: string, index: number) => (
            <View key={index}>
              <CloseIcon
                style={{
                  width: 25,
                  height: 25,
                }}
                onPress={() => setImages(images.filter((_, i) => i !== index))}
              />
              <Image
                source={{ uri: imageUrl }}
                width={GALLERY_IMAGE_SIZE}
                height={GALLERY_IMAGE_SIZE}
              />
            </View>
          ))}
      </View>
      <Button
        accessoryLeft={SendMessageIcon}
        onPress={() => setIsModalVisible(true)}
      >
        <Text>Enviar comunicado</Text>
      </Button>
      {associatedGuardiansModal}
    </ScrollView>
  );
};

export default AddAnnouncement;

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
