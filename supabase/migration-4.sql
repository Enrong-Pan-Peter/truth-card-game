-- Migration 4: 27 more dares (dr071–dr097), curated over three review rounds
-- Run once in the Supabase SQL Editor. Safe to re-run.

insert into public.dares (id, level, en, zh, enabled, sort) values
('dr071', 'mild', 'Hold a pen between your upper lip and nose while giving a full self-introduction — don''t drop it.', '把一支笔夹在嘴唇和鼻子之间，完整说完一段自我介绍，笔不能掉。', true, 70),
('dr072', 'mild', 'Imitate your favorite influencer''s signature opening until people guess who it is.', '学你最喜欢的网红/博主的经典开场，让大家猜是谁。', true, 71),
('dr073', 'medium', 'Give a 30-second award acceptance speech thanking everyone here — for completely absurd reasons (“thank you XX for that half bottle of water three months ago”).', '发表30秒获奖感言，感谢在场每一个人，但理由必须离谱（“感谢XX三个月前借我的那半瓶水，没有他就没有今天的我”）。', true, 72),
('dr074', 'mild', 'Eyes closed, name the color of everyone''s outfit today.', '闭上眼睛，凭记忆说出在场每个人今天衣服的颜色。', true, 73),
('dr075', 'mild', 'Show everyone your phone wallpaper and tell its story.', '给大家看你的手机壁纸，并讲讲它的故事。', true, 74),
('dr076', 'mild', 'In your softest, sweetest voice, deliver a long menacing speech: “I''ll count to three — snatch my snacks again and I''ll kick you out of the group chat, then tie your shoelaces together so you trip with every step~”', '用最温柔的奶音完整说完这段狠话：“我数到三，你再抢我零食，我就把你从群里踢出去，再把你的鞋带系在一起，让你走一步摔一步哦~”', true, 75),
('dr077', 'medium', 'Everyone types one word into your phone; read the resulting sentence aloud with deep emotion.', '在场每人往你手机里打一个词，连成的句子你必须深情朗读。', true, 76),
('dr078', 'bold', 'Call a friend, sing to them for 10 seconds, say “thanks for listening”, and hang up.', '打电话给朋友清唱10秒，唱完只说“谢谢收听”就挂。', true, 77),
('dr079', 'medium', 'Perform a famous drama scene in Sichuanese, Northeastern dialect, or Cantonese — pick one: 还珠格格 “山无棱，天地合”, 情深深雨濛濛 “你无情你残酷你无理取闹”, or 甄嬛传 “臣妾做不到啊” — and draft a scene partner.', '用四川话、东北话或粤语演一段知名片段（三选一：还珠格格“山无棱，天地合，才敢与君绝”、情深深雨濛濛“你无情你残酷你无理取闹”、甄嬛传“臣妾做不到啊”），并抽一人配戏。', true, 78),
('dr080', 'medium', 'Name 10 people from the Bible within 30 seconds.', '30秒内说出圣经里10个人名，停顿不能超过3秒。', true, 79),
('dr081', 'bold', 'Let someone draw a small doodle on your face with a washable pen — keep it until the game ends.', '让大家用可洗的笔在你脸上画一样小东西，保留到游戏结束。', true, 80),
('dr082', 'bold', 'Call a friend and let them decide whether your next card is Truth or Dare — then obey.', '打电话给一个朋友，让ta替你决定下一张抽真心话还是大冒险，并照做。', true, 81),
('dr083', 'medium', 'Give a sharp fashion review of two people''s outfits here — no talking back allowed.', '锐评在场两个人的今日穿搭，被锐评者不许反驳。', true, 82),
('dr084', 'medium', 'Everyone roasts one small habit of yours; you may only reply “thanks for the feedback”.', '在场每人轮流吐槽你一个小习惯，你只能回答“谢谢指教”。', true, 83),
('dr085', 'bold', 'Show everyone who your pinned chats are (contents may be covered).', '给大家看你微信的置顶聊天都是谁（内容可以遮住）。', true, 84),
('dr086', 'medium', 'The person on your left picks any photo from your camera roll; tell its full story.', '让左边的人从你相册随便挑一张照片，你讲出它的完整故事。', true, 85),
('dr087', 'bold', 'Show the last three messages between you and your mom or dad (you may skip one).', '公开你和爸/妈最近的三条聊天记录（可跳过一条）。', true, 86),
('dr088', 'medium', 'Reveal the top five items in your shopping cart or wishlist and accept the group''s review.', '公开你的购物车/收藏夹前五件商品，接受全场锐评。', true, 87),
('dr089', 'bold', 'Reveal your five most recent search records (you may skip one).', '公开你最近的五条搜索记录（可跳过一条）。', true, 88),
('dr090', 'bold', 'Screenshot today''s step count and post it to the group chat captioned “a disciplined day”.', '把今天的步数截图发到团契群，配文“自律的一天”。', true, 89),
('dr091', 'medium', 'Rate everyone''s outfit today from 1 to 10, out loud.', '给在场每个人的今日穿搭打1-10分，当众宣布。', true, 90),
('dr092', 'mild', 'Describe your journey to fellowship today in Classical Chinese.', '用文言文描述你今天来团契的路程。', true, 91),
('dr093', 'medium', 'Everyone votes with eyes closed for “who''s holding back the most tonight” — the winner does 5 squats with you.', '全场闭眼投票“今晚谁最放不开”，得票最多的人和你一起做5个深蹲。', true, 92),
('dr094', 'medium', 'Everyone delivers one cheesy pickup line to you; keep a straight face — each laugh costs one squat.', '在场每人对你说一句土味情话，你必须面无表情听完，笑一次做一个深蹲。', true, 93),
('dr095', 'medium', 'Spend one minute formally proposing a ridiculous “next week''s fellowship activity”, then the group votes by show of hands.', '用一分钟正式提案一个离谱的“下周团契活动”，大家举手表决。', true, 94),
('dr096', 'mild', 'Dig up the very first thing you ever bookmarked or saved, and show everyone.', '翻出你“收藏”里最早收藏的那一条内容，给大家看看当年的你。', true, 95),
('dr097', 'medium', 'Send the person on your right a real 60-second voice message of elder-style life advice — no pausing allowed.', '给右边的人发一条真的60秒语音，内容是长辈风格的“人生建议”，中途不能停顿。', true, 96)
on conflict (id) do update set level = excluded.level, en = excluded.en, zh = excluded.zh, sort = excluded.sort;
