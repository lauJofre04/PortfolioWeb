import { TestBed } from '@angular/core/testing';

import { ProyectosServices } from './proyectos-services';

describe('ProyectosServices', () => {
  let service: ProyectosServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProyectosServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
