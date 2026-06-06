import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTab } from './general-tab';

describe('GeneralTab', () => {
  let component: GeneralTab;
  let fixture: ComponentFixture<GeneralTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralTab],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
