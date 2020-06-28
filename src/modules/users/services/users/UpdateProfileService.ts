import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import IHashProvider from '../../providers/HashProvider/models/IHashProvider';
import User from '../../infra/typeorm/entities/User';
import IUsersRepository from '../../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  responsible?: string;
  creci?: string;
  email: string;
  phone?: string;
  secondary_phone?: string;
  description?: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
    phone,
    secondary_phone,
    responsible,
    creci,
    description,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('E-mail already in use.');
    }

    user.name = name;
    user.email = email;

    if (responsible) {
      user.responsible = responsible;
    }

    if (phone) {
      user.phone = phone;
    }

    if (secondary_phone) {
      user.secondary_phone = secondary_phone;
    }

    if (description) {
      user.description = description;
    }

    if (creci) {
      user.creci = creci;
    }

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password.',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
