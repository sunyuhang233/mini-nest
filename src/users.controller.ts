import { Controller, UseGuards } from '@nestjs/common';
import { Get } from './@nestjs/common';
import { isPublic } from './public.metadata';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';
import { RolesGuard } from './roles.guard';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  @Get("list")
  // @isPublic()
  @Roles(Role.User)
  getList() {
    return {
      code: 200,
      data: [
        {
          userId: 1,
          username: 'john',
        },
        {
          userId: 2,
          username: 'maria',
        },
      ],
    };
  }
}
