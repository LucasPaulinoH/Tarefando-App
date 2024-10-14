import { useCallback, useEffect, useState } from "react";
import { ScrollView, View, Image } from "react-native";
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
  useTheme,
} from "@ui-kitten/components";
import { StyleSheet } from "react-native";
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

  const theme = useTheme();

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
    <ScrollView style={{ backgroundColor: theme["color-primary-100"] }}>
      <View style={styles.mainContent}>
        {deleteSchoolConfirmationModal}

        <View style={styles.addAndSearchBarContainer}>
          <Button
            accessoryLeft={AddIcon}
            onPress={() => navigation.navigate("AddSchool")}
            style={{ width: "100%" }}
          >
            Adicionar escola
          </Button>
          {ownedSchools.length > 0 ? (
            <Input
              placeholder="Pesquise uma escola..."
              accessoryLeft={SearchIcon}
              value={searchTerm}
              onChangeText={(search) => setSearchTerm(search)}
            />
          ) : null}
        </View>

        <ScrollView style={styles.schoolListContainer}>
          {filteredSchools.length > 0 ? (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                height: "100%",
              }}
            >
              {filteredSchools.map((school: School) => (
                <Card
                  key={school.id}
                  onPress={() => handleSchoolDetailsClick(school.id!)}
                  style={{
                    borderWidth: 0,
                    backgroundColor: theme["color-primary-200"],
                  }}
                >
                  <View style={styles.schoolCard}>
                    <View style={styles.schoolCardFirstHalf}>
                      <Avatar
                        size="giant"
                        src={school.profileImage!}
                        style={styles.schoolAvatar}
                      />

                      <View>
                        <Text category="h6">{school.name}</Text>
                        <Text>{`${shortenLargeTexts(
                          `${school.district}`,
                          17
                        )}`}</Text>
                      </View>
                    </View>

                    <View>
                      <Button
                        accessoryLeft={EditIcon}
                        onPress={() => handleEditSchoolClick(school)}
                        appearance="ghost"
                      />
                      <Button
                        accessoryLeft={DeleteIcon}
                        onPress={() =>
                          handleSelectSchoolForDeletion(
                            school.id!,
                            school.profileImage!
                          )
                        }
                         appearance="ghost"
                      />
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <View
              style={{
                width: "100%",
                marginTop: 100,
                gap: 20,
              }}
            >
              <Image />
              <Text style={{ textAlign: "center" }} category="h6">
                Nenhuma escola cadastrada!
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default TutorHome;

const styles = StyleSheet.create({
  schoolCard: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  addAndSearchBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
  },

  schoolCardFirstHalf: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  schoolListContainer: {
    marginTop: 25,
    marginBottom: 20,
  },

  noSchoolsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  schoolAvatar: {
    borderRadius: 5,
  },

  mainContent: {
    width: "100%",
    height: "100%",
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },
});
