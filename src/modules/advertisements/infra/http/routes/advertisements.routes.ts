import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import multer from 'multer';
import uploadConfig from '@config/upload';

import AdvertisementsController from '../controllers/AdvertisementsController';
import AdvertisementMediaController from '../controllers/AdvertisementMediaController';
import AdvertisementAddressController from '../controllers/AdvertisementAddressController';
import AdvertisementListController from '../controllers/AdvertisementListController';

const advertisementsRouter = Router();
const advertisementsController = new AdvertisementsController();
const advertisementListController = new AdvertisementListController();
const advertisementMediaController = new AdvertisementMediaController();
const advertisementAddressController = new AdvertisementAddressController();
const upload = multer(uploadConfig.multer);

advertisementsRouter.get(
  '/',
  celebrate({
    [Segments.BODY]: {
      per_page: Joi.number(),
      page: Joi.number(),
      filter: Joi.object({
        type: Joi.string().required(),
        property: Joi.object({
          type: Joi.string().required(),
          address: Joi.object({
            country: Joi.string(),
            state: Joi.string(),
            neighborhood: Joi.string(),
            street: Joi.string(),
          }),
        }),
      }),
    },
  }),
  advertisementListController.show,
);

advertisementsRouter.get(
  '/:advertisement_id',
  celebrate({
    [Segments.PARAMS]: {
      advertisement_id: Joi.number().required(),
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
        country: Joi.string().required(),
        state: Joi.string().required(),
        postal_code: Joi.string().required(),
        neighborhood: Joi.string().required(),
        street: Joi.string().required(),
        sub_neighborhood: Joi.string(),
        number: Joi.string(),
        complement: Joi.string(),
        description: Joi.string(),
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
      advertisement_id: Joi.number().required(),
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
          street: Joi.string().required(),
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
      advertisement_id: Joi.number().required(),
    },
    [Segments.BODY]: {
      country: Joi.string(),
      state: Joi.string(),
      postal_code: Joi.string(),
      neighborhood: Joi.string(),
      street: Joi.string(),
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
      advertisement_id: Joi.number().required(),
    },
  }),
  advertisementsController.delete,
);

advertisementsRouter.post(
  '/:advertisement_id/gallery/:type',
  celebrate({
    [Segments.PARAMS]: {
      advertisement_id: Joi.number().required(),
      type: Joi.string().valid('photo', 'video').required(),
    },
  }),
  upload.array('gallery'),
  advertisementMediaController.update,
);

export default advertisementsRouter;
