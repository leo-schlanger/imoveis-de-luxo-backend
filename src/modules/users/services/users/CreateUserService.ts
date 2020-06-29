import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import User, { UserTypeEnum } from '../../infra/typeorm/entities/User';
import IUsersRepository from '../../repositories/IUsersRepository';
import IHashProvider from '../../providers/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  type: UserTypeEnum;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    // TODO: pensar na listagem de usuários
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    name,
    email,
    password,
    phone,
    type,
  }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      phone,
      type,
    });

    await this.cacheProvider.invalidatePrefix('users-list');

    return user;
  }
}

export default CreateUserService;
