import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Button, IndexPath, Input, Text } from "@ui-kitten/components";
import { MONTH_LABELS } from "../../../utils/stringUtils";
import {
  DayPicker,
  MonthPicker,
  YearPicker,
  fillDaysOfMonth,
  fillYearList,
  getDaysInMonth,
} from "../../../components/DatePickers";
import { View } from "react-native";
import { EditIcon } from "../../../theme/Icons";
import { Student } from "../../../services/Student/type";
import * as SecureStore from "expo-secure-store";
import studentApi from "../../../services/Student";

const CURRENT_DATE = new Date();

const EditStudent = ({ navigation }: any) => {
  const { authState } = useAuth();

  const selectedStudent: Student = JSON.parse(
    SecureStore.getItem("selectedStudent")!
  );

  const [name, setName] = useState(selectedStudent.name);

  const defaultBirthdate = new Date(selectedStudent.birthdate);
  const monthDaysQuantity = getDaysInMonth(
    defaultBirthdate.getFullYear(),
    defaultBirthdate.getMonth()
  );

  const YEAR_LIST = fillYearList(true, false);

  const [dayIndex, setDayIndex] = useState<IndexPath>(
    new IndexPath(monthDaysQuantity - defaultBirthdate.getDate())
  );
  const [monthIndex, setMonthIndex] = useState<IndexPath>(
    new IndexPath(defaultBirthdate.getMonth())
  );
  const [yearIndex, setYearIndex] = useState<IndexPath>(
    new IndexPath(CURRENT_DATE.getFullYear() - defaultBirthdate.getFullYear())
  );

  const [grade, setGrade] = useState(selectedStudent.grade);

  const selectedMonthLabel = MONTH_LABELS[monthIndex.row];
  const selectedYearLabel = YEAR_LIST[yearIndex.row];
  const selectedDayLabel = fillDaysOfMonth(
    Number(selectedYearLabel),
    monthIndex.row
  )[dayIndex.row];

  const handleEditStudentClick = async () => {
    try {
      const birthdate = new Date(
        selectedYearLabel,
        monthIndex.row,
        selectedDayLabel
      );

      const { user: guardianId } = selectedStudent;
      await studentApi.updateStudent(selectedStudent.id!, {
        user: guardianId,
        name,
        birthdate,
        grade,
      } as Student);
      navigation.navigate("GuardianHome");
    } catch (error) {
      console.error("Error editing student: ", error);
    }
  };

  return (
    <View>
      <Text category="h6">Editar estudante</Text>
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
      <Button accessoryLeft={EditIcon} onPress={handleEditStudentClick}>
        Confirmar edição
      </Button>
    </View>
  );
};

export default EditStudent;
