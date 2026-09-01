import { Component, Inject } from '@angular/core';
import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormControl } from '@angular/forms';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';
import { ChangeDetectorRef } from '@angular/core';

export interface AddMemberToChannelDialogData {
  title: string,
  channel: any
}
@Component({
  selector: 'app-add-member-to-channel-component',
  imports: [],
  templateUrl: './add-member-to-channel-component.html',
  styleUrl: './add-member-to-channel-component.scss',
})
export class AddMemberToChannelComponent {
  supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  memberList = new FormControl();

  constructor(@Inject(DIALOG_DATA) public data: AddMemberToChannelDialogData, @Inject(DialogRef) public dialogRef: DialogRef<AddMemberToChannelComponent>
    , private cd: ChangeDetectorRef) {
    // this.data = data

  }
  open: boolean = false
  searchInput: any
  filterResult: any
  closeDialog() {
    this.dialogRef.close();
  }

  async memberListHelperFunction() {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('username, avatar_url, uuid')
      .order('username', { ascending: true });
    if (!data || error) return

    return data ?? []
  }

  async searchingForMembers(event?: Event) {
    const input = (event?.target ?? document.querySelector('.memberInputField')) as HTMLInputElement | null;

    if (!input) {
      this.open = false;
      this.cd.detectChanges();
      return [];
    }

    this.searchInput = input;
    console.log(this.searchInput.value);
    const data = await this.memberListHelperFunction()
    this.filterResult = data?.filter((item: any) => {
      return item.username.toLowerCase().includes(this.searchInput.value.toLowerCase())
    })
    // debugger;
    if (this.filterResult?.length > 0 && this.searchInput.value.length > 0) {
      this.open = true;
      this.cd.detectChanges()
    } else {
      this.open = false;
      this.cd.detectChanges()
    }
    this.cd.detectChanges()
    console.log('memberList', this.filterResult);
    return this.filterResult && this.open
  }

  selectMemberToAdd(member: any) {
    console.log(member);
    let input = document.querySelector('.memberInputField') as HTMLInputElement
    input.style.display = 'none'
    let memberList = document.querySelector('.MemberDropdownList') as HTMLInputElement
    if(memberList){
      memberList.style.display = 'none'
    }
    let wrapper = document.querySelector('.inputWrapper') as HTMLInputElement
    wrapper.innerHTML = /*html*/`<div class="selectedMember">
    <img class="memberAvatar" src="${member.avatar_url}">${member.username}<img class="closeIcon" src="./icons/blackCloseIcon.svg"></div>`
    
    
    let choosenMember = document.querySelector('.memberAvatar') as HTMLInputElement
    let choosenMemberName = document.querySelector('.selectedMember') as HTMLInputElement
    let close = document.querySelector('.closeIcon') as HTMLInputElement
    if (!choosenMember) return
    choosenMember.style.height = '40px'
    choosenMember.style.width = '40px'
    choosenMemberName.style.display = 'flex'
    choosenMemberName.style.alignItems = 'center'
    choosenMemberName.style.justifyContent = 'start'
    choosenMemberName.style.gap = '15px'
    choosenMemberName.style.width = '150px'
    choosenMemberName.style.backgroundColor = 'rgba(68, 77, 242, 0.1)'
    choosenMemberName.style.borderRadius = '25px'
    choosenMemberName.style.padding = '5px 20px'
    if(close){
      close.style.cursor = 'pointer'
      close.addEventListener('click', () => {
      this.unselectMemberToAdd(); // 'this' funktioniert hier!
    });
    }
  }

  unselectMemberToAdd(){
    // debugger;
    let wrapper = document.querySelector('.inputWrapper') as HTMLInputElement
    wrapper.innerHTML = ``
    wrapper.innerHTML = /*html*/`<input class="memberInputField"  type="text" placeholder="Suche" formControl="memberList">`
    wrapper.addEventListener('input', () => {
      this.searchingForMembers(event);
    })
    let input = document.querySelector('.memberInputField') as HTMLInputElement
    if(input){
      input.style.display = 'flex'
      input.style.maxHeight = '40px'
      input.style.border = 'none'
      input.style.outline = 'none'
      this.cd.detectChanges()
    }
  
    let memberList = document.querySelector('.MemberDropdownList') as HTMLInputElement
    if(memberList){
      memberList.style.display = 'flex'
      memberList.style.maxHeight = 'auto'
      this.open = false
      this.cd.detectChanges()
    }
    let choosenMember = document.querySelector('.memberAvatar') as HTMLInputElement
    let choosenMemberName = document.querySelector('.selectedMember') as HTMLInputElement
    let close = document.querySelector('.closeIcon') as HTMLInputElement
    if (!choosenMember) return
    choosenMember.style.height = '0px'
    choosenMember.style.width = '0px'
    choosenMemberName.style.display = 'none'
    if(close){
      close.style.cursor = 'pointer'
    }
  }

  async addMemberToChannelInSupabase(){
    const choosenMember = document.querySelector('.selectedMember') as HTMLInputElement
    const memberList = await this.memberListHelperFunction()
    const memberUsername = choosenMember.innerText
    let name = memberList?.find((item: any) => item.username == memberUsername)
    if(!name) return
    let uuid = name.uuid
    if(!choosenMember) return
    console.log(memberUsername)
    // debugger;
    const { data, error } = await this.supabase
    .from('chat_room_members')
    .insert({
      chat_room_id: this.data.channel.uuid,
      user_id: uuid 
      });
    if (!data || error) return
    console.log('inserted Data', data)
  }

}

