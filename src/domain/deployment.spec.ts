import { Project } from './project';

describe('Project', () => {
  it('should create a deployment when deploying', () => {
    const projectName = 'project-name';
    const project = new Project(projectName);
    const deployment = project.deploy();
    expect(deployment.id.includes(projectName)).toBe(true);
  });
});
