import { createClient } from '@supabase/supabase-js';
import { INITIAL_POSTS, INITIAL_CHATS } from '../data';
import { Post, ChatSession, Message } from '../types';

// --- Client ---------------------------------------------------------------
// 瀏覽器端的 Vite env 變數一律要 VITE_ 開頭，否則 build 後讀不到（會是 undefined）。
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseReady = Boolean(url && key);
export const supabase = supabaseReady ? createClient(url as string, key as string) : null;

if (!supabaseReady) {
  // 沒填 key 時不報錯，整個 app 直接吃 data.ts 假資料，npm run dev 一定有畫面。
  console.warn('[flick] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 未設定，使用本地假資料 (data.ts)。');
}

// --- Row <-> 前端型別 對應 -------------------------------------------------
type PostRow = {
  id: string;
  creator_username: string;
  creator_name: string;
  creator_avatar: string | null;
  creator_discipline: string | null;
  image: string | null;
  video: string | null;
  content: string;
  tags: string[] | null;
  likes: number | null;
  comments_count: number | null;
  timestamp_label: string | null;
  is_private: boolean | null;
};

type MessageRow = {
  id: string;
  chat_id: string;
  sender: 'user' | 'other';
  text: string;
  timestamp_label: string | null;
  created_at?: string;
};

type ChatRow = {
  id: string;
  partner_username: string;
  partner_name: string;
  partner_avatar: string | null;
  partner_work: string | null;
  online: boolean | null;
  unread: boolean | null;
  messages?: MessageRow[];
};

function rowToPost(r: PostRow): Post {
  return {
    id: r.id,
    creator: {
      username: r.creator_username,
      name: r.creator_name,
      avatar: r.creator_avatar ?? '',
      discipline: r.creator_discipline ?? undefined,
    },
    image: r.image ?? undefined,
    video: r.video ?? undefined,
    content: r.content,
    tags: r.tags ?? [],
    likes: r.likes ?? 0,
    commentsCount: r.comments_count ?? 0,
    timestamp: r.timestamp_label ?? '',
    isLiked: false, // 無 Auth：每人各自的狀態保留前端 local
    isSaved: false,
    isPrivate: r.is_private ?? false,
  };
}

function postToRow(p: Post): PostRow {
  return {
    id: p.id,
    creator_username: p.creator.username,
    creator_name: p.creator.name,
    creator_avatar: p.creator.avatar ?? null,
    creator_discipline: p.creator.discipline ?? null,
    image: p.image ?? null,
    video: p.video ?? null,
    content: p.content,
    tags: p.tags,
    likes: p.likes,
    comments_count: p.commentsCount,
    timestamp_label: p.timestamp,
    is_private: p.isPrivate ?? false,
  };
}

function rowToChat(r: ChatRow): ChatSession {
  const msgs = (r.messages ?? [])
    .slice()
    .sort((a, b) => (a.created_at ?? '').localeCompare(b.created_at ?? ''))
    .map<Message>((m) => ({
      id: m.id,
      sender: m.sender,
      text: m.text,
      timestamp: m.timestamp_label ?? '',
    }));
  return {
    id: r.id,
    partner: {
      username: r.partner_username,
      name: r.partner_name,
      avatar: r.partner_avatar ?? '',
      work: r.partner_work ?? undefined,
    },
    online: r.online ?? false,
    unread: r.unread ?? false,
    messages: msgs,
  };
}

// --- 讀取 ------------------------------------------------------------------
export async function fetchPosts(): Promise<Post[]> {
  if (!supabase) return INITIAL_POSTS;
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) {
    console.warn('[flick] fetchPosts 失敗，fallback 假資料：', error?.message);
    return INITIAL_POSTS;
  }
  return (data as PostRow[]).map(rowToPost);
}

export async function fetchConversations(): Promise<ChatSession[]> {
  if (!supabase) return INITIAL_CHATS;
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*, messages(*)')
    .order('created_at', { ascending: true });
  if (error || !data) {
    console.warn('[flick] fetchConversations 失敗，fallback 假資料：', error?.message);
    return INITIAL_CHATS;
  }
  return (data as ChatRow[]).map(rowToChat);
}

// --- 寫入（fire-and-forget，失敗只 warn，不擋 UI） -------------------------
export async function insertPost(p: Post): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('posts').insert(postToRow(p));
  if (error) console.warn('[flick] insertPost 失敗：', error.message);
}

export async function setPostLikes(id: string, likes: number): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('posts').update({ likes }).eq('id', id);
  if (error) console.warn('[flick] setPostLikes 失敗：', error.message);
}

export async function addComment(postId: string, text: string, newCount: number): Promise<void> {
  if (!supabase) return;
  const ins = await supabase.from('comments').insert({ post_id: postId, text });
  if (ins.error) console.warn('[flick] addComment(insert) 失敗：', ins.error.message);
  const upd = await supabase.from('posts').update({ comments_count: newCount }).eq('id', postId);
  if (upd.error) console.warn('[flick] addComment(count) 失敗：', upd.error.message);
}

export async function insertMessage(chatId: string, msg: Message): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('messages').insert({
    id: msg.id,
    chat_id: chatId,
    sender: msg.sender,
    text: msg.text,
    timestamp_label: msg.timestamp,
  });
  if (error) console.warn('[flick] insertMessage 失敗：', error.message);
}

export async function setChatUnread(chatId: string, unread: boolean): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('chat_sessions').update({ unread }).eq('id', chatId);
  if (error) console.warn('[flick] setChatUnread 失敗：', error.message);
}
