import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IAdressesRepository from '@modules/adresses/repositories/IAdressesRepository';
import AdressesRepository from '@modules/adresses/infra/typeorm/repositories/AdressesRepository';

import IPropertiesRepository from '@modules/properties/repositories/IPropertiesRepository';
import PropertiesRepository from '@modules/properties/infra/typeorm/repositories/PropertiesRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IAdvertisementsRepository from '@modules/advertisements/repositories/IAdvertisementsRepository';
import AdvertisementsRepository from '@modules/advertisements/infra/typeorm/repositories/AdvertisementsRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

container.registerSingleton<IAdressesRepository>(
  'AdressesRepository',
  AdressesRepository,
);

container.registerSingleton<IPropertiesRepository>(
  'PropertiesRepository',
  PropertiesRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IAdvertisementsRepository>(
  'AdvertisementsRepository',
  AdvertisementsRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);
