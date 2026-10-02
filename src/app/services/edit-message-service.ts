import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class EditMessageService {
  supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  constructor() {

  }

  async pushEditedMessage(messageId: string, newContent: any) {
    const { data, error } = await this.supabase
      .from('messages')
      .update({ content: newContent })
      .eq('uuid', messageId);

    if (error) {
      console.error('Error updating message:', error);
    } else {
      console.log('Message updated successfully:', data);
    }
  }
}
