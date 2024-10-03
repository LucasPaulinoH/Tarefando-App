
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    mainContent: {
      width: "100%",
      height: "100%",
      marginBottom: 30,
      paddingLeft: 15,
      paddingRight: 15,
      display: "flex",
      flexDirection: "column",
      gap: 15,
    },
  
    subjectAutocomplete: {
      width: 354,
    },
  
    imageGallery: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
    },
  
    galleryImageContainer: {
      position: "relative",
      height: 300,
    },
    galleryImageDelete: {
      width: 25,
      height: 25,
      position: "absolute",
      top: 5,
      right: 5,
      zIndex: 1,
      backgroundColor: "rgba(0,0,0,0.2)",
      borderRadius: 50,
    },
  
    galleryImage: {
      width: "100%",
      height: "100%",
    },
  });
  