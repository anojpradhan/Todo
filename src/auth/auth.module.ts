import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { JwtModule} from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  imports:[
    JwtModule.register({
      global:true,
      secret:process.env.SecretKey,
      signOptions:{expiresIn:'10d'},
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,UsersService,PrismaService],
})
export class AuthModule {}
