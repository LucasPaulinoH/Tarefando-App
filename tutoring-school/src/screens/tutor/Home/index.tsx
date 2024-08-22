import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { School } from "../../../services/School/type";
import { useAuth } from "../../../context/AuthContext";
import schoolApi from "../../../services/School";
import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  Input,
  Text,
} from "@ui-kitten/components";
import styles from "./styles";
import { shortenLargeTexts } from "../../../utils/stringUtils";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
  UnlinkSchoolIcon,
} from "../../../theme/Icons";
import { deleteImageFromFirebase } from "../../../utils/imageFunctions";
import GenericModal from "../../../components/GenericModal";

const TutorHome = ({ navigation }: any) => {
  const { authState } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [ownedSchools, setOwnedSchools] = useState<School[]>([]);

  const [selectedSchoolToDeleteInfo, setSelectedSchoolToDeleteInfo] = useState({
    id: "",
    profileImage: "",
  });

  const [
    isDeleteSchoolConfirmationVisible,
    setIsDeleteSchoolConfirmationVisible,
  ] = useState(false);

  useEffect(() => {
    fetchOwnedSchools(authState?.user?.id);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOwnedSchools(authState?.user?.id);
    }, [authState?.user?.id])
  );

  const fetchOwnedSchools = async (tutorId: string | undefined) => {
    try {
      const tutorSchoolsResponse = await schoolApi.getSchoolsFromTutor(
        tutorId!
      );
      setOwnedSchools(tutorSchoolsResponse);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredSchools = ownedSchools.filter((school) =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSchoolDetailsClick = (schoolId: string) => {
    SecureStore.setItem("selectedSchoolId", JSON.stringify(schoolId));
    navigation.navigate("SchoolDetails");
  };

  const handleEditSchoolClick = (school: School) => {
    SecureStore.setItem("selectedSchool", JSON.stringify(school));
    navigation.navigate("EditSchool");
  };

  const handleDeleteSchool = async () => {
    const { id, profileImage } = selectedSchoolToDeleteInfo;

    try {
      if (profileImage && profileImage !== "") {
        await deleteImageFromFirebase(profileImage);
        console.log(`${profileImage} successfully deleted from firebase`);
      }

      await schoolApi.deleteSchool(id);
      fetchOwnedSchools(authState?.user?.id);
    } catch (error) {
      console.error("Error deleting school: ", error);
    }

    setIsDeleteSchoolConfirmationVisible(false);
  };

  const handleSelectSchoolForDeletion = (
    schoolId: string,
    profileImage: string
  ) => {
    setSelectedSchoolToDeleteInfo({
      id: schoolId,
      profileImage: profileImage,
    });
    setIsDeleteSchoolConfirmationVisible(true);
  };

  const deleteSchoolConfirmationModal = (
    <GenericModal
      isVisible={isDeleteSchoolConfirmationVisible}
      setIsVisible={setIsDeleteSchoolConfirmationVisible}
    >
      <Card disabled={true}>
        <Button
          accessoryLeft={UnlinkSchoolIcon}
          onPress={() => setIsDeleteSchoolConfirmationVisible(false)}
          appearance="ghost"
        />
        <Text>Tem certeza que deseja excluir esta escola?</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <Button onPress={handleDeleteSchool}>Sim</Button>
          <Button
            appearance="outline"
            onPress={() => setIsDeleteSchoolConfirmationVisible(false)}
          >
            Não
          </Button>
        </View>
      </Card>
    </GenericModal>
  );

  return (
    <View>
      {deleteSchoolConfirmationModal}
      <Button
        accessoryLeft={AddIcon}
        onPress={() => navigation.navigate("AddSchool")}
      >
        Adicionar escola
      </Button>
      <Input
        placeholder="Pesquise uma escola..."
        accessoryLeft={SearchIcon}
        value={searchTerm}
        onChangeText={(search) => setSearchTerm(search)}
      />
      {filteredSchools.map((school: School) => (
        <Card
          key={school.id}
          onPress={() => handleSchoolDetailsClick(school.id!)}
        >
          <View style={styles.schoolCard}>
            <View style={styles.schoolCardFirstHalf}>
              <Avatar
                size="giant"
                src={school.profileImage}
                style={styles.schoolAvatar}
              />

              <View>
                <Text category="h6">{school.name}</Text>
                <Text>{`${shortenLargeTexts(
                  `${school.district}`,
                  20
                )}, ${shortenLargeTexts(`${school.city}`, 20)}`}</Text>
              </View>
            </View>

            <View>
              <ButtonGroup appearance="ghost">
                <Button
                  accessoryLeft={EditIcon}
                  onPress={() => handleEditSchoolClick(school)}
                />
                <Button
                  accessoryLeft={DeleteIcon}
                  onPress={() =>
                    handleSelectSchoolForDeletion(
                      school.id!,
                      school.profileImage!
                    )
                  }
                />
              </ButtonGroup>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
};

export default TutorHome;
