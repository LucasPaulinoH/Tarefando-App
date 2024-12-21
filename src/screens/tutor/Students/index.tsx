import { useCallback, useState } from "react";
import { View } from "react-native";
import { School } from "../../../services/School/type";
import { useAuth } from "../../../context/AuthContext";
import schoolApi from "../../../services/School";
import { IndexPath, Select, SelectItem, Text } from "@ui-kitten/components";
import { Student } from "../../../services/Student/type";
import studentApi from "../../../services/Student";
import { useFocusEffect } from "@react-navigation/native";
import StudentListItem from "../../../components/StudentListItem";
import * as SecureStore from "expo-secure-store";

const TutorStudents = ({ navigation }: any) => {
  const { authState } = useAuth();

  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolIndex, setSelectedSchoolIndex] = useState(
    new IndexPath(0)
  );
  const [students, setStudents] = useState<Student[]>([]);
  const fetchUserSchools = async () => {
    try {
      const schoolsResponse = await schoolApi.getSchoolsFromTutor(
        authState?.user?.id!
      );
      setSchools(schoolsResponse);
    } catch (error) {
      console.log("Error fetching tutor schools", error);
    }
  };

  const fetchSelectedSchoolStudents = async () => {
    try {
      const studentsResponse = await studentApi.getStudentsFromSchool(
        schools[selectedSchoolIndex.row].id!
      );

      setStudents(studentsResponse);
    } catch (error) {
      console.log("Error fetching students: ", error);
    }
  };

  const handleStudentDetailsClick = (studentId: string) => {
    SecureStore.setItem("selectedStudentId", JSON.stringify(studentId));
    navigation.navigate("StudentDetails");
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserSchools();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      fetchSelectedSchoolStudents();
    }, [schools, selectedSchoolIndex])
  );

  return (
    <View>
      <Select
        value={
          schools[selectedSchoolIndex.row]?.name ?? "Carregando escolas..."
        }
        selectedIndex={selectedSchoolIndex}
        onSelect={(index) => setSelectedSchoolIndex(index)}
      >
        {schools!.map((school) => (
          <SelectItem title={school.name!} key={school.id!} />
        ))}
      </Select>

      {students.length > 0 ? (
        students.map((student) => (
          <StudentListItem
            student={student}
            onPress={() => handleStudentDetailsClick(student.id!)}
            actions={<></>}
            key={student.id}
          />
        ))
      ) : (
        <Text>Nenhum aluno vinculado à esta escola</Text>
      )}
    </View>
  );
};

export default TutorStudents;
