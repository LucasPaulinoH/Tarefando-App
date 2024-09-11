import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import {
  Button,
  Input,
  ButtonGroup,
  Card,
  useTheme,
} from "@ui-kitten/components";
import { Student } from "../../../services/Student/type";
import studentApi from "../../../services/Student";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
  UnlinkSchoolIcon,
} from "../../../theme/Icons";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import StudentListItem from "../../../components/StudentListItem";
import GenericModal from "../../../components/GenericModal";
import { StyleSheet } from "react-native";

const GuardianHome = ({ navigation }: any) => {
  const { authState } = useAuth();

  const theme = useTheme();

  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);

  const [
    isDeleteStudentConfirmationVisible,
    setIsDeleteStudentConfirmationVisible,
  ] = useState(false);

  const [studentIdToBeDeleted, setStudentIdToBeDeleted] = useState("");

  useEffect(() => {
    fetchSelfStudents(authState?.user?.id);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSelfStudents(authState?.user?.id);
    }, [authState?.user?.id])
  );

  const fetchSelfStudents = async (guardianId: string | undefined) => {
    try {
      const guardianStudentsResponse = await studentApi.getStudentsFromGuardian(
        guardianId!
      );
      setStudents(guardianStudentsResponse);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStudentDetailsClick = (studentId: string) => {
    SecureStore.setItem("selectedStudentId", JSON.stringify(studentId));
    navigation.navigate("StudentDetails");
  };

  const handleEditStudentClick = (student: Student) => {
    SecureStore.setItem("selectedStudent", JSON.stringify(student));
    navigation.navigate("EditStudent");
  };

  const handleDeleteStudent = async () => {
    try {
      await studentApi.deleteStudent(studentIdToBeDeleted);
      fetchSelfStudents(authState?.user?.id);
    } catch (error) {
      console.error("Error deleting school: ", error);
    }
    setIsDeleteStudentConfirmationVisible(false);
  };

  const handleSelectStudentForDeletion = (id: string) => {
    setStudentIdToBeDeleted(id);
    setIsDeleteStudentConfirmationVisible(true);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteSchoolConfirmationModal = (
    <GenericModal
      isVisible={isDeleteStudentConfirmationVisible}
      setIsVisible={setIsDeleteStudentConfirmationVisible}
    >
      <Card disabled={true}>
        <Button
          accessoryLeft={UnlinkSchoolIcon}
          onPress={() => setIsDeleteStudentConfirmationVisible(false)}
          appearance="ghost"
        />
        <Text>Tem certeza que deseja excluir este estudante?</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <Button onPress={handleDeleteStudent}>Sim</Button>
          <Button
            appearance="outline"
            onPress={() => setIsDeleteStudentConfirmationVisible(false)}
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
            onPress={() => {
              navigation.navigate("AddStudent");
            }}
            style={styles.addStudentButton}
          >
            Adicionar estudante
          </Button>
          {students.length > 0 ? (
            <Input
              placeholder="Buscar estudantes..."
              accessoryLeft={SearchIcon}
              value={searchTerm}
              onChangeText={(search) => setSearchTerm(search)}
            />
          ) : null}
        </View>

        {filteredStudents.length > 0 ? (
          <ScrollView style={styles.studentListContainer}>
            {filteredStudents.map((student: Student) => (
              <StudentListItem
                student={student}
                onPress={() => handleStudentDetailsClick(student.id!)}
                actions={
                  <ButtonGroup appearance="ghost">
                    <Button
                      accessoryLeft={EditIcon}
                      onPress={() => {
                        handleEditStudentClick(student);
                      }}
                    />
                    <Button
                      accessoryLeft={DeleteIcon}
                      onPress={() => {
                        handleSelectStudentForDeletion(student.id!);
                      }}
                    />
                  </ButtonGroup>
                }
                key={student.id}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noStudentsContainer}>
            <Text>Não há alunos cadastrados.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default GuardianHome;

const styles = StyleSheet.create({
  mainContent: {
    width: "100%",
    height: "100%",
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },

  noStudentsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  addStudentButton: {
    width: "100%",
  },

  addAndSearchBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
  },

  studentListContainer: {
    marginTop: 25,
    marginBottom: 20,
  },

  studentCard: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  studentCardFirstHalf: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  studentNameAndLinked: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
  },

  pendentTasksIconAndLabel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  exitModal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },

  exitModalCloseButton: {
    marginTop: -22,
    marginRight: -40,
    alignSelf: "flex-end",
  },

  exitModalOptionsContainer: {
    width: "100%",
    marginTop: 20,
  },
});
