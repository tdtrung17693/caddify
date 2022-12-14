describe('Deploy Service', () => {
  beforeEach(async () => {
    // const app: TestingModule = await Test.createTestingModule({
    //   providers: [
    //     DeployService,
    //     {
    //       provide: DEPLOY_STRATEGY_MANAGER_TOKEN,
    //       useFactory: () => {
    //         return {
    //           getDeployStrategy: jest.fn(() => ({
    //             deploy: jest.fn((deployment: Deployment) => deployment.id),
    //           })),
    //         };
    //       },
    //     },
    //   ],
    // }).compile();
    // deployService = app.get<DeployService>(DeployService);
  });

  it('should perform deployment of a project', () => {
    /*
      build -> upload -> deploy 
     */
  });
});
