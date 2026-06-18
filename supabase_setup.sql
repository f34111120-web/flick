-- ============================================================
-- Flick — Supabase 建表 + 種子資料 + RLS
-- 用法：Supabase 專案 → SQL Editor → 整段貼上 → Run
-- 可重複執行（drop if exists）。
-- ============================================================

-- 乾淨重建（先刪有外鍵依賴的子表）
drop table if exists messages cascade;
drop table if exists comments cascade;
drop table if exists chat_sessions cascade;
drop table if exists posts cascade;

-- ---------- posts（作者欄位攤平，不另設 creators 表）----------
create table posts (
  id              text primary key,
  creator_username   text not null,
  creator_name       text not null,
  creator_avatar     text,
  creator_discipline text,
  image           text,
  video           text,
  content         text not null,
  tags            text[] default '{}',
  likes           int default 0,
  comments_count  int default 0,
  timestamp_label text default 'Just now',  -- 顯示用字串（"2h ago"），非真實時間
  is_private      boolean default false,
  created_at      timestamptz default now() -- 排序用
);

-- ---------- comments（留言內容持久化；計數另存在 posts）----------
create table comments (
  id          bigint generated always as identity primary key,
  post_id     text references posts(id) on delete cascade,
  text        text not null,
  created_at  timestamptz default now()
);

-- ---------- chat_sessions（partner 欄位攤平）----------
create table chat_sessions (
  id              text primary key,
  partner_username text not null,
  partner_name     text not null,
  partner_avatar   text,
  partner_work     text,
  online          boolean default false,
  unread          boolean default false,
  created_at      timestamptz default now()
);

-- ---------- messages ----------
create table messages (
  id              text primary key,
  chat_id         text references chat_sessions(id) on delete cascade,
  sender          text not null check (sender in ('user','other')),
  text            text not null,
  timestamp_label text default 'Just now',
  created_at      timestamptz default now()
);

-- ============================================================
-- RLS：無 Auth 的 demo，anon key 需要可讀寫。
-- 注意：這代表任何拿到 anon key 的人都能讀寫這幾張表。
-- 課程 demo 可接受；要做真正權限請先接 Supabase Auth 再收緊 policy。
-- ============================================================
alter table posts          enable row level security;
alter table comments       enable row level security;
alter table chat_sessions  enable row level security;
alter table messages       enable row level security;

create policy "flick anon posts"    on posts         for all using (true) with check (true);
create policy "flick anon comments" on comments      for all using (true) with check (true);
create policy "flick anon chats"    on chat_sessions for all using (true) with check (true);
create policy "flick anon messages" on messages      for all using (true) with check (true);

-- ============================================================
-- 種子資料（對應 data.ts；created_at 由舊到新排，讓前端 desc 排序後
-- 顯示順序與原本一致，新發的貼文 now() 會排最上面）
-- ============================================================
insert into posts (id, creator_username, creator_name, creator_avatar, creator_discipline, image, video, content, tags, likes, comments_count, timestamp_label, is_private, created_at) values
('post-4','sofia_l','Sofia Lind','https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',null,'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop',null,'「早起為家人烤了外酥內軟的草莓司康，搭配自製的覆盆子果醬，全家吃得好滿足 🍓🥖✨」',array['手作料理','烘焙挑戰','幸福餐桌'],720,68,'2d ago',false, now() - interval '50 hours'),
('post-3','kaelen_c','Kaelen Croft','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',null,'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',null,'「剛烘好的一批衣索比亞玫瑰手沖，果酸明亮，帶有層次感的花香，週末早晨的一大享受 ☕️🌹」',array['手沖咖啡','烘焙日常','週末儀式感'],194,11,'1d ago',false, now() - interval '26 hours'),
('post-2','aria_c','Aria Chen','https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',null,'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',null,'「今天探訪了市中心這家隱密的小植栽咖啡店，焦糖瑪奇朵香醇順口，陽光從樹葉縫隙灑下來，超舒服！」',array['美食探店','綠意空間','下午茶時光'],512,42,'5h ago',false, now() - interval '5 hours'),
('post-5','@jane_design','Jane Doe','https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop','生活紀錄者',null,'https://assets.mixkit.co/videos/preview/mixkit-waves-breaking-in-the-ocean-1527-large.mp4','「今天的浪花特別藍，夕陽下的海邊散步，真的太療癒、太放鬆了 🌊✨」',array['海邊','日常隨筆','療癒瞬間'],624,39,'3h ago',true, now() - interval '3 hours'),
('post-1','marcus_v','Marcus Vance','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',null,'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',null,'「午後的陽光剛好灑進房間，暖融融的，這就是最舒服的閱讀角落了 ☀️📖☕️」',array['家居日常','極簡生活','午後時光'],348,24,'2h ago',false, now() - interval '2 hours');

insert into chat_sessions (id, partner_username, partner_name, partner_avatar, partner_work, online, unread) values
('chat-aria','aria_c','Aria Chen','https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop','旅遊 Vlogger',true,true),
('chat-marcus','marcus_v','Marcus Vance','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop','極簡攝影師',false,false),
('chat-kaelen','kaelen_c','Kaelen Croft','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop','咖啡烘焙師',true,false);

insert into messages (id, chat_id, sender, text, timestamp_label, created_at) values
('m-1','chat-aria','other','嗨！你有看到我今天發的沖繩海洋旅行 VLOG 嗎？🌊','10:32 AM', now() - interval '10 minutes'),
('m-2','chat-aria','user','有啊！拍得超級治癒，海浪的聲音配上日落，看完好想立刻飛過去！✨','10:34 AM', now() - interval '8 minutes'),
('m-3','chat-aria','other','哈哈謝謝！那家海邊咖啡廳我也超推，明天聊聊我整理的行程簡介給你！','10:35 AM', now() - interval '7 minutes'),
('m-4','chat-marcus','other','那張下午茶光影照片是在民生社區的那家老宅咖啡廳拍的唷 ☕️','Yesterday', now() - interval '1 day'),
('m-5','chat-marcus','user','我就知道！那裡的木造窗台下午陽光灑進來真的特別有底片感。','Yesterday', now() - interval '1 day' + interval '2 minutes'),
('m-6','chat-kaelen','other','剛烘好一包衣索比亞的淺焙豆，你要不要拿一些去手沖試試看？果香超濃郁！🍇','2 days ago', now() - interval '2 days');
