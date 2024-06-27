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
  LogoutIcon,
  SearchIcon,
} from "../../../theme/Icons";

const TutorHome = ({ navigation }: any) => {
  const { authState, onLogout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [ownedSchools, setOwnedSchools] = useState<School[]>([]);

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

  const handleDeleteSchoolClick = async (schoolId: string) => {
    try {
      await schoolApi.deleteSchool(schoolId);
      fetchOwnedSchools(authState?.user?.id);
    } catch (error) {
      console.error("Error deleting school: ", error);
    }
  };

  return (
    <View>
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
                  onPress={() => handleDeleteSchoolClick(school.id!)}
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
