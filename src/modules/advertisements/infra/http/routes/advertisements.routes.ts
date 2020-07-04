import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import multer from 'multer';
import uploadConfig from '@config/upload';

import AdvertisementsController from '../controllers/AdvertisementsController';
import AdvertisementMediaController from '../controllers/AdvertisementMediaController';
import AdvertisementAddressController from '../controllers/AdvertisementAddressController';

const advertisementsRouter = Router();
const advertisementsController = new AdvertisementsController();
const advertisementMediaController = new AdvertisementMediaController();
const advertisementAddressController = new AdvertisementAddressController();
const upload = multer(uploadConfig.multer);

advertisementsRouter.get(
  '/:advertisement_id',
  celebrate({
    [Segments.PARAMS]: {
      advertisement_id: Joi.string().uuid().required(),
    },
  }),
  advertisementsController.show,
);

advertisementsRouter.use(ensureAuthenticated);

advertisementsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
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
        value: Joi.number().required(),
      },
    },
  }),
  advertisementsController.create,
);

advertisementsRouter.put(
  '/:advertisement_id',
  celebrate({
    [Segments.PARAMS]: {
      advertisement_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
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
  advertisementsController.delete,
);

advertisementsRouter.put(
  '/:advertisement_id/gallery/:type',
  celebrate({
    [Segments.PARAMS]: {
      advertisement_id: Joi.string().uuid().required(),
      type: Joi.string().valid('photo', 'video').required,
    },
  }),
  upload.array('gallery'),
  advertisementMediaController.update,
);

export default advertisementsRouter;
