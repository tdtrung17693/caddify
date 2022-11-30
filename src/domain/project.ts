import { Deployment } from './deployment';

export class Project {
  constructor(public projectName: string) {}
  deploy() {
    return new Deployment(this.projectName);
  }
}
