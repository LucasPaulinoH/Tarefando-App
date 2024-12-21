import { View } from "react-native";
import { Icon, Text } from "@ui-kitten/components";
import styles from "./styles";
import { TaskStatus } from "../../types/Types";
import {
  CONCLUDED_TASK,
  DELAYED_TASK,
  PENDENT_TASK,
} from "../../theme/palette";
import { dateToString } from "../../utils/stringUtils";
import { checkTaskStatusFromTaskDeadline } from "../../utils/generalFunctions";
import { Task } from "../../services/Task/type";

interface TaskStatusChipProps {
  task: Task;
}

const CURRENT_DATE = new Date();

const TaskStatusChip = (props: TaskStatusChipProps) => {
  const { task } = props;

  const deadlineDateAsDate = new Date(task.deadlineDate);
  const deadlineYear = deadlineDateAsDate.getFullYear();

  const thisTaskStatus = checkTaskStatusFromTaskDeadline(task);

  return (
    <View
      style={[
        styles.mainContainer,
        {
          backgroundColor:
            thisTaskStatus === TaskStatus.CONCLUDED
              ? CONCLUDED_TASK
              : thisTaskStatus === TaskStatus.PENDENT
              ? PENDENT_TASK
              : DELAYED_TASK,
        },
      ]}
    >
      <Icon
        name={
          thisTaskStatus === TaskStatus.CONCLUDED
            ? "checkmark-circle-outline"
            : "clock-outline"
        }
        style={styles.icons}
      />
      <Text style={styles.innerContent}>
        {dateToString(
          deadlineDateAsDate,
          deadlineYear !== CURRENT_DATE.getFullYear()
        )}
      </Text>
    </View>
  );
};

export default TaskStatusChip;
