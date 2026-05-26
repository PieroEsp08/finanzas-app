import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardReporte } from './card-reporte';

describe('CardReporte', () => {
  let component: CardReporte;
  let fixture: ComponentFixture<CardReporte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardReporte],
    }).compileComponents();

    fixture = TestBed.createComponent(CardReporte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
