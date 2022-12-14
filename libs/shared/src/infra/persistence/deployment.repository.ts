import { Injectable } from '@nestjs/common';
import type {
  Deployment as DBDeployment,
  Project as DBProject,
} from '@prisma/client';
import { Deployment, DeploymentStatus } from '../../domain/deployment';
import { IDeploymentRepository } from '../../domain/deployment.repository';
import { PrismaService } from './prisma.service';

@Injectable()
export class DeploymentRepository implements IDeploymentRepository {
  constructor(private prisma: PrismaService) {}
  async getAll(): Promise<Deployment[]> {
    const dbRecords = await this.prisma.deployment.findMany({
      include: { project: true },
    });
    return dbRecords.map((record) => this.mapRecordToEntity(record));
  }
  async getByProjectId(projectId: string): Promise<Deployment[]> {
    const dbRecords = await this.prisma.deployment.findMany({
      include: { project: true },
      where: {
        projectId,
      },
    });
    return dbRecords.map((record) => this.mapRecordToEntity(record));
  }

  async save(deployment: Deployment): Promise<boolean> {
    const record = this.mapEntityToRecord(deployment);
    await this.prisma.deployment.upsert({
      where: { id: deployment.id },
      update: (() => {
        delete record.id;
        return record;
      })(),
      create: record,
    });
    return true;
  }

  private mapEntityToRecord(deployment: Deployment): DBDeployment {
    return {
      id: deployment.id,
      projectId: deployment.projectId,
      createdAt: deployment.createdAt,
      modifiedAt: deployment.createdAt,
      deployStrategyName: deployment.deployStrategyName,
      domains: deployment.domains,
      metadata: deployment.metadata,
      status: deployment.status,
    };
  }

  private mapRecordToEntity(record: DBDeployment & { project: DBProject }) {
    return new Deployment(
      record.id,
      record.project.id,
      record.deployStrategyName,
      record.domains,
      record.status as DeploymentStatus,
      record.metadata as object,
      record.createdAt,
      record.modifiedAt,
    );
  }
}
