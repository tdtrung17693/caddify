import { Maybe } from 'src/common/maybe.type';
import { Project } from './project';

export const PROJECT_REPOSITORY_TOKEN = Symbol('PROJECT_REPOSITORY');
export interface IProjectRepository {
  getById(projectId: string): Promise<Maybe<Project>>;
}
