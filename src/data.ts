import { Creator, Post, ChatSession } from './types';

export const INITIAL_CREATORS: Creator[] = [
  {
    username: 'aria_c',
    name: 'Aria Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    bio: '分享世界各地的旅行秘境、街頭美食探店 ✈️🍜',
    followers: 12400,
    following: 342,
    work: '旅遊 Vlogger'
  },
  {
    username: 'marcus_v',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    bio: '極簡生活攝影師。用底片記錄日常光影與空間美學 📷',
    followers: 8900,
    following: 210,
    work: '極簡攝影師'
  },
  {
    username: 'kaelen_c',
    name: 'Kaelen Croft',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    bio: '城市咖啡探索者。每日手沖烘焙與咖啡探店 ☕️🍃',
    followers: 5300,
    following: 401,
    work: '咖啡烘焙師'
  },
  {
    username: 'sofia_l',
    name: 'Sofia Lind',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
    bio: '手作烘焙與餐桌生活美學。記錄溫暖美味的餐桌日常 🥐🍓',
    followers: 15600,
    following: 887,
    work: '手作料理家'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    creator: INITIAL_CREATORS[1], // Marcus Vance
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    content: '「午後的陽光剛好灑進房間，暖融融的，這就是最舒服的閱讀角落了 ☀️📖☕️」',
    tags: ['家居日常', '極簡生活', '午後時光'],
    likes: 348,
    commentsCount: 24,
    timestamp: '2h ago',
    isLiked: false,
    isSaved: false
  },
  {
    id: 'post-5',
    creator: {
      username: '@jane_design',
      name: 'Jane Doe',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      discipline: '生活紀錄者'
    },
    video: 'https://assets.mixkit.co/videos/preview/mixkit-waves-breaking-in-the-ocean-1527-large.mp4',
    content: '「今天的浪花特別藍，夕陽下的海邊散步，真的太療癒、太放鬆了 🌊✨」',
    tags: ['海邊', '日常隨筆', '療癒瞬間'],
    likes: 624,
    commentsCount: 39,
    timestamp: '3h ago',
    isLiked: false,
    isSaved: true,
    isPrivate: true
  },
  {
    id: 'post-2',
    creator: INITIAL_CREATORS[0], // Aria Chen
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    content: '「今天探訪了市中心這家隱密的小植栽咖啡店，焦糖瑪奇朵香醇順口，陽光從樹葉縫隙灑下來，超舒服！」',
    tags: ['美食探店', '綠意空間', '下午茶時光'],
    likes: 512,
    commentsCount: 42,
    timestamp: '5h ago',
    isLiked: true,
    isSaved: false
  },
  {
    id: 'post-3',
    creator: INITIAL_CREATORS[2], // Kaelen Croft
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
    content: '「剛烘好的一批衣索比亞玫瑰手沖，果酸明亮，帶有層次感的花香，週末早晨的一大享受 ☕️🌹」',
    tags: ['手沖咖啡', '烘焙日常', '週末儀式感'],
    likes: 194,
    commentsCount: 11,
    timestamp: '1d ago',
    isLiked: false,
    isSaved: true
  },
  {
    id: 'post-4',
    creator: INITIAL_CREATORS[3], // Sofia Lind
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop',
    content: '「早起為家人烤了外酥內軟的草莓司康，搭配自製的覆盆子果醬，全家吃得好滿足 🍓🥖✨」',
    tags: ['手作料理', '烘焙挑戰', '幸福餐桌'],
    likes: 720,
    commentsCount: 68,
    timestamp: '2d ago',
    isLiked: false,
    isSaved: false
  }
];

export const INITIAL_CHATS: ChatSession[] = [
  {
    id: 'chat-aria',
    partner: INITIAL_CREATORS[0], // Aria Chen
    online: true,
    unread: true,
    messages: [
      { id: 'm-1', sender: 'other', text: '嗨！你有看到我今天發的沖繩海洋旅行 VLOG 嗎？🌊', timestamp: '10:32 AM' },
      { id: 'm-2', sender: 'user', text: '有啊！拍得超級治癒，海浪的聲音配上日落，看完好想立刻飛過去！✨', timestamp: '10:34 AM' },
      { id: 'm-3', sender: 'other', text: '哈哈謝謝！那家海邊咖啡廳我也超推，明天聊聊我整理的行程簡介給你！', timestamp: '10:35 AM' }
    ]
  },
  {
    id: 'chat-marcus',
    partner: INITIAL_CREATORS[1], // Marcus Vance
    online: false,
    unread: false,
    messages: [
      { id: 'm-4', sender: 'other', text: '那張下午茶光影照片是在民生社區的那家老宅咖啡廳拍的唷 ☕️', timestamp: 'Yesterday' },
      { id: 'm-5', sender: 'user', text: '我就知道！那裡的木造窗台下午陽光灑進來真的特別有底片感。', timestamp: 'Yesterday' }
    ]
  },
  {
    id: 'chat-kaelen',
    partner: INITIAL_CREATORS[2], // Kaelen Croft
    online: true,
    unread: false,
    messages: [
      { id: 'm-6', sender: 'other', text: '剛烘好一包衣索比亞的淺焙豆，你要不要拿一些去手沖試試看？果香超濃郁！🍇', timestamp: '2 days ago' }
    ]
  }
];

export const BOT_RESPONSES: { [key: string]: string[] } = {
  travel: [
    "旅行就是隨心所欲地去發現。每一次在陌生巷弄裡迷路，都是生活最棒的驚喜！✈️",
    "那裡的天空與海景真的太療癒了，簡直就是心靈充電的聖地！✨",
    "哈哈，我的口袋清單還有好多好地方，下次再整理一整篇旅遊攻略給你看！"
  ],
  food: [
    "美食絕對是生活裡最簡單的幸福了！那家店的甜點口感真的讓人想天天去報到 🍰",
    "外酥內軟的熱熱司康配上自製果醬，簡直就是週末早晨的最高靈魂滿足！🍓",
    "今天又要動手做什麼好吃的新料理呢？期待你的深夜食堂分享！😋"
  ],
  coffee: [
    "手沖咖啡時，看著咖啡粉在濾紙裡慢慢悶蒸膨脹，那段時間最讓人感到平靜 ☕️🌿",
    "豆子磨開時的那股花果香氣，真的可以瞬間趕走一整天的疲憊跟睡意呢！",
    "每種產地的豆子都有自己的脾氣，細細品嚐那種獨特的明亮果酸真的很有趣。"
  ],
  default: [
    "哇！這個生活瞬間記錄得太棒了，好喜歡這種生活溫度感 📸✨",
    "生活就是要留白，多花點時間在自己熱愛的事情上，整個人都亮了起來！",
    "哈哈，真希望我們每天都能在美好的氛圍裡分享彼此的故事 ☀️",
    "真的！每次看你的分享，都會被你滿滿的生活正能量給感染，今天也是充滿希望的一天！"
  ]
};
