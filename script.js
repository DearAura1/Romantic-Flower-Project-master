const $ = (s) => document.querySelector(s);
const screens = [...document.querySelectorAll(".screen")];

function showScreen(id){
  screens.forEach(s => s.classList.remove("active"));
  const target = document.getElementById(id);
  target.classList.add("active");
  window.scrollTo({top:0,behavior:"instant"});
}

const gift = $("#giftButton");

gift.addEventListener("click", () => {
  gift.classList.add("open");
  burstHearts(28, gift.getBoundingClientRect());

  // تشغيل الـ Typewriter عند فتح الهدية
  startTypewriter();

  setTimeout(() => {
    showScreen("flowerScreen");
    setTimeout(() => $("#flowerScreen").classList.add("show-note"), 1300);
  }, 900);
});

function burstHearts(count, rect){
  const holder = $("#clickHearts");

  for(let i=0;i<count;i++){
    const h = document.createElement("span");

    h.className = "click-heart";
    h.textContent = ["♥","♡","✦","✧"][Math.floor(Math.random()*4)];

    h.style.left = (rect.left + rect.width/2) + "px";
    h.style.top = (rect.top + rect.height/2) + "px";

    const angle = Math.random()*Math.PI*2;
    const distance = 70 + Math.random()*210;

    h.style.setProperty("--x", `${Math.cos(angle)*distance}px`);
    h.style.setProperty("--y", `${Math.sin(angle)*distance}px`);

    h.style.fontSize = `${10+Math.random()*18}px`;

    holder.appendChild(h);

    setTimeout(()=>h.remove(),1100);
  }
}

$("#continueButton").addEventListener(
  "click",
  ()=>showScreen("memoriesScreen")
);

$("#letterButton").addEventListener(
  "click",
  ()=>showScreen("letterScreen")
);

const envelope = $("#envelope");
const openLetter = $("#openLetter");

let typed = false;

openLetter.addEventListener("click",()=>{
  envelope.classList.add("open");

  openLetter.style.opacity = "0";
  openLetter.style.pointerEvents = "none";

  setTimeout(()=>{
    $("#letterScreen").classList.add("letter-done");
    typeLetter();
  },700);
});

const letterText =
  "يمكن الكلام ده بسيط... بس الحقيقة إن كان ليكي الفضل في تغيير حاجات كتير فيا وخلّيتي تفاصيل كتير تاخد معنى تاني. أتمنى كل مرة تشوفي فيها الورد تفتكري إن في حد بيتمنى لكِ دايمًا أيام حلوة، وضحكة من قلبك، وحاجات أجمل من اللي بتتمنيها.";

function typeLetter(){
  if(typed) return;

  typed = true;

  const el = $("#typedLetter");
  let i=0;

  const timer=setInterval(()=>{
    el.textContent += letterText[i++];

    if(i>=letterText.length){
      clearInterval(timer);
    }
  },28);
}

$("#timerButton").addEventListener(
  "click",
  ()=>showScreen("timerScreen")
);

$("#endingButton").addEventListener(
  "click",
  ()=>showScreen("finalScreen")
);

$("#replayButton").addEventListener("click",()=>{
  $("#flowerScreen").classList.remove("show-note");
  $("#envelope").classList.remove("open");
  $("#letterScreen").classList.remove("letter-done");
  $("#typedLetter").textContent="";

  typed=false;

  openLetter.style.opacity="1";
  openLetter.style.pointerEvents="auto";

  gift.classList.remove("open");

  // إعادة تشغيل الـ Typewriter
  resetTypewriter();

  // إيقاف الأغنية وإرجاعها للبداية
  if(messageMusic){
    messageMusic.pause();
    messageMusic.currentTime = 0;
    musicButton.classList.remove("playing");
    musicButton.textContent = "♪";
  }

  showScreen("introScreen");
});


