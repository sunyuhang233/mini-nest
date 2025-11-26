import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) { }
  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOne(username)
    if (!user) {
      throw new BadRequestException('用户名不存在')
    }
    if (user.password !== pass) {
      throw new UnauthorizedException()
    }
    const payload = { sub: user.userId, username: user.username, role: user.role }
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
