import { Card, Text } from "@ui-kitten/components";
import { View } from "react-native";
import { PendentTaskIcon } from "../../theme/Icons";
import {
  countPendentTasksInTaskArray,
  showStudentPendentTasksString,
} from "../../utils/generalFunctions";
import { Student } from "../../services/Student/type";
import { StyleSheet } from "react-native";
import { ReactNode } from "react";

interface StudentListItemProps {
  student: Student;
  onPress: any;
  actions: ReactNode;
}
const StudentListItem = (props: StudentListItemProps) => {
  const { student, onPress, actions } = props;

  return (
    <Card key={student.id} onPress={onPress} >
      <View style={styles.studentCard}>
        <View style={styles.studentCardFirstHalf}>
          <View style={styles.studentNameAndLinked}>
            <Text category="h6">{student.name}</Text>
          </View>
          <View style={styles.pendentTasksIconAndLabel}>
            {(() => {
              const pendentTasksQuantity = countPendentTasksInTaskArray(
                student.tasks!
              );
              return !student.schoolId ? (
                <>
                  <Text>Sem vínculo escolar</Text>
                </>
              ) : pendentTasksQuantity > 0 ? (
                <>
                  <PendentTaskIcon style={{ width: 20, height: 20 }} />
                  <Text>
                    {showStudentPendentTasksString(pendentTasksQuantity)}
                  </Text>
                </>
              ) : (
                <Text>
                  {showStudentPendentTasksString(pendentTasksQuantity)}
                </Text>
              );
            })()}
          </View>
        </View>

        <View>{actions}</View>
      </View>
    </Card>
  );
};

export default StudentListItem;



const styles = StyleSheet.create({
  studentCard: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  studentCardFirstHalf: {
    display: "flex",
    flexDirection: "column",
    gap: 3
  },

  studentNameAndLinked: {
    display: "flex",
    flexDirection: "row",
    gap: 2
  },


  pendentTasksIconAndLabel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
