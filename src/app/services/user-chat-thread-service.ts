import { Injectable } from '@angular/core';
import { computed, signal } from '@angular/core';
import { Message } from '../interfaces/interfaces';
@Injectable({
  providedIn: 'root',
})
export class UserChatThreadService {

  selectedThreadId = signal<string>('')
  userChat = signal<Message[]>([])
  replies = signal<Message[]>([])

  selectedThreadMessage = computed(() => {
    return this.userChat().find((message) => message.uuid === this.selectedThreadId())
  })
  constructor() { 

  }
}
