import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasTab } from './categorias-tab';

describe('CategoriasTab', () => {
  let component: CategoriasTab;
  let fixture: ComponentFixture<CategoriasTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasTab],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriasTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
