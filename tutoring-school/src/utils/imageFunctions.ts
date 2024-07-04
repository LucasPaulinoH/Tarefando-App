import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import { firebase } from "../utils/firebase";
import { Dispatch, SetStateAction } from "react";

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

export const handleSetSingleSelectImageState = async (
  setImage: Dispatch<SetStateAction<string | null>>
) => {
  const selectedImage = await selectSingleImage();
  if (selectedImage !== null) setImage(selectedImage);
};

export const uploadImage = async (
  imageUrl: string,
  refPath: string
): Promise<string> => {
  const blob = await new Promise<Blob>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response as Blob);
    };
    xhr.onerror = function () {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", imageUrl, true);
    xhr.send(null);
  });

  const ref = firebase.storage().ref().child(refPath);

  return new Promise<string>((resolve, reject) => {
    const snapshot = ref.put(blob);

    snapshot.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      () => {},
      (error) => {
        console.log(error);
        blob.close();
        reject(error);
      },
      () => {
        snapshot.snapshot.ref
          .getDownloadURL()
          .then((url) => {
            blob.close();
            resolve(url);
          })
          .catch((error) => {
            console.log(error);
            blob.close();
            reject(error);
          });
      }
    );
  });
};
