import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Text,
  useTheme,
} from "@ui-kitten/components";
import { View, Image, ScrollView, TouchableOpacity } from "react-native";
import { AddIcon, CloseIcon, ImageIcon } from "../../../theme/Icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { compareQueryStrings, dateToString } from "../../../utils/stringUtils";
import { Subject } from "../../../services/Subject/type";
import subjectApi from "../../../services/Subject";
import taskApi from "../../../services/Task";
import { Task } from "../../../services/Task/type";
import * as SecureStore from "expo-secure-store";
import studentApi from "../../../services/Student";
import {
  handleSetMultipleSelectedImageState,
  uploadImageToFirebase,
} from "../../../utils/imageFunctions";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { taskValidationSchema } from "../../../validations/task";
import { REQUIRED_FIELD_MSG } from "../../../validations/constants";
import { styles } from "../addAndEditTaskStyles";
import BackPageButton from "../../../components/BackPageButton";

const AddTask = ({ navigation }: any) => {
  const selectedStudentId: string = JSON.parse(
    SecureStore.getItem("selectedStudentId")!
  );

  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(taskValidationSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const [studentName, setStudentName] = useState("...");

  const [subject, setSubject] = useState("");

  const [deadlineDate, setDeadlineDate] = useState(new Date());
  const [isDeadlineDateModalVisible, setIsDeadlineDateModalVisible] =
    useState(false);

  const [images, setImages] = useState<string[] | null>(null);

  const [autocompleteSubjects, setAutocompleteSubjects] = useState<Subject[]>(
    []
  );

  const [submittedOnce, setSubmittedOnce] = useState(false);

  const fetchSubjectsForAutocomplete = async () => {
    try {
      const response = await subjectApi.getAllSubjects();
      setAutocompleteSubjects(response);
    } catch (error) {
      console.error("Error fetching subjects for autocomplete: ", error);
    }
  };

  const filteredSubjects = autocompleteSubjects.filter((autocompleteSubject) =>
    compareQueryStrings(autocompleteSubject.name, subject)
  );

  const onSelect = useCallback(
    (index: number): void => {
      setSubject(filteredSubjects[index].name);
    },
    [filteredSubjects]
  );

  const handleAddTaskClick = async (formData: any) => {
    if (submittedOnce && subject.length > 0) {
      try {
        let subjectId = "";

        const idkWhatNameToPutInThis = autocompleteSubjects.filter(
          (currentSubject) =>
            currentSubject.name.toLocaleLowerCase() === subject.toLowerCase()
        );

        if (idkWhatNameToPutInThis.length === 0) {
          const newSubjectResponse = await subjectApi.createSubject(subject);
          subjectId = newSubjectResponse.id!;
        } else subjectId = idkWhatNameToPutInThis[0].id!;

        const newTaskResponse = await taskApi.createTask({
          subjectId,
          title: formData.title,
          description: formData.description,
          deadlineDate,
          images: [],
          studentId: selectedStudentId,
        } as Task);

        const uploadedImageUrls: string[] = [];
        let iterableUploadedImageUrl = "";

        if (images?.length! > 0) {
          let iterableImage = null;

          for (let i = 0; i < images?.length!; i++) {
            iterableImage = images![i];

            iterableUploadedImageUrl = await uploadImageToFirebase(
              iterableImage,
              `tasks/${newTaskResponse.id}/${i + 1}`
            );

            uploadedImageUrls.push(iterableUploadedImageUrl);
          }

          await taskApi.updateTaskImages(
            newTaskResponse.id!,
            uploadedImageUrls
          );
        }

        navigation.navigate("StudentDetails");
      } catch (error) {
        console.error("Error adding a new task: ", error);
      }
    }
  };

  const fetchTaskStudent = async () => {
    try {
      const taskStudentResponse = await studentApi.getStudent(
        selectedStudentId
      );
      setStudentName(taskStudentResponse.name);
    } catch (error) {
      console.error("Error fetching student: ", error);
    }
  };

  const showEmptySubjectError = () => {
    return submittedOnce && !(subject.length > 0);
  };

  useEffect(() => {
    fetchTaskStudent();
    fetchSubjectsForAutocomplete();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: theme["color-primary-100"] }}>
      <BackPageButton onPress={() => navigation.goBack()} />
      <View style={styles.mainContent}>
        {isDeadlineDateModalVisible && (
          <DateTimePicker
            mode="date"
            display="spinner"
            value={deadlineDate}
            onChange={(_: any, selectedDate: Date) => {
              setDeadlineDate(selectedDate);
              setIsDeadlineDateModalVisible(false);
            }}
          />
        )}
        <Text category="h6">{`Nova tarefa de ${studentName}`}</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Título *"
              value={value}
              onChangeText={onChange}
              status={errors.title ? "danger" : "basic"}
              caption={errors.title ? errors.title.message : ""}
            />
          )}
          name="title"
        />
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Descrição *"
              value={value}
              onChangeText={onChange}
              multiline={true}
              numberOfLines={5}
              status={errors.description ? "danger" : "basic"}
              caption={errors.description ? errors.description.message : ""}
            />
          )}
          name="description"
        />

        <Autocomplete
          style={styles.subjectAutocomplete}
          placeholder="Disciplina *"
          value={subject}
          onSelect={onSelect}
          placement="inner top"
          onChangeText={(subject) => setSubject(subject)}
          status={showEmptySubjectError() ? "danger" : "basic"}
          caption={showEmptySubjectError() ? REQUIRED_FIELD_MSG : ""}
        >
          {filteredSubjects.map((subject, index) => (
            <AutocompleteItem
              key={index}
              title={subject.name}
              style={styles.subjectAutocomplete}
            />
          ))}
        </Autocomplete>

        <Button
          onPress={() => handleSetMultipleSelectedImageState(setImages)}
          accessoryLeft={ImageIcon}
        >
          <Text>Adicione imagens</Text>
        </Button>
        <Text>{` ${
          images?.length! > 0 ? `Imagens selecionadas (${images?.length}):` : ""
        }`}</Text>
        <View style={styles.imageGallery}>
          {images?.length! > 0 &&
            images?.map((imageUrl: string, index: number) => (
              <View key={index} style={styles.galleryImageContainer}>
                <TouchableOpacity
                  style={styles.galleryImageDelete}
                  onPress={() =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                >
                  <CloseIcon fill={theme["color-primary-100"]} />
                </TouchableOpacity>
                <Image source={{ uri: imageUrl }} style={styles.galleryImage} />
              </View>
            ))}
        </View>
        <View>
          <Input
            label="Data de entrega *"
            placeholder="dd/mm/aaaa"
            value={dateToString(deadlineDate, true)}
            onPress={() => setIsDeadlineDateModalVisible(true)}
          />
        </View>
        <Button
          accessoryLeft={AddIcon}
          onPress={handleSubmit((formData: any) => {
            if (!submittedOnce) setSubmittedOnce(true);
            handleAddTaskClick(formData);
          })}
        >
          Adicionar atividade
        </Button>
      </View>
    </ScrollView>
  );
};

export default AddTask;
