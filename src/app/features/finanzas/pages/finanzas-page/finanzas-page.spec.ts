import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanzasPage } from './finanzas-page';

describe('FinanzasPage', () => {
  let component: FinanzasPage;
  let fixture: ComponentFixture<FinanzasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanzasPage],
    }).compileComponents();

    fixture = TestBed.createComponent(FinanzasPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
