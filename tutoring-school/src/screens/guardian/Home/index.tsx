import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { Button, Card, Input, Text, ButtonGroup } from "@ui-kitten/components";
import { Student } from "../../../services/Student/type";
import studentApi from "../../../services/Student";
import styles from "./styles";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
} from "../../../theme/Icons";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

const GuardianHome = ({ navigation }: any) => {
  const { authState } = useAuth();

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

  const handleStudentDetailsClick = (student: Student) => {
    SecureStore.setItem("selectedStudent", JSON.stringify(student));
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
      <Input placeholder="Buscar estudantes..." accessoryLeft={SearchIcon} />
      {students.map((student: Student) => (
        <Card
          key={student.id}
          onPress={() => handleStudentDetailsClick(student)}
        >
          <View style={styles.studentCard}>
            <View style={styles.studentCardFirstHalf}>
              <Text category="h6">{student.name}</Text>
              <View style={styles.pendentTasksIconAndLabel}></View>
            </View>

            <View>
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
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
};

export default GuardianHome;
