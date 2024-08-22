import { View, Image, ScrollView } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Button, Card, Text } from "@ui-kitten/components";
import { Task } from "../../../services/Task/type";
import {
  CalendarIcon,
  FinishedTaskIcon,
  UnlinkSchoolIcon,
} from "../../../theme/Icons";
import styles from "./styles";
import { dateToString } from "../../../utils/stringUtils";
import subjectApi from "../../../services/Subject";
import { useEffect, useState } from "react";
import taskApi from "../../../services/Task";
import GenericModal from "../../../components/GenericModal";

const TaskDetails = () => {
  const selectedTaskId: string = JSON.parse(
    SecureStore.getItem("selectedTaskId")!
  );

  const [selectedTask, setSelectedTask] = useState<Task>({} as Task);

  const [subjectName, setSubjectName] = useState("...");
  const deadlineDateAsDate = new Date(selectedTask.deadlineDate);

  const [refetch, setRefetch] = useState(false);

  const [
    isConcludeTaskConfirmationVisible,
    setIsConcludeTaskConfirmationVisible,
  ] = useState(false);

  const fetchSelectedTask = async () => {
    try {
      const selectedTaskResponse = await taskApi.getTask(selectedTaskId);
      setSelectedTask(selectedTaskResponse);
    } catch (error) {
      console.error("Error fetching selected task: ", error);
    }
  };

  const handleConcludeTaskClick = async () => {
    try {
      await taskApi.toggleTaskConcluded(selectedTask.id!, true);
      setRefetch(true);
    } catch (error) {
      console.warn("Error concluding task: ", error);
    }
    setRefetch(false);
    setIsConcludeTaskConfirmationVisible(false);
  };

  const getSelectedTaskSubjectName = async () => {
    if (selectedTask.subjectId) {
      try {
        const subjectResponse = await subjectApi.getSubject(
          selectedTask.subjectId
        );
        setSubjectName(subjectResponse.name);
      } catch (error) {
        console.error("Error getting selected task subject: ", error);
      }
    }
  };

  useEffect(() => {
    fetchSelectedTask();
  }, [refetch]);

  useEffect(() => {
    getSelectedTaskSubjectName();
  }, [selectedTask]);

  const concludeTaskConfirmationModal = (
    <GenericModal
      isVisible={isConcludeTaskConfirmationVisible}
      setIsVisible={setIsConcludeTaskConfirmationVisible}
    >
      <Card disabled={true}>
        <Button
          accessoryLeft={UnlinkSchoolIcon}
          onPress={() => setIsConcludeTaskConfirmationVisible(false)}
          appearance="ghost"
        />
        <Text>Tem certeza que deseja marcar esta tarefa como concluída?</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <Button onPress={handleConcludeTaskClick}>Sim</Button>
          <Button
            appearance="outline"
            onPress={() => setIsConcludeTaskConfirmationVisible(false)}
          >
            Não
          </Button>
        </View>
      </Card>
    </GenericModal>
  );

  return (
    <ScrollView>
      {concludeTaskConfirmationModal}
      <Text category="h5">{selectedTask.title}</Text>
      <Text category="s1" style={{ textAlign: "justify" }}>
        {subjectName}
      </Text>
      <Text category="s1" style={{ textAlign: "justify" }}>
        {selectedTask.description}
      </Text>
      <View>
        {selectedTask.images?.length > 0 &&
          selectedTask.images?.map((image, index) => (
            <Image
              source={{
                uri: image,
              }}
              key={index}
              style={styles.image}
            />
          ))}
      </View>
      <View style={styles.deadlineDateContainer}>
        <View style={styles.deadlineDateLabel}>
          <CalendarIcon style={{ width: 18, height: 18 }} />
          <Text category="h6">Data de entrega: </Text>
        </View>
        <Text>{dateToString(deadlineDateAsDate, true)}</Text>
      </View>
      {!selectedTask.concluded ? (
        <Button
          accessoryLeft={() => (
            <FinishedTaskIcon style={styles.concludeButtonIcon} />
          )}
          style={styles.concludeButton}
          appearance="filled"
          onPress={() => setIsConcludeTaskConfirmationVisible(true)}
        >
          {() => (
            <Text style={styles.concludeButtonLabel}>
              Marcar como concluído
            </Text>
          )}
        </Button>
      ) : null}
    </ScrollView>
  );
};

export default TaskDetails;
