import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  studentCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
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

  schoolAvatar: {
    borderRadius: 5,
  },
});

export default styles;
