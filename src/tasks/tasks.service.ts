import {  BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
// import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService:PrismaService,){}
  async create(createTaskDto: CreateTaskDto) {
   const abc= await this.taskExists(createTaskDto.title, createTaskDto.userId);
   if(abc){
     const create= this.prismaService.task.create({data:createTaskDto});
     return create;
    }
  }
 async  findAll(userId:number) {
   const tasks = await this.prismaService.task.findMany({where:{userId}});
   if(tasks.length){
    return tasks;
   }
   else
   throw new BadRequestException(`No Tasks Found`);
  }
  
  async findOne(id: number) {
    const tasks = await this.prismaService.task.findFirst({where:{id}});
    if(tasks){
      return tasks;
    }
    else{
      throw new BadRequestException(`task not found`);
    }
  }
  async update(id: number, updateTaskDto:UpdateTaskDto, userId:number) {
   const allUserTasks = await this.prismaService.task.findMany({where:{userId}});
   const otherUserTasks = allUserTasks.filter(task => task.id !== id);
  //  const length= otherUserTasks.length;
   if(otherUserTasks.length){
     const abc =otherUserTasks.filter(task => task.title == updateTaskDto.title)
     if(abc.length>0){
      throw new BadRequestException(`Sakyo`);
     }
   }
    return this.prismaService.task.update({
      where:{id},
      data: updateTaskDto,
    });
  }

 async  remove(id: number) {
  const task = await this.prismaService.task.findFirst({where:{id}});
  if(task)
  {
    return this.prismaService.task.delete({where:{id}});
  }
  else{
    throw new BadRequestException(`No task for delete`);
  }
  }
  async taskExists(title:string, userId:number){
    const doesTaskExists = await this.prismaService.task.findMany({where:{title}});
    const length= doesTaskExists.length;
    if(length>0){
      console.log("IamIn");
      const doesTaskExistForUser = doesTaskExists.filter(task => task.userId==userId);
      if(doesTaskExistForUser){
        throw new BadRequestException("task already exists");
      }
    }
    else{
      return true;
    }
  }
}
