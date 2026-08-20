import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { I } from '@angular/cdk/keycodes';

interface CreateChannelDialogData {
  title: string;
}
@Component({
  selector: 'app-create-channel-component',
  imports: [],
  templateUrl: './create-channel-component.html',
  styleUrl: './create-channel-component.scss',
})
export class CreateChannelComponent {

  constructor(@Inject(DIALOG_DATA) public data: CreateChannelDialogData,@Inject(DialogRef) private readonly dialogRef: DialogRef<CreateChannelComponent>) {
    
  } 


  

  
}
