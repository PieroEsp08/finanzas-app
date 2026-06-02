import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPresupuesto } from './card-presupuesto';

describe('CardPresupuesto', () => {
  let component: CardPresupuesto;
  let fixture: ComponentFixture<CardPresupuesto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPresupuesto],
    }).compileComponents();

    fixture = TestBed.createComponent(CardPresupuesto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
