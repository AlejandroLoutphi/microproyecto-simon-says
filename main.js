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
let score;
let hiscore;
// Booleano para pausar el input del usuario mientras que es
// "turno de Simon"
let isSimonSaying = false;

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

function lightUpBtn(btn) {
	btn.classList.add('game-btn-pressed');
	setTimeout(() => btn.classList.remove('game-btn-pressed'), 100);
}

// Esta es la función que corre cada vez que "es el turno de Simon"
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

// Función que crea el Leaderboard en base a localStorage
function refreshLeaderboard() {
	let text = '';
	for (let i = 0; i < window.localStorage.length; i++) {
		const username = window.localStorage.key(i);
		// Esto es para que metadata no sea leido
		// como un usuario
		if (username.slice(0, 2) == '--') continue;
		const userHiscore = window.localStorage.getItem(username);
		text +=
			`<li class="leaderboard-item">
				<h2 class="leaderboard-name">${username}</h2>
				<h2 class="leaderboard-score">${userHiscore}</h2>
			</li>`;
	}
	// Se oculta todo el leaderboard si está vacío
	leaderboard.hidden = !text;
	leaderboardDisplay.innerHTML = text;
}

// Función que corre al perder o terminar partida
function gameOver() {
	showGameOverScreen();
	window.localStorage.setItem(nameInput.value, score);
	refreshLeaderboard();
	setTimeout(showMainMenu, 800);
}

// Función que corre al empezar partida
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
	// Se bloquea el input del usuario mientras es "turno de Simon"
	if (isSimonSaying) return;
	if (idx !== simonSeq[btnIdxToEnter]) return gameOver();
	btnIdxToEnter++;
	lightUpBtn(btn);
	if (btnIdxToEnter === simonSeq.length) simonSays();
}));

// No permitir al usuario entrar al juego sin nombre
nameInput.addEventListener('input', () => playBtn.disabled = nameInput.value.length === 0);
playBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', gameOver);
refreshLeaderboard();
