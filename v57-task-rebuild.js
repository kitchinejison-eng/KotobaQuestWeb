/* ことばクエスト V57｜対象課題の操作・UI再構成 */
(function(){
'use strict';
var $=function(id){return document.getElementById(id);};
var autoNextTimer=null;
var activityNames={fill:'穴埋め・自動言動',listen:'聴覚的指差し・選択',instruction:'聴覚的指示',board:'コミュニケーションボード'};
var pictureMap={
 'りんご':['images/matching/apple.svg','🍎'],'林檎':['images/matching/apple.svg','🍎'],
 'バナナ':['images/matching/banana.svg','🍌'],'みかん':['images/matching/mandarin.svg','🍊'],'蜜柑':['images/matching/mandarin.svg','🍊'],
 'コーヒー':['images/matching/coffee.svg','☕'],'さくら':['images/matching/sakura.svg','🌸'],'手洗い':['images/matching/handwash.svg','🧼'],
 'ごはん':['images/matching/rice.svg','🍚'],'おふろ':['images/matching/bath.svg','🛁'],'晴れ':['images/matching/sunny.svg','☀️'],
 'コップ':['images/matching/cup.svg','🥛'],'タオル':['images/matching/towel.svg','🧺'],'おさら':['images/matching/plate.svg','🍽️'],
 'えんぴつ':['images/naming-10.svg','✏️'],'バス':['images/naming-11.svg','🚌'],'でんしゃ':[null,'🚃'],
 'くるま':['images/naming-12.svg','🚗'],'くつ':['images/naming-13.svg','👟'],'かさ':['images/naming-14.svg','☂️'],
 'いぬ':['images/naming-15.svg','🐶'],'くま':['images/naming-15.svg','🐻'],'ねこ':['images/naming-16.svg','🐱'],
 'みず':['images/naming-17.svg','💧'],'とけい':['images/naming-18.svg','⏰'],'かばん':['images/naming-19.svg','🎒'],
 'ほん':['images/naming-20.svg','📗'],'いす':['images/naming-21.svg','🪑'],'さくらんぼ':['images/naming-22.svg','🍒'],
 'スマートフォン':['images/naming-23.svg','📱'],'じてんしゃ':['images/naming-24.svg','🚲'],'たまご':['images/naming-25.svg','🥚'],
 'パン':['images/naming-26.svg','🍞'],'せっけん':['images/naming-28.svg','🧼'],'めがね':['images/naming-29.svg','👓'],
 'ひこうき':[null,'✈️'],'ふね':[null,'🚢'],'ぶどう':[null,'🍇']
};
var actionIcons={'手をあげる':'🙋','目を閉じる':'😌','立ち上がる':'🧍','座る':'🪑','ペンを持つ':'✏️','ペンを置く':'🖊️','ペンを投げる':'🎯','本を閉じる':'📕','歩く':'🚶','走る':'🏃'};
function node(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=String(text);return e;}
function button(text,cls,fn){var b=node('button',cls,text);b.type='button';b.addEventListener('click',fn);return b;}
function setScore(){var n=$('score');if(n)n.textContent='正解 '+window.score;}
function resetFrame(q){
 if(autoNextTimer){clearTimeout(autoNextTimer);autoNextTimer=null;}
 window.answered=false;
 var game=$('game');if(game)game.classList.remove('aphasia-clear-mode-active');document.body.classList.remove('aphasia-clear-mode-active');
 var visual=$('visualArea'),img=$('questionImage'),emoji=$('emoji');
 if(visual){visual.classList.add('hidden');visual.classList.remove('aphasia-mode-visual','voice-read-hide-default-visual');}
 if(img){img.classList.add('hidden');img.removeAttribute('src');img.onload=null;img.onerror=null;}
 if(emoji){emoji.classList.remove('hidden');emoji.textContent='❓';}
 var title=$('trainingTitle');if(title){var cat=(window.selectedCategory&&window.selectedCategory.name)||(window.selectedGenre&&window.selectedGenre.name)||'トレーニング';title.textContent=cat+'｜'+(activityNames[window.selectedActivity]||window.selectedActivity||'練習');}
 var category=$('categoryLabel');if(category)category.textContent=(window.selectedCategory&&window.selectedCategory.name)||(window.selectedGenre&&window.selectedGenre.name)||'トレーニング';
 var label=$('questionLabel');if(label)label.textContent=q.question||'問題';
 var prog=$('progress');if(prog)prog.textContent=(window.current+1)+' / '+window.questions.length;
 setScore();
 var prompt=$('promptText');if(prompt){prompt.textContent='';prompt.classList.add('hidden');}
 var ins=$('instruction');if(ins){ins.textContent='';ins.classList.add('hidden');}
 var hint=$('hint');if(hint){hint.textContent=q.hint||'';hint.classList.add('hidden');}
 var hintBtn=$('hintBtn');if(hintBtn){hintBtn.textContent='💡 ヒント';hintBtn.classList.toggle('hidden',!(window.hintEnabled&&q.hint));}
 var speakBtn=$('speakBtn');if(speakBtn)speakBtn.textContent='🔊 お手本を聞く';
 var feedback=$('feedback');if(feedback){feedback.textContent='';feedback.className='feedback';}
 var next=$('nextBtn');if(next){next.classList.add('hidden');next.textContent='次へ →';}
 var voiceStatus=$('voiceStatus');if(voiceStatus)voiceStatus.textContent='';
 var area=$('answerArea');if(area){area.innerHTML='';area.className='answer-area v57-answer-area';}
}
function panel(intro){var p=node('section','v57-task-panel');if(intro){var lead=node('p','v57-task-intro',intro);p.appendChild(lead);}return p;}
function correct(btn,message){if(window.answered)return;window.answered=true;window.score++;setScore();if(btn)btn.classList.add('v57-correct');
 var fb=$('feedback');if(fb){fb.textContent='正解です。できました。'+(message?' '+message:'');fb.className='feedback ok';}
 if(typeof window.playCorrectSound==='function')window.playCorrectSound();if(typeof window.announceCorrect==='function')window.announceCorrect();
 disableTaskButtons();var next=$('nextBtn');if(next)next.classList.remove('hidden');}
function wrong(btn,message){if(window.answered)return;window.answered=true;if(btn)btn.classList.add('v57-wrong');
 var fb=$('feedback');if(fb){fb.textContent='不正解です。'+(message||'次の問題へ進みます。');fb.className='feedback ng';}
 disableTaskButtons();if(typeof window.playWrongSound==='function')window.playWrongSound();
 var at=window.current;autoNextTimer=setTimeout(function(){autoNextTimer=null;if(window.current===at&&typeof window.nextQuestion==='function')window.nextQuestion();},1450);}
function disableTaskButtons(){var area=$('answerArea');if(!area)return;area.querySelectorAll('button').forEach(function(b){b.disabled=true;});}
function choiceGrid(cls){return node('div',cls||'v57-choice-grid');}
function textChoice(choice,onAnswer){var b=button(choice,'v57-text-choice',function(){onAnswer(b,choice);});b.setAttribute('aria-label',choice);return b;}
function hero(q){var box=node('div','v57-hero');if(q.image){var image=node('img','v57-hero-image');image.alt='';image.style.display='none';var fallback=node('div','v57-hero-fallback',q.emoji||'🖼️');image.onload=function(){image.style.display='block';fallback.style.display='none';};image.onerror=function(){image.style.display='none';fallback.style.display='grid';};box.append(image,fallback);image.src=q.image;}else if(q.emoji){box.appendChild(node('div','v57-hero-fallback',q.emoji));}return box;}
function addImageChoice(grid,choice,onAnswer,showLabel){var info=pictureMap[choice]||[null,'🔎'];var b=button('','v57-picture-choice',function(){onAnswer(b,choice);});b.setAttribute('aria-label',choice);var art=node('div','v57-picture-art');var fallback=node('span','v57-picture-fallback',info[1]);art.appendChild(fallback);if(info[0]){var im=node('img','v57-picture-choice-img');im.alt='';im.style.display='none';im.onload=function(){im.style.display='block';fallback.style.display='none';};im.onerror=function(){im.style.display='none';fallback.style.display='inline-flex';};im.src=info[0];art.appendChild(im);}b.appendChild(art);if(showLabel)b.appendChild(node('span','v57-picture-choice-label',choice));grid.appendChild(b);return b;}
function renderFill(q){resetFrame(q);var p=panel('文の空いているところに入る言葉を選びましょう。');var h=hero(q);if(h.childNodes.length)p.appendChild(h);var prompt=node('div','v57-fill-prompt',q.prompt||q.question||'');p.appendChild(prompt);var grid=choiceGrid('v57-choice-grid');(q.choices||[]).forEach(function(c){grid.appendChild(textChoice(c,function(b,val){if(val===q.answer)correct(b,'文を完成できました。');else wrong(b,'次の問題へ進みます。');}));});p.appendChild(grid);$('answerArea').appendChild(p);}
function speakText(text){if(typeof window.speak==='function')window.speak(text);}
function repeatAudio(text,label){return button('🔊　'+(label||'もう一度聞く'),'v57-repeat-audio',function(){speakText(text);});}
function renderListen(q){resetFrame(q);var word=q.voiceText||q.answer;var p=panel('音声を聞いて、合う絵のカードを選びましょう。文字の名前は表示しません。');p.appendChild(repeatAudio(word,'ことばをもう一度聞く'));var grid=choiceGrid('v57-picture-grid');(q.choices||[]).forEach(function(c){addImageChoice(grid,c,function(b,val){if(val===q.answer)correct(b,'聞いた言葉に合う絵を選べました。');else wrong(b,'次の問題へ進みます。');},false);});p.appendChild(grid);$('answerArea').appendChild(p);if(window.voiceEnabled)setTimeout(function(){if(window.selectedActivity==='listen'&&!window.answered)speakText(word);},380);}
function renderInstruction(q){resetFrame(q);var target=q.voiceText||q.answer;var p=panel('指示を音声で聞いて、合う動作を選びましょう。画面には正解の指示文を表示しません。');p.appendChild(repeatAudio(target,'指示をもう一度聞く'));var grid=choiceGrid('v57-action-choice-grid');(q.choices||[]).forEach(function(c){var b=button('','v57-action-choice',function(){if(c===q.answer)correct(b,'聞いた指示に合う動作を選べました。');else wrong(b,'次の問題へ進みます。');});b.appendChild(node('span','v57-action-icon',actionIcons[c]||'👆'));b.appendChild(node('span','v57-action-label',c));b.setAttribute('aria-label',c);grid.appendChild(b);});p.appendChild(grid);$('answerArea').appendChild(p);if(window.voiceEnabled)setTimeout(function(){if(window.selectedActivity==='instruction'&&!window.answered)speakText(target);},380);}
function iconAndPhrase(choice){var s=String(choice||'').trim();var parts=s.split(/\s+/);if(parts.length>1&&parts[0].length<=4)return {icon:parts.shift(),label:parts.join(' '),value:s};return {icon:({水:'💧',トイレ:'🚻',痛い:'🤕',休みたい:'🛏️',ごはん:'🍚',コーヒー:'☕'}[s]||'💬'),label:s,value:s};}
function renderBoard(q){resetFrame(q);var p=panel('伝えたい言葉を選びましょう。選んだ言葉は読み上げられます。');var chosen=null;var status=node('p','v57-board-status','まだ言葉を選んでいません。');status.setAttribute('aria-live','polite');var grid=choiceGrid('v57-board-grid');var buttons=[];
 (q.choices||[]).forEach(function(c){var data=iconAndPhrase(c);var b=button('','v57-board-card',function(){if(window.answered)return;chosen=data;buttons.forEach(function(x){x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',x===b?'true':'false');});status.textContent='選択中：'+data.label+'。必要なら読み上げてから決定してください。';});b.setAttribute('aria-pressed','false');b.appendChild(node('span','v57-board-icon',data.icon));b.appendChild(node('span','v57-board-label',data.label));grid.appendChild(b);buttons.push(b);});p.appendChild(grid);p.appendChild(status);
 var actions=node('div','v57-board-actions');actions.appendChild(button('🔊　選んだ言葉を伝える','v57-board-speak',function(){if(!chosen){status.textContent='先に言葉のカードを選んでください。';return;}speakText(chosen.label);status.textContent='読み上げました：「'+chosen.label+'」。この言葉で進むか確認してください。';}));actions.appendChild(button('この言葉で決定　→','v57-board-confirm',function(){if(!chosen){status.textContent='先に言葉のカードを選んでください。';return;}if(chosen.value===q.answer)correct(null,'伝えたい内容に合うカードを選べました。');else wrong(null,'次の問題へ進みます。');}));p.appendChild(actions);$('answerArea').appendChild(p);}
// Correct data and instructions: auditory exercises must be heard, not read first.
if(window.QUESTIONS){
 (window.QUESTIONS.listen||[]).forEach(function(q){q.question='音声を聞いて、合う絵を選びましょう。';q.voiceText=q.voiceText||q.answer;});
 (window.QUESTIONS.instruction||[]).forEach(function(q){q.question='指示を聞いて、合う動作を選びましょう。';q.voiceText=q.answer;});
}
var originalRender=window.renderQuestion;
window.renderQuestion=function(){
 var id=window.selectedActivity;var q=window.questions&&window.questions[window.current];
 if(!q){if(typeof originalRender==='function')return originalRender.apply(this,arguments);return;}
 if(id==='fill')return renderFill(q);
 if(id==='listen')return renderListen(q);
 if(id==='instruction')return renderInstruction(q);
 if(id==='board')return renderBoard(q);
 return originalRender.apply(this,arguments);
};
})();
