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

interface TaskStatusChipProps {
  deadlineDate: Date;
  isConcluded: boolean;
}

const CURRENT_DATE = new Date();

const TaskStatusChip = (props: TaskStatusChipProps) => {
  const { deadlineDate, isConcluded } = props;

  const deadlineDateAsDate = new Date(deadlineDate);
  const deadlineYear = deadlineDateAsDate.getFullYear();

  const thisTaskStatus = checkTaskStatusFromTaskDeadline(
    deadlineDateAsDate,
    CURRENT_DATE,
    isConcluded
  );

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
