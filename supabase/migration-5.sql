-- Migration 5: 51 new truth questions, 24 questions moved out of 劲爆 (re-categorized + re-numbered),
-- hh021 wording update, 7 new dares. Run once in the Supabase SQL Editor. Safe to re-run.

-- Re-categorize (id changes keep masked numbering collision-free)
update public.questions set id = 'gk047', category = 'getting_to_know' where id = 'sp004';
update public.questions set id = 'gk048', category = 'getting_to_know' where id = 'sp006';
update public.questions set id = 'gk049', category = 'getting_to_know' where id = 'sp013';
update public.questions set id = 'gk050', category = 'getting_to_know' where id = 'sp016';
update public.questions set id = 'gk051', category = 'getting_to_know' where id = 'sp027';
update public.questions set id = 'gk052', category = 'getting_to_know' where id = 'sp028';
update public.questions set id = 'gk053', category = 'getting_to_know' where id = 'sp030';
update public.questions set id = 'gk054', category = 'getting_to_know' where id = 'sp032';
update public.questions set id = 'gk055', category = 'getting_to_know' where id = 'sp036';
update public.questions set id = 'gk056', category = 'getting_to_know' where id = 'sp037';
update public.questions set id = 'gk057', category = 'getting_to_know' where id = 'sp039';
update public.questions set id = 'gk058', category = 'getting_to_know' where id = 'sp042';
update public.questions set id = 'gk059', category = 'getting_to_know' where id = 'sp090';
update public.questions set id = 'ir040', category = 'ideals_reals' where id = 'sp009';
update public.questions set id = 'ir041', category = 'ideals_reals' where id = 'sp010';
update public.questions set id = 'ir042', category = 'ideals_reals' where id = 'sp031';
update public.questions set id = 'hh064', category = 'heart_to_heart' where id = 'sp035';
update public.questions set id = 'hh065', category = 'heart_to_heart' where id = 'sp044';
update public.questions set id = 'hh066', category = 'heart_to_heart' where id = 'sp052';
update public.questions set id = 'mem035', category = 'memories' where id = 'sp018';
update public.questions set id = 'mem036', category = 'memories' where id = 'sp025';
update public.questions set id = 'mem037', category = 'memories' where id = 'sp029';
update public.questions set id = 'ms071', category = 'matters_of_soul' where id = 'sp008';
update public.questions set id = 'ms072', category = 'matters_of_soul' where id = 'sp021';

update public.questions set en = 'Could you handle a long-distance relationship? How far is too far?', zh = '你能接受异地恋吗？最远能接受多远？' where id = 'hh021';

-- Recompute sort order per category
with ranked as (
  select id, row_number() over (partition by category order by id) - 1 as rn
  from public.questions
)
update public.questions s set sort = ranked.rn from ranked where s.id = ranked.id;

