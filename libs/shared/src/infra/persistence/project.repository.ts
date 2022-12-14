import { Injectable } from '@nestjs/common';
import { IProjectRepository } from '../../domain/product.repository';
import { Project } from '../../domain/project';
import { PrismaService } from './prisma.service';
import { ProjectMapper } from './mapper/project.mapper';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(
    private prisma: PrismaService,
    private dataMapper: ProjectMapper,
  ) {}
  async getById(projectId: string): Promise<Project> {
    const record = await this.prisma.project.findFirstOrThrow({
      where: { id: projectId },
      include: {
        deployments: true,
      },
    });
    return this.dataMapper.invertMap(record);
  }
}
