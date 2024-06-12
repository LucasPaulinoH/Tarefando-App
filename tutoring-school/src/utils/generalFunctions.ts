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

export const checkTaskStatusFromTaskDeadline = (
  deadlineDate: Date,
  currentDate: Date,
  concluded: boolean
) => {
  if (concluded) return TaskStatus.CONCLUDED;
  else if (currentDate.getTime() <= deadlineDate.getTime())
    return TaskStatus.PENDENT;
  else if (currentDate.getTime() > deadlineDate.getTime())
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
