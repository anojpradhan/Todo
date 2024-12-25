import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
// import { retry } from 'rxjs';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService:PrismaService){}
 async create(createUserDto: CreateUserDto) {
  await this.userPhoneExists(createUserDto.phone);
  await this.userEmailExists(createUserDto.email);
  createUserDto.password= await hash(createUserDto.password,10);
    return this.prismaService.user.create({
      data:createUserDto
    });
  }
 async findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: number) {
    return this.getUser(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.getUser(id);
    if (updateUserDto.email){
      await this.userEmailExists(updateUserDto.email, id);
    } 
    if (updateUserDto.phone){
      await this.userPhoneExists(updateUserDto.phone, id); 
    } 
    if(updateUserDto.password && user.password !== updateUserDto.password){
    }
    return this.prismaService.user.update({
      where:{id},
      data: updateUserDto,
    });
  }

 async  remove(id: number) {
    await this.getUser(id);
    return this.prismaService.user.delete({ where: { id } });
  }
  // find User 
  async getUser(id:number){
    const user = await this.prismaService.user.findFirst({where:{id}});
    if(!user){
      throw new NotFoundException("User Not Found.");
    }
      return user;
  }

  // check if user exists or not thrpugh email and number
  async userPhoneExists(phone:string,id?:number){
    const doesPhoneExists= await this.prismaService.user.findFirst({where:{phone}});
    // console.log(doesPhoneExists);
    if(doesPhoneExists){
      if(id && doesPhoneExists.id!==id)
      {
        throw new BadRequestException(`Phone already exists`);
      }
      else if (!id){
        throw new BadRequestException(`Phone already exists`);
      }
    }}
  async userEmailExists(email:string,id?:number){
    const doesEmailExists= await this.prismaService.user.findFirst({where:{email}});
    if(doesEmailExists){
      if(id && doesEmailExists.id!==id)
      {
        throw new BadRequestException(`Email already exists`);
      }
      else if (!id){
        throw new BadRequestException(`Email already exists`);
      }
    }}

}
