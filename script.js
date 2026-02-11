const totalCasas = 100;
let playerPos = 0;
let stars = 0;

const bancoDePerguntas = [
    {
        q: "Um colega está falando sobre um assunto que você não gosta. O que fazer?",
        opts: [
            { t: "Dizer 'isso é chato' e sair andando.", v: false },
            { t: "Ouvir por um pouco e depois tentar mudar de assunto educadamente.", v: true },
            { t: "Gritar para ele parar de falar.", v: false }
        ]
    },
    {
        q: "Você quer entrar em uma conversa de amigos. Qual a melhor forma?",
        opts: [
            { t: "Ficar parado bem perto encarando eles.", v: false },
            { t: "Esperar uma pausa e perguntar: 'Posso me juntar a vocês?'", v: true },
            { t: "Começar a falar alto sobre outro assunto.", v: false }
        ]
    }
    // Adicione mais 50-100 perguntas aqui seguindo o padrão
];

const obstaculos = [
    "O pátio está muito barulhento! (Sobrecarga Sensorial) - Volte 4 casas para se acalmar.",
    "A rotina mudou e não te avisaram. (Imprevisto) - Volte 2 casas para se organizar.",
    "Você esqueceu de carregar seu fone de ouvido. - Volte 3 casas."
];

function createBoard() {
    const board = document.getElementById('board');
    for (let i = 0; i < totalCasas; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        if (i % 15 === 0 && i !== 0) {
            tile.classList.add('obs');
            tile.innerHTML = "⚠️";
        } else {
            tile.innerText = i;
        }
        tile.id = `tile-${i}`;
        board.appendChild(tile);
    }
    updateUI();
}

function rollDice() {
    const roll = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice-face').innerText = roll;
    movePlayer(roll);
}

function movePlayer(steps) {
    playerPos = Math.min(totalCasas - 1, playerPos + steps);
    updateUI();
    
    setTimeout(() => {
        const currentTile = document.getElementById(`tile-${playerPos}`);
        if (currentTile.classList.contains('obs')) {
            triggerObstacle();
        } else {
            triggerChallenge();
        }
    }, 600);
}

function triggerObstacle() {
    const msg = obstaculos[Math.floor(Math.random() * obstaculos.length)];
    alert(msg);
    playerPos = Math.max(0, playerPos - 3);
    updateUI();
}

function triggerChallenge() {
    const quest = bancoDePerguntas[Math.floor(Math.random() * bancoDePerguntas.length)];
    document.getElementById('modal-question').innerText = quest.q;
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    quest.opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = opt.t;
        btn.onclick = () => checkAnswer(opt.v);
        container.appendChild(btn);
    });
    document.getElementById('modal').classList.remove('hidden');
}

function checkAnswer(isCorrect) {
    document.getElementById('modal').classList.add('hidden');
    if (isCorrect) {
        stars += 20;
        alert("Excelente escolha social! +20 Estrelas");
    } else {
        alert("Essa ação pode confundir os outros. Volte 2 casas.");
        playerPos = Math.max(0, playerPos - 2);
    }
    updateUI();
}

function updateUI() {
    const tile = document.getElementById(`tile-${playerPos}`);
    const token = document.getElementById('player-token');
    token.style.left = `${tile.offsetLeft + 15}px`;
    token.style.top = `${tile.offsetTop + 15}px`;
    
    document.getElementById('star-count').innerText = stars;
    document.getElementById('pos-text').innerText = `Casa ${playerPos}/100`;
    document.getElementById('progress-fill').style.width = `${playerPos}%`;
    tile.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

window.onload = createBoard;
