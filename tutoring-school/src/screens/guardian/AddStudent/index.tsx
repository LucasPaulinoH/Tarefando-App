import { View } from "react-native";
import { Text, Input, Button } from "@ui-kitten/components";
import React, { useState } from "react";
import { AddIcon } from "../../../theme/Icons";
import studentApi from "../../../services/Student";
import { Student } from "../../../services/Student/type";
import { useAuth } from "../../../context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { dateToString } from "../../../utils/stringUtils";

const AddStudent = ({ navigation }: any) => {
  const { authState } = useAuth();

  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState(new Date());
  const [isBirthdayModalVisible, setIsBirthdayModalVisible] = useState(false);
  const [grade, setGrade] = useState("");

  const handleAddStudentClick = async () => {
    const userId = authState?.user?.id;
    try {
      const newStudent: Student = {
        userId,
        name,
        grade,
        birthdate,
      };

      await studentApi.createStudent(newStudent);

      navigation.navigate("GuardianHome");
    } catch (error) {
      console.error("Error creating student: ", error);
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
      <Text category="h6">Novo estudante</Text>
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
      <Button accessoryLeft={AddIcon} onPress={handleAddStudentClick}>
        Adicionar estudante
      </Button>
    </View>
  );
};

export default AddStudent;
