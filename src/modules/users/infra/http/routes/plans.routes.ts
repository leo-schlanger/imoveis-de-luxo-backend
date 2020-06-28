import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import PlansController from '../controllers/PlansController';

const plansRouter = Router();
const plansController = new PlansController();

plansRouter.get('/', plansController.show);

plansRouter.use(ensureAuthenticated);

plansRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string(),
      quantity_photos: Joi.number().required(),
      quantity_properties: Joi.number().required(),
      quantity_videos: Joi.number().required(),
      value: Joi.number().required(),
    },
  }),
  plansController.create,
);

plansRouter.put(
  '/:plain_id',
  celebrate({
    [Segments.PARAMS]: {
      plain_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string(),
      quantity_photos: Joi.number().required(),
      quantity_properties: Joi.number().required(),
      quantity_videos: Joi.number().required(),
      value: Joi.number().required(),
    },
  }),
  plansController.update,
);

plansRouter.delete(
  '/:plain_id',
  celebrate({
    [Segments.PARAMS]: {
      plain_id: Joi.string().uuid().required(),
    },
  }),
  plansController.delete,
);

export default plansRouter;
