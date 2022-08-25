const startPage = document.querySelector('.startPage');
const startButton = document.getElementById('startButton');
const input = document.getElementById('input');

startButton.addEventListener('click', function() {
	 startPage.style.transform = 'translateX(-100%)';
});

const mobileMenu = document.querySelector('.menu');
const menu = document.querySelector('.header__menu');

mobileMenu.addEventListener('click', function() {
    menu.style.display = 'block';
    menu.style.opacity = '1';
    console.log('clicked');
});

// ======•• Draw ••==========

class HangmanCanvas {
  constructor(secretWord) {
	this.ctx = document.getElementById('canvas').getContext('2d');
	this.ctx.lineWidth = 4;
	this.ctx.font = '48px arial';
	this.secretWord = secretWord;
	this.hangmanShape = ['head', 'body', 'left leg', 'right leg', 'left arm', 'right arm', 'left eye', 'right eye']
  }

  createBoard() {
	this.ctx.clearRect(0, 0, 1000, 500);
	this.ctx.beginPath();
	this.ctx.moveTo(75, 450);
	this.ctx.lineTo(150, 500);
	this.ctx.lineTo(0, 500);
	this.ctx.lineTo(75, 450);
	this.ctx.lineTo(75, 0);
	this.ctx.lineTo(350, 0);
	this.ctx.lineTo(350, 50);
	this.ctx.stroke();
  }

  drawLines() {
	let x = 200;
	for (let i = 0; i < this.secretWord.length; i++)
	  {
		this.ctx.beginPath();
		this.ctx.moveTo(x, 500);
		this.ctx.lineTo(x + 34, 500);
		this.ctx.stroke();
		x += 55
	  }
  }

  writeCorrectLetter(index) {
	let x = 200 + index * 55;
	this.ctx.fillText(this.secretWord[index].toUpperCase(), x, 490);
  }

  writeWrongLetter(letter, errorsLeft) {
	let x = 1050 + errorsLeft * -55;
	this.ctx.fillText(letter.toUpperCase(), x, 150);
  }

  drawHangman(shape) {
	switch (shape) {
	  case 'head':
		this.ctx.beginPath();
		this.ctx.arc(350, 85, 35, 0, Math.PI * 2);
		this.ctx.stroke();
		this.ctx.closePath();
		break;

	  case 'body':
		this.ctx.beginPath();
		this.ctx.moveTo(350, 120);
		this.ctx.lineTo(350, 270);
		this.ctx.stroke();
		break;

	  case 'left leg':
		this.ctx.beginPath();
		this.ctx.moveTo(350, 270);
		this.ctx.lineTo(300, 350);
		this.ctx.stroke();
		break;

	  case 'right leg':
		this.ctx.beginPath();
		this.ctx.moveTo(350, 270);
		this.ctx.lineTo(400, 350);
		this.ctx.stroke();
		break;

	  case 'left arm':
		this.ctx.beginPath();
		this.ctx.moveTo(350, 160);
		this.ctx.lineTo(270, 210);
		this.ctx.stroke();
		break;

	  case 'right arm':
		this.ctx.beginPath();
		this.ctx.moveTo(350, 160);
		this.ctx.lineTo(430, 210);
		this.ctx.stroke();
		break;

	  case 'left eye':
		this.ctx.beginPath();
		this.ctx.moveTo(335, 70);
		this.ctx.lineTo(345, 80);
		this.ctx.moveTo(345, 70);
		this.ctx.lineTo(335, 80);
		this.ctx.stroke();
		break;

	  case 'right eye':
		this.ctx.beginPath();
		this.ctx.moveTo(355, 70);
		this.ctx.lineTo(365, 80);
		this.ctx.moveTo(365, 70);
		this.ctx.lineTo(355, 80);
		this.ctx.stroke();
		break;

	  default:
		break;
	}	
  }

  gameOver() {
	this.ctx.clearRect(0, 0, 1000, 500);
	const tela = document.getElementById('main');
    const gameOver = document.createElement('div');
    gameOver.className = 'gameOver';
    gameOver.innerHTML = '<h1>GAME OVER</h1>';
	const restartButton = document.createElement('button');
	restartButton.innerHTML = "Restart";
    restartButton.className = 'restartButton';
    restartButton.addEventListener('click', function() {
        location.reload();
    });
    tela.appendChild(gameOver);
	gameOver.appendChild(restartButton);
  }

  winner() {
	this.ctx.clearRect(0, 0, 1000, 500);
    const tela = document.getElementById('main');
    const congrats = document.createElement('div');
    congrats.className = 'congrats';
    congrats.innerHTML = '<h1>PARABÉNS!!!</h1>';
	const restartButton = document.createElement('button');
	restartButton.innerHTML = "Restart";
    restartButton.className = 'restartButton';
    restartButton.addEventListener('click', function() {
        location.reload();
    });
    tela.appendChild(congrats);
	congrats.appendChild(restartButton);
  }
}

//========•• Hangman ••==============

let hangman, canvas;

class Hangman {
  constructor() {
	this.words = ['teste', 'teto', 'cachorro', 'dinheiro', 'treta'];
	this.secretWord = '';
	this.letters = [];
	this.guessedLetter = '';
	this.errorsLeft = 8;
  }
  
  getWord() {
	this.secretWord = this.words[Math.floor(Math.random() * this.words.length)];
	return this.secretWord;
  }
  
  checkIfLetter(letter) {
	return letter > 64 && letter < 91 ? true : false;
  }
  
  checkClickedLetters(letter) {
	const notInclude = !this.letters.includes(letter)
	if (notInclude) this.letters.push(letter)
	return notInclude ? true : false;
  }
  
  addCorrectLetter(index) {
	this.guessedLetter += this.secretWord[index].toUpperCase()
	this.checkWinner()
  }
  
  addWrongLetter() {
	this.errorsLeft--
	this.checkGameOver()
  }
  
  checkGameOver() {
	const gameOver = this.errorsLeft === 0
	if (gameOver) setTimeout(() => canvas.gameOver(), 1000)
	return gameOver ? true : false
  }

  checkWinner() {
	const winner = this.secretWord.length === this.guessedLetter.length
	if (winner) setTimeout(() => canvas.winner(), 1000)
	return winner ? true : false

  }
}

document.getElementById('startButton').onclick = function () {
  hangman = new Hangman();
  canvas = new HangmanCanvas(hangman.getWord())
  canvas.createBoard()
  canvas.drawLines()
  input.focus()
};

document.onkeydown = function (e) {
  if (!hangman.checkGameOver() && !hangman.checkWinner()) {
	if (hangman.checkIfLetter(e.which)) {
	  if (hangman.checkClickedLetters(e.key)) {
		if (hangman.secretWord.includes(e.key)) {
		  // correct letter
		  const indexes = [];

		  for(let i = 0; i < hangman.secretWord.length; i++) {
			if (hangman.secretWord[i] === e.key) indexes.push(i);
		  }

		  indexes.map(index => {
			hangman.addCorrectLetter(index);
			canvas.writeCorrectLetter(index);
		  })

		} else {
		  // wrong letter
		  hangman.addWrongLetter();
		  canvas.writeWrongLetter(e.key, hangman.errorsLeft);
		  canvas.drawHangman(canvas.hangmanShape[7-hangman.errorsLeft])
		}

	  } else {
		alert('Letra repetida. Escolha outra letra.')
	  }
	}
  }
};