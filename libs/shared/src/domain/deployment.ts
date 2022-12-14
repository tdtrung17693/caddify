export enum DeploymentStatus {
  Pending = 'PENDING',
  InProgress = 'IN_PROGRESS',
  Successfull = 'SUCCESSFUL',
  Failed = 'FAILED',
  Canceled = 'CANCELED',
}

export class Deployment {
  constructor(
    public id: string,
    public projectId: string,
    public deployStrategyName: string,
    public domains: string[] = [],
    public status: DeploymentStatus = DeploymentStatus.Pending,
    public metadata: object = {},
    public createdAt: Date = new Date(),
    public modifiedAt: Date = new Date(),
  ) {}

  public attachDomain(domain: string) {
    this.domains.push(domain);
  }
}
