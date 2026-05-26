import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoResumenAnual } from './grafico-resumen-anual';

describe('GraficoResumenAnual', () => {
  let component: GraficoResumenAnual;
  let fixture: ComponentFixture<GraficoResumenAnual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoResumenAnual],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoResumenAnual);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
