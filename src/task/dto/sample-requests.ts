import { RateCurrency, SkillCategory } from "src/common/constants/constants";
import { CreateTaskDto } from "./create-task.dto";
import { UpdateTaskProgressDto } from "./update-progress.dto";
import { UpdateTaskStatusDto } from "./update-status.dto";

export const createTask: CreateTaskDto = {
  category: SkillCategory.FRONTEND,
  name: "Build a personal portfolio",
  description: "Looking for someone to build a responsive personal portfolio using Next.js and Tailwind CSS.",
  expectedStartDate: new Date(),
  expectedWorkingHours: 40,
  hourlyRate: 500,
  rateCurrency: RateCurrency.INR,
  accountId: 1
}

export const updateTaskProgress: UpdateTaskProgressDto = {
  taskId: 1,
  description: "Initial setup completed, moving to development phase.",
  accountId: 3,
}

export const updateTaskStatus: UpdateTaskStatusDto = {
  taskId: 1,
  accountId: 1,
}