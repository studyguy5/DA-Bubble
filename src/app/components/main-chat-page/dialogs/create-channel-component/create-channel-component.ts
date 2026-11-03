import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../../environment/environment';
import { InviteMemberComponent } from '../../dialogs/invite-member-component/invite-member-component';

interface CreateChannelDialogData {
  title: string;
}
@Component({
  selector: 'app-create-channel-component',
  imports: [ReactiveFormsModule],
  templateUrl: './create-channel-component.html',
  styleUrl: './create-channel-component.scss',
})
export class CreateChannelComponent {
  supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  overlay: any;
  constructor(@Inject(DIALOG_DATA) public data: CreateChannelDialogData,@Inject(DialogRef) private readonly dialogRef: DialogRef<CreateChannelComponent>, 
  @Inject(Dialog) private readonly ref: Dialog) {
    
  } 

  channelGroup = new FormGroup({
    channelName: new FormControl(),
    channelDescription: new FormControl(),
  });

  

  openSecondDialogAndPreSaveData() {
   this.openInviteUserDialog() 
  }

  openInviteUserDialog() {
    const channelName = this.channelGroup.getRawValue().channelName || '';
    const channelDescription = this.channelGroup.getRawValue().channelDescription || '';

    this.ref.open(InviteMemberComponent, 
      { 
      
      width: '710px',
      height: '279px',
      panelClass: 'invite-user-dialog',
      data: {
        title: 'Invite User',
        channelName: channelName,
        channelDescription: channelDescription
      },
    });
  }

  
}
