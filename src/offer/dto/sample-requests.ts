import { AcceptOfferDto } from "./accept-offer.dto"
import { MakeOfferDto } from "./make-offer.dto"

export const makeOffer: MakeOfferDto = {
  accountId: 2,
  taskId: 1
}

export const acceptOffer: AcceptOfferDto = {
  userId: 1,
  providerId: 3,
  taskId: 1
}