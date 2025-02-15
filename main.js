const mainMenu = document.getElementById('main-menu');
const nameInput = document.getElementById('name-input');
const playBtn = document.getElementById('play-btn');
const leaderboard = document.getElementById('leaderboard');
const leaderboardDisplay = document.getElementById('leaderboard-display');
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
// "Helper Array" para traducir desde índices a elementos HTML
const btns = [green, red, yellow, blue];

// La lógica del juego consiste en añadir un elemento a un
// array (simonSeq) cada vez que es "turno de Simon".
// En el turno del jugador, cada vez que se presiona un
// botón se incrementa un índice a simonSeq por 1.
// Si el botón que presionó el usuario no es el botón de
// simonSeq[btnIdxToEnter], se termina el juego.
// Una vez que btnIdxToEnter == simonSeq.length,
// es "turno de Simon" de nuevo.
let simonSeq;
let btnIdxToEnter = 0;
let hiscore;
// Booleano para pausar el input del usuario mientras que es
// "turno de Simon"
let isSimonSaying = false;
// Usado para determinar si el juego en el que se iniciaron acciones terminó
let gameId = Symbol();

// Estas son solo helper functions para mostrar
// las distintas secciones de la página
function showGame() {
	mainMenu.hidden = true;
	game.hidden = false;
	gameOverScreen.hidden = true;
}

function showMainMenu() {
	mainMenu.hidden = false;
	game.hidden = true;
	gameOverScreen.hidden = true;
	refreshLeaderboard();
}

function showGameOverScreen() {
	mainMenu.hidden = true;
	game.hidden = true;
	gameOverScreen.hidden = false;
}

// Audio
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const frequencies = [
	261.6,  // Do (C4)
	293.7,    // Re (D4)
	329.6, // Mi (E4)
	349.2    // Fa (F4)
];

function playSound(frequency) {
	if (game.hidden) return;
	const oscillator = audioCtx.createOscillator();
	const gainNode = audioCtx.createGain();

	oscillator.type = 'sine';
	oscillator.frequency.value = frequency;

	gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
	oscillator.connect(gainNode);
	gainNode.connect(audioCtx.destination);

	oscillator.start();
	setTimeout(() => {
		gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.015);
		oscillator.stop(audioCtx.currentTime + 0.08);
	}, 200);
}

// Función llamada cuando se presiona un botón
// por el jugador o "por Simon"
function lightUpBtn(idx) {
	btns[idx].classList.add('game-btn-pressed');
	playSound(frequencies[idx]);
	setTimeout(() => btns[idx].classList.remove('game-btn-pressed'), 100);
}

// Esta es la función que corre cada vez que "es el turno de Simon"
function simonSays() {
	const waitTime = 800;
	const calledGameId = gameId;
	btnIdxToEnter = 0;
	scoreDisplay.innerHTML = simonSeq.length;
	if (simonSeq.length > hiscore) hiscoreDisplay.innerHTML = simonSeq.length;

	simonSeq = [...simonSeq, Math.floor(Math.random() * 4)];
	counter.textContent = simonSeq.length;
	container.classList.add("blocked");
	isSimonSaying = true;

	for (let i = 0; i < simonSeq.length; i++) {
		setTimeout(() => calledGameId == gameId && lightUpBtn(simonSeq[i]), waitTime * (i + 1));
	}
	setTimeout(() => {
		isSimonSaying = false;
		container.classList.remove("blocked");
	}, waitTime * (simonSeq.length + 1));
}

// Función que crea el Leaderboard en base a localStorage
function refreshLeaderboard() {
	let hiscoreArray = [];
	let text = '';

	for (let i = 0; i < window.localStorage.length; i++) {
		const username = window.localStorage.key(i);
		// Esto es para que metadata no sea leido
		// como un usuario
		if (username.slice(0, 2) == '--') continue;
		const userHiscore = window.localStorage.getItem(username);
		hiscoreArray = [...hiscoreArray, { name: username, hiscore: userHiscore }];
	}

	hiscoreArray.sort((a, b) => b.hiscore - a.hiscore);
	for (let i = 0; i < hiscoreArray.length; i++) {
		text +=
			`<li class="leaderboard-item">
				<h2 class="leaderboard-name">${hiscoreArray[i].name}</h2>
				<h2 class="leaderboard-score">${hiscoreArray[i].hiscore}</h2>
			</li>`;
	}
	// Se oculta todo el leaderboard si está vacío
	leaderboard.hidden = !text;
	leaderboardDisplay.innerHTML = text;
}

// Función que corre al perder o terminar partida
function gameOver() {
	showGameOverScreen();
	gameId = Symbol();
	playBtn.innerHTML = 'Jugar de Nuevo';
	setTimeout(showMainMenu, 800);
}

// Función que corre al empezar partida
function startGame() {
	simonSeq = [];
	hiscore = Number(window.localStorage.getItem(nameInput.value));
	hiscoreDisplay.innerHTML = hiscore;
	showGame();
	simonSays();
}

btns.forEach((btn, idx) => btn.addEventListener('mouseup', (e) => {
	e.preventDefault();
	// Se bloquea el input del usuario mientras es "turno de Simon"
	if (isSimonSaying) return;
	if (idx !== simonSeq[btnIdxToEnter]) {
		if (hiscore < simonSeq.length - 1)
			window.localStorage.setItem(nameInput.value, simonSeq.length - 1);
		refreshLeaderboard();
		gameOver();
	}
	btnIdxToEnter++;
	lightUpBtn(idx);
	if (btnIdxToEnter === simonSeq.length) simonSays();
}));

// No permitir al usuario entrar al juego sin nombre
nameInput.addEventListener('input', () => playBtn.disabled = nameInput.value.length === 0);
playBtn.addEventListener('click', startGame);
// Nota: no se almacenan puntuaciones para juegos 'reseteados', porque en la rúbrica dice que:
// 'Se borran correctamente los datos de la partida actual sin afectar el historial de puntajes.'
resetBtn.addEventListener('click', gameOver);
refreshLeaderboard();
