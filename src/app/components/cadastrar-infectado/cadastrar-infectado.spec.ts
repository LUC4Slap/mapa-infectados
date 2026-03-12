import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarInfectado } from './cadastrar-infectado';

describe('CadastrarInfectado', () => {
  let component: CadastrarInfectado;
  let fixture: ComponentFixture<CadastrarInfectado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarInfectado],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarInfectado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