// Decorative cursor / touch burst
document.addEventListener("pointermove",(e)=>{
  if(!window.matchMedia("(pointer: coarse)").matches){
    const c=$("#cursorHeart");

    c.style.left=e.clientX+"px";
    c.style.top=e.clientY+"px";
  }
});

document.addEventListener("pointerdown",(e)=>{
  if(window.matchMedia("(pointer: coarse)").matches) return;
  if(Math.random()>.35) return;

  const h=document.createElement("span");

  h.className="click-heart";
  h.textContent="♥";

  h.style.left=e.clientX+"px";
  h.style.top=e.clientY+"px";

  h.style.setProperty(
    "--x",
    (Math.random()*80-40)+"px"
  );

  h.style.setProperty(
    "--y",
    (-30-Math.random()*80)+"px"
  );

  $("#clickHearts").appendChild(h);

  setTimeout(()=>h.remove(),1000);
});


// Ambient floating hearts
setInterval(()=>{
  if(document.hidden) return;

  const h=document.createElement("span");

  h.textContent=Math.random()>.25?"♥":"✦";

  h.style.position="fixed";
  h.style.left=Math.random()*100+"vw";
  h.style.bottom="-20px";

  h.style.color=
    `rgba(255,${90+Math.floor(Math.random()*100)},${150+Math.floor(Math.random()*70)},${.12+Math.random()*.25})`;

  h.style.fontSize=
    (8+Math.random()*15)+"px";

  h.style.zIndex="1";
  h.style.pointerEvents="none";

  h.style.transition=
    "transform 7s linear, opacity 7s linear";

  $("#ambientHearts").appendChild(h);

  requestAnimationFrame(()=>{
    h.style.transform=
      `translate(${(Math.random()-.5)*100}px,-${window.innerHeight+80}px) rotate(${Math.random()*120-60}deg)`;

    h.style.opacity="0";
  });

  setTimeout(()=>h.remove(),7200);

},850);


// Timer
const startDate = new Date("2024-02-01T00:00:00");

function updateTimer() {
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        console.error("عناصر العداد غير موجودة");
        return;
    }

    const diff = Math.max(0, Date.now() - startDate.getTime());
    const totalSeconds = Math.floor(diff / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysElement.textContent = String(days).padStart(3, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");
}

updateTimer();
setInterval(updateTimer, 1000);





// Music Player
const musicButton = $("#musicButton");
const messageMusic = $("#messageMusic");

musicButton.addEventListener("click", () => {

  if (messageMusic.paused) {

    messageMusic.play().catch(e => {
      console.log("تعذر تشغيل الأغنية:", e);
    });

    musicButton.classList.add("playing");
    musicButton.textContent = "❚❚";

  } else {

    messageMusic.pause();

    musicButton.classList.remove("playing");
    musicButton.textContent = "♪";
  }
});

messageMusic.addEventListener("ended", () => {
  musicButton.classList.remove("playing");
  musicButton.textContent = "♪";
});


// Typewriter Message
const typedMessageElement =
  document.getElementById("typedMessage");

const textToType =
  "وجودِك في حياتي بيخلي كل حاجة أجمَل.. الورد ده عشان يفكرك إنك دايماً مميزة وجميلة زي ما أنتِ. ❤️";

let index = 0;
let isTyping = false;
let typingSpeed = 60;

function startTypewriter(){

  if(!typedMessageElement || isTyping) return;

  typedMessageElement.innerHTML = "";

  index = 0;
  isTyping = true;

  function typeChar(){

    if(index < textToType.length){

      if(textToType.charAt(index) === "\n"){

        typedMessageElement.innerHTML += "<br>";

      }else{

        typedMessageElement.innerHTML +=
          textToType.charAt(index);
      }

      index++;

      setTimeout(typeChar, typingSpeed);

    }else{

      isTyping = false;
    }
  }

  typeChar();
}


// Reset Typewriter
function resetTypewriter(){

  if(typedMessageElement){
    typedMessageElement.innerHTML = "";
  }

  index = 0;
  isTyping = false;
}