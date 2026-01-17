import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { AuthCollectionMatmenuComponent } from './auth-collection-matmenu.component'

describe('AuthCollectionMatmenuComponent', () => {
  let component: AuthCollectionMatmenuComponent
  let fixture: ComponentFixture<AuthCollectionMatmenuComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AuthCollectionMatmenuComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCollectionMatmenuComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
