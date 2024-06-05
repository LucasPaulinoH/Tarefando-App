import { View } from "react-native";
import { Text, Input, Button, Select, IndexPath } from "@ui-kitten/components";
import React, { useState } from "react";
import { AddIcon } from "../../../theme/Icons";
import { MONTH_LABELS } from "../../../utils/stringUtils";
import {
  DayPicker,
  MonthPicker,
  YEAR_LABELS,
  YearPicker,
  fillDaysOfMonth,
} from "../../../components/BirthdatePickers";
import studentApi from "../../../services/Student";
import { Student } from "../../../services/Student/type";
import { useAuth } from "../../../context/AuthContext";

const AddStudent = ({ navigation }: any) => {
  const { authState } = useAuth();

  const [name, setName] = useState("");

  const [dayIndex, setDayIndex] = useState<IndexPath>(new IndexPath(0));
  const [monthIndex, setMonthIndex] = useState<IndexPath>(new IndexPath(0));
  const [yearIndex, setYearIndex] = useState<IndexPath>(new IndexPath(0));

  const [grade, setGrade] = useState("");

  const selectedMonthLabel = MONTH_LABELS[monthIndex.row];
  const selectedYearLabel = YEAR_LABELS[yearIndex.row];
  const selectedDayLabel = fillDaysOfMonth(
    Number(selectedYearLabel),
    monthIndex.row
  )[dayIndex.row];

  const handleAddStudentClick = async () => {
    const guardianId = authState?.user?.id;
    try {
      const birthdate = new Date(
        selectedYearLabel,
        monthIndex.row,
        selectedDayLabel
      );

      await studentApi.createStudent({
        guardianId,
        name,
        grade,
        birthdate,
      } as Student);

      navigation.navigate("GuardianHome");
    } catch (error) {
      console.error("Error creating student: ", error);
    }
  };

  return (
    <View>
      <Text category="h6">Novo estudante</Text>
      <Input
        placeholder="Nome do estudante *"
        value={name}
        onChangeText={(name) => setName(name)}
      />

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
      <Input
        placeholder="Série *"
        value={grade}
        onChangeText={(grade) => setGrade(grade)}
      />
      <Button accessoryLeft={AddIcon} onPress={handleAddStudentClick}>
        Adicionar estudante
      </Button>
    </View>
  );
};

export default AddStudent;
