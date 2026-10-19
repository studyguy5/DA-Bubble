import { TestBed } from '@angular/core/testing';

import { UserChatThreadService } from './user-chat-thread-service';

describe('UserChatThreadService', () => {
  let service: UserChatThreadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserChatThreadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
