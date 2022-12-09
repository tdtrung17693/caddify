import { IPipelineStep } from '../infra/pipeline/step';

export class Pipeline {
  constructor(private steps: IPipelineStep[] = []) {}

  insertStep(step: IPipelineStep, stepIndex: number) {
    this.steps.splice(stepIndex, 0, step);
  }

  removeStep(stepIndex: number) {
    this.steps.splice(stepIndex, 1);
  }

  async run<T>(input: T) {
    let output = input;
    const stepNumber = this.steps.length;

    for (let i = 0; i < stepNumber; i += 1) {
      output = await this.steps[i].run(input);
    }

    return output;
  }
}
