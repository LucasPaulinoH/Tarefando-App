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
} from "../../../utils/imageFunctions";
import userApi from "../../../services/User";
import { AssociatedGuardianCard } from "../../../services/User/type";
import { Announcement } from "../../../services/Announcement/type";
import * as SecureStore from "expo-secure-store";

const GALLERY_IMAGE_SIZE = 160;

const EditAnnouncement = ({ navigation }: any) => {
  const { authState } = useAuth();

  const selectedAnnouncement: Announcement = JSON.parse(
    SecureStore.getItem("selectedAnnouncement")!
  );

  const [title, setTitle] = useState(selectedAnnouncement.title);
  const [description, setDescription] = useState(selectedAnnouncement.description);
  const [images, setImages] = useState(selectedAnnouncement.images);
  const [receiverIds, setReceiverIds] = useState<string[]>(selectedAnnouncement.receiverIds);

  const [associatedGuardians, setAssociatedGuardians] = useState<
    AssociatedGuardianCard[]
  >([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleUpdateAnnouncementClick = async () => {
    try {
      
      navigation.navigate("TutorAnnouncements");
    } catch (error) {
      console.log("Error updating announcement: ", error);
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
          onPress={handleUpdateAnnouncementClick}
        >
          Enviar editado
        </Button>
      </Card>
    </Modal>
  );

  return (
    <ScrollView>
      <Text category="h6">Editar comunicado</Text>
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
        <Text>Confirmar edição</Text>
      </Button>
      {associatedGuardiansModal}
    </ScrollView>
  );
};

export default EditAnnouncement;

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
