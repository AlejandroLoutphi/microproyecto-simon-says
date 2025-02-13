const mainMenu = document.getElementById('main-menu');
const nameInput = document.getElementById('name-input');
const playBtn = document.getElementById('play-btn');
const scoreDisplay = document.getElementById('score-display');
const hiscoreDisplay = document.getElementById('hiscore-display');
const scoreBtn = document.getElementById('score-btn');
const gameOverScreen = document.getElementById('game-over-screen');
const game = document.getElementById('game');
const resetBtn = document.getElementById('reset-btn');
const green = document.getElementById('green');
const red = document.getElementById('red');
const yellow = document.getElementById('yellow');
const blue = document.getElementById('blue');
const btns = [green, red, yellow, blue];
let simonSeq;
let btnIdxToEnter = 0;
let score;
let hiscore;
let isSimonSaying = false;

function showGame() {
	mainMenu.hidden = true;
	game.hidden = false;
	gameOverScreen.hidden = true;
}

function showMainMenu() {
	mainMenu.hidden = false;
	game.hidden = true;
	gameOverScreen.hidden = true;
}

function showGameOverScreen() {
	mainMenu.hidden = true;
	game.hidden = true;
	gameOverScreen.hidden = false;
}

function lightUpBtn(btn) {
	btn.classList.add('game-btn-pressed');
	setTimeout(() => btn.classList.remove('game-btn-pressed'), 100);
}

function simonSays() {
	const waitTime = 400;
	btnIdxToEnter = 0;
	score++;
	scoreDisplay.innerHTML = score;
	if (score > hiscore) hiscoreDisplay.innerHTML = score;
	simonSeq = [...simonSeq, Math.floor(Math.random() * 4)];
	isSimonSaying = true;
	for (let i = 0; i < simonSeq.length; i++)
		setTimeout(() => lightUpBtn(btns[simonSeq[i]]), waitTime * (i + 1));
	setTimeout(() => isSimonSaying = false, waitTime * (simonSeq.length + 1));
}

function gameOver() {
	simonSeq = [];
	showGameOverScreen();
	window.localStorage.setItem(nameInput.value, score);
	setTimeout(showMainMenu, 800);
}

function startGame() {
	simonSeq = [];
	score = -1;
	// si getItem() retorna null, Number() retorna 0, que es lo que queremos
	hiscore = Number(window.localStorage.getItem(nameInput.value));
	hiscoreDisplay.innerHTML = hiscore;
	showGame();
	simonSays();
}

btns.forEach((btn, idx) => btn.addEventListener('click', () => {
	if (isSimonSaying) return;
	if (idx !== simonSeq[btnIdxToEnter]) return gameOver();
	btnIdxToEnter++;
	lightUpBtn(btn);
	if (btnIdxToEnter === simonSeq.length) simonSays();
}));

nameInput.addEventListener('input', () => playBtn.disabled = nameInput.value.length === 0);
playBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', gameOver);
