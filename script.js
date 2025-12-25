const btn = document.getElementById('enterBtn'), overlay = document.getElementById('overlay'), hubs = document.getElementById('hubs-wrapper'), santa = document.getElementById('santaGif'), bgMusic = document.getElementById('bg-music'), playlistPlayer = document.getElementById('music-player'), secretStar = document.getElementById('secret-star'), gameOverlay = document.getElementById('game-overlay'), gameCanvas = document.getElementById('game-canvas');
let gameIntervals = [];

const clearGame = () => { gameIntervals.forEach(clearInterval); gameIntervals = []; gameCanvas.innerHTML = ''; };
document.getElementById('closeGame').onclick = () => { clearGame(); gameOverlay.classList.add('hidden-game'); };

// 1. Music (All 10 songs)
const playlist = Array.from({length: 10}, (_, i) => ({ name: `Song ${i+1}`, file: `song${i+1}.mp3` }));
document.getElementById('surpriseBtn').onclick = () => { bgMusic.pause(); playlistPlayer.src = playlist[Math.floor(Math.random()*10)].file; playlistPlayer.play(); };

// 2. Message Modal
document.getElementById('openMsgBtn').onclick = () => document.getElementById('personal-message-overlay').classList.remove('hidden-game');
document.getElementById('closePersonalMsg').onclick = () => document.getElementById('personal-message-overlay').classList.add('hidden-game');

// 3. Snow Logic
const canvas = document.getElementById('snow'), ctx = canvas.getContext('2d');
let w, h, flakes = [];
function initSnow() { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; flakes = Array.from({length:150}, () => ({ x:Math.random()*w, y:Math.random()*h, r:Math.random()*3+1, d:Math.random()*1+0.5, s:Math.random()*2, st:Math.random()*10, o:Math.random()*0.7+0.2 })); }
function drawSnow() { ctx.clearRect(0,0,w,h); flakes.forEach(f => { f.st+=0.01; f.y+=f.d; f.x+=Math.sin(f.st)*f.s; if(f.y>h){f.y=-10; f.x=Math.random()*w;} ctx.beginPath(); ctx.fillStyle=`rgba(255,255,255,${f.o})`; ctx.arc(f.x, f.y, f.r, 0, Math.PI*2); ctx.fill(); }); requestAnimationFrame(drawSnow); }

// --- FIXED GAMES ---
document.getElementById('catchGameBtn').onclick = () => {
    clearGame(); gameOverlay.classList.remove('hidden-game');
    let score = 0, time = 30;
    gameCanvas.innerHTML = `<div style="margin-bottom:10px;">Score: <span id="sc">0</span> | Time: <span id="tm">30</span>s</div><div id="gz" style="position:relative; height:350px; overflow:hidden;"></div>`;
    gameIntervals.push(setInterval(() => { time--; document.getElementById('tm').innerText = time; if(time<=0){ clearGame(); gameCanvas.innerHTML = `<h2>Finish! Score: ${score}</h2>`; } }, 1000));
    gameIntervals.push(setInterval(() => {
        const item = document.createElement('div'); item.innerHTML = '🎁'; item.style.cssText = `position:absolute; left:${Math.random()*300}px; top:-30px; font-size:2rem; cursor:pointer; transition:top 2s linear;`;
        document.getElementById('gz').appendChild(item); setTimeout(() => item.style.top='380px', 10);
        item.onclick = () => { score++; document.getElementById('sc').innerText=score; item.remove(); };
    }, 800));
};

document.getElementById('memoryGameBtn').onclick = () => {
    clearGame(); gameOverlay.classList.remove('hidden-game');
    const ems = ['🎄','🎄','🎁','🎁','❄️','❄️','🎅','🎅','🦌','🦌','⛄','⛄'].sort(()=>0.5-Math.random());
    gameCanvas.innerHTML = `<div class="memory-grid"></div>`;
    const grid = gameCanvas.querySelector('.memory-grid'); let flipped = [];
    ems.forEach(e => {
        const card = document.createElement('div'); card.className='card'; card.dataset.emoji=e; card.innerHTML=e;
        card.onclick = () => {
            if(flipped.length<2 && !card.classList.contains('flipped')){
                card.classList.add('flipped'); flipped.push(card);
                if(flipped.length===2){
                    if(flipped[0].dataset.emoji !== flipped[1].dataset.emoji){
                        setTimeout(()=>{ flipped.forEach(c=>c.classList.remove('flipped')); flipped=[]; }, 600);
                    } else { flipped = []; }
                }
            }
        }; grid.appendChild(card);
    });
};

document.getElementById('dropGameBtn').onclick = () => {
    clearGame(); gameOverlay.classList.remove('hidden-game');
    gameCanvas.innerHTML = `<div id="sleigh">🛷</div><div id="chimney">🏠</div><p style="margin-top:330px;">Tap game area to drop!</p>`;
    const sl = document.getElementById('sleigh'), ch = document.getElementById('chimney');
    let sx=0, sd=3, cx=150, cd=2;
    gameIntervals.push(setInterval(() => { sx+=sd; if(sx>300||sx<0)sd*=-1; sl.style.left=sx+'px'; cx+=cd; if(cx>300||cx<0)cd*=-1; ch.style.left=cx+'px'; }, 20));
    gameCanvas.onclick = (e) => {
        const g = document.createElement('div'); g.className='dropping-gift'; g.innerHTML='🎁'; g.style.left=(sx+15)+'px'; g.style.top='100px'; gameCanvas.appendChild(g);
        let gy=100; const dInt = setInterval(() => {
            gy+=7; g.style.top=gy+'px';
            if(gy>350){ clearInterval(dInt); g.remove(); if(Math.abs((sx+15) - cx) < 40) alert("🎯 Good Drop!"); }
        }, 20); gameIntervals.push(dInt);
    };
};

document.getElementById('riddleGameBtn').onclick = () => {
    clearGame(); gameOverlay.classList.remove('hidden-game');
    const riddles = [{q:"What has a beard but no face?", a:"Santa", o:["Gnome","Santa","Wizard"]}];
    const r = riddles[0]; gameCanvas.innerHTML = `<h3 style="margin-top:40px">${r.q}</h3>`;
    r.o.forEach(o => {
        const b = document.createElement('button'); b.className='m-btn'; b.style.margin='10px auto'; b.style.display='block'; b.innerText=o;
        b.onclick = () => alert(o===r.a ? "Correct! 🎄" : "Try again!"); gameCanvas.appendChild(b);
    });
};

// 4. Entrance Logic
secretStar.onclick = () => document.getElementById('letter-overlay').classList.remove('hidden-game');
document.getElementById('closeLetter').onclick = () => document.getElementById('letter-overlay').classList.add('hidden-game');

btn.onclick = () => {
    overlay.style.opacity='0';
    setTimeout(() => {
        overlay.style.display='none'; hubs.classList.remove('hidden'); secretStar.classList.remove('hidden');
        bgMusic.volume=0.4; bgMusic.play();
        santa.style.display='block'; santa.style.animation='santaFly 22s linear infinite';
        document.getElementById('wallpaper').style.transform='scale(1.15)';
    }, 1000);
};

window.onresize = initSnow; initSnow(); drawSnow();