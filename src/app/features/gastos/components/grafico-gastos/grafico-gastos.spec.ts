import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoGastos } from './grafico-gastos';

describe('GraficoGastos', () => {
  let component: GraficoGastos;
  let fixture: ComponentFixture<GraficoGastos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoGastos],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoGastos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
