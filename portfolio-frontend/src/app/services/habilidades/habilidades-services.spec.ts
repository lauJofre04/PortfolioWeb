import { TestBed } from '@angular/core/testing';

import { HabilidadesServices } from './habilidades-services';

describe('HabilidadesServices', () => {
  let service: HabilidadesServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HabilidadesServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
