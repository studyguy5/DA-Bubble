export interface User {
    id: string;
    username: string;
    displayName: string;
    avatar_url: string;
    gender: string;
}

export interface Message {
    uuid: string;
    chat_room_id: string;
    author_id: string;
    content: string;
    created_at: string;
}

export interface ChatRoomMember {
    uuid: string;
    chat_room_id: string;
}

export interface Channel {
    uuid: string;
    created_at: string;
    message_type: string;
    name: string;
    description: string;
    created_by: string;
}

// export interface Member {
//     user_id: string;
//     chat_room_id: string;
//     avatar_url: string;
// }

export interface ChannelMember {
  user_id: string;
  chat_room_id: string;
  avatar_url: string;
}