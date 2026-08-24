import { Component, signal } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Data } from '@angular/router';
import { Channel } from '../../../interfaces/interfaces';


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
  channel = signal<Channel | null>(null);
  constructor(@Inject(DIALOG_DATA) public data: ChannelInfoDialogData, @Inject(DialogRef) public dialogRef: DialogRef<ChannelInfoComponent>) {
    this.channel.set(data.channel);
    console.log('data:', data);
    console.log('channel:', this.channel);
  }
  editModeOn = false
  editModeDescriptionOn = false
  channelInfoGroup = new FormGroup({
    channelInfoName: new FormControl(),
    channelInfoDescription: new FormControl(),
  })

  editChannelName(){
    this.editModeOn = !this.editModeOn
    let channelNameInfo: any = document.querySelector('.channelNameInfo');

    let channelNameheaderandSaveLineNormalMode = document.querySelector('.channelNameheaderandSaveLineNormalMode');

    let input: any = document.querySelector('.nameInput')

    let editModeHeadline: any = document.querySelector('.editModeHeadline')
    if(channelNameInfo){
      setTimeout(() => {
        channelNameInfo.style.display = 'none';
      }, 250)
    }
    if(input){
      input.style.display = 'flex';
    }
    // if(channelNameheaderandSaveLineNormalMode){
    //   channelNameheaderandSaveLineNormalMode.classList.toggle('hide');
    // }
    if(editModeHeadline){
      editModeHeadline.style.display = 'flex';
      editModeHeadline.transition = 'opacity 0.3s ease-in-out';
      editModeHeadline.style.opacity = '1';
    }
    
  }

  editChannelDescription(){
    this.editModeDescriptionOn = !this.editModeDescriptionOn
    let descriptionEditHeader: any = document.querySelector('.descriptionEditHeader');
    let descriptionEditHeaderh2: any = document.querySelector('.descriptionEditHeader h2');
    let descriptionEditHeaderButton: any = document.querySelector('.descriptionEditHeader button');
    let descriptionInput: any = document.querySelector('.descriptionInput');
    let normal: any = document.querySelector('.channelDescriptionInfoNormalMode');
    // if(descriptionEditHeader){
    //   descriptionEditHeader.style.transition = 'margin-bottom 0.3s ease-in-out';
    //   descriptionEditHeader.style.marginBottom = '20px';
    //   // descriptionEditHeader.style.width = '110%';
    // }
    if(descriptionEditHeaderh2){
      // descriptionEditHeaderh2.style.transition = 'margin-left 0.3s ease-in-out';
      // descriptionEditHeaderh2.style.marginRight = '-20px';
    }
    if(descriptionEditHeaderButton){
      // descriptionEditHeaderButton.style.transition = 'margin-right 0.3s ease-in-out';
      descriptionEditHeaderButton.innerHTML = 'Speichern';
    }
    if(descriptionInput){
      descriptionInput.style.transition = 'opacity 0.05s ease-in-out';
      descriptionInput.style.opacity = '1';
    }
    if(normal){
      // normal.style.transition = 'border 0.3s ease-in-out';
      normal.style.border = 'none';
      normal.style.transition = 'padding 0.3s ease-in-out';
      normal.style.padding ='10px 10px';
    }
  }
  
}
