import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  taskCard: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  taskCardSecondHalf: {
    display: "flex",
    flexDirection: "row",
    gap: 5
  }
});

export default styles;
