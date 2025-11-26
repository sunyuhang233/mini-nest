import { Injectable } from '@nestjs/common';
import { Role } from './role.enum';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      role: Role.Admin,
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      role: Role.User,
    },
  ];

  async findOne(username: string) {
    return this.users.find(user => user.username === username);
  }
}
