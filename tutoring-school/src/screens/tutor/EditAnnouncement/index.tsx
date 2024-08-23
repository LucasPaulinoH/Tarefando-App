import { ScrollView, View, Image, StyleSheet } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CheckBox,
  Input,
  Text,
} from "@ui-kitten/components";
import { CloseIcon, SendMessageIcon } from "../../../theme/Icons";
import {
  deleteImageFromFirebase,
  handleSetMultipleSelectedImageState,
  uploadImageToFirebase,
} from "../../../utils/imageFunctions";
import userApi from "../../../services/User";
import { AssociatedGuardianCard } from "../../../services/User/type";
import { Announcement } from "../../../services/Announcement/type";
import * as SecureStore from "expo-secure-store";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { announcementValidationSchema } from "../../../validations/announcements";
import GenericModal from "../../../components/GenericModal";
import announcementApi from "../../../services/Announcement";

const GALLERY_IMAGE_SIZE = 160;

const EditAnnouncement = ({ navigation }: any) => {
  const { authState } = useAuth();

  const selectedAnnouncement: Announcement = JSON.parse(
    SecureStore.getItem("selectedAnnouncement")!
  );

  const [announcementContent, setAnnouncementContent] = useState({
    title: "",
    description: "",
  });
  const [images, setImages] = useState(selectedAnnouncement.images);
  const [receiverIds, setReceiverIds] = useState<string[]>(
    selectedAnnouncement.receiverIds
  );

  const [associatedGuardians, setAssociatedGuardians] = useState<
    AssociatedGuardianCard[]
  >([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(announcementValidationSchema),
    defaultValues: {
      title: selectedAnnouncement.title,
      description: selectedAnnouncement.description,
    },
  });

  const storeAnnouncementContent = (formData: any) => {
    setIsModalVisible(true);
    setAnnouncementContent({
      title: formData.title,
      description: formData.description,
    });
  };

  const handleUpdateAnnouncementClick = async () => {
    try {
      const updatedAnnouncementResponse =
        await announcementApi.updateAnnouncement(selectedAnnouncement.id!, {
          userId: authState?.user?.id!,
          title: announcementContent.title,
          description: announcementContent.description,
          images,
          receiverIds,
        });

      if (images !== selectedAnnouncement.images! && images?.length! > 0) {
        let iterableImage = null;
        for (let i = 0; i < selectedAnnouncement.images!.length; i++) {
          iterableImage = selectedAnnouncement.images![i];

          await deleteImageFromFirebase(iterableImage);
        }

        const uploadedImageUrls: string[] = [];
        let iterableUploadedImageUrl = "";

        for (let i = 0; i < images?.length!; i++) {
          iterableImage = images![i];

          iterableUploadedImageUrl = await uploadImageToFirebase(
            iterableImage,
            `announcements/${updatedAnnouncementResponse.id}/${i + 1}`
          );

          uploadedImageUrls.push(iterableUploadedImageUrl);
        }

        await announcementApi.updateAnnouncementImages(
          updatedAnnouncementResponse.id!,
          uploadedImageUrls
        );
      }
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
    <GenericModal isVisible={isModalVisible} setIsVisible={setIsModalVisible}>
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
    </GenericModal>
  );

  return (
    <ScrollView>
      <Text category="h6">Editar comunicado</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Título *"
            value={value}
            onChangeText={onChange}
            status={errors.title ? "danger" : "basic"}
            caption={errors.title ? errors.title.message : ""}
          />
        )}
        name="title"
      />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Descrição *"
            value={value}
            onChangeText={onChange}
            multiline={true}
            numberOfLines={5}
            status={errors.description ? "danger" : "basic"}
            caption={errors.description ? errors.description.message : ""}
          />
        )}
        name="description"
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
        onPress={handleSubmit(storeAnnouncementContent)}
      >
        <Text>Confirmar edição</Text>
      </Button>
      {associatedGuardiansModal}
    </ScrollView>
  );
};

export default EditAnnouncement;
