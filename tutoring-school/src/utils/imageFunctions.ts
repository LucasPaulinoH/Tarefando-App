import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import { firebase } from "../utils/firebase";
import { Dispatch, SetStateAction } from "react";
import { getStorage, ref, deleteObject } from "firebase/storage";

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

export const selectMultipleImages = async (): Promise<string[] | null> => {
  let result = await launchImageLibraryAsync({
    mediaTypes: MediaTypeOptions.Images,
    quality: 1,
    allowsMultipleSelection: true,
  });

  const imageUris = [];

  if (!result.canceled) {
    for (let i = 0; i < result.assets.length; i++) {
      imageUris.push(result.assets[i].uri);
    }

    return imageUris;
  } else return null;
};

export const handleSetSingleSelectedImageState = async (
  setImage: Dispatch<SetStateAction<string | null>>
) => {
  const selectedImage = await selectSingleImage();
  if (selectedImage !== null) setImage(selectedImage);
};

export const handleSetMultipleSelectedImageState = async (
  setImages: Dispatch<SetStateAction<string[] | null>> 
) => {
  const selectedImages = await selectMultipleImages();

  if (selectedImages !== null)
    setImages((previousImages) =>
      previousImages === null
        ? [...selectedImages]
        : [...previousImages!, ...selectedImages]
    );
};
export const uploadImageToFirebase = async (
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

export const deleteImageFromFirebase = async (imageUrl: string) => {
  try {
    const storage = getStorage();
    const imageRef = ref(storage, imageUrl);
    deleteObject(imageRef);
  } catch (error) {
    console.log(`Error deleting ${imageUrl} from firebase: `, error);
  }
};
