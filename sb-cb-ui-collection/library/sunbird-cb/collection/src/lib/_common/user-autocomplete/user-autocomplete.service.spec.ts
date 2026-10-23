import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { UserAutocompleteService } from './user-autocomplete.service'

describe('UserAutocompleteService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: UserAutocompleteService = TestBed.inject(UserAutocompleteService)
    expect(service).toBeTruthy()
  })
})
