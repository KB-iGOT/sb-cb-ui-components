import { of, throwError } from 'rxjs'
import { ConnectionHoverService } from './connection-hover.servive'

describe('ConnectionHoverService', () => {
  let service: ConnectionHoverService
  let httpClientMock: any

  beforeEach(() => {
    httpClientMock = {
      get: jasmine.createSpy('get'),
    }

    service = new ConnectionHoverService(httpClientMock)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('fetchProfile', () => {
    const userId = 'testUserId'
    const apiUrl = '/apis/proxies/v8/api/user/v2/read/testUserId'

    it('should make HTTP GET request with correct URL', () => {
      // Arrange
      const mockResponse = {
        result: {
          response: {
            id: 'testUserId',
            name: 'Test User'
          }
        }
      }
      httpClientMock.get.and.returnValue(of(mockResponse))

      // Act
      service.fetchProfile(userId).subscribe()

      // Assert
      expect(httpClientMock.get).toHaveBeenCalledWith(apiUrl)
    })

    it('should transform response data correctly', () => {
      // Arrange
      const mockResponse = {
        result: {
          response: {
            id: 'testUserId',
            name: 'Test User',
            email: 'test@example.com'
          }
        }
      }
      const expectedProfile = mockResponse.result.response
      httpClientMock.get.and.returnValue(of(mockResponse))

      // Act & Assert
      service.fetchProfile(userId).subscribe(profile => {
        expect(profile).toEqual(expectedProfile as any)
      })
    })

    it('should handle null response data', () => {
      // Arrange
      const mockResponse = {
        result: {
          response: ''
        }
      }
      httpClientMock.get.and.returnValue(of(mockResponse))

      // Act & Assert
      service.fetchProfile(userId).subscribe(profile => {
        expect(profile).toBeNull()
      })
    })

    it('should handle HTTP error', () => {
      // Arrange
      const mockError = new Error('HTTP Error')
      httpClientMock.get.and.returnValue(throwError(() => mockError))

      // Act & Assert
      service.fetchProfile(userId).subscribe({
        next: (response) => {
          expect(response).toEqual({
            data: null,
            error: mockError
          } as any)
        }
      })
    })

    it('should handle malformed response data', () => {
      // Arrange
      const malformedResponse = {}  // completely empty response
      httpClientMock.get.and.returnValue(of(malformedResponse))

      // Act & Assert
      // The malformed shape throws while reading it, which the service's catchError
      // converts into a { data: null, error } result rather than emitting a value.
      service.fetchProfile(userId).subscribe({
        next: (profile: any) => {
          expect(profile.data).toBeNull()
          expect(profile.error).toBeTruthy()
        }
      })
    })

    it('should handle partially malformed response data', () => {
      // Arrange
      const partialResponse = {
        result: {}  // missing 'response' property
      }
      httpClientMock.get.and.returnValue(of(partialResponse))

      // Act & Assert
      service.fetchProfile(userId).subscribe(profile => {
        expect(profile).toBeNull()
      })
    })
  })
})