import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";

export const selectSingleImage = async (): Promise<string | null> => {
  let result = await launchImageLibraryAsync({
    mediaTypes: MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 4],
    quality: 1,
  });

  if (!result.canceled) return result.assets[0].uri;
  else return null;
};
