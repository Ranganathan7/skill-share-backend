import { RateCurrency, SkillCategory } from "src/common/constants/constants";
import { CreateTaskDto } from "./create-task.dto";

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