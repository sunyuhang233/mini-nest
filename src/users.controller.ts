import { Controller, UseGuards, Body, Post } from '@nestjs/common';
import { Get } from './@nestjs/common';
import { isPublic } from './public.metadata';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';
import { RolesGuard } from './roles.guard';
import { CreateUserDto } from './dto/create-user.dto';

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

  @Post("create")
  @isPublic()
  createUser(@Body() createUserDto: CreateUserDto) {
    return {
      code: 200,
      message: '用户创建成功',
      data: createUserDto
    };
  }
}
