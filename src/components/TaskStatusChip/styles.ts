import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    height: 40,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },

  icons: {
    width: 20,
    height: 20,
    opacity: 0.6
  },

  innerContent: {
    color: "rgba(0, 0, 0, 0.5)",
    fontWeight: "bold"
  },
});

export default styles;
