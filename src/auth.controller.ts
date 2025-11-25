import { Body, Controller, Get, UseGuards, Request } from '@nestjs/common';
import { Post } from './@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { isPublic } from './public.metadata';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @isPublic()
  @Post('sign-in')
  signIn(@Body() signInDto: { username: string, password: string }) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
  // @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
