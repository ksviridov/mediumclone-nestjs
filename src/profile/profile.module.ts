import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "@app/user/user.module";
import { FollowEntity } from "@app/profile/follow.entity";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([FollowEntity]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [TypeOrmModule]
})
export class ProfileModule {}