insert into public.questions (id, category, en, zh, enabled, sort) values
('gk060', 'getting_to_know', 'When is your birthday?', '你的生日是什么时候？', true, 999),
('gk061', 'getting_to_know', 'The water cuts out halfway through your shower — what do you do?', '洗澡洗到一半没水了，你会怎么办？', true, 999),
('gk062', 'getting_to_know', 'What do you usually look at on your phone in the bathroom?', '上厕所的时候一般用手机看什么？', true, 999),
('gk063', 'getting_to_know', 'Describe your own looks in three words.', '如果让你形容自己的长相，你会用哪三个词语？', true, 999),
('hh067', 'heart_to_heart', 'How would you rank parents, partner, and children?', '父母、对象、孩子，你会怎么排序？', true, 999),
('hh068', 'heart_to_heart', 'Under what circumstances would you agree if your ex asked to get back together?', '如果前任找你复合，什么情况下你会同意？', true, 999),
('hh069', 'heart_to_heart', 'What are your requirements for a partner?', '你对另一半的要求有哪些？', true, 999),
('hh070', 'heart_to_heart', 'An opposite-gender friend you haven''t talked to in ages suddenly says they like you — how do you react?', '好久没联系的异性突然说喜欢你，你会是什么反应？', true, 999),
('hh071', 'heart_to_heart', 'Do you believe in pure friendship between men and women? Why?', '你觉得男女之间有纯友谊吗？为什么？', true, 999),
('hh072', 'heart_to_heart', 'Who do you trust the most?', '在你心中谁最可信？', true, 999),
('hh073', 'heart_to_heart', 'Could you date someone noticeably older or younger? What age gap is acceptable?', '接受姐弟恋或者兄妹恋吗？相差多少岁可以接受？', true, 999),
('hh074', 'heart_to_heart', 'You run into your ex while on a date with someone you like — what do you do?', '如果跟你喜欢的人约会时遇到前任，你会怎么做？', true, 999),
('hh075', 'heart_to_heart', 'What gift would you most like to receive on Valentine''s Day?', '情人节最想收到什么礼物？', true, 999),
('hh076', 'heart_to_heart', 'If you found out a close friend was cheating on their partner, what would you do?', '如果发现好朋友有外遇，你会怎么做？', true, 999),
('hh077', 'heart_to_heart', 'In love, what''s your biggest edge over others of your gender?', '你觉得在爱情方面，你和其他同性相比最有竞争力的是什么？', true, 999),
('hh078', 'heart_to_heart', 'Share a moment when someone here left a deep impression on you.', '说出在场某个人让你印象深刻的一件事情。', true, 999),
('hh079', 'heart_to_heart', 'What does a perfect relationship look like to you?', '你对完美恋爱关系的认知是怎样的？', true, 999),
('hh080', 'heart_to_heart', 'What instantly turns you off about the opposite sex?', '异性做什么事情会让你瞬间下头？', true, 999),
('hh081', 'heart_to_heart', 'Is there a romantic movie moment you wish would happen to you?', '有希望发生在自己身上的爱情桥段吗？是什么？', true, 999),
('hh082', 'heart_to_heart', 'Have you ever started a relationship casually just because everyone around you was dating?', '你曾经有因为别人都在谈恋爱，而随便开始一段关系吗？', true, 999),
('mem038', 'memories', 'What was your saddest cry ever, and why?', '哭得最伤心的是哪一次？为什么？', true, 999),
('sp105', 'spicy', 'Is there someone you fancy right now? What are they like?', '现在有没有钟意的人？ta是怎么样的人？', true, 999),
('sp106', 'spicy', 'What type of the opposite sex do you dislike the most?', '你最讨厌的异性是哪种类型？', true, 999),
('sp107', 'spicy', 'Do you say “I love you” often? How many times have you said it?', '你经常说我爱你吗？说了多少次了？', true, 999),
('sp108', 'spicy', 'Would you confess to your crush? How would you usually do it?', '会不会向暗恋的人表白？通常会怎样表白？', true, 999),
('sp109', 'spicy', 'How is your first love doing these days?', '初恋对方现在过得怎么样？', true, 999),
('sp110', 'spicy', 'If a robber broke in and you could only protect one opposite-gender person here, who and why?', '如果现在有人入室抢劫，你只能保护在场的一个异性，你会保护谁？为什么？', true, 999),
('sp111', 'spicy', 'When was your last kiss?', '上次接吻是什么时候？', true, 999),
('sp112', 'spicy', 'When did you last hold hands with someone of the opposite sex?', '上次和异性牵手是什么时候？', true, 999),
('sp113', 'spicy', 'What''s the worst thing you''ve ever done to a friend?', '过去做过最对不起朋友的事情是什么？', true, 999),
('sp114', 'spicy', 'What''s the biggest lie you''ve ever told?', '撒过最大的一个谎是什么？', true, 999),
('sp115', 'spicy', 'Who here do you most want to tell off, and why?', '最想骂在座的谁？为什么？', true, 999),
('sp116', 'spicy', 'Pick an opposite-gender person here and roast three things about them.', '选一位在场的异性，吐槽ta三点。', true, 999),
('sp117', 'spicy', 'If someone new pursued you while in a relationship, would you tell your partner?', '恋爱中有新的追求者，你会向对象坦白吗？', true, 999),
('sp118', 'spicy', 'Should a blind date split the bill? What about after you''re together?', '你觉得相亲要不要AA？在一起之后呢？', true, 999),
('sp119', 'spicy', 'Who changes their heart more easily — men or women?', '你觉得男人善变还是女人善变？', true, 999),
('sp120', 'spicy', 'When do you plan to get married?', '你打算什么时候结婚？', true, 999),
('sp121', 'spicy', 'Does your best friend''s current partner deserve them?', '你觉得好朋友现在的另一半配得上ta吗？', true, 999),
('sp122', 'spicy', 'Is a confession fighting for love, or just a formality?', '你觉得表白应该是一种争取，还是走流程？', true, 999),
('sp123', 'spicy', 'At what stage of a relationship would you reveal your dating history?', '会在恋爱的什么阶段跟对方坦白自己的恋爱史？', true, 999),
('sp124', 'spicy', 'Which app on your phone do you most fear others browsing, and why?', '手机里最怕别人浏览的App是哪个？为什么？', true, 999),
('sp125', 'spicy', 'What''s the most selfish thing you''ve done in a relationship?', '感情中，你做过最自私的一件事情是什么？', true, 999),
('sp126', 'spicy', 'Have you ever been secretly admired? How did it feel?', '有被暗恋过吗？心情如何？', true, 999),
('sp127', 'spicy', 'Who is the best-looking opposite-gender person here?', '你觉得在座的异性里，谁最好看？', true, 999),
('sp128', 'spicy', 'Plastic-surgery looks or plain looks — which is easier for you to accept?', '整容脸和长相一般，哪个你更容易接受？', true, 999),
('sp129', 'spicy', 'Handsome but short, or average-looking — which is easier to accept?', '帅但矮和长相一般，哪个你更容易接受？', true, 999),
('sp130', 'spicy', 'Have you ever deliberately excluded someone? Why?', '你有没有孤立过任何人？为什么？', true, 999),
('sp131', 'spicy', 'What''s the most undignified thing you''ve done for someone you liked?', '你为喜欢的人做过最卑微的事情是什么？', true, 999),
('sp132', 'spicy', 'What''s the most two-faced thing you''ve ever done?', '你做过最双面人的事情是什么？', true, 999),
('sp133', 'spicy', 'Have you ever felt more than friendship for a friend? What sparked it?', '你有没有曾经对朋友产生过超越友谊的感觉？因为什么事情？', true, 999),
('sp134', 'spicy', 'Do you like someone right now? Which city are they in?', '你现在有喜欢的人吗？ta目前在哪个城市？', true, 999)
on conflict (id) do update set category = excluded.category, en = excluded.en, zh = excluded.zh;

