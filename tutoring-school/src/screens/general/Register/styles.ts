import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  innerContainer: {
    width: "90%",
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  button: {
    width: "100%",
  },
});

export default styles;
