import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Student } from "../../../services/Student/type";
import { Button, Card, Input, Text } from "@ui-kitten/components";
import { AddIcon, SearchIcon } from "../../../theme/Icons";
import TaskStatusChip from "../../../components/TaskStatusChip";
import styles from "./styles";
import { Task } from "../../../services/Task/type";
import { Subject } from "../../../services/Subject/type";
import { useEffect, useState } from "react";
import {
  calculateAge,
  getSubjectsFromATaskArray,
} from "../../../utils/generalFunctions";

const StudentDetails = ({ navigation }: any) => {
  const selectedStudent: Student = JSON.parse(
    SecureStore.getItem("selectedStudent")!
  );

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const handleTaskDetailsClick = (task: Task) => {
    SecureStore.setItem("selectedTask", JSON.stringify(task));
    navigation.navigate("TaskDetails");
  };

  useEffect(() => {
    getSubjectsFromATaskArray(selectedStudent.tasks!).then((tasksSubjects) =>
      setSubjects(tasksSubjects!)
    );
  }, []);

  const showStudentAgeString = (ageInYears: number): string => {
    return ageInYears !== 1 ? `${ageInYears} anos` : `${ageInYears} ano`;
  };

  return (
    <View>
      <Text category="h5">{selectedStudent.name}</Text>
      <Text category="s1" style={{ textAlign: "justify" }}>
        {`${showStudentAgeString(
          calculateAge(new Date(selectedStudent.birthdate))
        )}, ${selectedStudent.grade}`}
      </Text>
      <Button
        accessoryLeft={AddIcon}
        onPress={() => navigation.navigate("AddTask")}
      >
        Adicionar atividade
      </Button>
      <Input placeholder="Buscar atividade..." accessoryLeft={SearchIcon} />

      {selectedStudent.tasks?.map((task) => (
        <Card
          key={task.id}
          onPress={() => {
            handleTaskDetailsClick(task);
          }}
        >
          <View style={styles.taskCard}>
            <View>
              <Text category="h6">{task.title}</Text>
              <Text category="s1">
                {subjects.find((subject) => subject.id === task.subjectId)
                  ?.name || "..."}
              </Text>
            </View>

            <TaskStatusChip
              deadlineDate={task.deadlineDate}
              isConcluded={task.concluded!}
            />
          </View>
        </Card>
      ))}
    </View>
  );
};

export default StudentDetails;
