import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReaderDashboard } from './reader-dashboard';

describe('ReaderDashboard', () => {
  let component: ReaderDashboard;
  let fixture: ComponentFixture<ReaderDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReaderDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(ReaderDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
