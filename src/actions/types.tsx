export type RegisterUserData = {
  username: string;
  email: string;
  password: string;
  password2: string;
};

export type ErrorDataType = {
  username?: string;
  email?: string;
  password?: string;
  password2?: string;
};

export type AuthResponseDataType = {
  type: string;
  data: object;
};

export type AuthType = {
  id: string;
  username: string;
  avatar: string;
  email: string;
  iat: number;
  exp: number;
};

export type MessagePropsType = {
  id: string;
  avatar: string;
  created_date: Date;
  message: string;
  username: string;
  flag: boolean;
  duplicationFlag?: boolean;
};

export type PrivateUserPropsType = {
  id: string;
  avatar: string;
  created_date: Date;
  message: string;
  name: string;
  flag: boolean;
};

export type GroupFestivalPropsType = {
  id: string;
  avatar: string;
  created_date: Date;
  message: string;
  name: string;
  flag: boolean;
};

export type UnReadUsersResType = {
  user: string;
  unReadCount: number;
};

export type UnreadMessageResType = {
  _id: string;
  festival: string;
  unReadUsers: UnReadUsersResType[];
};

export type PrivateUnReadMessageResType = {
  _id: string;
  sender: string;
  recipient: string;
  unReadMessageCount: number;
};

export type PrivateChatHistoryResType = {
  _id: string;
  created_date: Date;
  message: string;
  festival?: string;
  duplicationFlag?: boolean;
  user: {
    avatar: string;
    created_at: Date;
    email: string;
    password: string;
    username: string;
    _id: string;
  };
  recipient: {
    avatar: string;
    created_at: Date;
    email: string;
    password: string;
    username: string;
    _id: string;
  };
};

export type GroupChatHistoryResType = {
  _id: string;
  created_date: Date;
  message: string;
  festival?: string;
  duplicationFlag?: boolean;
  user: {
    avatar: string;
    created_at: Date;
    email: string;
    password: string;
    username: string;
    _id: string;
  };
};

export type GlobalChatHistoryResType = {
  _id: string;
  created_date: Date;
  message: string;
  duplicationFlag?: boolean;
  user: {
    avatar: string;
    created_at: Date;
    email: string;
    password: string;
    username: string;
    _id: string;
  };
};

export type ScheduleListPropsType = {
  _id: string;
  title: string;
  location: string;
  description: string;
  beginDate: Date;
  endDate: Date;
  imageUrl: string;
};

export type UserListPropsType = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  created_at: Date;
};

export type FestivalStatusItemType = {
  _id: string;
  festival: string;
  user: string;
  created_at: Date;
  status: number;
};

export type ReceiveMessageToGroupTyoe = {
  avatar: string;
  created_date: Date;
  festival: string;
  id: string;
  message: string;
  totalMsgNum: number;
  username: string;
};
