import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaDeLogin } from './tela-de-login';

describe('TelaDeLogin', () => {
  let component: TelaDeLogin;
  let fixture: ComponentFixture<TelaDeLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TelaDeLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaDeLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
