import { TaskStatus } from "../../types/Types";

export interface Task{
    id: string,
    subjectId: string,
    title: string,
    description: string,
    images: string[],
    deadlineDate: string,
    status: TaskStatus
}