/* ことばクエスト Ver.47
   脳トレと失語症トレーニングの実用性改善。答えを選択前に出さない。 */
(function(){
'use strict';
if (typeof QUESTIONS === 'undefined' || typeof renderQuestion !== 'function') return;
var $v = function(id){ return document.getElementById(id); };
function shuffleV(arr){ var a=arr.slice(); for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;} return a; }
function setActivityName(id, name, desc){
  [GENRES, TRAINING_CATEGORIES].forEach(function(groups){(groups||[]).forEach(function(group){(group.activities||[]).forEach(function(item){if(item[0]===id){item[1]=name;if(desc)item[2]=desc;}});});});
}
setActivityName('matching','文字・画像マッチング','文字を見て、名前のない絵カードから合う絵を選びます。');
setActivityName('anagram','文字並べ替え','ばらばらの文字タイルを押して、言葉を組み立てます。');
setActivityName('copy','写字・見写し','見本を見ながら、画面の用紙に指やマウスで実際に書きます。');
setActivityName('tf','○×・意味理解','文を読んで意味を考え、○か×を選びます。違っても正解はすぐに表示しません。');
setActivityName('gesture','身ぶり＋ことば','身ぶりや場面の絵を見て、相手に伝える言葉を4択で選びます。言葉を引き出す練習です。');
setActivityName('roleplay','生活の場面で伝える（4択）','買い物・病院・カフェなどの場面で、相手に伝える言葉を4択で選びます。');

// 絵・画像は画面に文字名を重ねず、文字と絵を対応させる課題に使います。
var MATCH_ITEMS = [
 ['りんご','images/matching/apple.svg','🍎'],['バナナ','images/matching/banana.svg','🍌'],['みかん','images/matching/mandarin.svg','🍊'],['コーヒー','images/matching/coffee.svg','☕'],['さくら','images/matching/sakura.svg','🌸'],['手洗い','images/matching/handwash.svg','🧼'],['ごはん','images/matching/rice.svg','🍚'],['おふろ','images/matching/bath.svg','🛁'],['晴れ','images/matching/sunny.svg','☀️'],['コップ','images/matching/cup.svg','🥛'],['タオル','images/matching/towel.svg','🧺'],['おさら','images/matching/plate.svg','🍽️'],
 ['えんぴつ','images/naming-10.svg','✏️'],['バス','images/naming-11.svg','🚌'],['くるま','images/naming-12.svg','🚗'],['くつ','images/naming-13.svg','👟'],['かさ','images/naming-14.svg','☂️'],['くま','images/naming-15.svg','🐻'],['ねこ','images/naming-16.svg','🐱'],['みず','images/naming-17.svg','💧'],['とけい','images/naming-18.svg','⏰'],['かばん','images/naming-19.svg','🎒'],['ほん','images/naming-20.svg','📗'],['いす','images/naming-21.svg','🪑'],['さくらんぼ','images/naming-22.svg','🍒'],['スマートフォン','images/naming-23.svg','📱'],['じてんしゃ','images/naming-24.svg','🚲'],['たまご','images/naming-25.svg','🥚'],['パン','images/naming-26.svg','🍞'],['せっけん','images/naming-28.svg','🧼'],['めがね','images/naming-29.svg','👓']
].map(function(x){return {label:x[0], image:x[1], emoji:x[2]};});
QUESTIONS.matching = MATCH_ITEMS.map(function(item){
 return {kind:'picture-match', question:'この文字に合う絵を選びましょう。', target:item.label, answer:item.label, image:item.image, emoji:item.emoji, hint:'文字をゆっくり見て、絵の形や使い道を思い浮かべましょう。'};
});

// 意味理解は答えを明かさない共通ヒントにし、30問を登録。
var TF_ITEMS = [
 ['バナナは食べ物です。','○'],['魚は空を飛びます。','×'],['雨の日に傘を使うことがあります。','○'],['電車は線路を走ります。','○'],['靴は手にはめて使います。','×'],['時計を見ると時間が分かります。','○'],['りんごは飲み物です。','×'],['歯みがきは歯をきれいにするためにします。','○'],['お風呂では体を洗うことがあります。','○'],['夏は毎日必ず雪が降ります。','×'],['病院では診察を受けることがあります。','○'],['椅子に座るときは、立ったまま座ります。','×'],['パンは食べ物です。','○'],['水は飲むことができます。','○'],['夜に会った人へのあいさつは、いつも「おはようございます」です。','×'],['駅には電車が来ることがあります。','○'],['手袋は手にはめて使います。','○'],['傘は雨を飲むための道具です。','×'],['食事をすると、おなかがいっぱいになることがあります。','○'],['電話を使って、離れた人と話すことができます。','○'],['はさみは紙を切るときに使います。','○'],['冷蔵庫は食べ物を温めるために使います。','×'],['信号が赤のときは、必ず進んでよいです。','×'],['薬は自分の判断で、いつも決められた量より多く飲みます。','×'],['台所は料理をする場所の一つです。','○'],['駅では改札や案内表示を見かけることがあります。','○'],['桜は一年中、必ず満開です。','×'],['すべての魚は海に住んでいます。','×'],['手を洗うときは水やせっけんを使うことがあります。','○'],['電話を切る前に、相手へあいさつをすることがあります。','○']
];
QUESTIONS.tf = TF_ITEMS.map(function(x,i){return {kind:'true-false', question:'文の内容を考えましょう。', prompt:x[0], statement:x[0], answer:x[1], hint:'文を最後まで読み、実際の生活や経験と照らし合わせましょう。', itemNo:i+1};});

// 文字並べ替え：見本の答えは表示せず、文字タイルから組み立てる。
var ANAGRAM_ITEMS = [
 ['りんご',['ご','り','ん'],'食べ物の名前です。'],['さくら',['ら','さ','く'],'花の名前です。'],['くるま',['ま','く','る'],'乗り物の名前です。'],['でんしゃ',['ゃ','で','し','ん'],'乗り物の名前です。'],['とけい',['い','と','け'],'時間を見る道具です。'],['みず',['ず','み'],'飲み物です。'],['はさみ',['み','は','さ'],'文房具の一つです。'],['かばん',['ん','か','ば'],'持ち物を入れるものです。'],['たまご',['ご','た','ま'],'料理に使う食材です。'],['かさ',['さ','か'],'雨の日に使います。'],['ほん',['ん','ほ'],'読んだり、見たりするものです。'],['めがね',['ね','め','が'],'目にかける道具です。'],['くつした',['た','く','し','つ'],'足にはくものです。'],['たまねぎ',['ぎ','た','ね','ま'],'野菜の名前です。'],['はみがき',['き','は','み','が'],'歯をきれいにする習慣です。'],['おにぎり',['り','お','ぎ','に'],'ごはんで作る食べ物です。'],['てぶくろ',['ろ','て','ぶ','く'],'寒い日に手にはめます。'],['かがみ',['み','か','が'],'自分の姿を映します。'],['しんぶん',['ん','し','ぶ','ん'],'ニュースなどが載っています。'],['つくえ',['え','つ','く'],'勉強や作業に使う家具です。'],['いちご',['ご','い','ち'],'赤い果物です。'],['ふとん',['ん','ふ','と'],'寝るときに使います。'],['とまと',['と','ま','と'],'赤い野菜・食材の一つです。'],['すいか',['か','す','い'],'夏に食べることの多い果物です。'],['おさら',['ら','お','さ'],'食事を盛りつけます。'],['すぷーん',['ー','す','ん','ぷ'],'食事に使う道具です。'],['はぶらし',['し','は','ら','ぶ'],'歯をみがく道具です。'],['えき',['き','え'],'電車に乗り降りする場所です。'],['やさい',['い','や','さ'],'畑などで育つ食べ物です。'],['としょかん',['ん','と','か','しょ'],'本を読んだり借りたりする場所です。']
];
QUESTIONS.anagram = ANAGRAM_ITEMS.map(function(x,i){return {kind:'anagram',question:'文字タイルを正しい順番に並べましょう。',answer:x[0],tokens:x[1],hint:'文字を一つずつ声に出して、言葉のまとまりを考えましょう。',itemNo:i+1};});

// 写字：見本を見ながら、マウス・指・タッチペンで実際に書きます。
var COPY_ITEMS = ['りんご','さくら','みず','ほん','くつ','かさ','ねこ','いぬ','かばん','でんしゃ','えんぴつ','ありがとう','おはよう','手を洗います','今日は晴れです。','水をください。','少し休みます。','手伝ってください。','明日、買い物に行きます。','今日はコーヒーを飲みます。','ゆっくり話してください。','もう一度お願いします。','ここに名前を書きます。','帰る時間を確認します。'];
QUESTIONS.copy = COPY_ITEMS.map(function(x,i){return {kind:'handwriting', question:'見本を見ながら、下の用紙に書いてみましょう。', prompt:x, answer:'書けました', hint:'一文字ずつ形を見比べながら、ゆっくり書いてみましょう。', itemNo:i+1};});

// ジェスチャー：動きをまねて自己申告するだけでなく、生活場面に合う伝え方を4択。
function optsV(answer, distractors){return shuffleV([answer].concat(distractors));}
var GESTURE_ITEMS = [
 {scene:'お店の商品がほしいです。商品を指さしながら、何と言いますか？',img:'images/scenes/shop.svg',emoji:'🛍️',a:'これをください',o:['これはいくらですか','袋をお願いします','少し考えます']},
 {scene:'相手にお礼を伝えます。軽くおじぎをするとき、言葉を添えるなら？',img:'images/scenes/conversation.svg',emoji:'🙏',a:'ありがとうございます',o:['すみません','お願いします','大丈夫です']},
 {scene:'トイレに行きたいです。トイレの表示を指さして、何と伝えますか？',img:'images/scenes/toilet.svg',emoji:'🚻',a:'トイレはどこですか',o:['出口はどこですか','手を洗う場所はどこですか','水をください']},
 {scene:'相手の言葉が聞き取れません。耳に手を当てて、何と伝えますか？',img:'images/scenes/conversation.svg',emoji:'👂',a:'もう一度言ってください',o:['ゆっくり話してください','文字で書いてください','もう一度見せてください']},
 {scene:'荷物が重くて困っています。手を差し出して、何と頼みますか？',img:'images/scenes/work.svg',emoji:'📦',a:'手伝ってください',o:['これを持ってください','少し待ってください','別のものをください']},
 {scene:'少し待ってほしいです。手のひらで合図をしながら、何と伝えますか？',img:'images/scenes/conversation.svg',emoji:'✋',a:'少し待ってください',o:['もう一度お願いします','ゆっくりお願いします','先にどうぞ']},
 {scene:'ひざが痛いです。痛い場所を指さしながら、何と伝えますか？',img:'images/scenes/hospital.svg',emoji:'🩹',a:'ここが痛いです',o:['気分が悪いです','ここがかゆいです','少し休みたいです']},
 {scene:'駅で行き先が分かりません。案内表示を指さしながら、何と頼みますか？',img:'images/scenes/transit.svg',emoji:'🚉',a:'行き方を教えてください',o:['駅まで何分ですか','出口はどこですか','切符売り場はどこですか']},
 {scene:'もう一度見たいです。相手に繰り返しの合図をして、何と伝えますか？',img:'images/scenes/conversation.svg',emoji:'🔁',a:'もう一度見せてください',o:['もう一度説明してください','ゆっくり話してください','文字で書いてください']},
 {scene:'話す速さをゆっくりにしてほしいです。手で合図をしながら、何と頼みますか？',img:'images/scenes/conversation.svg',emoji:'🐢',a:'ゆっくり話してください',o:['もう一度言ってください','文字で書いてください','少し大きな声でお願いします']},
 {scene:'話をいったん止めてほしいです。手のひらで合図をして何と伝えますか？',img:'images/scenes/work.svg',emoji:'✋',a:'ちょっと待ってください',o:['少し時間をください','あとでお願いします','今はできません']},
 {scene:'うなずく動作に言葉を添えて、相手に同意を伝えます。どの言葉が合いますか？',img:'images/scenes/conversation.svg',emoji:'🙂',a:'はい',o:['いいえ','分かりません','もう一度お願いします']},
 {scene:'首を横に振って断ります。言葉でも伝えるなら？',img:'images/scenes/conversation.svg',emoji:'🙅',a:'いいえ',o:['はい','ありがとうございます','お願いします']},
 {scene:'昼に知り合いに会いました。手を振りながら、何とあいさつしますか？',img:'images/scenes/conversation.svg',emoji:'👋',a:'こんにちは',o:['おはようございます','こんばんは','お疲れさまです']},
 {scene:'説明が分からず困っています。首をかしげて、何と伝えますか？',img:'images/scenes/conversation.svg',emoji:'❓',a:'よく分かりません',o:['もう一度教えてください','文字で書いてください','少し考えます']},
 {scene:'いくつかの商品から選びました。選んだ物を指さして何と伝えますか？',img:'images/scenes/shop.svg',emoji:'👉',a:'こちらにします',o:['少し考えます','値段を教えてください','これを見せてください']},
 {scene:'食事を注文します。メニューを指さしながら何と伝えますか？',img:'images/scenes/cafe.svg',emoji:'🍽️',a:'これをお願いします',o:['メニューを見せてください','水をください','おすすめはどれですか']},
 {scene:'座って休みたいです。椅子を指さしながら何と伝えますか？',img:'images/scenes/home.svg',emoji:'🪑',a:'少し休みたいです',o:['水をください','横になりたいです','今日は帰ります']},
 {scene:'もう一つほしいです。指を一本立てて何と伝えますか？',img:'images/scenes/cafe.svg',emoji:'☝️',a:'もう一つください',o:['あと一つお願いします','これで大丈夫です','もう少しください']},
 {scene:'相手にこちらへ来てほしいです。手招きをして何と伝えますか？',img:'images/scenes/conversation.svg',emoji:'🫴',a:'こちらに来てください',o:['あちらへ行ってください','こちらで待ってください','あとで来てください']}
];
QUESTIONS.gesture = GESTURE_ITEMS.map(function(x){return {kind:'four-choice',question:'身ぶりと一緒に使う言葉を選びましょう。',prompt:x.scene,scene:x.scene,sceneLabel:'場面のイラスト',image:x.img,emoji:x.emoji,answer:x.a,choices:optsV(x.a,x.o),hint:'誰に、何を伝えたい場面かを考えましょう。'};});

// 実生活ロールプレイ：模範文を見せず、実際の状況に合う返答を4択で練習。
var ROLEPLAY_ITEMS = [
 ['カフェで飲み物を注文します。','images/scenes/cafe.svg','コーヒーをください',['お水をください','お茶をください','お会計をお願いします']],
 ['お店で商品の値段を知りたいです。','images/scenes/shop.svg','これはいくらですか',['これをください','袋をお願いします','カードは使えますか']],
 ['病院の受付に来ました。診察を受けることを最初に伝えます。','images/scenes/hospital.svg','診察に来ました',['予約しています','薬の説明をお願いします','頭が痛いです']],
 ['外出中にトイレに行きたくなりました。場所を尋ねます。','images/scenes/toilet.svg','トイレはどこですか',['出口はどこですか','手を洗う場所はどこですか','駅はどこですか']],
 ['頭が痛くて、スタッフに状態を伝えます。','images/scenes/hospital.svg','頭が痛いです',['お腹が痛いです','気分が悪いです','少し休みたいです']],
 ['相手の説明が聞き取れませんでした。','images/scenes/conversation.svg','もう一度説明してください',['ゆっくり話してください','文字で書いてください','もう少し大きな声でお願いします']],
 ['説明より文字を見たほうが分かりやすいです。','images/scenes/work.svg','文字で書いてください',['ゆっくり話してください','声を大きくしてください','もう一度説明してください']],
 ['重い荷物を運ぶのが難しく、助けが必要です。','images/scenes/work.svg','手伝ってください',['これを持ってください','少し待ってください','ゆっくりお願いします']],
 ['作業を続けて疲れました。休みたいです。','images/scenes/work.svg','少し休みたいです',['今日は早く帰りたいです','水を飲みたいです','続けても大丈夫です']],
 ['店員さんに商品をすすめられましたが、必要ありません。','images/scenes/shop.svg','いりません',['少し考えます','これをください','値段を教えてください']],
 ['食事のときに水がほしいです。','images/scenes/cafe.svg','水をください',['お茶をください','メニューを見せてください','お会計をお願いします']],
 ['レストランでメニューの商品を注文します。','images/scenes/cafe.svg','これをお願いします',['これはいくらですか','メニューを見せてください','お水をください']],
 ['食事が終わり、支払いをしたいです。','images/scenes/cafe.svg','お会計をお願いします',['レシートをください','カードで払えますか','メニューをお願いします']],
 ['約束の時間に少し遅れそうです。相手へ連絡します。','images/scenes/conversation.svg','少し遅れます',['あと5分で着きます','予定を変更したいです','今日は行けません']],
 ['朝、事業所で人に会いました。あいさつをします。','images/scenes/work.svg','おはようございます',['こんにちは','お疲れさまです','よろしくお願いします']],
 ['相手が手伝ってくれました。お礼を伝えます。','images/scenes/conversation.svg','ありがとうございます',['すみません','お願いします','大丈夫です']],
 ['駅でトイレの場所を知りたいです。駅員さんに尋ねます。','images/scenes/transit.svg','トイレはどこですか',['駅員さんはどこですか','トイレは何階ですか','切符売り場はどこですか']],
 ['道に迷って駅までの行き方を知りたいです。','images/scenes/transit.svg','駅はどこですか',['駅まで何分ですか','道を教えてください','ここはどこですか']],
 ['買い物袋が必要です。店員さんに伝えます。','images/scenes/shop.svg','袋をお願いします',['レジ袋はありますか','袋は有料ですか','袋は大丈夫です']],
 ['パソコンの操作が分からず、職員に助けを頼みます。','images/scenes/work.svg','パソコンの操作を教えてください',['この画面を見てください','もう一度やり方を教えてください','少し待ってください']],
 ['相手が早口で、話を追いにくいです。','images/scenes/conversation.svg','ゆっくり話してください',['もう一度言ってください','文字で書いてください','声を大きくしてください']],
 ['家族に今日の予定を聞かれました。今日は買い物に行く予定です。','images/scenes/home.svg','今日は買い物に行きます',['今日は家で過ごします','今日は事業所に行きます','今日は病院に行きます']],
 ['家で部屋を明るくしたいです。','images/scenes/home.svg','電気をつけてください',['電気を消してください','カーテンを開けてください','電気がつきません']],
 ['薬局で薬の説明をお願いしたいです。','images/scenes/hospital.svg','薬の説明をお願いします',['飲み方を教えてください','薬はいつ飲みますか','副作用を教えてください']],
 ['駅で電車の乗り場を確認したいです。','images/scenes/transit.svg','何番線ですか',['電車は何時に来ますか','この電車はどこ行きですか','切符はどこで買いますか']],
 ['聞き取れないところがあり、ゆっくり言ってほしいです。','images/scenes/conversation.svg','ゆっくり話してください',['もう一度言ってください','文字で書いてください','声を大きくしてください']],
 ['作業のやり方が分からず、確認したいです。','images/scenes/work.svg','やり方をもう一度教えてください',['見本を見せてください','手順を書いてください','一緒にやってください']],
 ['自分ではできるので、手伝いは必要ないと伝えます。','images/scenes/work.svg','自分でできます',['見守っていてください','必要なときにお願いします','少しだけ手伝ってください']],
 ['体調が悪く、今日は早く帰りたいです。','images/scenes/home.svg','体調が悪いので帰りたいです',['少し休んでから続けたいです','具合が悪いです','病院に行きたいです']],
 ['予約した時間に病院へ来ました。受付に伝えます。','images/scenes/hospital.svg','予約しています',['受付はどこですか','保険証はこちらです','診察券を忘れました']]
];
QUESTIONS.roleplay = ROLEPLAY_ITEMS.map(function(x){var a=x[2];return {kind:'four-choice',question:'場面を見て、相手に伝える言葉を選びましょう。',prompt:x[0],scene:x[0],sceneLabel:'実生活ロールプレイ',image:x[1],answer:a,choices:optsV(a,x[3]),hint:'今の場面で、相手に一番伝えたいことを考えましょう。'};});

// ---------------------------------------
// UI helpers and accessible answer handling
// ---------------------------------------
var V47_IDS = ['matching','anagram','copy','tf','gesture','roleplay'];
// 実生活ロールプレイは「最初の回答」で正答率を計算します。
var roleplayAnswered = 0;
var roleplayWrong = 0;
var roleplayAdvanceTimer = null;
function el(tag, cls, text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function btn(text, cls, click){var b=el('button',cls,text);b.type='button';b.addEventListener('click',click);return b;}
function core(q, title, kind){
 answered=false;
 var prog=$v('progress');if(prog)prog.textContent=(current+1)+' / '+questions.length;updateScoreV47(kind);
 var cat=$v('categoryLabel');if(cat)cat.textContent=selectedCategory?selectedCategory.name:(kind==='matching'||kind==='anagram'||kind==='copy'||kind==='tf'?'脳トレ':'失語症のトレーニング');
 if($v('questionLabel'))$v('questionLabel').textContent=title||q.question||'問題';
 if($v('trainingTitle'))$v('trainingTitle').textContent=(selectedCategory?selectedCategory.name:'トレーニング')+'｜'+({matching:'文字・画像マッチング',anagram:'文字並べ替え',copy:'写字・見写し',tf:'○×・意味理解',gesture:'身ぶり＋ことば',roleplay:'生活の場面で伝える（4択）'}[selectedActivity]||'練習');
 var visual=$v('visualArea');if(visual)visual.classList.add('hidden');
 var prompt=$v('promptText');if(prompt){prompt.textContent='';prompt.classList.add('hidden');}
 var ins=$v('instruction');if(ins)ins.classList.add('hidden');
 var hint=$v('hint');if(hint){hint.textContent=q.hint||'';hint.classList.add('hidden');}
 var hb=$v('hintBtn');if(hb){hb.classList.toggle('hidden',!hintEnabled||!q.hint);hb.textContent='💡 ヒント';}
 var sb=$v('speakBtn');if(sb)sb.textContent='🔊 問題を聞く';
 var area=$v('answerArea');if(area){area.innerHTML='';area.className='answer-area v47-answer-area';}
 var fb=$v('feedback');if(fb){fb.textContent='';fb.className='feedback';}
 var next=$v('nextBtn');if(next){next.classList.add('hidden');next.textContent='次へ →';}
 if($v('game'))$v('game').classList.remove('aphasia-clear-mode-active');document.body.classList.remove('aphasia-clear-mode-active');
 return area;
}
function updateScoreV47(kind){
 var scr=$v('score');if(!scr)return;
 if(selectedActivity==='roleplay'){
  var rate=roleplayAnswered?Math.round(score/roleplayAnswered*100):0;
  scr.textContent='正解 '+score+'/'+roleplayAnswered+(roleplayAnswered?'・'+rate+'%':'・—');
  scr.title='回答した問題の正答率。正解 '+score+'問、不正解 '+roleplayWrong+'問';
  scr.setAttribute('aria-label','正解 '+score+'問、回答 '+roleplayAnswered+'問、正答率 '+(roleplayAnswered?rate+'%':'まだ回答なし'));
  return;
 }
 scr.textContent=(kind==='copy'?'練習 ':'正解 ')+score;
}
function completeCorrectV47(button, message, kind){
 if(answered)return;answered=true;
 if(selectedActivity==='roleplay')roleplayAnswered++;
 score++;updateScoreV47(kind);if(button)button.classList.add('v47-correct');
 var fb=$v('feedback');if(fb){fb.textContent='正解です。できました。'+(message && message.indexOf('正解です。できました。')<0?' '+message:'');fb.className='feedback ok';}
 if(typeof playCorrectSound==='function')playCorrectSound();
 if(typeof announceCorrect==='function')announceCorrect();
 document.querySelectorAll('.v47-option-button,.v47-picture-button,.v47-token,.tf-choice').forEach(function(b){b.disabled=true;});
 var next=$v('nextBtn');if(next)next.classList.remove('hidden');
}
function wrongNoRevealV47(button, msg){
 if(answered)return;
 if(button){button.classList.add('v47-wrong');button.disabled=true;}
 answered=true;
 if(selectedActivity==='roleplay'){roleplayAnswered++;roleplayWrong++;updateScoreV47('roleplay');}
 document.querySelectorAll('.v47-option-button,.v47-picture-button,.v47-token,.tf-choice').forEach(function(b){b.disabled=true;});
 var fb=$v('feedback');
 var text=msg||'不正解です。次の問題へ進みます。';
 if(fb){fb.textContent='不正解です。'+(text.indexOf('不正解です')===0?text.substring('不正解です'.length).replace(/^。?/, '。'):' '+text)+' 次の問題へ進みます。';fb.className='feedback ng';}
 if(typeof playWrongSound==='function')playWrongSound();
 if(roleplayAdvanceTimer)clearTimeout(roleplayAdvanceTimer);
 var questionAtAnswer=current;
 roleplayAdvanceTimer=setTimeout(function(){
  roleplayAdvanceTimer=null;
  var game=$v('game');
  if(current===questionAtAnswer && game && game.classList.contains('active') && typeof nextQuestion==='function')nextQuestion();
 },1400);
}
function renderFourChoiceV47(q, mode){
 var area=core(q,q.question,'choice');if(!area)return;
 var wrap=el('div','v47-task-panel v47-scenario-panel');
 var top=el('div','v47-scene-top');
 if(q.image){var im=el('img','v47-scene-image');im.src=q.image;im.alt=q.sceneLabel||'場面のイラスト';im.onerror=function(){this.style.display='none';};top.appendChild(im);}
 else if(q.emoji)top.appendChild(el('div','v47-scene-emoji',q.emoji));
 top.appendChild(el('div','v47-scene-prompt',q.prompt||q.scene||''));wrap.appendChild(top);
 wrap.appendChild(el('p','v47-short-instruction',mode==='gesture'?'身ぶりと一緒に使う言葉を選びましょう。':'相手に伝える言葉を4つから選びましょう。'));
 var grid=el('div','v47-four-grid');shuffleV(q.choices||[]).forEach(function(choice){var b=btn(choice,'v47-option-button',function(){if(answered)return;if(choice===q.answer)completeCorrectV47(b,'⭕ いい選択です！',null);else wrongNoRevealV47(b,'もう一度、場面を考えてみましょう。正解はまだ表示しません。');});grid.appendChild(b);});wrap.appendChild(grid);
 area.appendChild(wrap);
}
function renderMatchingV47(q){
 var area=core(q,'文字に合う絵を選びましょう。','match');var wrap=el('div','v47-task-panel');
 wrap.appendChild(el('p','v47-mode-instruction','この文字と同じものの絵を、下から1つ選んでください。'));
 wrap.appendChild(el('div','v47-match-target',q.target));
 var grid=el('div','v47-picture-grid');var options=shuffleV([MATCH_ITEMS.find(function(x){return x.label===q.target;} )].concat(shuffleV(MATCH_ITEMS.filter(function(x){return x.label!==q.target;})).slice(0,3)));
 options.forEach(function(item,index){var b=btn('','v47-picture-button',function(){if(answered)return;if(item.label===q.target)completeCorrectV47(b,'⭕ 合う絵を選べました！');else wrongNoRevealV47(b,'この絵ではないようです。ほかの絵も見てみましょう。');});b.setAttribute('aria-label','絵カード '+(index+1));var im=el('img','v47-picture-img');im.src=item.image;im.alt='';im.onerror=function(){this.style.display='none';b.appendChild(el('span','v47-picture-fallback',item.emoji));};b.appendChild(im);grid.appendChild(b);});wrap.appendChild(grid);area.appendChild(wrap);
}
function renderTrueFalseV47(q){
 // ○×問題は、アプリ共通の問題文エリアと回答ボタンを使います。
 // 独自の入れ子カードをなくし、既存のトレーニング画面と同じ見た目に戻します。
 var area=core(q,'文の内容が正しいか答えましょう。','tf');
 if(!area)return;
 var statement=$v('promptText');
 if(statement){statement.textContent=q.statement||q.prompt||'';statement.classList.remove('hidden');}
 var instruction=el('p','tf-question-instruction','この文は正しいですか？');
 area.appendChild(instruction);
 var grid=el('div','choices tf-choice-grid');
 [['○　あっている','○'],['×　ちがう','×']].forEach(function(pair,index){
  var b=btn(pair[0],'choice tf-choice '+(index===0?'tf-choice-true':'tf-choice-false'),function(){
   if(answered)return;
   if(pair[1]===q.answer)completeCorrectV47(b,'判断できました！');
   else wrongNoRevealV47(b,'もう一度考えてみましょう。文の意味を確認してください。');
  });
  b.setAttribute('aria-label',pair[0]);
  grid.appendChild(b);
 });
 area.appendChild(grid);
}
function renderAnagramV47(q){
 var area=core(q,'ばらばらの文字を並べましょう。','anagram');var wrap=el('div','v47-task-panel v47-anagram-panel');wrap.appendChild(el('p','v47-mode-instruction','文字を1つずつ押して、上の枠に言葉を作ります。'));
 var answerLine=el('div','v47-built-word','ここに並びます');answerLine.setAttribute('aria-live','polite');var tokenGrid=el('div','v47-token-grid');var status=el('p','v47-status','');status.setAttribute('aria-live','polite');var chosen=[];var tokens=shuffleV(q.tokens||[]);
 function redraw(){answerLine.innerHTML='';if(!chosen.length){answerLine.textContent='ここに並びます';return;}chosen.forEach(function(x,i){var b=btn(x.ch,'v47-picked-token',function(){if(answered)return;var found=chosen.splice(i,1)[0];var source=tokenGrid.querySelector('[data-token-id="'+found.id+'"]');if(source)source.disabled=false;redraw();});answerLine.appendChild(b);});}
 tokens.forEach(function(t,i){var b=btn(t,'v47-token',function(){if(answered||b.disabled)return;chosen.push({ch:t,id:i});b.disabled=true;redraw();status.textContent='選んだ文字は '+chosen.length+' 文字です。';});b.dataset.tokenId=String(i);tokenGrid.appendChild(b);});
 var actions=el('div','v47-action-row');actions.appendChild(btn('1つ戻す','v47-secondary-button',function(){if(answered||!chosen.length)return;var x=chosen.pop();var source=tokenGrid.querySelector('[data-token-id="'+x.id+'"]');if(source)source.disabled=false;redraw();}));actions.appendChild(btn('やり直す','v47-secondary-button',function(){if(answered)return;chosen=[];tokenGrid.querySelectorAll('button').forEach(function(b){b.disabled=false;});redraw();status.textContent='最初から並べられます。';}));actions.appendChild(btn('答え合わせ','v47-primary-button',function(){if(answered)return;if(chosen.length!==tokens.length){status.textContent='すべての文字を使ってください。';return;}var built=chosen.map(function(x){return x.ch;}).join('');if(built===q.answer)completeCorrectV47(null,'⭕ 言葉を組み立てられました！');else{wrongNoRevealV47(null,'文字の順番が違うようです。次の問題へ進みます。');}}));
 wrap.append(answerLine,tokenGrid,actions,status);area.appendChild(wrap);
}
function renderCopyV47(q){
 var area=core(q,'見本を見ながら、実際に書いてみましょう。','copy');
 var wrap=el('div','v47-task-panel v47-copy-panel');
 wrap.appendChild(el('p','v47-mode-instruction','上の見本を見て、下の用紙に指・タッチペン・マウスで書いてください。書くモードと消しゴムモードを切り替えられます。'));
 wrap.appendChild(el('div','v47-copy-model-label','見本'));
 wrap.appendChild(el('div','v47-copy-model',q.prompt||''));
 var canvas=el('canvas','v47-writing-canvas');canvas.width=1100;canvas.height=350;canvas.setAttribute('aria-label','文字を書く用紙');canvas.setAttribute('role','img');canvas.style.touchAction='none';wrap.appendChild(canvas);
 var ctx=canvas.getContext('2d'), drawing=false, hasStroke=false, last=null, activeStroke=null, mode='draw', strokes=[];
 function drawGrid(){
  ctx.strokeStyle='#e0e8ef';ctx.lineWidth=2;
  for(var y=70;y<canvas.height;y+=90){ctx.beginPath();ctx.moveTo(24,y);ctx.lineTo(canvas.width-24,y);ctx.stroke();}
  ctx.strokeStyle='#8cb7d9';ctx.lineWidth=2;ctx.setLineDash([8,8]);ctx.beginPath();ctx.moveTo(24,canvas.height/2);ctx.lineTo(canvas.width-24,canvas.height/2);ctx.stroke();ctx.setLineDash([]);
 }
 function paint(){
  ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
  // 罫線は先に描き、書いた線が罫線に埋もれないようにする。
  drawGrid();
  strokes.forEach(function(st){
   if(!st.points.length)return;
   ctx.save();ctx.strokeStyle=st.mode==='erase'?'#fff':'#174d85';ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=st.mode==='erase'?36:7;ctx.lineCap='round';ctx.lineJoin='round';
   if(st.points.length===1){ctx.beginPath();ctx.arc(st.points[0].x,st.points[0].y,ctx.lineWidth/2,0,Math.PI*2);ctx.fill();}
   else{ctx.beginPath();ctx.moveTo(st.points[0].x,st.points[0].y);for(var i=1;i<st.points.length;i++)ctx.lineTo(st.points[i].x,st.points[i].y);ctx.stroke();}
   ctx.restore();
  });
 }
 function updateAvailability(){hasStroke=strokes.some(function(st){return st.mode==='draw' && st.points.length>0;});done.disabled=!hasStroke;wrong.disabled=!hasStroke;undo.disabled=!strokes.length;}
 function pos(e){var r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*canvas.width,y:(e.clientY-r.top)/r.height*canvas.height};}
 function toggleMode(next){mode=next;drawMode.classList.toggle('active',mode==='draw');eraseMode.classList.toggle('active',mode==='erase');drawMode.setAttribute('aria-pressed',String(mode==='draw'));eraseMode.setAttribute('aria-pressed',String(mode==='erase'));status.textContent=mode==='draw'?'書くモードです。用紙に書いてください。':'消しゴムモードです。消したい線をなぞってください。';}
 canvas.addEventListener('pointerdown',function(e){if(answered)return;e.preventDefault();drawing=true;last=pos(e);activeStroke={mode:mode,points:[last]};strokes.push(activeStroke);try{canvas.setPointerCapture(e.pointerId);}catch(err){}paint();updateAvailability();});
 canvas.addEventListener('pointermove',function(e){if(!drawing||!activeStroke)return;e.preventDefault();last=pos(e);activeStroke.points.push(last);paint();updateAvailability();});
 function end(){drawing=false;last=null;activeStroke=null;paint();updateAvailability();}
 canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('pointerleave',function(){if(drawing)end();});
 var toolbar=el('div','v47-action-row v47-writing-toolbar');
 var drawMode=btn('✍️ 書くモード','v47-secondary-button active',function(){if(!answered)toggleMode('draw');});drawMode.setAttribute('aria-pressed','true');
 var eraseMode=btn('🧽 消しゴムモード','v47-secondary-button',function(){if(!answered)toggleMode('erase');});eraseMode.setAttribute('aria-pressed','false');
 var undo=btn('↶ 1手戻す','v47-secondary-button',function(){if(answered||!strokes.length)return;strokes.pop();paint();updateAvailability();status.textContent='直前の線を戻しました。';});
 var clear=btn('全部消す','v47-secondary-button',function(){if(answered)return;strokes=[];paint();updateAvailability();status.textContent='用紙を消しました。もう一度書けます。';});
 toolbar.append(drawMode,eraseMode,undo,clear);
 var done=btn('できました → 次の問題へ','v47-primary-button',function(){if(answered||!hasStroke)return;completeCorrectV47(null,'書く練習を記録しました。次の言葉に進みましょう。','copy');});
 var wrong=btn('うまく書けなかった（復習して次へ）','v47-secondary-button',function(){if(answered||!hasStroke)return;wrongNoRevealV47(null,'書いた文字を復習して次の問題へ進みます。');});
 done.disabled=true;wrong.disabled=true;
 var actions=el('div','v47-action-row');actions.append(done,wrong);
 var status=el('p','v47-status','書き始めると「できました」または「復習して次へ」を選べます。');
 wrap.append(toolbar,actions,status);area.appendChild(wrap);paint();updateAvailability();
}

var oldStartActivityV47=startActivity;
startActivity=function(activityId){
 if(roleplayAdvanceTimer){clearTimeout(roleplayAdvanceTimer);roleplayAdvanceTimer=null;}
 roleplayAnswered=0;roleplayWrong=0;
 return oldStartActivityV47.apply(this,arguments);
};
var oldRenderQuestionV47=renderQuestion;
renderQuestion=function(){
 if(V47_IDS.indexOf(selectedActivity)<0){oldRenderQuestionV47();return;}
 var q=questions[current];if(!q)return;
 if(selectedActivity==='matching')renderMatchingV47(q);
 else if(selectedActivity==='tf')renderTrueFalseV47(q);
 else if(selectedActivity==='anagram')renderAnagramV47(q);
 else if(selectedActivity==='copy')renderCopyV47(q);
 else renderFourChoiceV47(q,selectedActivity);
};
var oldSpeakQuestionV47=speakQuestion;
speakQuestion=function(){var q=questions[current];if(!q)return;
 if(selectedActivity==='matching'){speak('文字は、'+q.target+'。この文字に合う絵を選びましょう。');return;}
 if(selectedActivity==='anagram'){speak('ばらばらの文字を正しい順番に並べましょう。');return;}
 if(selectedActivity==='copy'){speak('見本を見ながら、実際に書いてみましょう。'+(q.prompt||''));return;}
 if(selectedActivity==='tf'){speak('文を読んで、正しいかどうか考えましょう。'+(q.statement||q.prompt||''));return;}
 if(selectedActivity==='gesture'||selectedActivity==='roleplay'){speak((q.prompt||q.scene||'')+'。'+(selectedActivity==='gesture'?'身ぶりと一緒に使う言葉を選びましょう。':'相手に伝える言葉を4つから選びましょう。'));return;}
 oldSpeakQuestionV47();
};
var oldShowHintV47=showHint;
showHint=function(){
 if(V47_IDS.indexOf(selectedActivity)>=0){var q=questions[current];if(!q||!q.hint)return;var h=$v('hint');if(h){h.textContent=q.hint;h.classList.remove('hidden');}if(voiceEnabled)speak('ヒント。'+q.hint);if(typeof playButtonSound==='function')playButtonSound();return;}
 oldShowHintV47();
};
var sb=$v('speakBtn');if(sb){sb.removeEventListener('click',oldSpeakQuestionV47);sb.addEventListener('click',speakQuestion);}
var hb=$v('hintBtn');if(hb){hb.removeEventListener('click',oldShowHintV47);hb.addEventListener('click',showHint);}
// BGMなどを画面から離れた後に残さない。非表示になったら音楽設定もOFFへ。
function stopPageAudio(){
 var a=$v('bgmAudio');if(a){try{a.pause();a.currentTime=0;}catch(e){}}
 try{if(window.speechSynthesis)window.speechSynthesis.cancel();}catch(e){}
 try{if(window.__appAudio && window.__appAudio.state==='running')window.__appAudio.suspend();}catch(e){}
}
window.addEventListener('pagehide',stopPageAudio);
window.addEventListener('beforeunload',stopPageAudio);
document.addEventListener('visibilitychange',function(){if(document.hidden){stopPageAudio();var enteringDungeon=false;try{enteringDungeon=sessionStorage.getItem('kotobaquest_entering_dungeon')==='1';}catch(e){}if(!enteringDungeon){try{localStorage.setItem('kotobaquest_music_v3','0');}catch(e){}var b=$v('musicMiniBtn');if(b){b.textContent='OFF';b.classList.add('off');}}}});
})();
