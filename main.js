const mainMenu = document.getElementById('main-menu');
const playBtn = document.getElementById('play-btn');
const scoreBtn = document.getElementById('score-btn');
const gameOverScreen = document.getElementById('game-over-screen');
const game = document.getElementById('game');
const pauseBtn = document.getElementById('pause-btn');
const green = document.getElementById('green');
const red = document.getElementById('red');
const yellow = document.getElementById('yellow');
const blue = document.getElementById('blue');
const btns = [green, red, yellow, blue];
let simonSeq = [];
let btnIdxToEnter = 0;

playBtn.addEventListener('click', () => {
	mainMenu.hidden = true;
	game.hidden = false;
	gameOverScreen.hidden = true;
	simonSays();
});

function gameOver() {
	mainMenu.hidden = true;
	game.hidden = true;
	gameOverScreen.hidden = false;
	simonSeq = [];
	setTimeout(() => {
		mainMenu.hidden = false;
		game.hidden = true;
		gameOverScreen.hidden = true;
	}, 800);
}

function lightUpBtn(btn) {
	const bgColor = btn.style.backgroundColor;
	btn.style.backgroundColor = 'white';
	setTimeout(() => btn.style.backgroundColor = bgColor, 100);
}

function simonSays() {
	const waitTime = 400;
	btnIdxToEnter = 0;
	simonSeq = [...simonSeq, Math.floor(Math.random() * 4)];
	for (let i = 0, len = simonSeq.length; i < len; i++)
		setTimeout(() => lightUpBtn(btns[simonSeq[i]]), waitTime * i + waitTime);
}

btns.forEach((btn, idx) => {
	btn.addEventListener('click', () => {
		if (idx !== simonSeq[btnIdxToEnter]) return gameOver();
		btnIdxToEnter++;
		lightUpBtn(btn);
		if (btnIdxToEnter === simonSeq.length) simonSays();
	});
});
