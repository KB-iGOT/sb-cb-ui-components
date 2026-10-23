import { UntypedFormBuilder } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ChangeDetectorRef } from '@angular/core'
import { AddUsersFormMetaComponent } from './add-users-form-meta.component'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { UserService } from '../user.service'
import { of, throwError } from 'rxjs'

describe('AddUsersFormMetaComponent', () => {
  let component: AddUsersFormMetaComponent
  let mockFormBuilder: UntypedFormBuilder
  let mockConfigSvc: any
  let mockUserService: any
  let mockSnackBar: any
  let mockChangeDetector: any
  let mockEnvironment: any

  beforeEach(() => {
    mockFormBuilder = new UntypedFormBuilder()

    mockConfigSvc = {
      userProfile: {
        departmentName: 'Test Department',
        rootOrgId: 'test-org',
      },
      unMappedUser: {
        rootOrg: {
          channel: 'test-channel',
        },
      },
    }

    mockUserService = {
      getUserById: jest.fn().mockReturnValue(of(null)),
      addUserToRole: jest.fn().mockReturnValue(of(null)),
    }

    mockSnackBar = {
      openFromComponent: jest.fn(),
    }

    mockChangeDetector = {
      detectChanges: jest.fn(),
    } as unknown as ChangeDetectorRef

    mockEnvironment = {
      portalRoles: ['ADMIN', 'USER', 'SPV_PUBLISHER'],
    }

    component = new AddUsersFormMetaComponent(
      mockFormBuilder,
      mockConfigSvc as ConfigurationsService,
      mockUserService as UserService,
      mockSnackBar as MatSnackBar,
      mockChangeDetector,
      mockEnvironment,
    )
    component.userId = 'test-id'
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {
    it('should filter out SPV_PUBLISHER from portal roles and load user values', () => {
      component.ngOnInit()
      expect(component.listOfRoles).toEqual(['ADMIN', 'USER'])
      expect(mockUserService.getUserById).toHaveBeenCalledWith('test-id')
    })
  })

  describe('ngAfterViewInit', () => {
    it('should trigger change detection', () => {
      component.ngAfterViewInit()
      expect(mockChangeDetector.detectChanges).toHaveBeenCalled()
    })
  })

  describe('actionBtn', () => {
    it('should emit cancel event', () => {
      const emitSpy = jest.spyOn(component.updateEvent, 'emit')
      component.actionBtn()
      expect(emitSpy).toHaveBeenCalledWith('cancel')
    })
  })

  describe('assignValues', () => {
    it('should populate the form when user data is found', async () => {
      mockUserService.getUserById.mockReturnValue(of({
        firstName: 'John',
        channel: 'Test Department',
        maskedEmail: 't***@test.com',
        phone: '1234567890',
        organisations: [{ roles: ['ROLE_1'] }],
      }))

      await component.assignValues('test-id')

      expect(component.userCompleteData).toBeTruthy()
      expect(component.contentForm.get('firstName')?.value).toBe('John')
    })

    it('should show a fail toast when no user data is found', async () => {
      mockUserService.getUserById.mockReturnValue(of(null))

      await component.assignValues('test-id')

      expect(mockSnackBar.openFromComponent).toHaveBeenCalled()
    })
  })

  describe('updateuser', () => {
    beforeEach(() => {
      component.createFormContent()
    })

    it('should show up-to-date message when roles have not changed', () => {
      component.userCompleteData = {
        organisations: [{ roles: ['ROLE_1'] }],
      }
      component.contentForm.get('selectedRoles')?.setValue(['ROLE_1'])

      component.updateuser()

      expect(mockSnackBar.openFromComponent).toHaveBeenCalled()
      expect(mockUserService.addUserToRole).not.toHaveBeenCalled()
    })

    it('should assign new roles when roles have changed', () => {
      component.userCompleteData = {
        userId: 'test-id',
        organisations: [{ roles: ['ROLE_1'] }],
      }
      component.contentForm.get('selectedRoles')?.setValue(['ROLE_2'])
      mockUserService.addUserToRole.mockReturnValue(of({ params: { status: 'SUCCESS' } }))

      component.updateuser()

      expect(mockUserService.addUserToRole).toHaveBeenCalled()
    })
  })

  describe('assignRoleToUser', () => {
    it('should show success toast and emit updated event on success', async () => {
      const emitSpy = jest.spyOn(component.updateEvent, 'emit')
      mockUserService.addUserToRole.mockReturnValue(of({ params: { status: 'SUCCESS' } }))

      await component.assignRoleToUser('test-id', ['ROLE_1'])

      expect(mockSnackBar.openFromComponent).toHaveBeenCalled()
      expect(emitSpy).toHaveBeenCalledWith('updated')
    })

    it('should show fail toast when the request errors', async () => {
      mockUserService.addUserToRole.mockReturnValue(throwError(() => new Error('failed')))

      await component.assignRoleToUser('test-id', ['ROLE_1'])

      expect(mockSnackBar.openFromComponent).toHaveBeenCalled()
    })
  })
})
