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
  PendentTaskIcon,
  SearchIcon,
} from "../../../theme/Icons";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Task } from "../../../services/Task/type";

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

  const countPendentTasksInTaskArray = (tasks: Task[]): number => {
    let pendentTaskCounter = 0;

    let iterableTask = null;
    for (let i = 0; i < tasks.length; i++) {
      iterableTask = tasks[i];

      if (!iterableTask.concluded) pendentTaskCounter++;
    }

    return pendentTaskCounter;
  };

  const showStudentPendentTasksString = (
    pendentTaskQuantity: number
  ): string => {
    return pendentTaskQuantity === 0
      ? `Nenhuma atividade pendente`
      : pendentTaskQuantity === 1
      ? `1 atividade pendente`
      : `${pendentTaskQuantity} atividades pendentes`;
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
        <Card
          key={student.id}
          onPress={() => handleStudentDetailsClick(student.id!)}
        >
          <View style={styles.studentCard}>
            <View style={styles.studentCardFirstHalf}>
              <View style={styles.studentNameAndLinked}>
                <Text category="h6">{student.name}</Text>
              </View>
              <View style={styles.pendentTasksIconAndLabel}>
                {(() => {
                  const pendentTasksQuantity = countPendentTasksInTaskArray(
                    student.tasks!
                  );
                  return !student.schoolId ? (
                    <>
                      <Text>Sem vínculo escolar</Text>
                    </>
                  ) : pendentTasksQuantity > 0 ? (
                    <>
                      <PendentTaskIcon style={{ width: 20, height: 20 }} />
                      <Text>
                        {showStudentPendentTasksString(pendentTasksQuantity)}
                      </Text>
                    </>
                  ) : (
                    <Text>
                      {showStudentPendentTasksString(pendentTasksQuantity)}
                    </Text>
                  );
                })()}
              </View>
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
