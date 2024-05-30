import { StyleSheet } from "react-native";
import { highlight } from "../../theme/palette";

const styles = StyleSheet.create({
  container: {
    borderColor: highlight,
    borderWidth: 2,
    width: "70%",
    height: 200,
    borderRadius: 10,
  },
  innerCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: 10,
  },
});

export default styles;
