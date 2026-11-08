import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorDashboard } from './author-dashboard';

describe('AuthorDashboard', () => {
  let component: AuthorDashboard;
  let fixture: ComponentFixture<AuthorDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
