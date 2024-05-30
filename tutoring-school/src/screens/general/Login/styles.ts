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
    width: "70%",
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  loginButton: {
    width: "100%",
  },
  notRegisteredYetRow: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
  },
  newAccountText: {
    fontWeight: "bold",
  },
});

export default styles;
