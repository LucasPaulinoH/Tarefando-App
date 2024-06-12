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
    borderRadius: 8,
  },

  concludeButton: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    backgroundColor: CONCLUDED_TASK,
    borderColor: CONCLUDED_TASK,
  },

  concludeButtonIcon: {
    width: 20,
    height: 20,
    color: "#000000",
    opacity: 0.55
  },


  concludeButtonLabel: {
    color: "rgba(0,0,0,0.4)",
    fontWeight: "bold",
  },
});

export default styles;
