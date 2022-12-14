import { Test, TestingModule } from '@nestjs/testing';
import { DeployService, DEPLOY_STRATEGY_MANAGER_TOKEN } from './deploy.service';

describe('Deploy Service', () => {
  let deployService: DeployService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        DeployService,
        {
          provide: DEPLOY_STRATEGY_MANAGER_TOKEN,
          useFactory: () => {
            return {
              getDeployStrategy: jest.fn(() => ({
                deploy: jest.fn(() => true),
              })),
            };
          },
        },
      ],
    }).compile();

    deployService = app.get<DeployService>(DeployService);
  });

  it('should call configured deploy strategy', () => {
    const projectName = 'project-name';
    const testStrategy = 'test-strategy';

    expect(deployService.deployProject(projectName, testStrategy)).toBeTruthy();
  });
});
