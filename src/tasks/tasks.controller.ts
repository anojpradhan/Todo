import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
import { Request } from 'express';
import { UpdateTaskDto } from './dto/update-task.dto';
// import { User } from '@prisma/client';
interface UserPayload extends Request{
  payload:{
    userId:number;
    created_At:Date;
  }
}
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Req() userPayload:UserPayload,@Body() createTaskDto: CreateTaskDto) {
    // console.log(userPayload);
    createTaskDto.userId= userPayload.payload.userId;
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Req() userPayload:UserPayload) {
    return this.tasksService.findAll(userPayload.payload.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string ) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto:UpdateTaskDto,@Req() userPayload:UserPayload) {
    return this.tasksService.update(+id , updateTaskDto, userPayload.payload.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
