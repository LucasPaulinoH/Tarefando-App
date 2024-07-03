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
    gap: 3
  },

  studentNameAndLinked: {
    display: "flex",
    flexDirection: "row",
    gap: 2
  },


  pendentTasksIconAndLabel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});

export default styles;
