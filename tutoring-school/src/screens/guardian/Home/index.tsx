import { useEffect, useState } from "react";
import { View } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import {
  Button,
  Card,
  Icon,
  IconElement,
  Input,
  Text,
  ButtonGroup,
} from "@ui-kitten/components";
import { Student } from "../../../services/Student/type";
import studentApi from "../../../services/Student";
import styles from "./styles";
import { Task } from "../../../services/Task/type";
import { TaskStatus } from "../../../types/Types";

const EditIcon = (props: any): IconElement => (
  <Icon {...props} name="edit-outline" />
);

const DeleteIcon = (props: any): IconElement => (
  <Icon {...props} name="trash-2-outline" />
);

const AddSchoolIcon = (props: any): IconElement => (
  <Icon {...props} name="plus-square-outline" />
);

const SearchIcon = (props: any): IconElement => (
  <Icon {...props} name="search-outline" />
);

const PendentIcon = (props: any): IconElement => (
  <Icon {...props} name="clock-outline" />
);

const GuardianHome = () => {
  const { authState } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (authState?.user?.id) fetchSelfStudents(authState?.user?.id);
  }, [authState]);

  const fetchSelfStudents = async (guardianId: string | undefined) => {
    try {
      const guardianStudentsResponse = await studentApi.getStudentsFromGuardian(
        guardianId!
      );
      setStudents(guardianStudentsResponse);
    } catch (error) {
      console.error(error);
    }
  };

  const countPendentTasksInTaskArray = (tasks: Task[]) => {
    let pendentTaskCounter = 0;

    tasks.forEach((task) => {
      if (task.status === TaskStatus.PENDENT) pendentTaskCounter++;
    });

    return pendentTaskCounter;
  };

  return (
    <View>
      <Button accessoryLeft={AddSchoolIcon}>Adicionar estudantes</Button>
      <Input placeholder="Buscar estudantes..." accessoryLeft={SearchIcon} />
      {students.map((student: Student) => {
        const pendentTasksQuantity = countPendentTasksInTaskArray(
          student.tasks
        );
        
        return (
          <Card key={student.id}>
            <View style={styles.studentCard}>
              <View style={styles.studentCardFirstHalf}>
                <Text category="h6">{student.name}</Text>
                <View style={styles.pendentTasksIconAndLabel}>
                  {pendentTasksQuantity > 0 ? (
                    <Text category="h4">•</Text>
                  ) : null}
                  <Text>
                    {pendentTasksQuantity === 0
                      ? "Nenhuma atividade pendente"
                      : pendentTasksQuantity === 1
                      ? "1 atividade pendente"
                      : `${pendentTasksQuantity} atividades pendentes`}
                  </Text>
                </View>
              </View>

              <View>
                <ButtonGroup appearance="ghost">
                  <Button accessoryLeft={EditIcon} />
                  <Button accessoryLeft={DeleteIcon} />
                </ButtonGroup>
              </View>
            </View>
          </Card>
        );
      })}
    </View>
  );
};

export default GuardianHome;
