import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProfileController from '../controllers/ProfileController';
import UserAddressController from '../controllers/UserAddressController';

import ensureAuthenticated from '../middleware/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();
const userAddressController = new UserAddressController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      responsible: Joi.string(),
      creci: Joi.string(),
      phone: Joi.string(),
      secondary_phone: Joi.string(),
      description: Joi.string(),
      password: Joi.string(),
      old_password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);

profileRouter.put(
  '/address',
  celebrate({
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
  userAddressController.update,
);

export default profileRouter;
