import { Injectable } from '@nestjs/common';
import { IProjectRepository } from 'src/domain/product.repository';
import { Project } from 'src/domain/project';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  async getById(projectId: string): Promise<Project> {
    return new Project(projectId);
  }
}
