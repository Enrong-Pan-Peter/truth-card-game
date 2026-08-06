-- Migration 2: 劲爆 (spicy) category + 大冒险 (dare) deck
-- Run once in the Supabase SQL Editor (after migration-1.sql).

-- ============================================================
-- 1. Allow the new 'spicy' category
-- ============================================================
alter table public.questions drop constraint if exists questions_category_check;
alter table public.questions add constraint questions_category_check check (category in (
  'getting_to_know', 'ideals_reals', 'heart_to_heart', 'memories', 'matters_of_soul', 'spicy'
));
alter table public.suggestions drop constraint if exists suggestions_category_check;
alter table public.suggestions add constraint suggestions_category_check check (category in (
  'getting_to_know', 'ideals_reals', 'heart_to_heart', 'memories', 'matters_of_soul', 'spicy'
));

-- ============================================================
-- 2. Dare deck
-- ============================================================
create table if not exists public.dares (
  id text primary key,
  level text not null check (level in ('mild', 'medium', 'bold')),
  en text not null default '',
  zh text not null default '',
  enabled boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.dares enable row level security;

create policy "dares readable by everyone"
  on public.dares for select using (true);

create policy "admins insert dares"
  on public.dares for insert to authenticated
  with check (exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email')));

create policy "admins update dares"
  on public.dares for update to authenticated
  using (exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email')));

create policy "admins delete dares"
  on public.dares for delete to authenticated
  using (exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email')));

-- ============================================================
-- 3. Seed 劲爆 questions (safe to re-run)
-- ============================================================
insert into public.questions (id, category, en, zh, enabled, sort) values
('sp001', 'spicy', 'What is the most despicable thought you''ve ever had?', '你人生中最卑鄙的一个念头是什么？', true, 0),
('sp002', 'spicy', 'What behavior do you criticize out loud but often do yourself?', '你嘴上最反感、自己却经常做的行为是什么？', true, 1),
('sp003', 'spicy', 'Is there something you pretend to be over, but still hold onto?', '你有没有假装已经放下，其实一直耿耿于怀的事？', true, 2),
('sp004', 'spicy', 'If your lifetime search history went public, which year would scare you most?', '假如你这一生的搜索记录被公开，你最怕哪一年？', true, 3),
('sp005', 'spicy', 'Have you ever been secretly happy about someone else''s failure?', '你有没有因为别人的失败而偷偷开心？', true, 4),
('sp006', 'spicy', 'What standard do you often demand of others but can''t meet yourself?', '你有没有一个自己根本做不到，却经常要求别人的标准？', true, 5),
('sp007', 'spicy', 'What do you think is the most hypocritical thing about you?', '你觉得自己最虚伪的地方是什么？', true, 6),
('sp008', 'spicy', 'Are you a good person, or have you just never had the chance to be bad?', '你认为自己是好人，还是只是没有机会做坏事？', true, 7),
('sp009', 'spicy', 'What kind of person are you most afraid of eventually becoming?', '你最怕自己最终变成什么样的人？', true, 8),
('sp010', 'spicy', 'What do you have right now that you feel you least deserve?', '你认为自己最配不上现在拥有的什么？', true, 9),
('sp011', 'spicy', 'What are you most reluctant to admit you envy?', '你最不愿承认自己羡慕什么？', true, 10),
('sp012', 'spicy', 'When someone hits a sore spot, how do you usually cover it up?', '你被戳中痛处时，最常用什么方式掩饰？', true, 11),
('sp013', 'spicy', 'Have you ever quit early with an excuse because you were afraid to lose?', '你有没有因为怕输，提前找借口退出？', true, 12),
('sp014', 'spicy', 'What topic do you most fear being asked about?', '你最害怕别人问你哪方面的问题？', true, 13),
('sp015', 'spicy', 'What''s the meanest thing you''ve done that you still don''t regret?', '你做过最不厚道、但至今不后悔的事情是什么？', true, 14),
('sp016', 'spicy', 'Have you ever deliberately exploited a loophole?', '你有没有故意利用规则漏洞？', true, 15),
('sp017', 'spicy', 'What''s your most calculated flex?', '你做过最刻意的炫耀是什么？', true, 16),
('sp018', 'spicy', 'What''s the biggest price you''ve paid to save face?', '你曾经为了面子付出过最大的代价是什么？', true, 17),
('sp019', 'spicy', 'What have you done that still makes you feel guilty today?', '你做过哪件事，直到现在想起还会愧疚？', true, 18),
('sp020', 'spicy', 'What are you most afraid people will find out you''re really like?', '你最怕别人发现你其实是个怎样的人？', true, 19),
('sp021', 'spicy', 'Have you ever stayed silent knowing someone else would lose out?', '你有没有明知道别人会吃亏，还是保持沉默？', true, 20),
('sp022', 'spicy', 'What''s the most selfish thing you''ve ever done?', '你做过最自私的一件事是什么？', true, 21),
('sp023', 'spicy', 'Have you ever exaggerated your experience to look impressive?', '你有没有为了显得厉害，夸大过自己的经历？', true, 22),
('sp024', 'spicy', 'Have you ever quietly taken credit for someone else''s work?', '你有没有把别人的功劳偷偷算在自己头上？', true, 23),
('sp025', 'spicy', 'What''s the most embarrassing state someone has caught you in?', '你被别人撞见过最狼狈的状态是什么？', true, 24),
('sp026', 'spicy', 'Has a craving or desire ever interfered with your studies or work?', '你曾经因为某种欲望影响过正常学习或工作吗？', true, 25),
('sp027', 'spicy', 'In what kind of atmosphere do you most easily lose your head?', '你最容易在哪一种氛围下失去理智？', true, 26),
('sp028', 'spicy', 'In what area can you least accept losing?', '你最无法接受自己输在哪个方面？', true, 27),
('sp029', 'spicy', 'What''s your biggest failed attempt?', '你最失败的一次尝试是什么？', true, 28),
('sp030', 'spicy', 'Have you ever added up how much money you''ve wasted on saving face?', '你有没有算过自己为了面子浪费了多少钱？', true, 29),
('sp031', 'spicy', 'Which material comfort could you least stand to suddenly lose?', '你最不能接受自己突然失去哪种物质享受？', true, 30),
('sp032', 'spicy', 'What is your biggest impulse purchase ever?', '你最大的一笔冲动消费是什么？', true, 31),
('sp033', 'spicy', 'Have you ever used your parents'' money to buy something you didn''t dare tell them about?', '你有没有用父母的钱买过不敢告诉他们的东西？', true, 32),
('sp034', 'spicy', 'How much money did it take for you to abandon a principle?', '你曾经为了多少钱放弃过原则？', true, 33),
('sp035', 'spicy', 'Do you secretly compare your income or spending with your friends''?', '你有没有偷偷比较过自己和朋友的收入或消费？', true, 34),
('sp036', 'spicy', 'Have you ever spent more in the end because you were too cheap at first?', '你有没有因为舍不得花钱，最后反而花得更多？', true, 35),
('sp037', 'spicy', 'What''s the most ridiculous thing you''ve done to save money?', '你为了省钱做过最离谱的事情是什么？', true, 36),
('sp038', 'spicy', 'What''s the weirdest thing you''ve ever saved or bookmarked?', '你收藏过最奇怪的内容是什么？', true, 37),
('sp039', 'spicy', 'What''s the most inexplicable picture in your camera roll?', '你手机相册里最莫名其妙的一张图是什么？', true, 38),
('sp040', 'spicy', 'Describe the old photo of you that you''d least want dug up.', '你最不想被翻出来的一张旧照片是什么样的？', true, 39),
('sp041', 'spicy', 'Have you ever sent a message to exactly the wrong person? What did it say?', '你有没有发错消息给最不该看到的人？内容是什么？', true, 40),
('sp042', 'spicy', 'Have you ever dressed totally out of character and taken selfies?', '你有没有穿过不符合自己平时形象的衣服，然后自拍？', true, 41),
('sp043', 'spicy', 'What''s the biggest time you misread the signals and embarrassed yourself?', '你做过最自作多情的一件事是什么？', true, 42),
('sp044', 'spicy', 'Do you prefer being in control, or being led?', '你比较喜欢掌控，还是被掌控？', true, 43),
('sp045', 'spicy', 'Who here seems innocent on the surface but is secretly the wildest?', '在场谁最像表面纯情、私下最会玩的人？', true, 44),
('sp046', 'spicy', 'If someone here secretly liked you, who do you hope it is?', '假如在场有人已经偷偷喜欢你，你最希望是谁？', true, 45),
('sp047', 'spicy', 'In a close relationship, are you more dominant or compliant?', '你觉得自己在亲密关系里更偏强势还是顺从？', true, 46),
('sp048', 'spicy', 'Have you ever been drawn to someone because of their role — a boss, a senior, a friend''s friend?', '你有没有被某种身份关系吸引过，比如上司、学长、朋友的朋友？', true, 47),
('sp049', 'spicy', 'Do you enjoy the chase more, or the feeling of being wanted?', '你更享受追人的过程，还是被人渴望的感觉？', true, 48),
('sp050', 'spicy', 'Honestly, how possessive are you when dating?', '你谈恋爱时，占有欲到底有多强？', true, 49),
('sp051', 'spicy', 'What kind of physical touch instantly gets to you?', '什么样的肢体接触最容易让你瞬间上头？', true, 50),
('sp052', 'spicy', 'Do you prefer making the moves, or letting the other person set the pace?', '你更喜欢主动，还是被对方掌控节奏？', true, 51),
('sp053', 'spicy', 'What''s the most jerk-like thing you''ve done in romance?', '你最渣的一次行为是什么？', true, 52),
('sp054', 'spicy', 'Have you ever had feelings for a friend''s ex or partner?', '你有没有对朋友的前任或对象动过心？', true, 53),
('sp055', 'spicy', 'Who here best matches your physical type?', '在场谁最符合你的身体审美？', true, 54),
('sp056', 'spicy', 'Who here would change the most once they started dating?', '你觉得在场谁谈恋爱以后反差最大？', true, 55),
('sp057', 'spicy', 'If your ex and your current partner both asked to meet, who would you choose?', '如果前任和现任同时约你见面，你会选择谁？', true, 56),
('sp058', 'spicy', 'Would you mind your partner staying in touch with an ex? Where''s the line?', '你会介意对象和前任保持联系吗？什么程度算越界？', true, 57),
('sp059', 'spicy', 'Who is the one who got away?', '你最后悔错过的一个人是谁？', true, 58),
('sp060', 'spicy', 'Have you ever replied late on purpose to seem less interested?', '你有没有故意晚回消息，让自己显得没那么在意？', true, 59),
('sp061', 'spicy', 'Who here is closest to your ideal type?', '在场的人里，谁最接近你的理想型？', true, 60),
('sp062', 'spicy', 'When did your heart last skip a beat? What did they do?', '你最近一次心动是什么时候？对方做了什么？', true, 61),
('sp063', 'spicy', 'What feature or trait of the opposite sex attracts you most?', '你最容易被异性的哪个部位或特质吸引？', true, 62),
('sp064', 'spicy', 'Name one thing that would definitely make you fall for someone.', '说一个一定能让你心动的点。', true, 63),
('sp065', 'spicy', 'From people we all know, name one person you''ve at least briefly considered.', '从大家都认识的人之中，选一个你稍微考虑过作为对象的人。', true, 64),
('sp066', 'spicy', 'Who in this room did you notice first when you joined?', '你刚来团契时，最先注意到这个屋子里的谁？', true, 65),
('sp067', 'spicy', 'Among the opposite gender here, who do you find most attractive?', '在场的异性中，你觉得谁最有魅力？', true, 66),
('sp068', 'spicy', 'Have you ever had a crush on someone in a fellowship or church? What happened?', '你有没有喜欢过团契或教会里的人？后来呢？', true, 67),
('sp069', 'spicy', 'Summarize your entire dating history in one sentence.', '用一句话概括你的感情史。', true, 68),
('sp070', 'spicy', 'If you had to set up two people in this room, who would you pick?', '如果必须撮合在场的两个人，你会选谁和谁？', true, 69),
('sp071', 'spicy', 'What''s the longest you''ve secretly liked someone?', '你暗恋最久的一个人，暗恋了多久？', true, 70),
('sp072', 'spicy', 'Have you ever staged a "coincidental" run-in with someone you liked?', '你有没有假装偶遇过喜欢的人？', true, 71),
('sp073', 'spicy', 'What''s the longest detour you''ve taken just to see someone?', '你为了见某个人，绕过最远的路是什么？', true, 72),
('sp074', 'spicy', 'Which would you rather make public: your last 10 searches or your last 10 DMs?', '如果必须公开：最近10条搜索记录，还是最近10条私聊？', true, 73),
('sp075', 'spicy', 'What''s the chat history you''d least want to delete — and least want seen?', '你最舍不得删、又最不想被看到的聊天记录是哪段？', true, 74),
('sp076', 'spicy', 'Have you ever peeked at someone else''s phone screen?', '你有没有偷偷看过别人的手机屏幕？', true, 75),
('sp077', 'spicy', 'Have you ever pretended to be more spiritual than you actually were?', '你有没有“装属灵”的时候？', true, 76),
('sp078', 'spicy', 'When did you last say "I''ll pray for you" and then not pray?', '你最近一次说“我为你祷告”但其实没祷告，是什么时候？', true, 77),
('sp079', 'spicy', 'Have you ever said "Amen" without hearing a word of the prayer?', '你有没有说过“阿门”，但其实完全没在听？', true, 78),
('sp080', 'spicy', 'What have you prayed for that you''d be embarrassed to say out loud?', '你在祷告里求过什么不好意思告诉别人的东西？', true, 79),
('sp081', 'spicy', 'Be honest: what goes through your mind during very long prayers?', '说实话，特别长的祷告时你脑子里在想什么？', true, 80),
('sp082', 'spicy', 'What''s something you''ve never told anyone in this fellowship?', '有什么事你从没告诉过团契里的任何人？', true, 81),
('sp083', 'spicy', 'Who here would you call first at 3 a.m. in a crisis?', '遇到急事，凌晨三点你会先打给在场的谁？', true, 82),
('sp084', 'spicy', 'What first impression of someone here turned out completely wrong?', '你对在场哪位的第一印象，后来发现完全错了？', true, 83)
on conflict (id) do update
  set en = excluded.en, zh = excluded.zh, sort = excluded.sort;

-- ============================================================
-- 4. Seed 大冒险 dares (safe to re-run)
-- ============================================================
insert into public.dares (id, level, en, zh, enabled, sort) values
('dr001', 'medium', 'Hold hands with someone here and run a lap around the room while singing "你还要我怎样".', '找一个在场的人和你手拉手绕场跑一圈，边跑边唱《你还要我怎样》。', true, 0),
('dr002', 'medium', 'Face-to-face with a same-gender player, hold a pen between your faces for 10 seconds.', '找一个在场的同性，脸对脸夹着一支笔坚持10秒。', true, 1),
('dr003', 'mild', 'Sing one verse of a worship song, solo.', '独唱一段敬拜诗歌。', true, 2),
('dr004', 'mild', 'Show the group the most recent photo in your camera roll (skip if truly private).', '给大家看你相册里最新的一张照片（太私密可跳过）。', true, 3),
('dr005', 'mild', 'Imitate how your fellowship leader opens the meeting.', '模仿团契带领人开场的样子。', true, 4),
('dr006', 'mild', 'Speak only in your hometown dialect or accent for the next two rounds.', '接下来两轮只能用家乡话说话。', true, 5),
('dr007', 'mild', 'Do an animal impression until someone guesses the animal.', '模仿一种动物，直到有人猜出来。', true, 6),
('dr008', 'mild', 'You may only sing, not speak, until your next turn.', '到你下一轮之前，只能用唱的说话。', true, 7),
('dr009', 'mild', 'Read your most recent sent message in the most dramatic, romantic voice.', '用最深情的语气朗读你最近发出的一条消息。', true, 8),
('dr010', 'mild', 'Imitate someone in this room — mannerisms and catchphrases — until people guess who.', '模仿在场一个人的标志性动作和口头禅，直到大家猜出是谁。', true, 9),
('dr011', 'medium', 'Voice-message a friend you haven''t talked to in a month: "I''m thankful for you."', '给一个月没联系的朋友发语音：“我很感恩认识你。”', true, 10),
('dr012', 'medium', 'Recite any Bible verse from memory within 10 seconds — fail and you draw another dare.', '10秒内背出一节圣经经文，失败就再抽一张大冒险。', true, 11),
('dr013', 'medium', 'Let the group look at your most-used emojis and analyze your personality.', '让大家看你最常用的表情符号，并解读你的性格。', true, 12),
('dr014', 'medium', 'Give every person in the room a one-sentence compliment.', '用一句话夸奖在场的每一个人。', true, 13),
('dr015', 'medium', 'Do 10 push-ups; before each one, name something you''re thankful for.', '做10个俯卧撑，每做一个之前说一件感恩的事。', true, 14),
('dr016', 'medium', 'Call a parent on speaker and tell them you love them.', '给爸妈打电话（开免提）说“我爱你”。', true, 15),
('dr017', 'medium', 'Sit back-to-back with someone and stand up together without using your hands.', '和在场一个人背靠背坐下，不用手一起站起来。', true, 16),
('dr018', 'medium', 'Stare into someone''s eyes for 30 seconds — whoever laughs first draws another dare.', '和一个人对视30秒，谁先笑谁再抽一张大冒险。', true, 17),
('dr019', 'medium', 'Spell your name with your hips.', '用屁股扭出你的名字。', true, 18),
('dr020', 'medium', 'Let the person on your left pose you for a photo — they keep it.', '让你左边的人给你摆一个拍照姿势，照片归ta保存。', true, 19),
('dr021', 'medium', 'Arm-wrestle anyone here; the loser does 5 squats.', '和在场任何一人比腕力，输的做5个深蹲。', true, 20),
('dr022', 'medium', 'Close your eyes and let another player feed you a snack — guess what it is.', '闭上眼睛，让一个人喂你吃一样零食，猜出是什么。', true, 21),
('dr023', 'medium', 'Draw a portrait of someone here with your non-dominant hand in 30 seconds — they keep it.', '用非惯用手30秒画出在场一个人的肖像，本人保留。', true, 22),
('dr024', 'medium', 'Hold hands with a same-gender friend, gaze into their eyes, and say "认识你真好" without laughing.', '和一位同性十指相扣深情对望，说“认识你真好”，不许笑。', true, 23),
('dr025', 'bold', 'Pray out loud for the person across from you, right now, by name.', '现在就为你对面的人开口祷告，要提名。', true, 24),
('dr026', 'bold', 'Ask the group "what''s one thing I could grow in?" — listen without defending yourself.', '问大家：“你觉得我有什么可以成长的地方？”只能听，不能辩解。', true, 25),
('dr027', 'bold', 'Text a friend who doesn''t come to church: "Thought of you at fellowship tonight — want to come with me Sunday?"', '给一位不来教会的朋友发：“今晚在团契想到你了，周日要不要一起来？”', true, 26),
('dr028', 'bold', 'Give a 30-second improvised sermon on a random object the group picks.', '用大家随手指定的一个物品，即兴讲道30秒。', true, 27),
('dr029', 'bold', 'Call the 5th contact in your phone and say: "I drew a dare card and it says I must thank you for being in my life."', '打给通讯录里第5个人说：“我抽到大冒险，要谢谢你出现在我的生命里。”', true, 28),
('dr030', 'bold', 'Let the group pick a pose; hold it until the next card is drawn.', '让大家给你指定一个姿势，保持不动直到下一张卡被抽出。', true, 29)
on conflict (id) do update
  set level = excluded.level, en = excluded.en, zh = excluded.zh, sort = excluded.sort;
