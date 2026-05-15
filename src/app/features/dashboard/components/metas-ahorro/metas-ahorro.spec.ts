import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetasAhorro } from './metas-ahorro';

describe('MetasAhorro', () => {
  let component: MetasAhorro;
  let fixture: ComponentFixture<MetasAhorro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetasAhorro],
    }).compileComponents();

    fixture = TestBed.createComponent(MetasAhorro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
