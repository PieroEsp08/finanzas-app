import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMeta } from './card-meta';

describe('CardMeta', () => {
  let component: CardMeta;
  let fixture: ComponentFixture<CardMeta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMeta],
    }).compileComponents();

    fixture = TestBed.createComponent(CardMeta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
