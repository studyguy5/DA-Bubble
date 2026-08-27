import { Component, signal } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Data } from '@angular/router';
import { Channel } from '../../../interfaces/interfaces';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';

export interface ChannelInfoDialogData {
  title: string;
  channel: Channel;
}
@Component({
  selector: 'app-channel-info-component',
  imports: [ReactiveFormsModule],
  templateUrl: './channel-info-component.html',
  styleUrl: './channel-info-component.scss',
})
export class ChannelInfoComponent {
  supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  channel = signal<Channel | null>(null);
  constructor(@Inject(DIALOG_DATA) public data: ChannelInfoDialogData, @Inject(DialogRef) public dialogRef: DialogRef<ChannelInfoComponent>) {
    this.channel.set(data.channel);
    console.log('data:', data);
    // console.log('channel:', this.channel);
  }
  editModeOn = false
  editModeDescriptionOn = false
  channelInfoGroup = new FormGroup({
    channelInfoName: new FormControl(),
    channelInfoDescription: new FormControl(),
  })

  editChannelName() {
    // debugger;
    let channelNameInfo: any = document.querySelector('.channelNameInfo');
    let channelNameInfop: any = document.querySelector('.channelNameInfo p');
    let NameInput: any = document.querySelector('.nameInput')
    let editHeaderButton: any = document.querySelector('.nameEditHeader button');
    let editModeHeadline: any = document.querySelector('.editModeHeadline')
    if (editHeaderButton && editHeaderButton.innerHTML == 'Bearbeiten') {
      this.setValuesIntoInput()
      if (channelNameInfop) {
        channelNameInfop.style.display = 'none';
      }
      if(editHeaderButton){
        editHeaderButton.innerHTML = 'Speichern'
      }
      if (channelNameInfo) {
        channelNameInfo.style.border = 'none';
        channelNameInfo.style.transition = 'padding 0.3s ease-in-out';
        channelNameInfo.style.padding = '0';
      }
      if (NameInput) {
        NameInput.style.display = 'flex';
        NameInput.style.transition = 'opacity 0.3s ease-in-out';
        NameInput.style.marginBottom = '20px';
      }
      return
    }
    if(editHeaderButton && editHeaderButton.innerHTML == 'Speichern'){
      this.patchChannelName()
      if (channelNameInfop) {
        channelNameInfop.style.display = 'flex';
      }
      if(editHeaderButton){
        editHeaderButton.innerHTML = 'Bearbeiten'
      }
      if (channelNameInfo) {
        channelNameInfo.style.border = '1px solid rgb(173, 176, 217)';
        channelNameInfo.style.transition = 'padding 0.3s ease-in-out';
        channelNameInfo.style.padding = '18px 20px';
      }
      if (NameInput) {
        NameInput.style.transition = 'opacity 0.3s ease-in-out';
        NameInput.style.display = 'none';
      } 
      return
    }
  }

  async patchChannelName(){
    const update = this.channelInfoGroup.get('channelInfoName')?.value
    console.log('Name', update)
    const updateChannelName = await this.supabase
    .from('chat_rooms')
    .update({
      name: update
      
    }
  )
  .eq('uuid', this.channel()?.uuid)
  console.log('updateChannelName', updateChannelName)
  // this.dialogRef.close()
  
  }

  editChannelDescription() {
    let descriptionEditHeaderButton: any = document.querySelector('.descriptionEditHeader button');
    let descriptionEditHeader: any = document.querySelector('.descriptionEditHeader');
    let descriptionEditHeaderh2: any = document.querySelector('.descriptionEditHeader h2');
    let descriptionInput: any = document.querySelector('.descriptionInput');
    let normal: any = document.querySelector('.channelDescriptionInfoNormalMode');
    let hr: any = document.querySelector('.channelDescriptionInfoNormalMode hr');
    if (descriptionEditHeaderButton && descriptionEditHeaderButton.innerHTML == 'Bearbeiten') {
      
      this.setValuesIntoInput()
      this.editModeDescriptionOn = !this.editModeDescriptionOn
      if (hr) {
        hr.style.transition = 'opacity 0.1s ease-in-out';
        hr.style.marginTop = '50px';
      }
      if (descriptionEditHeaderButton) {
        descriptionEditHeaderButton.innerHTML = 'Speichern';
      }
      if (descriptionInput) {
        descriptionInput.style.transition = 'opacity 0.3s ease-in-out';
        descriptionInput.style.maxHeight = '60px';
        descriptionInput.style.padding = '18px 32px';
        descriptionInput.style.opacity = '1';
      }
      if (normal) {
        normal.style.border = 'none';
        normal.style.transition = 'padding 0.3s ease-in-out';
        normal.style.padding = '10px 0px';
      }
      return
    }


    if (descriptionEditHeaderButton && descriptionEditHeaderButton.innerHTML == 'Speichern') {
      this.editModeDescriptionOn = !this.editModeDescriptionOn
      this.patchChannelDescription()
      if (hr) {
        hr.style.transition = 'opacity 0.1s ease-in-out';
        hr.style.marginTop = '30px';
      }
      if (descriptionEditHeaderButton.innerHTML == 'Speichern') {
        descriptionEditHeaderButton.innerHTML = 'Bearbeiten';
      }
      if (descriptionEditHeaderh2) {
        descriptionEditHeaderh2.style.transition = 'opacity 0.3s ease-in-out';
        descriptionEditHeaderh2.style.opacity = '1';
      }
      if (descriptionInput) {
        descriptionInput.style.transition = 'opacity 0.3s ease-in-out';
        descriptionInput.style.maxHeight = '0px';
        descriptionInput.style.padding = '0px 0px';
        descriptionInput.style.opacity = '0';
      }
      if (normal) {
        normal.style.border = '1px solid rgba(173, 176, 217, 1)';
        normal.style.transition = 'padding 0.3s ease-in-out';
        normal.style.padding = '20px 20px';
      }
      return
    }
  }

  async patchChannelDescription(){
    debugger;
    const update = this.channelInfoGroup.get('channelInfoDescription')?.value
    console.log('Description', update)
    const updateChannelDescription = await this.supabase
    .from('chat_rooms')
    .update({
      description: update
      
    }
  )
  .eq('uuid', this.channel()?.uuid)
  console.log('updateChannelDescription', updateChannelDescription)
  // this.dialogRef.close()
  
  }

  closeDialog() {
    this.dialogRef.close();
  }

  setValuesIntoInput() {
    console.log('Name:', this.channel()?.name);
    console.log('Description:', this.channel()?.description);
    this.channelInfoGroup.patchValue({
      channelInfoName: this.channel()?.name,
      channelInfoDescription: this.channel()?.description,
    });
  }

}
