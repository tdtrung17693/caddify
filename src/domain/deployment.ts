import * as shortUUID from 'short-uuid';
export class Deployment {
  public id: string;
  public subdomain: string;
  constructor(public projectId: string) {
    this.id = shortUUID.generate();
    this.subdomain = `${this.projectId}-${this.id}`;
  }
}
