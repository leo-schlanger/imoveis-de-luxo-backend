import { getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllUsersDTO from '@modules/users/dtos/IFindAllUsersDTO';

import User, { UserStatusEnum, UserTypeEnum } from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findAllUsers({
    except_user_id,
    page = 1,
    per_page = 20,
    filter,
  }: IFindAllUsersDTO): Promise<[User[], number]> {
    const users = this.ormRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.address', 'address')
      .leftJoinAndSelect('user.plan', 'plan');

    if (except_user_id) {
      users.andWhere('user.id != :except_user_id', { except_user_id });
    }

    if (filter) {
      const { plan, address, ...user } = filter;

      if (user) {
        const userFields = Object.entries(user);

        userFields.map(field =>
          users.andWhere(`user.${field[0]} = :${field[0]}`, {
            [field[0]]: field[1],
          }),
        );
      }

      if (address) {
        const addressFields = Object.entries(address);

        addressFields.map(field =>
          users.andWhere(`address.${field[0]} = :${`address_${field[0]}`}`, {
            [`address_${field[0]}`]: field[1],
          }),
        );
      }

      if (plan) {
        const planFields = Object.entries(plan);

        planFields.map(field =>
          users.andWhere(`plan.${field[0]} = :${`plan_${field[0]}`}`, {
            [`plan_${field[0]}`]: field[1],
          }),
        );
      }
    }

    return users
      .skip((page - 1) * per_page)
      .take(per_page)
      .addOrderBy('user.created_at', 'DESC')
      .getManyAndCount();
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne(id);

    return findUser;
  }

  public async findByName(name: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: { name },
    });

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: { email },
    });

    return findUser;
  }

  public async findAllByStatus(
    status: UserStatusEnum,
  ): Promise<User[] | undefined> {
    const findUser = await this.ormRepository.find({
      where: { status },
    });

    return findUser;
  }

  public async findAllByType(type: UserTypeEnum): Promise<User[] | undefined> {
    const findUser = await this.ormRepository.find({
      where: { type },
    });

    return findUser;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    user.status = UserStatusEnum.NEW;

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
