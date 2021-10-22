import { Body, Controller, Get, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "@app/user/user.service";
import { CreateUserDto } from "@app/user/dto/createUser.dto";
import { UserResponseInterface } from "@app/user/types/userResponse.interface";
import { LoginUserDto } from "@app/user/dto/loginUser.dto";
import { Request } from "express";
import { ExpressRequestInterface } from "@app/types/expressRequest.interface";
import { User } from "@app/user/decorators/user.decorator";
import { UserEntity } from "@app/user/user.entity";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { UpdateUserDto } from "@app/user/dto/updateUser.dto";

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('users')
  @UsePipes(ValidationPipe)
  async createUser(
    @Body('user') createUserDto: CreateUserDto
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(ValidationPipe)
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(
    @User() user: UserEntity,
  ): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async updateCurrentUser(
    @User('id') userId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(
      userId,
      updateUserDto,
    );

    return this.userService.buildUserResponse(user);
  }
}
