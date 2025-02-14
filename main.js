const mainMenu = document.getElementById('main-menu');
const nameInput = document.getElementById('name-input');
const playBtn = document.getElementById('play-btn');
const scoreDisplay = document.getElementById('score-display');
const hiscoreDisplay = document.getElementById('hiscore-display');
const scoreBtn = document.getElementById('score-btn');
const gameOverScreen = document.getElementById('game-over-screen');
const game = document.getElementById('game');
const resetBtn = document.getElementById('reset-btn');
const counter = document.getElementById('counter');
const container = document.getElementById('container');
const green = document.getElementById('green');
const red = document.getElementById('red');
const yellow = document.getElementById('yellow');
const blue = document.getElementById('blue');
const btns = [green, red, yellow, blue];

let simonSeq;
let btnIdxToEnter = 0;
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

function updateCounter() {
	counter.textContent = simonSeq.length;
}

function simonSays() {
	const waitTime = 800;
	btnIdxToEnter = 0;
	scoreDisplay.innerHTML = simonSeq.length;
	if (simonSeq.length > hiscore) hiscoreDisplay.innerHTML = simonSeq.length;
	counter.textContent = simonSeq.length;

	simonSeq = [...simonSeq, Math.floor(Math.random() * 4)];
	container.classList.add("blocked");
	isSimonSaying = true;

	for (let i = 0; i < simonSeq.length; i++) {
		setTimeout(() => lightUpBtn(btns[simonSeq[i]]), waitTime * (i + 1));
	}
	setTimeout(() => {
		isSimonSaying = false;
		container.classList.remove("blocked");
	}, waitTime * (simonSeq.length + 1));
}

function gameOver() {
	showGameOverScreen();
	window.localStorage.setItem(nameInput.value, simonSeq.length - 1);
	setTimeout(showMainMenu, 800);
}

function startGame() {
	simonSeq = [];
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

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const frequencies = {
	green: 261.6,  // Do (C4)
	red: 293.7,    // Re (D4)
	yellow: 329.6, // Mi (E4)
	blue: 349.2    // Fa (F4)
};

function playSound(frequency) {
	const oscillator = audioCtx.createOscillator();
	const gainNode = audioCtx.createGain();

	oscillator.type = 'sine';
	oscillator.frequency.value = frequency;

	gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
	oscillator.connect(gainNode);
	gainNode.connect(audioCtx.destination);

	oscillator.start();
	setTimeout(() => {
		oscillator.stop();
	}, 200);
}

function lightUpBtn(btn) {
	btn.classList.add('game-btn-pressed');
	playSound(frequencies[btn.id]);
	setTimeout(() => btn.classList.remove('game-btn-pressed'), 100);
}
