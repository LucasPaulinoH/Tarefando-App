import {
  Autocomplete,
  AutocompleteItem,
  Button,
  IndexPath,
  Input,
  Text,
} from "@ui-kitten/components";
import { View, Image, ScrollView } from "react-native";
import { AddIcon, CloseIcon } from "../../../theme/Icons";
import {
  DayPicker,
  MonthPicker,
  YearPicker,
  fillDaysOfMonth,
  fillYearList,
} from "../../../components/DatePickers";
import { useCallback, useEffect, useState } from "react";
import { MONTH_LABELS, compareQueryStrings } from "../../../utils/stringUtils";
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

const GALLERY_IMAGE_SIZE = 160;

const AddTask = ({ navigation }: any) => {
  const selectedStudentId: string = JSON.parse(
    SecureStore.getItem("selectedStudentId")!
  );

  const [studentName, setStudentName] = useState("...");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [images, setImages] = useState<string[] | null>(null);

  const YEAR_LIST = fillYearList(false, true);

  const [autocompleteSubjects, setAutocompleteSubjects] = useState<Subject[]>(
    []
  );

  const [dayIndex, setDayIndex] = useState<IndexPath>(new IndexPath(0));
  const [monthIndex, setMonthIndex] = useState<IndexPath>(new IndexPath(0));
  const [yearIndex, setYearIndex] = useState<IndexPath>(
    new IndexPath(YEAR_LIST.length - 1)
  );

  const selectedMonthLabel = MONTH_LABELS[monthIndex.row];
  const selectedYearLabel = YEAR_LIST[yearIndex.row];
  const selectedDayLabel = fillDaysOfMonth(
    Number(selectedYearLabel),
    monthIndex.row
  )[dayIndex.row];

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

  const handleAddTaskClick = async () => {
    try {
      let subjectId = "";

      const idkWhatNameToPutInThis = autocompleteSubjects.filter(
        (currentSubject) =>
          currentSubject.name.toLocaleLowerCase() === subject.toLowerCase()
      );

      if (idkWhatNameToPutInThis.length === 0) {
        const newSubjectResponse = await subjectApi.createSubject(subject);
        subjectId = newSubjectResponse.id!;
      } else {
        subjectId = idkWhatNameToPutInThis[0].id!;
      }

      const deadlineDate = new Date(
        selectedYearLabel,
        monthIndex.row,
        selectedDayLabel
      );

      const newTaskResponse = await taskApi.createTask({
        subjectId,
        title,
        description,
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

        await taskApi.updateTaskImages(newTaskResponse.id!, uploadedImageUrls);
      }

      navigation.navigate("StudentDetails");
    } catch (error) {
      console.error("Error adding a new task: ", error);
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

  useEffect(() => {
    fetchTaskStudent();
    fetchSubjectsForAutocomplete();
  }, []);

  return (
    <ScrollView>
      <Text category="h6">{`Nova tarefa de ${studentName}`}</Text>
      <Input
        placeholder="Título *"
        value={title}
        onChangeText={(title) => setTitle(title)}
      />
      <Input
        placeholder="Descrição *"
        multiline={true}
        numberOfLines={5}
        value={description}
        onChangeText={(description) => setDescription(description)}
      />
      <Autocomplete
        placeholder="Disciplina *"
        value={subject}
        onSelect={onSelect}
        placement="inner top"
        onChangeText={(subject) => setSubject(subject)}
      >
        {filteredSubjects.map((subject, index) => (
          <AutocompleteItem key={index} title={subject.name} />
        ))}
      </Autocomplete>
      <Button
        onPress={() => handleSetMultipleSelectedImageState(setImages)}
      >
        <Text>Adicione imagens</Text>
      </Button>
      <Text>{` ${
        images?.length! > 0 ? `Imagens selecionadas (${images?.length}):` : ""
      }`}</Text>
      <View>
        {images?.length! > 0 &&
          images?.map((imageUrl: string, index: number) => (
            <View key={index}>
              <CloseIcon
                style={{
                  width: 25,
                  height: 25,
                }}
                onPress={() => setImages(images.filter((_, i) => i !== index))}
              />
              <Image
                source={{ uri: imageUrl }}
                width={GALLERY_IMAGE_SIZE}
                height={GALLERY_IMAGE_SIZE}
              />
            </View>
          ))}
      </View>
      <View>
        <DayPicker
          selectedLabel={selectedDayLabel}
          index={dayIndex}
          setIndex={setDayIndex}
          month={monthIndex.row}
          year={Number(selectedYearLabel)}
          width="100%"
        />
        <MonthPicker
          selectedLabel={selectedMonthLabel}
          index={monthIndex}
          setIndex={setMonthIndex}
          width="100%"
        />
        <YearPicker
          selectedLabel={selectedYearLabel}
          index={yearIndex}
          setIndex={setYearIndex}
          width="100%"
        />
      </View>
      <Button accessoryLeft={AddIcon} onPress={handleAddTaskClick}>
        Adicionar atividade
      </Button>
    </ScrollView>
  );
};

export default AddTask;
