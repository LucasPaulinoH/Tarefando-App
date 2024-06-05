import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  schoolCard: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  schoolCardFirstHalf: {
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
