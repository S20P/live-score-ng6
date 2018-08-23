import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurAppsComponent } from './our-apps.component';

describe('OurAppsComponent', () => {
  let component: OurAppsComponent;
  let fixture: ComponentFixture<OurAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
