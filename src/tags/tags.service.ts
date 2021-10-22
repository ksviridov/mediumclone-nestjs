import { Injectable } from '@nestjs/common';
import { TagEntity } from "@app/tags/tag.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async finAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find();
  }
}
