import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Student } from "../../../services/Student/type";
import {
  Button,
  Card,
  Icon,
  Input,
  Layout,
  Modal,
  Popover,
  Text,
} from "@ui-kitten/components";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  MoreOptionsVerticalIcon,
  SearchIcon,
} from "../../../theme/Icons";
import TaskStatusChip from "../../../components/TaskStatusChip";
import styles from "./styles";
import { Subject } from "../../../services/Subject/type";
import { useCallback, useEffect, useState } from "react";
import {
  calculateAge,
  getSubjectsFromATaskArray,
} from "../../../utils/generalFunctions";
import studentApi from "../../../services/Student";
import taskApi from "../../../services/Task";
import { Task } from "../../../services/Task/type";
import { useFocusEffect } from "@react-navigation/native";

const StudentDetails = ({ navigation }: any) => {
  const selectedStudentId: string = JSON.parse(
    SecureStore.getItem("selectedStudentId")!
  );

  const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [student, setStudent] = useState<Student>({} as Student);
  const [selectedTask, setSelectedTask] = useState<Task>({} as Task);

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

  const handleEditTaskClick = (task: Task) => {
    SecureStore.setItem("selectedTask", JSON.stringify(task));
    navigation.navigate("EditTask");
  };

  const handleDeleteTaskClick = async (taskId: string) => {
    try {
      await taskApi.deleteTask(taskId);
      fetchStudentDetails();
      setMoreOptionsVisible(false);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const handleMoreOptionsClick = (task: Task) => {
    setSelectedTask(task);
    setMoreOptionsVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      fetchStudentDetails();
    }, [])
  );

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
              <Button
                accessoryLeft={MoreOptionsVerticalIcon}
                style={styles.moreOptionsButton}
                appearance="outline"
                onPress={() => handleMoreOptionsClick(task)}
              />
              <Modal
                visible={moreOptionsVisible}
                backdropStyle={styles.moreOptionsModal}
                onBackdropPress={() => setMoreOptionsVisible(false)}
              >
                <Card disabled={true}>
                  <View style={styles.modalCard}>
                    <Text>{selectedTask.title}</Text>
                    <Button
                      accessoryLeft={EditIcon}
                      onPress={() => handleEditTaskClick(task)}
                    >
                      Editar tarefa
                    </Button>
                    <Button
                      accessoryLeft={DeleteIcon}
                      onPress={() => handleDeleteTaskClick(selectedTask.id!)}
                    >
                      Excluir tarefa
                    </Button>
                  </View>
                </Card>
              </Modal>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
};

export default StudentDetails;
