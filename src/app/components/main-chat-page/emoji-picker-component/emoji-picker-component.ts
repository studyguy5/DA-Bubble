import { Component, CUSTOM_ELEMENTS_SCHEMA, output } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import 'emoji-picker-element';

@Component({
  selector: 'app-emoji-picker-component',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './emoji-picker-component.html',
  styleUrl: './emoji-picker-component.scss',
})
export class EmojiPickerComponent {

  // emoji = output();
  constructor(private dialogRef: DialogRef<EmojiPickerComponent>) {
  }
  
  
  ngAfterViewInit() {
    document.querySelector('emoji-picker')?.addEventListener('emoji-click', event => console.log(event.detail));
    
  }
  selectEmoji(event: any) {
    let emojiDiv = (event as CustomEvent).detail
    console.log(emojiDiv.innerText);
    // this.emoji.emit(emojiDiv.innerText as any)
    this.dialogRef.close(event.detail.emoji);
  }
}

