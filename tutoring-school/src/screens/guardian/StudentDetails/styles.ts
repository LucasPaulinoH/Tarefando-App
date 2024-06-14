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
    alignItems: "center",
    gap: 5,
  },

  moreOptionsButton: {
    width: 10,
    height: 10,
    margin: 0,
    padding: 0,
  },

  moreOptionsModal: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },

  modalCard: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  }
});

export default styles;
