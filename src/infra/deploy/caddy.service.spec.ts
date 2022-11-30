import { Test, TestingModule } from '@nestjs/testing';
import { CaddyService } from './caddy.service';

describe('Deploy Service', () => {
  let caddyService: CaddyService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [CaddyService],
    }).compile();

    caddyService = app.get<CaddyService>(CaddyService);
  });

  it('should add a site to config', () => {
    expect(true).toBeTruthy();
  });
});
