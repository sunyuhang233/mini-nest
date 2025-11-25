import { Controller } from '@nestjs/common';
import { Get } from './@nestjs/common';
import { isPublic } from './public.metadata';

@Controller('users')
export class UsersController {
  @Get("list")
  @isPublic()
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
