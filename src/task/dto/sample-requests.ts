import { RateCurrency, SkillCategory } from "../../common/constants/constants";
import { CreateTaskDto } from "./create-task.dto";
import { UpdateTaskProgressDto } from "./update-progress.dto";
import { UpdateTaskStatusDto } from "./update-status.dto";

export const createTask: OmitAccountId<CreateTaskDto> = {
  category: SkillCategory.FRONTEND,
  name: "Build a personal portfolio",
  description: "Looking for someone to build a responsive personal portfolio using Next.js and Tailwind CSS.",
  expectedStartDate: new Date(),
  expectedWorkingHours: 40,
  hourlyRate: 500,
  rateCurrency: RateCurrency.INR,
}

export const updateTaskProgress: OmitAccountId<UpdateTaskProgressDto> = {
  taskId: 1,
  description: "Initial setup completed, moving to development phase.",
}

export const updateTaskStatus: OmitAccountId<UpdateTaskStatusDto> = {
  taskId: 1,
}