import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllUsersDTO from '@modules/users/dtos/IFindAllUsersDTO';
import User from '../infra/typeorm/entities/User';

// TODO: Colocar os métodos faltantes já implementados no UsersRepository
export default interface IUsersRepository {
  findAllUsers(data: IFindAllUsersDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
