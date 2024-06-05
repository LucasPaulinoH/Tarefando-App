import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  studentCard: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  studentCardFirstHalf: {
    display: "flex",
    flexDirection: "column",
  },

  pendentTasksIconAndLabel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default styles;
