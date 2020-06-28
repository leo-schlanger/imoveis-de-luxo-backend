import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

// TODO: repensar rotas de atualização da galeria
// import multer from 'multer';
// import uploadConfig from '@config/upload';

import AdvertisementsController from '../controllers/AdvertisementsController';
import AdvertisementAddressController from '../controllers/AdvertisementAddressController';

const advertisementsRouter = Router();
const advertisementsController = new AdvertisementsController();
const advertisementAddressController = new AdvertisementAddressController();
// const upload = multer(uploadConfig.multer);

advertisementsRouter.use(ensureAuthenticated);

advertisementsRouter.get(
  '/:advertisement_id',
  celebrate({
    [Segments.PARAMS]: {
      advertisement_id: Joi.string().uuid().required(),
    },
  }),
  advertisementsController.show,
);

advertisementsRouter.put(
  '/:advertisement_id',
  celebrate({
    [Segments.PARAMS]: {
      advertisement_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      user_id: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string(),
      address_visible: Joi.boolean(),
      type: Joi.string().required(),
      property: {
        address: {
          country: Joi.string().required(),
          state: Joi.string().required(),
          postal_code: Joi.string().required(),
          neighborhood: Joi.string().required(),
          address: Joi.string().required(),
          sub_neighborhood: Joi.string(),
          number: Joi.string(),
          complement: Joi.string(),
          description: Joi.string(),
        },
        type: Joi.string().required(),
        value: Joi.number(),
      },
    },
  }),
  advertisementsController.update,
);

advertisementsRouter.put(
  '/:advertisement_id/address',
  celebrate({
    [Segments.PARAMS]: {
      advertisement_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      country: Joi.string(),
      state: Joi.string(),
      postal_code: Joi.string(),
      neighborhood: Joi.string(),
      address: Joi.string(),
      sub_neighborhood: Joi.string(),
      number: Joi.string(),
      complement: Joi.string(),
      description: Joi.string(),
    },
  }),
  advertisementAddressController.update,
);

advertisementsRouter.delete(
  '/:advertisement_id',
  celebrate({
    [Segments.PARAMS]: {
      advertisement_id: Joi.string().uuid().required(),
    },
  }),
  advertisementsController.update,
);

// TODO: Desenvolver a parte de upload de imagems da galeria de anúncios
// advertisementsRouter.put(
//   '/:advertisement_id/gallery',
//   ensureAuthenticated,
//   upload.array('gallery'),
//   AdvertisementGalleryController.update,
// );

export default advertisementsRouter;
