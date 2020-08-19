import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import multer from 'multer';
import uploadConfig from '@config/upload';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import UsersController from '../controllers/UsersController';
import UserPlanController from '../controllers/UserPlanController';
import UserAvatarController from '../controllers/UserAvatarController';
import UserListController from '../controllers/UserListController';

const usersRouter = Router();
const usersController = new UsersController();
const userPlanController = new UserPlanController();
const userAvatarController = new UserAvatarController();
const userListController = new UserListController();
const upload = multer(uploadConfig.multer);

usersRouter.get(
  '/',
  celebrate({
    [Segments.BODY]: {
      except_user_id: Joi.string(),
      per_page: Joi.number(),
      page: Joi.number(),
      filter: Joi.object({
        name: Joi.string(),
        responsible: Joi.string(),
        creci: Joi.string(),
        email: Joi.string(),
        status: Joi.string(),
        type: Joi.string().required(),
        address: Joi.object({
          country: Joi.string(),
          state: Joi.string(),
          neighborhood: Joi.string(),
          address: Joi.string(),
        }),
        plan: Joi.object({
          name: Joi.string(),
        }),
        plan_status: Joi.boolean(),
      }),
    },
  }),
  userListController.show,
);

usersRouter.get(
  '/:user_id',
  celebrate({
    [Segments.PARAMS]: {
      user_id: Joi.string().uuid().required(),
    },
  }),
  usersController.show,
);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      phone: Joi.string().required(),
      type: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.put(
  '/plan/:plan_id',
  ensureAuthenticated,
  userPlanController.update,
);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;
