import { ScrollView, View, Image, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Student } from "../../../services/Student/type";
import {
  Avatar,
  Button,
  Card,
  Input,
  Modal,
  Text,
  useTheme,
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
import { CameraView, useCameraPermissions } from "expo-camera";
import { useAuth } from "../../../context/AuthContext";
import { UserRole } from "../../../types/Types";
import userApi from "../../../services/User";
import { UserCard } from "../../../services/User/type";
import { deleteImageFromFirebase } from "../../../utils/imageFunctions";
import GenericModal from "../../../components/GenericModal";
import { StyleSheet } from "react-native";

const StudentDetails = ({ navigation }: any) => {
  const selectedStudentId: string = JSON.parse(
    SecureStore.getItem("selectedStudentId")!
  );

  const theme = useTheme();

  const { authState } = useAuth();

  const [loading, setLoading] = useState(false);
  const [wantsToScanLinkingCode, setWantsToScanLinkingCode] = useState(false);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [readCode, setReadCode] = useState("");

  const [isScannedSchoolIdValid, setIsScannedSchoolIdValid] = useState(false);
  const [foundedSchool, setFoundedSchool] = useState({} as School);

  const [searchTerm, setSearchTerm] = useState("");

  const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [student, setStudent] = useState<Student>({} as Student);
  const [selectedTask, setSelectedTask] = useState<Task>({} as Task);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [school, setSchool] = useState<School>({} as School);
  const [guardianCard, setGuardianCard] = useState<UserCard>({
    userName: "Carregando...",
    profileImage: "",
  });

  const [isDeleteTaskConfirmationVisible, setIsDeleteTaskConfirmationVisible] =
    useState(false);
  const [taskIdToBeDeleted, setTaskIdToBeDeleted] = useState("");

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

  const checkSchoolarLink = async () => {
    try {
      const isSchoolValidResponse = await studentApi.checkStudentLinkValidity(
        student.id!
      );

      if (!isSchoolValidResponse) fetchStudentDetails()
    } catch (error) {
      console.error("Error checking schoolar link: ", error.response.data);
    }
  };

  const fetchSchool = async () => {
    try {
      const schoolResponse = await schoolApi.getSchool(student.schoolId!);
      setSchool(schoolResponse);
    } catch (error) {
      console.log("Error fetching student school: ", error);
    }
  };

  const fetchGuardian = async () => {
    try {
      const guardianCardResponse = await userApi.getUserCard(student.user!);
      setGuardianCard(guardianCardResponse);
    } catch (error) {
      console.log("Error fetching guardian: ", error);
    }
  };

  const handleAddTaskClick = () => {
    SecureStore.setItem("selectedStudentId", JSON.stringify(student!.id));
    navigation.navigate("AddTask");
  };

  const handleEditTaskClick = (task: Task) => {
    setMoreOptionsVisible(false);
    SecureStore.setItem("selectedTask", JSON.stringify(task));
    navigation.navigate("EditTask");
  };

  const handleDeleteTask = async () => {
    try {
      setMoreOptionsVisible(false);
      await taskApi.deleteTask(taskIdToBeDeleted);

      if (selectedTask.images !== null) {
        for (let i = 0; i < selectedTask.images.length; i++) {
          await deleteImageFromFirebase(selectedTask.images[i]);
        }
      }

      fetchStudentDetails();
    } catch (error) {
      console.log("Error deleting task: ", error);
    }

    setIsDeleteTaskConfirmationVisible(false);
  };

  const handleSelectTaskForDeletion = (id: string) => {
    setTaskIdToBeDeleted(id);
    setIsDeleteTaskConfirmationVisible(true);
  };

  const handleSchoolClick = () => {
    SecureStore.setItem("selectedSchoolId", JSON.stringify(school.id));
    navigation.navigate("SchoolDetails");
  };

  const handleUnlinkFromSchool = async () => {
    try {
      await studentApi.unlinkStudentFromSchool(selectedStudentId);
      navigation.navigate("GuardianHome");
    } catch (error) {
      console.log("Error unlinking student from school: ", error);
    }
  };

  const handleLinkStudentToSchool = async () => {
    try {
      await studentApi.linkStudentToSchool(
        selectedStudentId,
        foundedSchool.id!
      );
      fetchStudentDetails();
    } catch (error) {
      console.log("Error linking student to school: ", error);
    }
  };

  const handleOnSchoolIdRead = async () => {
    try {
      const schoolResponse = await schoolApi.getSchool(readCode);
      if (schoolResponse) {
        setIsScannedSchoolIdValid(true);
        setFoundedSchool(schoolResponse);
      }
    } catch (error) {
      console.log("The school id read is invalid: ", error);
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
    checkSchoolarLink();
  }, [student]);

  const isUserTutor = () => {
    return authState?.user?.role === UserRole.TUTOR;
  };

  useEffect(() => {
    if (student.schoolId && !isUserTutor()) fetchSchool();
    if (isUserTutor()) fetchGuardian();
  }, [student]);

  useEffect(() => {
    getSubjectsFromATaskArray(student!.tasks!).then((tasksSubjects) =>
      setSubjects(tasksSubjects!)
    );
  }, [student]);

  useEffect(() => {
    if (readCode) handleOnSchoolIdRead();
  }, [readCode]);

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

  const deleteTaskConfirmationModal = (
    <GenericModal
      isVisible={isDeleteTaskConfirmationVisible}
      setIsVisible={setIsDeleteTaskConfirmationVisible}
    >
      <Card disabled={true}>
        <Button
          accessoryLeft={UnlinkSchoolIcon}
          onPress={() => setIsDeleteTaskConfirmationVisible(false)}
          appearance="ghost"
        />
        <Text>Tem certeza que deseja excluir esta tarefa?</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <Button onPress={handleDeleteTask}>Sim</Button>
          <Button
            appearance="outline"
            onPress={() => setIsDeleteTaskConfirmationVisible(false)}
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
        {deleteTaskConfirmationModal}
        {!loading ? (
          <>
            <View style={styles.studentInfo}>
              <Text category="h5">{student!.name}</Text>
              <Text category="s1" style={{ textAlign: "justify" }}>
                {`${showStudentAgeString(
                  calculateAge(new Date(student!.birthdate))
                )}, ${student!.grade}`}
              </Text>
            </View>
            {student.schoolId ? (
              <>
                {!isUserTutor() ? (
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
                            )}, ${shortenLargeTexts(
                              `${school.city}`,
                              20
                            )}`}</Text>
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
                ) : (
                  <>
                    <Card>
                      <View style={styles.schoolCard}>
                        <View style={styles.schoolCardFirstHalf}>
                          <Avatar
                            size="giant"
                            src={guardianCard.profileImage}
                            style={styles.schoolAvatar}
                          />

                          <View>
                            <Text category="h6">{guardianCard.userName}</Text>
                            <Text>Responsável</Text>
                          </View>
                        </View>
                      </View>
                    </Card>
                  </>
                )}
                <Button accessoryLeft={AddIcon} onPress={handleAddTaskClick}>
                  Adicionar atividade
                </Button>
                {student.tasks!.length > 0 ? (
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
                          {subjects.find(
                            (subject) => subject.id === task.subjectId
                          )?.name || "Carregando..."}
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
                                onPress={() => {
                                  handleSelectTaskForDeletion(selectedTask.id!);
                                }}
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
            ) : isUserTutor() ? null : !cameraPermission ? (
              <></>
            ) : !cameraPermission.granted ? (
              <View>
                <Button onPress={requestCameraPermission}>
                  <Text></Text>
                </Button>
              </View>
            ) : !wantsToScanLinkingCode ? (
              <View
                style={{
                  ...styles.studentInfo,
                  gap: 175,
                  marginTop: 80,
                }}
              >
                <View
                  style={{
                    ...styles.studentInfo,
                    width: "70%",
                  }}
                >
                  <Image
                    source={require("../../../../assets/notLinkedToSchool.png")}
                    style={styles.image}
                  />
                  <Text
                    style={{ textAlign: "center", marginTop: -20 }}
                    category="h6"
                  >
                    Este aluno ainda não está vinculado a nenhuma escola!
                  </Text>
                </View>
                <Button
                  onPress={() => setWantsToScanLinkingCode(true)}
                  style={{ ...styles.buttons, marginTop: 20 }}
                >
                  <Text>Escanear código de vinculação</Text>
                </Button>
              </View>
            ) : !isScannedSchoolIdValid ? (
              <View style={{ ...styles.studentInfo, marginTop: 20, gap: 20 }}>
                <Text category="h6">Escaneie o QR para vincular aluno</Text>
                <CameraView
                  style={styles.cameraContainer}
                  facing="back"
                  barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                  }}
                  onBarcodeScanned={(value) => setReadCode(value.raw!)}
                >
                  <View
                    style={{
                      ...styles.cameraScanningArea,
                      borderColor: theme["color-primary-400"],
                    }}
                  />
                </CameraView>
                <Button
                  onPress={() => {
                    setWantsToScanLinkingCode(false);
                  }}
                  appearance="ghost"
                  style={{ width: "100%" }}
                >
                  <Text>Cancelar</Text>
                </Button>
              </View>
            ) : (
              <View
                style={{
                  ...styles.studentInfo,
                  marginTop: 20,
                  gap: 30,
                  width: "100%",
                }}
              >
                <Text category="h6">
                  {`Deseja vincular à `}
                  <Text
                    category="h6"
                    style={{ color: theme["color-primary-500"] }}
                  >
                    {foundedSchool.name ?? "..."}
                  </Text>
                  ?
                </Text>
                <View style={styles.buttons}>
                  <Button
                    onPress={handleLinkStudentToSchool}
                    style={styles.buttons}
                  >
                    <Text>Sim</Text>
                  </Button>
                  <Button
                    onPress={() => {
                      setIsScannedSchoolIdValid(false);
                      setWantsToScanLinkingCode(false);
                      setReadCode("");
                      setFoundedSchool({} as School);
                    }}
                    appearance="ghost"
                    style={styles.buttons}
                  >
                    <Text>Cancelar</Text>
                  </Button>
                </View>
              </View>
            )}
          </>
        ) : (
          <View>
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

export default StudentDetails;

const styles = StyleSheet.create({
  mainContent: {
    width: "100%",
    height: "100%",
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },

  studentInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  buttons: {
    width: "100%",
  },

  cameraContainer: {
    width: "100%",
    height: 400,
    alignItems: "center",
    justifyContent: "center",
  },

  cameraScanningArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 15,
  },

  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },

  taskCard: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  taskCardSecondHalf: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  moreOptionsButton: {
    width: 10,
    height: 10,
    margin: 0,
    padding: 0,
  },

  moreOptionsModal: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },

  modalCard: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  schoolCard: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  schoolCardFirstHalf: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  schoolAvatar: {
    borderRadius: 5,
  },
});