with ranked as (
  select id, row_number() over (partition by category order by id) - 1 as rn
  from public.questions
)
update public.questions s set sort = ranked.rn from ranked where s.id = ranked.id;

insert into public.dares (id, level, en, zh, enabled, sort) values
('dr098', 'medium', 'Pick an opposite-gender player and hold deep, soulful eye contact for 15 seconds.', '选一位在场的异性，深情对视15秒。', true, 97),
('dr099', 'mild', 'Do 10 push-ups, saying “我好菜” (“I''m so weak”) out loud with each one.', '做10个俯卧撑，边做边说“我好菜”。', true, 98),
('dr100', 'medium', 'Let the person on your right braid or style your hair.', '让右边的人给你编一个辫子，或者整理发型。', true, 99),
('dr101', 'bold', 'Rest your head on a same-gender player''s lap for 10 seconds while acting like you''re thoroughly enjoying it.', '头枕在一位同性的腿上10秒，同时演出你很享受的样子。', true, 100),
('dr102', 'medium', 'Pick an opposite-gender player and whisper a secret in their ear.', '选在场一位异性，跟ta说一句悄悄话。', true, 101),
('dr103', 'bold', 'Have a same-gender player carry you princess-style and take a selfie together.', '找在场一位同性公主抱你，并自拍一张。', true, 102),
('dr104', 'medium', 'Pick a same-gender player and say “你保护世界，而我，保护你～” in three different tones.', '选在场一位同性，用三种不同的语气对ta说“你保护世界，而我，保护你～”。', true, 103)
on conflict (id) do update set level = excluded.level, en = excluded.en, zh = excluded.zh, sort = excluded.sort;
