import { ScrollView, View, Image, TouchableOpacity } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CheckBox,
  Input,
  Text,
  useTheme,
} from "@ui-kitten/components";
import { CloseIcon, ImageIcon, SendMessageIcon } from "../../../theme/Icons";
import {
  handleSetMultipleSelectedImageState,
  uploadImageToFirebase,
} from "../../../utils/imageFunctions";
import userApi from "../../../services/User";
import { AssociatedGuardianCard } from "../../../services/User/type";
import { Announcement } from "../../../services/Announcement/type";
import announcementApi from "../../../services/Announcement";
import GenericModal from "../../../components/GenericModal";
import { Controller, useForm } from "react-hook-form";
import { announcementValidationSchema } from "../../../validations/announcements";
import { yupResolver } from "@hookform/resolvers/yup";
import BackPageButton from "../../../components/BackPageButton";
import userIcon from "../../../../assets/user.png";

const AddAnnouncement = ({ navigation }: any) => {
  const { authState } = useAuth();

  const theme = useTheme();

  const [announcementContent, setAnnouncementContent] = useState({
    title: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [receiverIds, setReceiverIds] = useState<string[]>([]);

  const [associatedGuardians, setAssociatedGuardians] = useState<
    AssociatedGuardianCard[]
  >([]);

  const [isModalVisible, setIsModalVisible] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(announcementValidationSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const storeAnnouncementContent = (formData: any) => {
    setIsModalVisible(true);
    setAnnouncementContent({
      title: formData.title,
      description: formData.description,
    });
  };

  const handleAddAnnouncementClick = async () => {
    try {
      const newAnnouncement: Announcement = {
        userId: authState?.user?.id!,
        title: announcementContent.title,
        description: announcementContent.description,
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
    <GenericModal isVisible={isModalVisible} setIsVisible={setIsModalVisible}>
      <Card disabled={true} style={{ borderWidth: 0 }}>
        <View style={{ ...styles.imageGallery, gap: 15 }}>
          <Text category="h6">Enviar para...</Text>
          {associatedGuardians.map((guardian: AssociatedGuardianCard) => (
            <Card
              key={guardian.guardianId}
              style={{
                borderWidth: 0,
                backgroundColor: theme["color-primary-200"],
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <Avatar
                  size="giant"
                  source={
                    guardian.profileImage
                      ? { uri: guardian.profileImage }
                      : userIcon
                  }
                  style={{
                    borderWidth: 2,
                    borderStyle: "solid",
                    borderColor: theme["color-primary-300"],
                  }}
                />

                <View>
                  <Text category="h6">{guardian.name}</Text>
                </View>

                <CheckBox
                  checked={receiverIds.includes(guardian.guardianId)}
                  onChange={() =>
                    selectAGuardianToSendAnnouncement(guardian.guardianId)
                  }
                />
              </View>
            </Card>
          ))}
          <Button
            accessoryLeft={SendMessageIcon}
            onPress={handleAddAnnouncementClick}
          >
            Enviar
          </Button>
        </View>
      </Card>
    </GenericModal>
  );

  return (
    <ScrollView style={{ backgroundColor: theme["color-primary-100"] }}>
      <BackPageButton onPress={() => navigation.goBack()} />
      <View style={styles.mainContent}>
        <Text category="h6">Novo comunicado</Text>
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
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              status={errors.description ? "danger" : "basic"}
              caption={errors.description ? errors.description.message : ""}
            />
          )}
          name="description"
        />

        <Button
          onPress={() => handleSetMultipleSelectedImageState(setImages)}
          accessoryLeft={ImageIcon}
        >
          <Text>Adicione imagens</Text>
        </Button>
        <Text>{` ${
          images?.length! > 0 ? `Imagens selecionadas (${images?.length}):` : ""
        }`}</Text>
        <View style={styles.imageGallery}>
          {images?.length! > 0 &&
            images?.map((imageUrl: string, index: number) => (
              <View key={index} style={styles.galleryImageContainer}>
                <TouchableOpacity
                  style={styles.galleryImageDelete}
                  onPress={() =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                >
                  <CloseIcon fill={theme["color-primary-100"]} />
                </TouchableOpacity>
                <Image source={{ uri: imageUrl }} style={styles.galleryImage} />
              </View>
            ))}
        </View>
        <Button
          accessoryLeft={SendMessageIcon}
          onPress={handleSubmit(storeAnnouncementContent)}
        >
          <Text>Enviar comunicado</Text>
        </Button>
        {associatedGuardiansModal}
      </View>
    </ScrollView>
  );
};

export default AddAnnouncement;

export const styles = {
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

  imageGallery: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  galleryImageContainer: {
    position: "relative",
    height: 300,
  },

  galleryImage: {
    width: "100%",
    height: "100%",
  },

  galleryImageDelete: {
    width: 25,
    height: 25,
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 50,
  },
};
