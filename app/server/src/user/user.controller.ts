import { Controller, Get, Post, Delete, Param, Body, HttpStatus, HttpCode, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import type { UserService } from './user.service'
import type { CreateUserDto } from './dto/user.dto'
import type { User } from './schemas/user.schema'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() createCatDto: CreateUserDto) {
    await this.userService.create(createCatDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id)
  }
}
