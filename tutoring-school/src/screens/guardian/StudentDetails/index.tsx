import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Student } from "../../../services/Student/type";
import {
  Avatar,
  Button,
  ButtonGroup,
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
  UnlinkSchoolIcon,
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
import { School } from "../../../services/School/type";
import schoolApi from "../../../services/School";
import { shortenLargeTexts } from "../../../utils/stringUtils";

const StudentDetails = ({ navigation }: any) => {
  const selectedStudentId: string = JSON.parse(
    SecureStore.getItem("selectedStudentId")!
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [student, setStudent] = useState<Student>({} as Student);
  const [selectedTask, setSelectedTask] = useState<Task>({} as Task);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [school, setSchool] = useState<School>({} as School);

  const handleTaskDetailsClick = (taskId: string) => {
    SecureStore.setItem("selectedTaskId", JSON.stringify(taskId));
    navigation.navigate("TaskDetails");
  };

  const fetchStudentDetails = async () => {
    try {
      const studentResponse = await studentApi.getStudent(selectedStudentId);
      setStudent(studentResponse);
      setTasks(studentResponse.tasks!);
    } catch (error) {
      console.error("Error fetching user details: ", error);
    }
  };

  const fetchSchool = async () => {
    try {
      const schoolResponse = await schoolApi.getSchool(student.schoolId!);
      setSchool(schoolResponse);
    } catch (error) {
      console.error("Error fetching student school: ", error);
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

  const handleSchoolClick = () => {
    SecureStore.setItem("selectedSchool", JSON.stringify(school));
    navigation.navigate("SchoolDetails");
  };

  const handleUnlinkFromSchool = async () => {
    try {
      await studentApi.unlinkStudentFromSchool(selectedStudentId);
      navigation.navigate("GuardianHome");
    } catch (error) {
      console.error("Error unlinking student from school: ", error);
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
    fetchSchool();
  }, [student]);

  useEffect(() => {
    getSubjectsFromATaskArray(student!.tasks!).then((tasksSubjects) =>
      setSubjects(tasksSubjects!)
    );
  }, [student]);

  const showStudentAgeString = (ageInYears: number): string => {
    return ageInYears !== 1 ? `${ageInYears} anos` : `${ageInYears} ano`;
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subjects.some(
        (subject) =>
          subject.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          subject.id === task.subjectId
      )
  );

  return (
    <View>
      <Text category="h5">{student!.name}</Text>
      <Text category="s1" style={{ textAlign: "justify" }}>
        {`${showStudentAgeString(
          calculateAge(new Date(student!.birthdate))
        )}, ${student!.grade}`}
      </Text>
      {student.schoolId ? (
        <>
          <Text category="h6">Vinculado à:</Text>
          <Card onPress={handleSchoolClick}>
            <View style={styles.schoolCard}>
              <View style={styles.schoolCardFirstHalf}>
                <Avatar
                  size="giant"
                  src={school.profileImage}
                  style={styles.schoolAvatar}
                />

                <View>
                  <Text category="h6">{school.name ?? "..."}</Text>
                  <Text>{`${shortenLargeTexts(
                    `${school.district}`,
                    20
                  )}, ${shortenLargeTexts(`${school.city}`, 20)}`}</Text>
                </View>
              </View>

              <View>
                <Button
                  accessoryLeft={UnlinkSchoolIcon}
                  onPress={handleUnlinkFromSchool}
                  appearance="ghost"
                />
              </View>
            </View>
          </Card>
        </>
      ) : null}

      {student.schoolId ? (
        <>
          <Button accessoryLeft={AddIcon} onPress={handleAddTaskClick}>
            Adicionar atividade
          </Button>
          {filteredTasks.length > 0 ? (
            <Input
              placeholder="Buscar atividade..."
              accessoryLeft={SearchIcon}
              value={searchTerm}
              onChangeText={(search) => setSearchTerm(search)}
            />
          ) : null}

          {filteredTasks.map((task) => (
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
                          onPress={() =>
                            handleDeleteTaskClick(selectedTask.id!)
                          }
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
        </>
      ) : null}
    </View>
  );
};

export default StudentDetails;
