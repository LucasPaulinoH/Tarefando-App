import { CURRENT_DATE } from "../constants/date";
import subjectApi from "../services/Subject";
import { Subject } from "../services/Subject/type";
import { Task } from "../services/Task/type";
import { TaskStatus } from "../types/Types";

export const getSubjectsFromATaskArray = async (tasks: Task[]) => {
  try {
    const tasksSubjects: Subject[] = [];
    const searchedSubjectIds: string[] = [];

    for (let i = 0; i < tasks?.length!; i++) {
      if (!searchedSubjectIds.includes(tasks![i].subjectId)) {
        const iterableTaskSubject = await subjectApi.getSubject(
          tasks![i].subjectId
        );
        tasksSubjects.push(iterableTaskSubject);
      }
    }

    return tasksSubjects;
  } catch (error) {
    console.error("Error getting subject name: ", error);
  }
};

export const checkTaskStatusFromTaskDeadline = (task: Task) => {
  const formattedDeadline = new Date(task.deadlineDate);

  if (task.concluded) return TaskStatus.CONCLUDED;
  else if (CURRENT_DATE.getTime() <= formattedDeadline.getTime())
    return TaskStatus.PENDENT;
  else if (CURRENT_DATE.getTime() > formattedDeadline.getTime())
    return TaskStatus.DELAYED;
};

export const calculateAge = (birthdate: Date): number => {
  let ageInYears = CURRENT_DATE.getFullYear() - birthdate.getFullYear();
  const monthDifference = CURRENT_DATE.getMonth() - birthdate.getMonth();
  const dayDifference = CURRENT_DATE.getDate() - birthdate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    ageInYears--;
  }

  return ageInYears;
};

export const countPendentTasksInTaskArray = (tasks: Task[]): number => {
  let pendentTaskCounter = 0;

  let iterableTask = null;
  for (let i = 0; i < tasks.length; i++) {
    iterableTask = tasks[i];

    if (!iterableTask.concluded) pendentTaskCounter++;
  }

  return pendentTaskCounter;
};

export const showStudentPendentTasksString = (
  pendentTaskQuantity: number
): string => {
  return pendentTaskQuantity === 0
    ? `Nenhuma atividade pendente`
    : pendentTaskQuantity === 1
    ? `1 atividade pendente`
    : `${pendentTaskQuantity} atividades pendentes`;
};
