import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeightSettingsComponent } from './height-settings.component';

describe('HeightSettingsComponent', () => {
  let component: HeightSettingsComponent;
  let fixture: ComponentFixture<HeightSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeightSettingsComponent]
    });
    fixture = TestBed.createComponent(HeightSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
