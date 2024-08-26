import { useState } from "react";
import { Button, Input, Text } from "@ui-kitten/components";
import { View } from "react-native";
import { EditIcon } from "../../../theme/Icons";
import { Student } from "../../../services/Student/type";
import * as SecureStore from "expo-secure-store";
import studentApi from "../../../services/Student";
import DateTimePicker from "@react-native-community/datetimepicker";
import { dateToString } from "../../../utils/stringUtils";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { studentValidationSchema } from "../../../validations/student";

const EditStudent = ({ navigation }: any) => {
  const selectedStudent: Student = JSON.parse(
    SecureStore.getItem("selectedStudent")!
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(studentValidationSchema),
    defaultValues: {
      firstName: selectedStudent.name.split(" ")[0],
      lastName: selectedStudent.name.split(" ")[1],
      grade: selectedStudent.grade,
    },
  });

  const [birthdate, setBirthdate] = useState<Date>(
    new Date(selectedStudent.birthdate)
  );
  const [isBirthdayModalVisible, setIsBirthdayModalVisible] = useState(false);

  const handleEditStudentClick = async (formData: any) => {
    try {
      const { user: guardianId } = selectedStudent;

      await studentApi.updateStudent(selectedStudent.id!, {
        userId: guardianId,
        name: `${formData.firstName} ${formData.lastName}`,
        grade: formData.grade,
        birthdate,
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
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Nome *"
            value={value}
            onChangeText={onChange}
            status={errors.firstName ? "danger" : "basic"}
            caption={errors.firstName ? errors.firstName.message : ""}
          />
        )}
        name="firstName"
      />
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Sobrenome *"
            value={value}
            onChangeText={onChange}
            status={errors.lastName ? "danger" : "basic"}
            caption={errors.lastName ? errors.lastName.message : ""}
          />
        )}
        name="lastName"
      />

      <Input
        label="Data de nascimento *"
        placeholder="dd/mm/aaaa"
        value={dateToString(birthdate, true)}
        onPress={() => setIsBirthdayModalVisible(true)}
      />
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Série *"
            value={value}
            onChangeText={onChange}
            status={errors.grade ? "danger" : "basic"}
            caption={errors.grade ? errors.grade.message : ""}
          />
        )}
        name="grade"
      />
      <Button
        accessoryLeft={EditIcon}
        onPress={handleSubmit(handleEditStudentClick)}
      >
        Confirmar edição
      </Button>
    </View>
  );
};

export default EditStudent;
