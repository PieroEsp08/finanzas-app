import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaccionesRecientes } from './transacciones-recientes';

describe('TransaccionesRecientes', () => {
  let component: TransaccionesRecientes;
  let fixture: ComponentFixture<TransaccionesRecientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransaccionesRecientes],
    }).compileComponents();

    fixture = TestBed.createComponent(TransaccionesRecientes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
