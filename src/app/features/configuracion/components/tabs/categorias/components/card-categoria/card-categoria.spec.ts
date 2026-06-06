import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCategoria } from './card-categoria';

describe('CardCategoria', () => {
  let component: CardCategoria;
  let fixture: ComponentFixture<CardCategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCategoria],
    }).compileComponents();

    fixture = TestBed.createComponent(CardCategoria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
