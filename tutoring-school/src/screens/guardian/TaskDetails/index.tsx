import { View, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Button, Text } from "@ui-kitten/components";
import { Task } from "../../../services/Task/type";
import { FinishedTaskIcon, PendentTaskIcon } from "../../../theme/Icons";
import styles from "./styles";
import { dateToString } from "../../../utils/stringUtils";

const TaskDetails = () => {
  const selectedTask: Task = JSON.parse(SecureStore.getItem("selectedTask")!);

  const deadlineDateAsDate = new Date(selectedTask.deadlineDate);

  return (
    <View>
      <Text category="h5">{selectedTask.title}</Text>
      <Text category="s1" style={{ textAlign: "justify" }}>
        Matemática
      </Text>
      <Text category="s1" style={{ textAlign: "justify" }}>
        {selectedTask.description}
      </Text>
      <View>
        {selectedTask.images.map((image, index) => (
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
          <PendentTaskIcon style={{ width: 20, height: 20 }} />
          <Text category="h6">Data de entrega: </Text>
        </View>
        <Text>{dateToString(deadlineDateAsDate, true)}</Text>
      </View>
      {!selectedTask.concluded ? (
        <Button accessoryLeft={FinishedTaskIcon} style={styles.concludeButton}>
          Marcar como concluído
        </Button>
      ) : null}
    </View>
  );
};

export default TaskDetails;
