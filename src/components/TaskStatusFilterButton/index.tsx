import { TouchableOpacity } from "react-native";
import { Text, useTheme } from "@ui-kitten/components";
import { TaskStatus } from "../../types/Types";
import { StyleSheet } from "react-native";

interface TaskStatusFilterButtonProps {
  status: TaskStatus;
  isSelected: boolean;
  onPress: () => void;
}

const TaskStatusFilterButton = (props: TaskStatusFilterButtonProps) => {
  const theme = useTheme();
  const { status, isSelected, onPress } = props;

  return (
    <TouchableOpacity
      style={{
        ...styles.mainContainer,
        borderColor: isSelected
          ? theme["color-primary-500"]
          : theme["color-primary-900"],
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: isSelected
            ? theme["color-primary-500"]
            : theme["color-primary-900"],
        }}
      >
        {status === TaskStatus.PENDENT
          ? "Pendentes"
          : status === TaskStatus.CONCLUDED
          ? "Concluídas"
          : "Atrasadas"}
      </Text>
    </TouchableOpacity>
  );
};

export default TaskStatusFilterButton;

const styles = StyleSheet.create({
  mainContainer: {
    width: 100,
    borderWidth: 1,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    padding: 2,
  },
});
