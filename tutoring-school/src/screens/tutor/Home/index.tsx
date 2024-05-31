import { useEffect, useState } from "react";
import { View } from "react-native";
import { School } from "../../../services/School/type";
import { useAuth } from "../../../context/AuthContext";
import schoolApi from "../../../services/School";
import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  Icon,
  IconElement,
  Input,
  Text,
} from "@ui-kitten/components";
import styles from "./styles";

const EditIcon = (props: any): IconElement => (
  <Icon {...props} name="edit-outline" />
);

const DeleteIcon = (props: any): IconElement => (
  <Icon {...props} name="trash-2-outline" />
);

const AddSchoolIcon = (props: any): IconElement => (
  <Icon {...props} name="plus-square-outline" />
);

const SearchIcon = (props: any): IconElement => (
  <Icon {...props} name="search-outline" />
);

const TutorHome = () => {
  const { authState } = useAuth();

  const [ownedSchools, setOwnedSchools] = useState<School[]>([]);

  useEffect(() => {
    if (authState?.user?.id) fetchOwnedSchools(authState?.user?.id);
  }, [authState]);

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
  return (
    <View>
      <Button accessoryLeft={AddSchoolIcon}>Adicionar escola</Button>
      <Input placeholder="Pesquise uma escola..." accessoryLeft={SearchIcon} />
      {ownedSchools.map((school: School) => (
        <Card key={school.id}>
          <View style={styles.schoolCard}>
            <View style={styles.schoolCardFirstHalf}>
              <Avatar
                size="giant"
                src="https://njadvogados.com/website2020/wp-content/uploads/2020/10/educacao-em-portugal.jpg"
                style={styles.schoolAvatar}
              />

              <View>
                <Text category="h6">{school.name}</Text>
                <Text>{`${school.address}, ${school.district}`}</Text>
              </View>
            </View>

            <View>
              <ButtonGroup appearance="ghost">
                <Button accessoryLeft={EditIcon} />
                <Button accessoryLeft={DeleteIcon} />
              </ButtonGroup>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
};

export default TutorHome;
