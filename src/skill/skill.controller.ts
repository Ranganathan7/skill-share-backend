import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { swaggerAPIOptions } from '../common/swagger/operations';
import { AddUpdateSkillDto } from './dto/add-update-skill.dto';
import { addSkill } from './dto/sample-requests';
import { SkillService } from './skill.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetSkillsDto } from './dto/get-skills.dto';
import { headers } from '../common/constants/constants';

@Controller('skills')
@ApiTags('Skill related services')
@ApiBearerAuth()
@ApiHeader({
  name: headers.requestId,
  required: true,
})
@UseGuards(JwtAuthGuard)
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  /**
   * Endpoint to add or update a skill for a given account.
   * Accepts skill details and the account ID as input.
   * Returns the updated list of skills for the account.
   */
  @Post('/add-update')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation(swaggerAPIOptions.addUpdateSkill)
  @ApiBody({
    type: AddUpdateSkillDto,
    examples: {
      addSkill: {
        value: addSkill,
      },
    },
  })
  async addOrUpdate(@Body() dto: AddUpdateSkillDto) {
    return this.skillService.addOrUpdate(dto.accountId, dto);
  }

  /**
   * Endpoint to retrieve all skills associated with a given account ID.
   * Returns an array of skill objects if found.
   */
  @Post('/get')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(swaggerAPIOptions.getSkills)
  async getSkills(@Body() dto: GetSkillsDto) {
    return this.skillService.getSkills(dto.accountId);
  }
}
