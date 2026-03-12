import { TestBed } from '@angular/core/testing';

import { Infectados } from './infectados';

describe('Infectados', () => {
  let service: Infectados;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Infectados);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
