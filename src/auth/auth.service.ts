import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto, RegisterDto } from './auth.controller';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService,
    private readonly usersService:UsersService,
    private readonly jwtService:JwtService
  ) {}
  async register(registerDto: RegisterDto) {
   const user=  await this.usersService.create(registerDto);
    // const token = await this.createToken(registerDto);
    const token= await this.jwtService.signAsync({
      userid:user.id,
      createdAt:user.created_at,
    }
  );
    return {token};
  }
  async login(loginDto: LoginDto) {
    const user= await this.prismaService.user.findFirst({
      where:{
        OR:[{
          email: loginDto.username,
        },
      {
        phone:loginDto.username,
      },],
      },
    });
    if(!user){
      throw new NotFoundException(`user Not Found `);
    }
    if(!(await compare(loginDto.password, user.password)))
      {
      throw new NotFoundException(`Invalid Credentials`);

    }
      const token= await this.jwtService.signAsync({
        userId:user.id,
      });
      return {token};
    }
    // async createToken(userDto){
    //   const user= await this.usersService.getUser(userDto.id);
    //   // console.log(user);
    //   // console.log(this.jwtService.signAsync({userId:user.id}));
    //   return(this.jwtService.signAsync({
    //     userId:user.id,
    //     createdAt:user.created_at,
    //   }
    // ));
    // }
}
