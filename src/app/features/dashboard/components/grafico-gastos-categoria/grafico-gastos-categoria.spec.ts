import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoGastosCategoria } from './grafico-gastos-categoria';

describe('GraficoGastosCategoria', () => {
  let component: GraficoGastosCategoria;
  let fixture: ComponentFixture<GraficoGastosCategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoGastosCategoria],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoGastosCategoria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
