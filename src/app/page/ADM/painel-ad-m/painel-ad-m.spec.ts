import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelAdM } from './painel-ad-m';

describe('PainelAdM', () => {
  let component: PainelAdM;
  let fixture: ComponentFixture<PainelAdM>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PainelAdM]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelAdM);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
