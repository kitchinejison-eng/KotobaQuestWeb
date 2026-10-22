(function () {
  'use strict';
  try{sessionStorage.removeItem('kotobaquest_entering_dungeon');}catch(e){}

  var SAVE_KEY = 'kotobaDungeonSaveV1';
  var AVATARS = [
    { id: 1, label: 'アバター1', src: 'images/ivent/avatar_default_01.png' },
    { id: 2, label: 'アバター2', src: 'images/ivent/avatar_default_02.png' },
    { id: 3, label: 'アバター3', src: 'images/ivent/avatar_default_03.png' },
    { id: 4, label: 'ねこ', src: 'images/ivent/avatar_default_04.png' }
  ];
  var TIER_META = [
    { title: '絵を見て、ことばを選ぼう', description: '絵やマークを見て、合う言葉を選びます。', label: '絵とことば', range: 'Lv.1〜2' },
    { title: 'ことばの仲間を見つけよう', description: 'ものの名前や特徴から、仲間やグループを考えます。', label: '仲間分け', range: 'Lv.3〜4' },
    { title: '意味や反対のことばを考えよう', description: '反対の言葉や、似た意味の言葉に挑戦します。', label: '意味・反対語', range: 'Lv.5〜6' },
    { title: '文に合う言葉を入れよう', description: '文章を読んで、空いているところに入る言葉を選びます。', label: '文の穴うめ', range: 'Lv.7〜8' },
    { title: '思い出して、言葉を入力しよう', description: 'ヒントから言葉を思い出して、自分で入力します。', label: '言葉を入力', range: 'Lv.9〜10' },
    { title: '短いお話を読んで考えよう', description: '短い文章を読み、内容を覚えて答えます。', label: '短文の理解', range: 'Lv.11〜14' },
    { title: '場面に合う表現を選ぼう', description: '日常の場面を考えて、より合う言葉や返事を選びます。', label: '場面で考える', range: 'Lv.15〜' }
  ];

  function c(prompt, choices, answer, hint, extra) {
    var q = { kind: 'choice', prompt: prompt, choices: choices, answer: answer, hint: hint || '' };
    if (extra) Object.keys(extra).forEach(function (key) { q[key] = extra[key]; });
    return q;
  }
  function i(prompt, accepted, hint, extra) {
    var q = { kind: 'input', prompt: prompt, accepted: accepted, answer: accepted[0], hint: hint || '' };
    if (extra) Object.keys(extra).forEach(function (key) { q[key] = extra[key]; });
    return q;
  }
  var QUESTION_BANKS = [
    // Lv.1〜2：絵とことば
    [
      c('「りんご」は どれ？', ['🍎 りんご', '🍌 バナナ', '🍇 ぶどう', '🥕 にんじん'], '🍎 りんご', '赤いことが多い、丸いくだものです。', { visual: '🍎' }),
      c('「ねこ」は どれ？', ['🐱 ねこ', '🐟 さかな', '🐶 いぬ', '🐦 とり'], '🐱 ねこ', '「にゃー」と鳴く動物です。', { visual: '🐱' }),
      c('「くつ」は どれ？', ['👟 くつ', '🧢 ぼうし', '🍵 おちゃ', '📕 ほん'], '👟 くつ', '歩くときに足にはきます。', { visual: '👟' }),
      c('「さかな」は どれ？', ['🐟 さかな', '🍎 りんご', '🚗 くるま', '🌷 はな'], '🐟 さかな', '水の中を泳ぐ生きものです。', { visual: '🐟' }),
      c('「でんしゃ」は どれ？', ['🚃 でんしゃ', '🍰 ケーキ', '🐰 うさぎ', '✏️ えんぴつ'], '🚃 でんしゃ', '線路の上を走ります。', { visual: '🚃' }),
      c('「はな」は どれ？', ['🌷 はな', '🥛 ぎゅうにゅう', '🪑 いす', '🧦 くつした'], '🌷 はな', '花びらがあり、よい香りのものもあります。', { visual: '🌷' }),
      c('「あめ」が ふるときに つかうものは？', ['☂️ かさ', '🍴 フォーク', '🛏️ ふとん', '🧤 てぶくろ'], '☂️ かさ', 'ぬれないように頭の上にさします。'),
      c('「とけい」は どれ？', ['🕒 とけい', '🍞 パン', '🪥 はぶらし', '🎒 かばん'], '🕒 とけい', '時間を知るために使います。'),
      c('「みず」は どれ？', ['💧 みず', '🔥 ひ', '🪨 いし', '🍃 はっぱ'], '💧 みず', 'のどがかわいたときに飲みます。'),
      c('「ほん」は どれ？', ['📘 ほん', '🍌 バナナ', '🧹 ほうき', '🧸 ぬいぐるみ'], '📘 ほん', 'ページをめくって読みます。')
    ],
    // Lv.3〜4：仲間分け
    [
      c('くだものの なかまは どれ？', ['🍇 ぶどう', '🥔 じゃがいも', '🥬 キャベツ', '🐟 さかな'], '🍇 ぶどう', '甘くて、木やつるなどに実る食べ物です。'),
      c('料理をするときに使うものは？', ['🍳 フライパン', '🛏️ ふとん', '🧴 シャンプー', '🎒 ランドセル'], '🍳 フライパン', '食べ物を焼いたり、炒めたりします。'),
      c('雨の日に関係が深いものは？', ['☔ ながぐつ', '🕶️ サングラス', '🏖️ うきわ', '🪭 せんす'], '☔ ながぐつ', '足がぬれにくい靴です。'),
      c('野菜の なかまは どれ？', ['🥕 にんじん', '🍑 もも', '🍪 クッキー', '🐟 さかな'], '🥕 にんじん', '畑で育つ食べ物です。'),
      c('朝にすることとして自然なのは？', ['☀️ あいさつをする', '🌙 ねむるためにふとんに入る', '🎄 クリスマスを祝う', '🧥 コートをしまう'], '☀️ あいさつをする', '一日の始まりに「おはよう」と言います。'),
      c('文房具の なかまは どれ？', ['✏️ えんぴつ', '🍲 なべ', '🧦 くつした', '🧼 せっけん'], '✏️ えんぴつ', '文字を書いたり、絵を描いたりします。'),
      c('乗り物の なかまではないものは？', ['🍮 プリン', '🚲 自転車', '🚌 バス', '🚢 船'], '🍮 プリン', '食べ物と乗り物を分けて考えましょう。'),
      c('体をきれいにするとき使うものは？', ['🧼 せっけん', '📏 ものさし', '🔑 かぎ', '🧩 パズル'], '🧼 せっけん', '手や体を洗うときに使います。'),
      c('「甘い」と関係が深い味は？', ['🍯 はちみつ', '🍋 レモンのすっぱさ', '☕ にがいコーヒー', '🌶️ からいとうがらし'], '🍯 はちみつ', 'ケーキやあめにもある味です。'),
      c('寒い日に使うものは？', ['🧣 マフラー', '🩴 サンダル', '🪭 せんす', '🩱 水着'], '🧣 マフラー', '首に巻いて、あたたかくします。')
    ],
    // Lv.5〜6：意味・反対語
    [
      c('「大きい」の反対の言葉は？', ['小さい', '長い', '重い', '高い'], '小さい', 'サイズが小さなものを表します。'),
      c('「早い」の反対に近い言葉は？', ['おそい', '明るい', '広い', '強い'], 'おそい', '時間がかかることです。'),
      c('「あたたかい」の反対は？', ['つめたい', 'やさしい', 'やわらかい', 'にぎやか'], 'つめたい', '氷や雪をさわったときの感じです。'),
      c('「うれしい」と似た意味の言葉は？', ['たのしい', 'かなしい', 'こわい', 'ねむい'], 'たのしい', '心が明るくなる気持ちです。'),
      c('「はじまる」の反対は？', ['おわる', 'つづく', 'すすむ', 'あつまる'], 'おわる', '最後になることです。'),
      c('「静か」の反対に近い言葉は？', ['にぎやか', 'しずか', 'やさしい', 'まじめ'], 'にぎやか', '人の声や音がたくさん聞こえます。'),
      c('「買う」と反対の意味は？', ['売る', '使う', '作る', '選ぶ'], '売る', 'お店で品物を人にわたして、お金を受け取ります。'),
      c('「まっすぐ」と反対に近い言葉は？', ['曲がった', '明るい', '短い', '新しい'], '曲がった', '道が右や左へ向きを変えます。'),
      c('「ていねい」と似た意味の言葉は？', ['きちんと', '急いで', '適当に', 'こっそり'], 'きちんと', 'あわてず、細かいところまで気をつけます。'),
      c('「成功」と反対に近い言葉は？', ['失敗', '準備', '挑戦', '成長'], '失敗', '思ったような結果にならないことです。')
    ],
    // Lv.7〜8：文の穴うめ
    [
      c('のどが かわいたので、みずを（　）。', ['飲みました', '読みました', '着ました', '歩きました'], '飲みました', '水は口から飲みます。'),
      c('雨が ふってきたので、かさを（　）。', ['さしました', '書きました', '焼きました', '洗いました'], 'さしました', '雨にぬれないようにします。'),
      c('朝ごはんを食べて、学校へ（　）。', ['行きました', '寝ました', '泳ぎました', '買いました'], '行きました', '目的地へ向かう言葉です。'),
      c('寒かったので、上着を（　）。', ['着ました', '飲みました', '切りました', '読みました'], '着ました', '服を身につける言葉です。'),
      c('時間を知りたいので、とけいを（　）。', ['見ました', '食べました', '聞きました', '投げました'], '見ました', '目で確認します。'),
      c('料理をする前に、手を（　）。', ['洗います', '描きます', '飛びます', '歌います'], '洗います', 'せっけんと水を使います。'),
      c('約束の時間に遅れそうなので、友だちに電話で（　）。', ['知らせます', '焼きます', '並べます', '磨きます'], '知らせます', '相手に情報を伝えます。'),
      c('本を読み終わったので、本だなに（　）。', ['戻しました', '煮ました', '走りました', '歌いました'], '戻しました', '元の場所に置くことです。'),
      c('道がわからなくなったので、地図を（　）。', ['確認しました', '料理しました', '洗濯しました', '運動しました'], '確認しました', '間違いがないか調べます。'),
      c('花が元気に育つように、水を（　）。', ['あげます', '閉めます', '返します', '消します'], 'あげます', '植物に水を与えます。')
    ],
    // Lv.9〜10：想起して入力
    [
      i('「大きい」の反対の言葉を入力してください。', ['小さい', 'ちいさい'], 'サイズが小さいことを表します。'),
      i('朝のあいさつは「おはよう」。では、夜のあいさつは？', ['こんばんは', '今晩は'], '夜、人に会ったときのあいさつです。'),
      i('雨の日に、頭の上にさすものは？', ['かさ', '傘'], 'ぬれないために使います。'),
      i('食事の前に、せっけんで何をしますか？', ['手を洗う', '手をあらう', '手洗い'], '水道で、手をきれいにします。'),
      i('文字を書くときに使うものは？', ['えんぴつ', '鉛筆', 'ペン', 'ボールペン'], '手に持って、紙に文字を書きます。'),
      i('「始まる」の反対の言葉は？', ['終わる', 'おわる'], '最後になることです。'),
      i('電車が走る場所は？', ['線路', 'せんろ'], '電車の車輪が通る道です。'),
      i('料理を作る人を何といいますか？', ['料理人', 'りょうりにん', 'シェフ'], 'レストランなどで料理を作る仕事です。'),
      i('「ありがとう」と言われたときの返事の例は？', ['どういたしまして', 'こちらこそ'], '感謝に対する返事です。'),
      i('困っている人を助けることを何といいますか？', ['手伝う', 'てつだう', '助ける', 'たすける'], '相手のために力を貸すことです。')
    ],
    // Lv.11〜14：短い文章の理解
    [
      c('ゆきさんは朝、駅まで歩きました。電車に乗って会社へ行きました。ゆきさんが駅から会社へ行くために使ったものは？', ['電車', '自転車', '船', '飛行機'], '電車', '駅から乗る乗り物が文の中にあります。', { context: 'ゆきさんは朝、駅まで歩きました。電車に乗って会社へ行きました。' }),
      c('たろうさんはスーパーで牛乳とパンを買いました。買ったものはどれ？', ['牛乳とパン', '水とごはん', '魚と肉', 'りんごとお茶'], '牛乳とパン', '買ったものを文から探しましょう。', { context: 'たろうさんはスーパーで牛乳とパンを買いました。' }),
      c('花子さんは雨が降る前に洗濯物を取り込みました。なぜですか？', ['洗濯物をぬらさないため', '花に水をあげるため', '出かけるため', '暑かったため'], '洗濯物をぬらさないため', '雨が降ると、外の洗濯物はどうなるでしょう。', { context: '花子さんは空が暗くなったので、外に干した洗濯物を取り込みました。少しあとに雨が降り始めました。' }),
      c('けんさんは図書館で本を借り、来週返す予定です。けんさんがすることは？', ['本を返す', '本を買う', '本を捨てる', '本を売る'], '本を返す', '「返す予定」と書いてあります。', { context: 'けんさんは図書館で本を借りました。返す日は来週です。' }),
      c('みほさんは朝食を食べずに出かけたので、お昼前におなかがすきました。理由は？', ['朝食を食べなかったから', 'たくさん寝たから', '雨が降ったから', '本を読んだから'], '朝食を食べなかったから', 'おなかがすいた原因を考えましょう。', { context: 'みほさんは朝、急いで家を出ました。朝食を食べなかったので、お昼前におなかがすきました。' }),
      c('お店は10時に開き、18時に閉まります。16時に買い物できますか？', ['できる', 'できない', '朝だけできる', '翌日まで待つ'], 'できる', '16時は10時から18時の間です。', { context: 'お店の営業時間は、午前10時から午後6時までです。' }),
      c('あきさんは友だちの誕生日に花を贈りました。友だちに伝えたい気持ちは？', ['お祝い', 'おわび', '怒り', '心配'], 'お祝い', '誕生日に贈り物をする気持ちです。', { context: 'あきさんは友だちの誕生日に、きれいな花を贈りました。' }),
      c('バスは9時に出発します。駅には8時50分に着きました。出発まで何分ありますか？', ['10分', '5分', '15分', '20分'], '10分', '8時50分から9時までを考えます。', { context: 'バスは午前9時に出発します。' }),
      c('りょうさんは料理のあと、使った皿を洗って棚に戻しました。最後にしたことは？', ['皿を棚に戻す', '料理を始める', '買い物をする', '皿を買う'], '皿を棚に戻す', '「最後にしたこと」を読み取ります。', { context: 'りょうさんは夕食を作りました。食べ終わってから皿を洗い、棚に戻しました。' }),
      c('まきさんは毎日少しずつ練習し、発表会で最後までピアノを弾けました。よかった理由は？', ['毎日練習したから', '練習を休んだから', 'ピアノを片づけたから', '発表会に行かなかったから'], '毎日練習したから', '「少しずつ練習」と書いてあります。', { context: 'まきさんは毎日少しずつピアノを練習しました。発表会では最後まで演奏できました。' })
    ],
    // Lv.15〜：場面や意味を考える
    [
      c('カフェで飲み物を注文したいとき、自然な言い方は？', ['コーヒーをください', 'コーヒーを走ります', 'コーヒーを読みます', 'コーヒーが歩きます'], 'コーヒーをください', 'ほしいものを、ていねいに伝えましょう。'),
      c('相手の話が聞き取れませんでした。もう一度聞きたいときは？', ['もう一度お願いします', 'もう帰ります', 'おいしかったです', 'おやすみなさい'], 'もう一度お願いします', '相手にくり返してもらう言い方です。'),
      c('待ち合わせに遅れそうです。まず何をするとよいですか？', ['相手に連絡する', '何も言わずに帰る', '約束を忘れる', '電気を消す'], '相手に連絡する', '相手が困らないように、状況を知らせます。'),
      c('友だちが手伝ってくれました。感謝を伝える言葉は？', ['ありがとう', 'どうしましたか', 'さようなら', 'いくらですか'], 'ありがとう', '助けてもらったときに使います。'),
      c('お店で値段がわかりません。自然な質問は？', ['これはいくらですか？', 'これは何時に寝ますか？', 'これはどこを歩きますか？', 'これは何色を食べますか？'], 'これはいくらですか？', '値段をたずねる言葉です。'),
      c('相手が話しているとき、よい聞き方はどれですか？', ['相手を見て、最後まで聞く', 'ずっと別の方を見る', '大きな声でさえぎる', 'その場を離れてしまう'], '相手を見て、最後まで聞く', '相手の話を大切にする態度を考えましょう。'),
      c('道を教えてもらい、場所がわかりました。自然な返事は？', ['ありがとうございます。わかりました。', 'お皿を洗います。', '昨日は晴れでした。', 'りんごをください。'], 'ありがとうございます。わかりました。', '教えてもらったことへのお礼を伝えます。'),
      c('「少しお待ちください」と言われました。どうするのが自然ですか？', ['その場で待つ', 'すぐに怒る', '質問を忘れる', '走って帰る'], 'その場で待つ', '待ってほしい、という意味です。'),
      c('体調が悪くて作業を続けるのが難しいとき、よい伝え方は？', ['少し休ませてください', '何も言わずに無理をする', '急に大声を出す', '人の物を隠す'], '少し休ませてください', '自分の状態を言葉で伝えることが大切です。'),
      c('「確認する」という言葉に近い意味はどれ？', ['たしかめる', '忘れる', 'かくす', 'こわす'], 'たしかめる', '間違いがないか見たり調べたりすることです。')
    ]
  ];

  var data = loadData();
  var setupAvatar = 4;
  var settingsAvatar = 4;
  var challenge = null;
  var toastTimer = null;
  var lastLevelUp = null;

  function defaultData() {
    return {
      profile: null,
      totalExp: 0,
      clears: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      rules: { questionCount: 5, autoRead: false, showHints: true },
      history: []
    };
  }
  function loadData() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return defaultData();
      var d = JSON.parse(raw);
      var base = defaultData();
      if (!d || typeof d !== 'object') return base;
      base.profile = d.profile && typeof d.profile.name === 'string' ? { name: d.profile.name, avatar: clampAvatar(d.profile.avatar) } : null;
      base.totalExp = Math.max(0, Number(d.totalExp) || 0);
      base.clears = Math.max(0, Number(d.clears) || 0);
      base.totalCorrect = Math.max(0, Number(d.totalCorrect) || 0);
      base.totalAnswered = Math.max(0, Number(d.totalAnswered) || 0);
      base.rules.questionCount = Number(d.rules && d.rules.questionCount) === 10 ? 10 : 5;
      base.rules.autoRead = !!(d.rules && d.rules.autoRead);
      base.rules.showHints = d.rules ? d.rules.showHints !== false : true;
      base.history = Array.isArray(d.history) ? d.history.slice(0, 20) : [];
      return base;
    } catch (e) { return defaultData(); }
  }
  function clampAvatar(value) {
    var n = Number(value);
    return n >= 1 && n <= 4 ? Math.floor(n) : 4;
  }
  function saveData() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (e) { showToast('保存できませんでした。端末の空き容量を確認してください。'); }
  }
  function $(id) { return document.getElementById(id); }
  function showScreen(id) {
    ['kdSetupScreen','kdHomeScreen','kdSettingsScreen','kdChallengeScreen','kdResultScreen'].forEach(function (screenId) {
      var el = $(screenId); if (el) el.classList.toggle('kd-hidden', screenId !== id);
    });
    window.scrollTo(0, 0);
  }
  function assetAvatar(id) {
    var avatar = AVATARS.find(function (a) { return a.id === clampAvatar(id); }) || AVATARS[3];
    return avatar.src;
  }
  function renderAvatarPicker(containerId, selected, callback) {
    var container = $(containerId);
    if (!container) return;
    container.innerHTML = '';
    AVATARS.forEach(function (avatar) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'kd-avatar-option' + (avatar.id === selected ? ' is-selected' : '');
      button.setAttribute('aria-pressed', avatar.id === selected ? 'true' : 'false');
      var img = document.createElement('img');
      img.src = avatar.src;
      img.alt = '';
      img.loading = 'eager';
      var label = document.createElement('span');
      label.textContent = avatar.label;
      button.appendChild(img); button.appendChild(label);
      button.addEventListener('click', function () { callback(avatar.id); });
      container.appendChild(button);
    });
  }
  function renderSetupAvatars() {
    renderAvatarPicker('kdSetupAvatars', setupAvatar, function (id) { setupAvatar = id; renderSetupAvatars(); });
  }
  function renderSettingsAvatars() {
    renderAvatarPicker('kdSettingsAvatars', settingsAvatar, function (id) { settingsAvatar = id; renderSettingsAvatars(); });
  }
  function expToNextForLevel(level) { return 50 + Math.max(0, level - 1) * 25; }
  function levelInfo(totalExp) {
    var level = 1;
    var remaining = Math.max(0, Number(totalExp) || 0);
    var needed = expToNextForLevel(level);
    while (remaining >= needed && level < 999) {
      remaining -= needed;
      level += 1;
      needed = expToNextForLevel(level);
    }
    return { level: level, within: remaining, needed: needed, percent: Math.max(0, Math.min(100, remaining / needed * 100)) };
  }
  function tierIndex(level) {
    if (level <= 2) return 0;
    if (level <= 4) return 1;
    if (level <= 6) return 2;
    if (level <= 8) return 3;
    if (level <= 10) return 4;
    if (level <= 14) return 5;
    return 6;
  }
  function rankName(level) {
    if (level <= 2) return 'ことばのたまご';
    if (level <= 4) return 'ことばの見習い';
    if (level <= 6) return 'ことばの探究者';
    if (level <= 8) return 'ことばの冒険者';
    if (level <= 10) return 'ことばの達人';
    if (level <= 14) return 'ことばマスター';
    return 'ことばの大賢者';
  }
  function renderHome() {
    if (!data.profile) { showScreen('kdSetupScreen'); return; }
    var info = levelInfo(data.totalExp);
    var tier = TIER_META[tierIndex(info.level)];
    $('kdHomeAvatar').src = assetAvatar(data.profile.avatar);
    $('kdHomeName').textContent = data.profile.name;
    $('kdHomeLevel').textContent = 'Lv.' + info.level;
    $('kdHomeRank').textContent = rankName(info.level);
    $('kdHomeExpText').textContent = Math.floor(info.within) + ' / ' + info.needed + ' EXP';
    $('kdHomeExpBar').style.width = info.percent + '%';
    $('kdHomeTotalExp').textContent = data.totalExp;
    $('kdTaskLevelTag').textContent = tier.range;
    $('kdTaskTitle').textContent = tier.title;
    $('kdTaskDescription').textContent = tier.description;
    $('kdHomeClears').textContent = data.clears;
    $('kdHomeCorrectRate').textContent = data.totalAnswered ? Math.round(data.totalCorrect / data.totalAnswered * 100) + '%' : '—';
    $('kdHomeBestLevel').textContent = info.level;
    renderHistory();
  }
  function renderHistory() {
    var list = $('kdHistoryList');
    if (!list) return;
    list.innerHTML = '';
    if (!data.history.length) {
      var empty = document.createElement('p'); empty.className = 'kd-history-empty'; empty.textContent = 'まだ冒険の記録はありません。最初のクエストに挑戦してみましょう。'; list.appendChild(empty); return;
    }
    data.history.slice(0, 10).forEach(function (h) {
      var row = document.createElement('div'); row.className = 'kd-history-item';
      var left = document.createElement('div');
      var title = document.createElement('strong'); title.textContent = h.tierTitle || 'ダンジョン';
      var date = document.createElement('small'); date.textContent = h.date || '';
      left.appendChild(title); left.appendChild(date);
      var right = document.createElement('div'); right.style.textAlign = 'right';
      var score = document.createElement('strong'); score.textContent = (h.correct || 0) + ' / ' + (h.total || 0) + '問';
      var exp = document.createElement('small'); exp.textContent = '+' + (h.exp || 0) + ' EXP';
      right.appendChild(score); right.appendChild(exp);
      row.appendChild(left); row.appendChild(right); list.appendChild(row);
    });
  }
  function openSettings() {
    var p = data.profile || { name: '', avatar: setupAvatar };
    $('kdSettingsName').value = p.name || '';
    settingsAvatar = clampAvatar(p.avatar);
    $('kdQuestionCount').value = String(data.rules.questionCount);
    $('kdAutoRead').checked = data.rules.autoRead;
    $('kdShowHints').checked = data.rules.showHints;
    renderSettingsAvatars();
    showScreen('kdSettingsScreen');
  }
  function saveProfileSettings() {
    var name = ($('kdSettingsName').value || '').trim().slice(0, 12);
    if (!name) name = data.profile && data.profile.name ? data.profile.name : '冒険者';
    data.profile = { name: name, avatar: settingsAvatar };
    data.rules.questionCount = Number($('kdQuestionCount').value) === 10 ? 10 : 5;
    data.rules.autoRead = $('kdAutoRead').checked;
    data.rules.showHints = $('kdShowHints').checked;
    saveData(); renderHome(); showScreen('kdHomeScreen'); showToast('設定を保存しました！');
  }
  function shuffle(arr) {
    var out = arr.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = out[i]; out[i] = out[j]; out[j] = t;
    }
    return out;
  }
  // Ver.47：コトバ・ダンジョン用の効果音。外部ファイルなしで鳴らします。
  var kdAudioCtx = null;
  var kdBgmAudio = document.getElementById('kdBgmAudio');
  function startDungeonBgm(){
    try{
      if(!kdBgmAudio) kdBgmAudio=document.getElementById('kdBgmAudio');
      if(!kdBgmAudio || localStorage.getItem('kotobaquest_music_v3')==='0') return;
      var vol=Number(localStorage.getItem('kotobaquest_volume_v3')||60);
      if(!isFinite(vol)) vol=60;
      kdBgmAudio.volume=Math.max(0,Math.min(100,vol))/100*0.32;
      var p=kdBgmAudio.play();if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }
  function stopDungeonBgm(){try{if(kdBgmAudio){kdBgmAudio.pause();kdBgmAudio.currentTime=0;}}catch(e){}}
  function playDungeonSfx(type){
    try{
      var AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) return;
      if(!kdAudioCtx || kdAudioCtx.state === 'closed') kdAudioCtx = new AC();
      if(kdAudioCtx.state === 'suspended') kdAudioCtx.resume();
      var ctx = kdAudioCtx, now = ctx.currentTime;
      var patterns = {
        click:[[720,0,.045,'sine',.035]],
        start:[[392,0,.11,'triangle',.075],[587,.10,.13,'triangle',.075],[784,.22,.22,'triangle',.085]],
        correct:[[523,0,.10,'triangle',.08],[659,.09,.11,'triangle',.08],[784,.18,.16,'triangle',.09],[1046,.30,.22,'sine',.095]],
        wrong:[[220,0,.12,'triangle',.07],[165,.10,.18,'sawtooth',.05]],
        hint:[[659,0,.10,'sine',.06],[880,.08,.17,'sine',.065]],
        attack:[[440,0,.07,'sawtooth',.07],[220,.05,.14,'triangle',.09],[100,.12,.18,'square',.035]],
        levelup:[[523,0,.12,'triangle',.075],[659,.10,.12,'triangle',.075],[784,.20,.12,'triangle',.075],[1046,.30,.25,'sine',.09],[1318,.40,.30,'sine',.08]],
        clear:[[392,0,.16,'triangle',.075],[494,.15,.16,'triangle',.075],[587,.30,.16,'triangle',.075],[784,.45,.34,'sine',.09]]
      };
      (patterns[type] || patterns.click).forEach(function(n){
        var osc=ctx.createOscillator(), gain=ctx.createGain();
        osc.type=n[3]; osc.frequency.setValueAtTime(n[0],now+n[1]);
        if(type==='attack') osc.frequency.exponentialRampToValueAtTime(Math.max(45,n[0]*.45),now+n[1]+n[2]);
        gain.gain.setValueAtTime(.0001,now+n[1]);
        gain.gain.linearRampToValueAtTime(n[4],now+n[1]+.014);
        gain.gain.exponentialRampToValueAtTime(.0001,now+n[1]+n[2]);
        osc.connect(gain);gain.connect(ctx.destination);osc.start(now+n[1]);osc.stop(now+n[1]+n[2]+.02);
      });
    }catch(e){ /* 音声非対応端末では、ゲームの操作を止めません。 */ }
  }
  window.addEventListener('pagehide',function(){
    stopDungeonBgm();
    try{ if(window.speechSynthesis) window.speechSynthesis.cancel(); }catch(e){}
    try{ if(window.AndroidSpeech && typeof window.AndroidSpeech.stopTts==='function') window.AndroidSpeech.stopTts(); }catch(e){}
    try{ if(kdAudioCtx && kdAudioCtx.state!=='closed') kdAudioCtx.suspend(); }catch(e){}
  });
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){
      stopDungeonBgm();
      try{localStorage.setItem('kotobaquest_music_v3','0');}catch(e){}
      try{if(window.speechSynthesis)window.speechSynthesis.cancel();}catch(e){}
      try{if(window.AndroidSpeech && typeof window.AndroidSpeech.stopTts==='function')window.AndroidSpeech.stopTts();}catch(e){}
      try{if(kdAudioCtx&&kdAudioCtx.state==='running')kdAudioCtx.suspend();}catch(e){}
    }
  });
  function startChallenge() {
    if (!data.profile) { showScreen('kdSetupScreen'); return; }
    playDungeonSfx('start');
    startDungeonBgm();
    var level = levelInfo(data.totalExp).level;
    var tier = tierIndex(level);
    var count = data.rules.questionCount === 10 ? 10 : 5;
    challenge = { level: level, tier: tier, questions: shuffle(QUESTION_BANKS[tier]).slice(0, count), index: 0, correct: 0, wrong: 0, locked: false };
    showScreen('kdChallengeScreen');
    drawQuestion();
  }
  function drawQuestion() {
    if (!challenge) return;
    var q = challenge.questions[challenge.index];
    $('kdChallengeLevel').textContent = 'Lv.' + challenge.level + ' の課題';
    $('kdQuestionPosition').textContent = (challenge.index + 1) + ' / ' + challenge.questions.length;
    $('kdQuestionBar').style.width = ((challenge.index + 1) / challenge.questions.length * 100) + '%';
    $('kdQuestionType').textContent = TIER_META[challenge.tier].label;
    $('kdChallengeTitle').textContent = q.prompt;
    $('kdQuestionInstruction').textContent = q.kind === 'input' ? '思い出した言葉を入力してください。' : '合う答えをひとつ選んでください。';
    var context = $('kdQuestionContext');
    if (q.context) { context.textContent = q.context; context.classList.remove('kd-hidden'); }
    else { context.textContent = ''; context.classList.add('kd-hidden'); }
    var visual = $('kdQuestionVisual');
    if (q.visual) { visual.textContent = q.visual; visual.classList.remove('kd-hidden'); }
    else { visual.textContent = ''; visual.classList.add('kd-hidden'); }
    var choices = $('kdChoiceArea'); choices.innerHTML = '';
    var inputForm = $('kdInputForm'); inputForm.classList.toggle('kd-hidden', q.kind !== 'input');
    if (q.kind === 'choice') {
      choices.classList.remove('kd-hidden');
      q.choices.forEach(function (choiceText) {
        var button = document.createElement('button'); button.type = 'button'; button.className = 'kd-choice-button'; button.textContent = choiceText;
        button.addEventListener('click', function () { submitAnswer(choiceText); });
        choices.appendChild(button);
      });
    } else {
      choices.classList.add('kd-hidden');
      $('kdAnswerInput').value = '';
    }
    $('kdHintBtn').classList.toggle('kd-hidden', !data.rules.showHints || !q.hint);
    $('kdHintText').textContent = q.hint || '';
    $('kdHintText').classList.add('kd-hidden');
    $('kdAnswerFeedback').textContent = '';
    $('kdAnswerFeedback').className = 'kd-answer-feedback';
    $('kdNextQuestionBtn').classList.add('kd-hidden');
    $('kdNextQuestionBtn').textContent = challenge.index === challenge.questions.length - 1 ? '結果を見る →' : 'つぎの問題へ →';
    challenge.locked = false;
    if (q.kind === 'input') {
      $('kdAnswerInput').readOnly = false;
      var inputSubmit = $('kdInputForm').querySelector('button[type="submit"]'); if (inputSubmit) inputSubmit.disabled = false;
      setTimeout(function () { if (challenge && !challenge.locked && $('kdChallengeScreen').classList.contains('kd-hidden') === false) $('kdAnswerInput').focus({ preventScroll: true }); }, 140);
    }
    if (data.rules.autoRead) setTimeout(speakCurrentQuestion, 250);
  }
  function normaliseAnswer(value) {
    return String(value == null ? '' : value).toLowerCase().replace(/[\s　。、，．,.!！?？「」『』【】]/g, '').trim();
  }
  function submitAnswer(answer) {
    if (!challenge || challenge.locked) return;
    var q = challenge.questions[challenge.index];
    var accepted = q.kind === 'input' ? q.accepted : [q.answer];
    var answerText = String(answer == null ? '' : answer).trim();
    if (!answerText) { showToast('答えを入力してください。'); return; }
    var correct = accepted.some(function (a) { return normaliseAnswer(a) === normaliseAnswer(answerText); });
    challenge.locked = true;
    if (correct) challenge.correct += 1; else challenge.wrong += 1;
    if (q.kind === 'choice') {
      Array.prototype.forEach.call($('kdChoiceArea').querySelectorAll('button'), function (button) {
        button.disabled = true;
        if (button.textContent === q.answer) button.classList.add('is-correct');
        else if (button.textContent === answerText && !correct) button.classList.add('is-wrong');
      });
    } else {
      $('kdAnswerInput').readOnly = true;
      var submitBtn = $('kdInputForm').querySelector('button[type="submit"]'); if (submitBtn) submitBtn.disabled = true;
    }
    var feedback = $('kdAnswerFeedback');
    if (correct) {
      if (typeof window.playCorrectSound === 'function') window.playCorrectSound(); else playDungeonSfx('correct');
      if (typeof window.announceCorrect === 'function') window.announceCorrect();
      feedback.textContent = '正解です。できました。 せいかい！ よくできました ✨';
      feedback.classList.add('good');
    } else {
      if (typeof window.playWrongSound === 'function') window.playWrongSound(); else playDungeonSfx('wrong');
      feedback.textContent = '不正解です。だいじょうぶ。今回はちがったようです。次の問題でも練習できます。';
      feedback.classList.add('retry');
    }
    $('kdHintBtn').classList.add('kd-hidden');
    $('kdNextQuestionBtn').classList.remove('kd-hidden');
  }
  function nextQuestion() {
    if (!challenge || !challenge.locked) return;
    if (challenge.index >= challenge.questions.length - 1) { finishChallenge(); return; }
    challenge.index += 1;
    drawQuestion();
  }
  function finishChallenge() {
    var beforeLevel = levelInfo(data.totalExp).level;
    var correct = challenge.correct;
    var total = challenge.questions.length;
    var gainedExp = correct * 10 + 10; // 正解1問ごとに10EXP、最後まで挑戦で10EXP
    data.totalExp += gainedExp;
    data.clears += 1;
    data.totalCorrect += correct;
    data.totalAnswered += total;
    var afterLevel = levelInfo(data.totalExp).level;
    var tierTitle = TIER_META[challenge.tier].title;
    var record = { date: nowLabel(), tierTitle: tierTitle, level: challenge.level, correct: correct, total: total, exp: gainedExp, levelAfter: afterLevel };
    data.history.unshift(record); data.history = data.history.slice(0, 20);
    saveData();
    $('kdResultCorrect').textContent = correct + ' / ' + total;
    $('kdResultAccuracy').textContent = '正答率 ' + Math.round(correct / total * 100) + '%';
    $('kdResultAccuracyBar').style.width = (correct / total * 100) + '%';
    $('kdResultExp').textContent = '+' + gainedExp + ' EXP';
    $('kdResultIcon').textContent = correct === total ? '🏆' : (correct >= Math.ceil(total / 2) ? '🌟' : '🌱');
    $('kdResultTitle').textContent = correct === total ? 'パーフェクト！' : '冒険クリア！';
    $('kdResultMessage').textContent = correct === total ? 'すばらしい！ ぜんぶ正解です。' : '最後まで取り組めました。次の冒険につながります。';
    if (afterLevel > beforeLevel) {
      $('kdResultLevelChange').textContent = 'Lv.' + beforeLevel + ' → Lv.' + afterLevel + ' にレベルアップ！';
      lastLevelUp = { before: beforeLevel, after: afterLevel };
    } else {
      $('kdResultLevelChange').textContent = '次のレベルまで、少しずつ経験値をためましょう。';
      lastLevelUp = null;
    }
    challenge = null;
    renderHome();
    showScreen('kdResultScreen');
    if (lastLevelUp) showLevelUp(lastLevelUp.before, lastLevelUp.after);
  }
  function showLevelUp(before, after) {
    playDungeonSfx('levelup');
    $('kdLevelUpText').textContent = 'Lv.' + before + '  →  Lv.' + after;
    $('kdLevelUpOverlay').classList.remove('kd-hidden');
  }
  function closeLevelUp() { $('kdLevelUpOverlay').classList.add('kd-hidden'); }
  function nowLabel() {
    var d = new Date();
    return d.getFullYear() + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getDate()).padStart(2, '0');
  }
  function speakCurrentQuestion() {
    if (!challenge) return;
    var q = challenge.questions[challenge.index];
    var phrase = (q.context ? q.context + '。' : '') + q.prompt;
    if (q.kind === 'choice') phrase += '。選択肢。' + q.choices.join('。');
    try {
      if (window.AndroidSpeech && typeof window.AndroidSpeech.speak === 'function') { window.AndroidSpeech.speak(String(phrase)); return; }
      if ('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
        window.speechSynthesis.cancel();
        var utterance = new SpeechSynthesisUtterance(phrase); utterance.lang = 'ja-JP'; utterance.rate = 0.85; window.speechSynthesis.speak(utterance);
      } else showToast('この端末では読み上げを利用できません。');
    } catch (e) { showToast('音声を再生できませんでした。'); }
  }
  function showToast(message) {
    var el = $('kdToast'); if (!el) return;
    el.textContent = message; el.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 2300);
  }
  function returnToMain() {
    if (window.AndroidApp && typeof window.AndroidApp.returnToMain === 'function') { try { window.AndroidApp.returnToMain(); return; } catch(e) {} }
    window.location.href = 'index.html#title';
  }
  function resetDungeon() {
    var ok = window.confirm('コトバ・ダンジョンのレベル・経験値・名前・アバター・冒険記録を初期化します。\nほかのトレーニングの記録は消えません。\nよろしいですか？');
    if (!ok) return;
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { }
    data = defaultData(); challenge = null; setupAvatar = 4; settingsAvatar = 4;
    $('kdSetupName').value = '';
    renderSetupAvatars(); showScreen('kdSetupScreen'); showToast('初期化しました。新しい冒険を始めましょう。');
  }
  function setupEvents() {
    $('kdBackBtn').addEventListener('click', function(){ playDungeonSfx('click'); returnToMain(); });
    $('kdSettingsTopBtn').addEventListener('click', function () { if (data.profile) openSettings(); else showToast('先に名前とアバターを決めましょう。'); });
    $('kdBeginSetupBtn').addEventListener('click', function () {
      var name = ($('kdSetupName').value || '').trim().slice(0, 12) || '冒険者';
      data.profile = { name: name, avatar: setupAvatar };
      saveData(); renderHome(); showScreen('kdHomeScreen');
    });
    $('kdStartChallengeBtn').addEventListener('click', startChallenge);
    $('kdOpenSettingsBtn').addEventListener('click', openSettings);
    $('kdSaveSettingsBtn').addEventListener('click', saveProfileSettings);
    $('kdCancelSettingsBtn').addEventListener('click', function () { renderHome(); showScreen('kdHomeScreen'); });
    $('kdResetBtn').addEventListener('click', resetDungeon);
    $('kdShowHistoryBtn').addEventListener('click', function () { $('kdHistoryPanel').classList.toggle('kd-hidden'); });
    $('kdCloseHistoryBtn').addEventListener('click', function () { $('kdHistoryPanel').classList.add('kd-hidden'); });
    $('kdQuitChallengeBtn').addEventListener('click', function () {
      if (window.confirm('この冒険をいったん終了してホームに戻りますか？ 今回の経験値は、最後まで進んだときに加算されます。')) { challenge = null; renderHome(); showScreen('kdHomeScreen'); }
    });
    $('kdSpeakQuestionBtn').addEventListener('click', speakCurrentQuestion);
    $('kdHintBtn').addEventListener('click', function () { playDungeonSfx('hint'); $('kdHintText').classList.toggle('kd-hidden'); });
    $('kdInputForm').addEventListener('submit', function (event) { event.preventDefault(); submitAnswer($('kdAnswerInput').value); });
    $('kdNextQuestionBtn').addEventListener('click', function(){ playDungeonSfx('click'); nextQuestion(); });
    $('kdLevelUpCloseBtn').addEventListener('click', closeLevelUp);
    $('kdLevelUpOverlay').addEventListener('click', function (event) { if (event.target === $('kdLevelUpOverlay')) closeLevelUp(); });
    $('kdResultContinueBtn').addEventListener('click', function () { closeLevelUp(); renderHome(); showScreen('kdHomeScreen'); });
    $('kdResultAgainBtn').addEventListener('click', function () { closeLevelUp(); startChallenge(); });
    $('kdAnswerInput').addEventListener('keydown', function (event) { if (event.key === 'Enter') { event.preventDefault(); submitAnswer($('kdAnswerInput').value); } });
  }
  function boot() {
    renderSetupAvatars();
    setupEvents();
    if (data.profile) { renderHome(); showScreen('kdHomeScreen'); }
    else showScreen('kdSetupScreen');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
