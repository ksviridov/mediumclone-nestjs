import { Controller, Get } from "@nestjs/common";
import { TagsService } from "./tags.service";

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async finAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagsService.finAll();

    return {
      tags: tags.map(tag => tag.name),
    }
  }
}
