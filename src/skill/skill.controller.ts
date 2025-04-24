import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { swaggerAPIOptions } from 'src/common/swagger/operations';
import { AddUpdateSkillDto } from './dto/add-update-skill.dto';
import { addSkill } from './dto/sample-requests';
import { SkillService } from './skill.service';

@Controller('skills')
@ApiTags('Skill related services')
export class SkillController {
  constructor(private readonly skillService: SkillService) { }

  /**
   * Endpoint to add or update a skill for a given account.
   * Accepts skill details and the account ID as input.
   * Returns the updated list of skills for the account.
   */
  @Post('/add-update/:accountId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation(swaggerAPIOptions.addUpdateSkill)
  @ApiBody({
    type: AddUpdateSkillDto,
    examples: {
      addSkill: {
        value: addSkill
      },
    }
  })
  @ApiParam({
    type: Number,
    name: 'accountId'
  })
  async addOrUpdate(
    @Body() dto: AddUpdateSkillDto,
    @Param('accountId', ParseIntPipe) accountId: number,
  ) {
    return this.skillService.addOrUpdate(accountId, dto);
  }

  /**
   * Endpoint to retrieve all skills associated with a given account ID.
   * Returns an array of skill objects if found.
   */
  @Get('/get/:accountId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    type: Number,
    name: 'accountId'
  })
  @ApiOperation(swaggerAPIOptions.getSkills)
  async getSkills(@Param('accountId', ParseIntPipe) accountId: number) {
    return this.skillService.getSkills(accountId);
  }
}
