import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Student } from "../../../services/Student/type";
import { Button, Card, Input, Text } from "@ui-kitten/components";
import { AddIcon, DeleteIcon, SearchIcon } from "../../../theme/Icons";
import TaskStatusChip from "../../../components/TaskStatusChip";
import styles from "./styles";
import { Subject } from "../../../services/Subject/type";
import { useEffect, useState } from "react";
import {
  calculateAge,
  getSubjectsFromATaskArray,
} from "../../../utils/generalFunctions";
import studentApi from "../../../services/Student";

const StudentDetails = ({ navigation }: any) => {
  const selectedStudentId: string = JSON.parse(
    SecureStore.getItem("selectedStudentId")!
  );

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [student, setStudent] = useState<Student>({} as Student);

  const handleTaskDetailsClick = (taskId: string) => {
    SecureStore.setItem("selectedTaskId", JSON.stringify(taskId));
    navigation.navigate("TaskDetails");
  };

  const fetchStudentDetails = async () => {
    try {
      const studentResponse = await studentApi.getStudent(selectedStudentId);
      setStudent(studentResponse);
    } catch (error) {
      console.error("Error fetching user details: ", error);
    }
  };

  const handleAddTaskClick = () => {
    SecureStore.setItem("selectedStudentId", JSON.stringify(student!.id));
    navigation.navigate("AddTask");
  };

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  useEffect(() => {
    getSubjectsFromATaskArray(student!.tasks!).then((tasksSubjects) =>
      setSubjects(tasksSubjects!)
    );
  }, [student]);

  const showStudentAgeString = (ageInYears: number): string => {
    return ageInYears !== 1 ? `${ageInYears} anos` : `${ageInYears} ano`;
  };

  return (
    <View>
      <Text category="h5">{student!.name}</Text>
      <Text category="s1" style={{ textAlign: "justify" }}>
        {`${showStudentAgeString(
          calculateAge(new Date(student!.birthdate))
        )}, ${student!.grade}`}
      </Text>
      <Button accessoryLeft={AddIcon} onPress={handleAddTaskClick}>
        Adicionar atividade
      </Button>
      <Input placeholder="Buscar atividade..." accessoryLeft={SearchIcon} />

      {student!.tasks?.map((task) => (
        <Card
          key={task.id}
          onPress={() => {
            handleTaskDetailsClick(task.id!);
          }}
        >
          <View style={styles.taskCard}>
            <View>
              <Text category="h6">{task.title}</Text>
              <Text category="s1">
                {subjects.find((subject) => subject.id === task.subjectId)
                  ?.name || "Carregando..."}
              </Text>
            </View>

            <View style={styles.taskCardSecondHalf}>
              <TaskStatusChip
                deadlineDate={task.deadlineDate}
                isConcluded={task.concluded!}
              />
              <Button accessoryLeft={DeleteIcon} appearance="ghost" />
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
};

export default StudentDetails;
