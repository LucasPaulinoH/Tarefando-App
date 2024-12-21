import { View, Image, ScrollView } from "react-native";
import { School } from "../../../services/School/type";
import * as SecureStore from "expo-secure-store";
import {
  Button,
  Card,
  Icon,
  Input,
  Text,
  useTheme,
} from "@ui-kitten/components";
import QRCode from "react-native-qrcode-svg";
import { useEffect, useState } from "react";
import schoolApi from "../../../services/School";
import { Student } from "../../../services/Student/type";
import studentApi from "../../../services/Student";
import { SearchIcon, UnlinkSchoolIcon } from "../../../theme/Icons";
import { useAuth } from "../../../context/AuthContext";
import { UserRole } from "../../../types/Types";
import { StyleSheet } from "react-native";
import GenericModal from "../../../components/GenericModal";

const SchoolDetails = ({ navigation }: any) => {
  const selectedSchoolId: string = JSON.parse(
    SecureStore.getItem("selectedSchoolId")!
  );

  const theme = useTheme();
  const { authState } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");

  const [school, setSchool] = useState<School>({} as School);
  const [students, setStudents] = useState<Student[]>([]);

  const [showQr, setShowQr] = useState(false);

  const fetchSchool = async () => {
    try {
      const schoolResponse = await schoolApi.getSchool(selectedSchoolId);
      setSchool(schoolResponse);
    } catch (error) {
      console.error("Error fetching school: ", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const studentsResponse = await studentApi.getStudentsFromSchool(
        selectedSchoolId
      );
      setStudents(studentsResponse);
    } catch (error) {
      console.error("Error fetching school: ", error);
    }
  };

  const handleUnlinkFromSchool = async (studentId: string) => {
    try {
      await studentApi.unlinkStudentFromSchool(studentId);
      fetchStudents();
    } catch (error) {
      console.error("Error unlinking student from school: ", error);
    }
  };

  const handleStudentDetailsClick = (studentId: string) => {
    SecureStore.setItem("selectedStudentId", JSON.stringify(studentId));
    navigation.navigate("StudentDetails");
  };

  useEffect(() => {
    fetchSchool();
  }, []);

  const isUserTutor = () => {
    return authState?.user?.role === UserRole.TUTOR;
  };

  useEffect(() => {
    if (isUserTutor()) fetchStudents();
  }, [school]);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const qrCodeModal = (
    <GenericModal isVisible={showQr} setIsVisible={setShowQr}>
      <Card disabled={true}>
        <Button
          accessoryLeft={UnlinkSchoolIcon}
          onPress={() => setShowQr(false)}
          appearance="ghost"
          style={styles.qrModalCloseButton}
        />
        <View style={styles.qrModalContainer}>
          <Text category="h6">Código de vinculação escolar</Text>
          <View style={styles.qrContainer}>
            <QRCode
              value={school.id}
              size={200}
              backgroundColor={theme["color-primary-100"]}
              color={theme["color-primary-700"]}
            />
          </View>
        </View>
      </Card>
    </GenericModal>
  );

  return (
    <ScrollView style={{ backgroundColor: theme["color-primary-100"] }}>
      {qrCodeModal}
      {school.profileImage ? (
        <Image
          source={{ uri: school.profileImage! }}
          style={styles.profileImage}
        />
      ) : null}
      <View style={styles.mainContent}>
        <Text category="h5">{school.name}</Text>
        <Text category="s1" style={{ textAlign: "justify" }}>
          {school.description}
        </Text>
        <View style={{ maxWidth: "90%", ...styles.schoolData }}>
          <View style={styles.contactInfoContainer}>
            <Icon
              name="phone-outline"
              style={styles.icons}
              fill={theme["color-primary-500"]}
            />
            <Text>{school.phone}</Text>
          </View>
          <View style={styles.contactInfoContainer}>
            <Icon
              name="email-outline"
              style={styles.icons}
              fill={theme["color-primary-500"]}
            />
            <Text>{school.email}</Text>
          </View>
          <View style={styles.contactInfoContainer}>
            <Icon
              name="navigation-2-outline"
              style={styles.icons}
              fill={theme["color-primary-500"]}
            />
            <Text
              style={{ textAlign: "justify" }}
            >{`${school.address}, ${school.addressNumber} - ${school.district}, ${school.city} - ${school.state}`}</Text>
          </View>
        </View>

        {isUserTutor() ? (
          <Button
            onPress={() => setShowQr(true)}
            style={{
              width: "91%",
              margin: 20,
              paddingRight: 15,
              paddingLeft: 15,
            }}
          >
            Exibir código de vinculação
          </Button>
        ) : null}

        {students.length > 0 && isUserTutor() ? (
          <View
            style={{
              ...styles.mainContent,
              margin: 10,
              gap: 10,
              paddingRight: 15,
              paddingLeft: 15,
            }}
          >
            <Text category="h6">Alunos desta escola</Text>
            <Input
              placeholder="Buscar estudantes..."
              accessoryLeft={SearchIcon}
              value={searchTerm}
              onChangeText={(search) => setSearchTerm(search)}
            />

            <View style={{marginTop: 20}}>
              {filteredStudents.map((student: Student) => (
                <Card
                  key={student.id}
                  onPress={() => handleStudentDetailsClick(student.id!)}
                  style={{
                    borderWidth: 0,
                    backgroundColor: theme["color-primary-200"],
                  }}
                >
                  <View style={styles.studentCard}>
                    <View style={styles.studentCardFirstHalf}>
                      <Text category="h6">{student.name}</Text>

                      <View style={styles.pendentTasksIconAndLabel}></View>
                    </View>

                    <View>
                      <Button
                        accessoryLeft={UnlinkSchoolIcon}
                        onPress={() => handleUnlinkFromSchool(student.id!)}
                        appearance="ghost"
                        style={{ marginRight: -20 }}
                      />
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        ) : students.length === 0 && isUserTutor() ? (
          <View style={{ alignSelf: "center" }}>
            <Text>Não há alunos vinculados a esta escola ainda.</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

export default SchoolDetails;

const styles = StyleSheet.create({
  mainContent: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },

  profileImage: {
    width: "100%",
    height: 290,
  },

  icons: {
    width: 22,
    height: 22,
  },

  dataContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
  },

  schoolData: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  contactInfoContainer: {
    maxWidth: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  studentCard: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  qrModalCloseButton: {
    marginTop: -22,
    marginRight: -40,
    alignSelf: "flex-end",
  },

  qrModalContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    alignItems: "center",
    alignSelf: "center",
  },

  qrContainer: {
    marginBottom: 20,
  },

  studentCardFirstHalf: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  studentNameAndLinked: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
  },

  pendentTasksIconAndLabel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
