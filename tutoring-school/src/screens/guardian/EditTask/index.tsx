import { useCallback, useEffect, useState } from "react";
import { MONTH_LABELS, compareQueryStrings } from "../../../utils/stringUtils";
import {
  DayPicker,
  MonthPicker,
  YEAR_LABELS,
  YearPicker,
  fillDaysOfMonth,
  getDaysInMonth,
} from "../../../components/BirthdatePickers";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  IndexPath,
  Input,
  Text,
} from "@ui-kitten/components";
import { View } from "react-native";
import studentApi from "../../../services/Student";
import subjectApi from "../../../services/Subject";
import { EditIcon } from "../../../theme/Icons";
import * as SecureStore from "expo-secure-store";
import { Subject } from "../../../services/Subject/type";
import { Task } from "../../../services/Task/type";
import { CURRENT_DATE } from "../../../constants/date";
import { getSubjectsFromATaskArray } from "../../../utils/generalFunctions";
import taskApi from "../../../services/Task";

const EditTask = ({ navigation }: any) => {
  const selectedStudentId: string = JSON.parse(
    SecureStore.getItem("selectedStudentId")!
  );

  const selectedTask: Task = JSON.parse(SecureStore.getItem("selectedTask")!);

  const [studentName, setStudentName] = useState("...");

  const [title, setTitle] = useState(selectedTask.title);
  const [description, setDescription] = useState(selectedTask.description);

  const [subject, setSubject] = useState("");

  const [autocompleteSubjects, setAutocompleteSubjects] = useState<Subject[]>(
    []
  );

  const defaultBirthdate = new Date(selectedTask.deadlineDate);
  const monthDaysQuantity = getDaysInMonth(
    defaultBirthdate.getFullYear(),
    defaultBirthdate.getMonth()
  );

  const [dayIndex, setDayIndex] = useState<IndexPath>(
    new IndexPath(monthDaysQuantity - defaultBirthdate.getDate())
  );
  const [monthIndex, setMonthIndex] = useState<IndexPath>(
    new IndexPath(defaultBirthdate.getMonth())
  );
  const [yearIndex, setYearIndex] = useState<IndexPath>(
    new IndexPath(CURRENT_DATE.getFullYear() - defaultBirthdate.getFullYear())
  );

  const selectedMonthLabel = MONTH_LABELS[monthIndex.row];
  const selectedYearLabel = YEAR_LABELS[yearIndex.row];
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

  const handleEditTask = async () => {
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

      await taskApi.updateTask(selectedTask.id!, {
        subjectId,
        title,
        description,
        deadlineDate,
        images: [],
        studentId: selectedStudentId,
      } as Task);

      navigation.navigate("StudentDetails");
    } catch (error) {
      console.error("Error updating task: ", error);
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
    getSubjectsFromATaskArray([selectedTask]).then((tasksSubjects) =>
      setSubject(tasksSubjects![0].name)
    );
    fetchTaskStudent();
    fetchSubjectsForAutocomplete();
  }, []);

  return (
    <View>
      <Text category="h6">Edição de tarefa</Text>
      <Text category="s1">{studentName}</Text>
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
      <Button accessoryLeft={EditIcon} onPress={handleEditTask}>
        Confirmar edição
      </Button>
    </View>
  );
};

export default EditTask;
