import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCadastroInfectado } from './modal-cadastro-infectado';

describe('ModalCadastroInfectado', () => {
  let component: ModalCadastroInfectado;
  let fixture: ComponentFixture<ModalCadastroInfectado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCadastroInfectado],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCadastroInfectado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
