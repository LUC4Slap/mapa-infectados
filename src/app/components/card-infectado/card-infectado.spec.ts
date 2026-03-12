import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInfectado } from './card-infectado';

describe('CardInfectado', () => {
  let component: CardInfectado;
  let fixture: ComponentFixture<CardInfectado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardInfectado],
    }).compileComponents();

    fixture = TestBed.createComponent(CardInfectado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
