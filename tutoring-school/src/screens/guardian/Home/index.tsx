import { useCallback, useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, Image } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import {
  Button,
  Input,
  ButtonGroup,
  Card,
  useTheme,
  Text,
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

  const [loading, setLoading] = useState(true);

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

      setLoading(false);
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

  const deleteStudentConfirmationModal = (
    <GenericModal
      isVisible={isDeleteStudentConfirmationVisible}
      setIsVisible={setIsDeleteStudentConfirmationVisible}
    >
      <Card disabled={true} style={styles.deleteStudentModal}>
        <Button
          style={styles.deleteStudentCloseButton}
          accessoryLeft={UnlinkSchoolIcon}
          onPress={() => setIsDeleteStudentConfirmationVisible(false)}
          appearance="ghost"
        />
        <Text>Tem certeza que deseja excluir este estudante?</Text>
        <View style={styles.deleteStudentModalOptionsContainer}>
          <Button onPress={handleDeleteStudent} style={styles.buttons}>
            Sim
          </Button>
          <Button
            appearance="ghost"
            onPress={() => setIsDeleteStudentConfirmationVisible(false)}
            style={styles.buttons}
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
        {!loading ? (
          <>
            {deleteStudentConfirmationModal}
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

            <ScrollView style={styles.studentListContainer}>
              {filteredStudents.length > 0 ? (
                <>
                  {filteredStudents.map((student: Student, index: number) => (
                    <>
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
                        key={`${student.id}_${index}`}
                      />
                    </>
                  ))}
                </>
              ) : (
                <View
                  style={{
                    ...styles.studentInfo,
                    width: "100%",
                    marginTop: 100,
                    gap: 20,
                  }}
                >
                  <Image
                    source={require("../../../../assets/noStudentRegistered.png")}
                    style={styles.image}
                  />
                  <Text style={{ textAlign: "center" }} category="h6">
                    Nenhum estudante encontrado!
                  </Text>
                </View>
              )}
            </ScrollView>
          </>
        ) : (
          <View style={{ ...styles.addAndSearchBarContainer, marginTop: 200 }}>
            <ActivityIndicator
              size="large"
              color={theme["color-primary-500"]}
            />
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

  studentInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  addStudentButton: {
    width: "100%",
  },

  image: {
    width: 220,
    height: 220,
    resizeMode: "contain",
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
    display: "flex",
    flexDirection: "column",
    gap: 10,
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

  buttons: { width: "100%" },

  deleteStudentModal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },

  deleteStudentCloseButton: {
    marginTop: -32,
    marginRight: -40,
    alignSelf: "flex-end",
  },

  deleteStudentModalOptionsContainer: {
    marginTop: 20,
  },
});
