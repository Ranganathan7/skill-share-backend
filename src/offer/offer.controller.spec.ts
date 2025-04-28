import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { MakeOfferDto } from './dto/make-offer.dto';
import { GetOffersDto } from './dto/get-offers.dto';
import { AcceptOfferDto } from './dto/accept-offer.dto';

describe('OfferController', () => {
  let controller: OfferController;
  let service: OfferService;

  beforeEach(() => {
    service = {
      makeOffer: jest.fn(),
      getOffersForAccount: jest.fn(),
      acceptOffer: jest.fn(),
    } as any;
    controller = new OfferController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('makeOffer', () => {
    it('should call offerService.makeOffer with correct params', async () => {
      const dto = { accountId: 1, taskId: 2 } as MakeOfferDto;
      const result = { success: true };
      (service.makeOffer as jest.Mock).mockResolvedValue(result);

      expect(await controller.makeOffer(dto)).toEqual(result);
      expect(service.makeOffer).toHaveBeenCalledWith(dto.accountId, dto.taskId);
    });
  });

  describe('getOffersForAccount', () => {
    it('should call offerService.getOffersForAccount with correct params', async () => {
      const dto = { accountId: 1 } as GetOffersDto;
      const result = [{ offerId: 1 }];
      (service.getOffersForAccount as jest.Mock).mockResolvedValue(result);

      expect(await controller.getOffersForaccount(dto)).toEqual(result);
      expect(service.getOffersForAccount).toHaveBeenCalledWith(dto.accountId);
    });
  });

  describe('acceptOffer', () => {
    it('should call offerService.acceptOffer with correct dto', async () => {
      const dto = { accountId: 1, taskId: 2, offerAccountId: 3 } as unknown as AcceptOfferDto;
      const result = { success: true };
      (service.acceptOffer as jest.Mock).mockResolvedValue(result);

      expect(await controller.acceptOffer(dto)).toEqual(result);
      expect(service.acceptOffer).toHaveBeenCalledWith(dto);
    });
  });
});
