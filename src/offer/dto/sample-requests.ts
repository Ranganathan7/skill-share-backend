import { AcceptOfferDto } from './accept-offer.dto';
import { MakeOfferDto } from './make-offer.dto';

export const makeOffer: OmitAccountId<MakeOfferDto> = {
  taskId: 1,
};

export const acceptOffer: OmitAccountId<AcceptOfferDto> = {
  providerId: 3,
  taskId: 1,
};
