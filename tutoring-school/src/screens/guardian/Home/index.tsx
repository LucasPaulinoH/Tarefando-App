import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { Button, Input, ButtonGroup } from "@ui-kitten/components";
import { Student } from "../../../services/Student/type";
import studentApi from "../../../services/Student";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
} from "../../../theme/Icons";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import StudentListItem from "../../../components/StudentListItem";

const GuardianHome = ({ navigation }: any) => {
  const { authState, onLogout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);

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

  const handleDeleteStudentClick = async (studentId: string) => {
    try {
      await studentApi.deleteStudent(studentId);
      fetchSelfStudents(authState?.user?.id);
    } catch (error) {
      console.error("Error deleting school: ", error);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View>
      <Button
        accessoryLeft={AddIcon}
        onPress={() => {
          navigation.navigate("AddStudent");
        }}
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
                  handleDeleteStudentClick(student.id!);
                }}
              />
            </ButtonGroup>
          }
          key={student.id}
        />
      ))}
    </View>
  );
};

export default GuardianHome;
