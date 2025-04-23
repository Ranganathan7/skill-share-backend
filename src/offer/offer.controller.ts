import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { swaggerAPIOptions } from 'src/common/swagger/operations';
import { OfferService } from './offer.service';
import { MakeOfferDto } from './dto/make-offer.dto';
import { acceptOffer, makeOffer } from './dto/sample-requests';
import { AcceptOfferDto } from './dto/accept-offer.dto';

@ApiTags('Offer related services')
@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) { }

  @Post('make')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: MakeOfferDto,
    examples: {
      makeOffer: {
        value: makeOffer
      },
    }
  })
  @ApiOperation(swaggerAPIOptions.makeOffer)
  async makeOffer(@Body() dto: MakeOfferDto) {
    return this.offerService.makeOffer(dto.accountId, dto.taskId);
  }

  @Get('/get/:accountId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    type: Number,
    name: 'accountId'
  })
  @ApiOperation(swaggerAPIOptions.getOffers)
  async getOffersForaccount(@Param('accountId', ParseIntPipe) accountId: number) {
    return this.offerService.getOffersForAccount(accountId)
  }

  @Post('accept')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: AcceptOfferDto,
    examples: {
      acceptOffer: {
        value: acceptOffer
      },
    }
  })
  @ApiOperation(swaggerAPIOptions.acceptOffer)
  async acceptOffer(@Body() dto: AcceptOfferDto) {
    return this.offerService.acceptOffer(dto)
  }
}
