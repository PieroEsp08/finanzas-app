import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetasPage } from './metas-page';

describe('MetasPage', () => {
  let component: MetasPage;
  let fixture: ComponentFixture<MetasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetasPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MetasPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
