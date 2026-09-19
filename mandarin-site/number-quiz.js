(function () {
  const $ = id => document.getElementById(id);
  const MODES = [
    { id:"teens", name:"11–20", emoji:"1️⃣", sub:"Start with the teens", min:11, max:20 },
    { id:"twoDigits", name:"21–99", emoji:"🔢", sub:"Practise tens and units", min:21, max:99 },
    { id:"hundreds", name:"100–999", emoji:"💯", sub:"Add hundreds and zeroes", min:100, max:999 },
    { id:"mix", name:"Mixed challenge", emoji:"🎲", sub:"Anything from 11 to 999", min:11, max:999 }
  ];
  let mode = null, answer = 0, previous = -1, streak = 0, answered = false;
  let best = {};
  try { best = JSON.parse(localStorage.getItem("mandarinNumberQuizBest") || "{}"); } catch (e) { best = {}; }

  function save() { try { localStorage.setItem("mandarinNumberQuizBest", JSON.stringify(best)); } catch (e) {} }
  function show(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    $(id).classList.add("active"); window.scrollTo({top:0});
  }
  function renderMenu() {
    const list=$("topic-list"); list.innerHTML="";
    MODES.forEach(m=>{
      const b=document.createElement("button"); b.className="topic-btn";
      b.innerHTML=`<span class="topic-emoji">${m.emoji}</span><span><span class="topic-name">${m.name}</span><br><span class="topic-sub">${m.sub}</span></span>${best[m.id]?`<span class="topic-best">🔥 best: ${best[m.id]}</span>`:""}`;
      b.addEventListener("click",()=>start(m)); list.appendChild(b);
    });
  }
  function start(m) { mode=m; streak=0; updateBar(); next(); show("screen-play"); }
  function randomNumber() {
    let n, attempts=0;
    do { n=Math.floor(Math.random()*(mode.max-mode.min+1))+mode.min; attempts++; } while(n===previous&&attempts<10);
    previous=n; return n;
  }
  function next() {
    answer=randomNumber(); answered=false;
    $("word-english").textContent=MandarinNumbers.numberToPinyin(answer);
    $("word-pinyin").textContent="";
    $("word-phon").textContent="";
    $("word-card").classList.remove("correct","wrong");
    const input=$("answer-input"); input.value=""; input.disabled=false; input.focus();
    $("feedback").className="feedback neutral"; $("feedback").textContent="Type the number in digits";
    $("btn-next").hidden=true; $("btn-reveal").hidden=false;
  }
  function finish(correct) {
    answered=true; $("answer-input").disabled=true; $("btn-reveal").hidden=true; $("btn-next").hidden=false;
    $("word-pinyin").textContent=String(answer);
    $("word-phon").textContent=MandarinNumbers.numberToHanzi(answer);
    if(correct){
      streak++; $("word-card").classList.add("correct");
      $("feedback").className="feedback good"; $("feedback").innerHTML=`✓ Correct — <strong>${answer}</strong>`;
      if(!best[mode.id]||streak>best[mode.id]){best[mode.id]=streak;save();}
    } else {
      streak=0; $("word-card").classList.add("wrong");
      $("feedback").className="feedback bad"; $("feedback").innerHTML=`The answer is <strong>${answer}</strong>.`;
    }
    updateBar(!correct); $("btn-next").focus();
  }
  function check() {
    if(answered)return; const value=$("answer-input").value.trim(); if(!value)return;
    if(Number(value)===answer && /^\d+$/.test(value)) finish(true);
    else { $("word-card").classList.remove("wrong"); void $("word-card").offsetWidth; $("word-card").classList.add("wrong"); $("feedback").className="feedback bad"; $("feedback").textContent="Not quite — try again or show the answer."; $("answer-input").select(); }
  }
  function updateBar(broken) {
    $("streak-now").textContent=`🔥 ${streak}`; $("streak-best").textContent=`Best: ${best[mode?mode.id:""]||0}`;
    if(broken){$("streak-now").classList.add("broken");setTimeout(()=>$("streak-now").classList.remove("broken"),450);}
  }
  $("btn-check").addEventListener("click",check);
  $("answer-input").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();answered?next():check();}});
  $("btn-next").addEventListener("click",next);
  $("btn-reveal").addEventListener("click",()=>{if(!answered)finish(false);});
  $("btn-quit").addEventListener("click",()=>{renderMenu();show("screen-menu");});
  renderMenu();
}());
