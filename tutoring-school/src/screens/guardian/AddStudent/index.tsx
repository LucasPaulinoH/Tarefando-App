import { ScrollView, View } from "react-native";
import { Text, Input, Button, useTheme } from "@ui-kitten/components";
import React, { useState } from "react";
import { AddIcon } from "../../../theme/Icons";
import studentApi from "../../../services/Student";
import { Student } from "../../../services/Student/type";
import { useAuth } from "../../../context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { dateToString } from "../../../utils/stringUtils";
import { studentValidationSchema } from "../../../validations/student";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { styles } from "../studentScreenStyles";
import BackPageButton from "../../../components/BackPageButton";

const AddStudent = ({ navigation }: any) => {
  const { authState } = useAuth();

  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(studentValidationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      grade: "",
    },
  });

  const [birthdate, setBirthdate] = useState(new Date());
  const [isBirthdayModalVisible, setIsBirthdayModalVisible] = useState(false);

  const handleAddStudentClick = async (formData: any) => {
    const userId = authState?.user?.id;
    try {
      const newStudent: Student = {
        userId,
        name: `${formData.firstName} ${formData.lastName}`,
        grade: formData.grade,
        birthdate,
      };

      await studentApi.createStudent(newStudent);

      navigation.navigate("GuardianHome");
    } catch (error) {
      console.error("Error creating student: ", error);
    }
  };

  return (
    <View style={{ backgroundColor: theme["color-primary-100"] }}>
       <BackPageButton onPress={() => navigation.goBack()} />
      <View style={styles.mainContent}>
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
        <Text category="h6">
          Novo estudante
        </Text>
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
          accessoryLeft={AddIcon}
          onPress={handleSubmit(handleAddStudentClick)}
          style={styles.addNewStudentButton}
        >
          Adicionar estudante
        </Button>
      </View>
    </View>
  );
};

export default AddStudent;
