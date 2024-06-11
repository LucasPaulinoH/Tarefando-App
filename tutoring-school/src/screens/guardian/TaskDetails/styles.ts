import { StyleSheet } from "react-native";
import { CONCLUDED_TASK } from "../../../theme/palette";

const styles = StyleSheet.create({
  deadlineDateContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  deadlineDateLabel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  image: {
    width: 300,
    height: 300,
    borderRadius: 15
  },

  concludeButton: {
    backgroundColor: CONCLUDED_TASK,
    borderColor: CONCLUDED_TASK,
  },
});

export default styles;
