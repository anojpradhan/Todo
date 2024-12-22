import { ImpType, StatusType } from "@prisma/client";
import { Type } from "class-transformer";
// import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
export class CreateTaskDto {
  @IsOptional()
  @IsNumber()
  userId: number;
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsOptional()
  @IsEnum(StatusType)
  status?:StatusType;
  @IsOptional()
  @IsDate()
  @Type(()=>Date)
  // @Transform(({ value }) => value ? new Date(value) : value) 
  deadline?: Date;
  @IsOptional()
  @IsEnum(ImpType)
  importance?: ImpType;
}
