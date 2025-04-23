import { NatureOfWork, RateCurrency, SkillCategory } from "src/common/constants/constants";
import { AddUpdateSkillDto } from "./add-update-skill.dto";

export const addSkill: AddUpdateSkillDto = {
  "category": SkillCategory.BACKEND,
  "experience": 5,
  "natureOfWork": NatureOfWork.ONLINE,
  "hourlyRate": 250,
  "rateCurrency": RateCurrency.INR
}
