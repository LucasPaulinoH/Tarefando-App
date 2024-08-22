import { useState } from "react";
import { Button, Input, Text } from "@ui-kitten/components";
import { View } from "react-native";
import { EditIcon } from "../../../theme/Icons";
import { Student } from "../../../services/Student/type";
import * as SecureStore from "expo-secure-store";
import studentApi from "../../../services/Student";
import DateTimePicker from "@react-native-community/datetimepicker";
import { dateToString } from "../../../utils/stringUtils";

const EditStudent = ({ navigation }: any) => {
  const selectedStudent: Student = JSON.parse(
    SecureStore.getItem("selectedStudent")!
  );

  const [name, setName] = useState(selectedStudent.name);
  const [birthdate, setBirthdate] = useState<Date>(
    new Date(selectedStudent.birthdate)
  );
  const [isBirthdayModalVisible, setIsBirthdayModalVisible] = useState(false);
  const [grade, setGrade] = useState(selectedStudent.grade);

  const handleEditStudentClick = async () => {
    try {
      const { user: guardianId } = selectedStudent;
      
      await studentApi.updateStudent(selectedStudent.id!, {
        userId: guardianId,
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
      {isBirthdayModalVisible && (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={birthdate}
          onChange={(_: any, selectedDate: Date) => {
            setBirthdate(selectedDate);
            setIsBirthdayModalVisible(false);
          }}
        />
      )}
      <Text category="h6">Editar estudante</Text>
      <Input
        placeholder="Nome do estudante *"
        value={name}
        onChangeText={(name) => setName(name)}
      />
      <Input
        label="Data de nascimento *"
        placeholder="dd/mm/aaaa"
        value={dateToString(birthdate, true)}
        onPress={() => setIsBirthdayModalVisible(true)}
      />
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
