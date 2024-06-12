import {
  Autocomplete,
  AutocompleteItem,
  Button,
  IndexPath,
  Input,
  Text,
} from "@ui-kitten/components";
import { View } from "react-native";
import { AddIcon } from "../../../theme/Icons";
import {
  DayPicker,
  MonthPicker,
  YEAR_LABELS,
  YearPicker,
  fillDaysOfMonth,
} from "../../../components/BirthdatePickers";
import { useCallback, useEffect, useState } from "react";
import { MONTH_LABELS, compareQueryStrings } from "../../../utils/stringUtils";
import { Subject } from "../../../services/Subject/type";
import subjectApi from "../../../services/Subject";
import taskApi from "../../../services/Task";
import { Task } from "../../../services/Task/type";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");

  const [autocompleteSubjects, setAutocompleteSubjects] = useState<Subject[]>(
    []
  );

  const [dayIndex, setDayIndex] = useState<IndexPath>(new IndexPath(0));
  const [monthIndex, setMonthIndex] = useState<IndexPath>(new IndexPath(0));
  const [yearIndex, setYearIndex] = useState<IndexPath>(new IndexPath(0));

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
      } as Task);

      console.log(newTaskResponse);
    } catch (error) {
      console.error("Error adding a new task: ", error);
    }
  };

  useEffect(() => {
    fetchSubjectsForAutocomplete();
  }, []);

  return (
    <View>
      <Text category="h6">Nova atividade de </Text>
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
      <Button accessoryLeft={AddIcon} onPress={handleAddTaskClick}>
        Adicionar atividade
      </Button>
    </View>
  );
};

export default AddTask;
