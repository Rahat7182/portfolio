function loadGame(game) {
    const container = document.getElementById('game-container');
    container.innerHTML = '';

    if (game === 'clicker') {
        container.innerHTML = `
            <div class="game">
                <p>Осталось: <span id="timer">30</span>s</p>
                <p>Счёт: <span id="score">0</span></p>
                <p>Рекорд: <span id="record">${localStorage.getItem('clickerRecord') || 0}</span></p>
                <button id="click-btn" class="click-btn">НАЖМИ МЕНЯ!</button>
                <button id="reset-btn">Сбросить</button>
            </div>`;
    } 
    else if (game === 'adventure') {
    } 
    else if (game === 'guess') {
    } 
    else if (game === 'reaction') {
        container.innerHTML = `
            <div class="game reaction-game">
                <h3>Игра на реакцию</h3>
                <p>Осталось: <span id="time-left">30</span> сек</p>
                <p>Нажатий: <span id="clicks">0</span></p>
                <p>Среднее время реакции: <span id="avg">—</span> мс</p>
                <div id="reaction-area" class="reaction-area">
                    <button id="target-btn" style="display:none;">НАЖМИ!</button>
                </div>
                <button id="start-reaction">Начать</button>
                <button id="reset-reaction">Сброс</button>
            </div>`;

        const area = document.getElementById('reaction-area');
        const btn = document.getElementById('target-btn');
        const startBtn = document.getElementById('start-reaction');
        const resetBtn = document.getElementById('reset-reaction');
        const timeEl = document.getElementById('time-left');
        const clicksEl = document.getElementById('clicks');
        const avgEl = document.getElementById('avg');

        let timeLeft = 30;
        let clicks = 0;
        let reactionTimes = [];
        let gameActive = false;
        let nextAppearTimeout;
        let startTime;

        function resetGame() {
            clearTimeout(nextAppearTimeout);
            btn.style.display = 'none';
            timeLeft = 30;
            clicks = 0;
            reactionTimes = [];
            gameActive = false;
            timeEl.textContent = timeLeft;
            clicksEl.textContent = clicks;
            avgEl.textContent = '—';
        }

        function scheduleNext() {
            if (!gameActive) return;
            const delay = 1000 + Math.random() * 4000;
            nextAppearTimeout = setTimeout(() => {
                if (!gameActive) return;
                const maxX = area.clientWidth - btn.offsetWidth - 20;
                const maxY = area.clientHeight - btn.offsetHeight - 20;
                const x = Math.max(10, Math.random() * maxX);
                const y = Math.max(10, Math.random() * maxY);

                btn.style.left = x + 'px';
                btn.style.top  = y + 'px';
                btn.style.display = 'block';
                startTime = performance.now();
            }, delay);
        }

        function endGame() {
            gameActive = false;
            clearTimeout(nextAppearTimeout);
            btn.style.display = 'none';
            const avg = clicks > 0 
                ? (reactionTimes.reduce((a,b)=>a+b,0) / clicks).toFixed(0) 
                : 0;
            avgEl.textContent = avg + ' мс';
            alert(`Игра окончена!\nНажатий: ${clicks}\nСредняя реакция: ${avg} мс`);
        }

        startBtn.addEventListener('click', () => {
            if (gameActive) return;
            resetGame();
            gameActive = true;
            timeEl.textContent = timeLeft;
            scheduleNext();

            const timer = setInterval(() => {
                timeLeft--;
                timeEl.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    endGame();
                }
            }, 1000);
        });

        resetBtn.addEventListener('click', resetGame);

        btn.addEventListener('click', () => {
            if (!gameActive || !startTime) return;
            const reaction = performance.now() - startTime;
            reactionTimes.push(reaction);
            clicks++;
            clicksEl.textContent = clicks;
            btn.style.display = 'none';
            startTime = null;
            scheduleNext();
        });
    } 
    else if (game === 'tictactoe') {
        container.innerHTML = `
            <div class="game tictactoe-game">
                <h3>Крестики-нолики</h3>
                <div class="score">
                    <p>Побед X: <span id="winX">0</span></p>
                    <p>Побед O: <span id="winO">0</span></p>
                </div>
                <label><input type="checkbox" id="vs-ai"> Играть против компьютера</label>
                <div id="board" class="board"></div>
                <p id="status">Ход: X</p>
                <button id="reset-tictactoe">Новая игра</button>
            </div>`;

        const boardEl = document.getElementById('board');
        const statusEl = document.getElementById('status');
        const resetBtn = document.getElementById('reset-tictactoe');
        const vsAI = document.getElementById('vs-ai');
        const winXEl = document.getElementById('winX');
        const winOEl = document.getElementById('winO');

        let board = Array(9).fill(null);
        let currentPlayer = 'X';
        let gameOver = false;
        let wins = { X: 0, O: 0 };

        function createBoard() {
            boardEl.innerHTML = '';
            board.forEach((_, i) => {
                const cell = document.createElement('button');
                cell.classList.add('cell');
                cell.dataset.index = i;
                cell.addEventListener('click', handleClick);
                boardEl.appendChild(cell);
            });
        }

        function handleClick(e) {
            if (gameOver) return;
            const idx = e.target.dataset.index;
            if (board[idx]) return;

            board[idx] = currentPlayer;
            e.target.textContent = currentPlayer;
            e.target.classList.add(currentPlayer);

            if (checkWin(currentPlayer)) {
                statusEl.textContent = `Победил ${currentPlayer}!`;
                wins[currentPlayer]++;
                updateScore();
                gameOver = true;
                return;
            }
            if (board.every(v => v)) {
                statusEl.textContent = 'Ничья!';
                gameOver = true;
                return;
            }

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusEl.textContent = `Ход: ${currentPlayer}`;

            if (vsAI.checked && currentPlayer === 'O' && !gameOver) {
                setTimeout(aiMove, 400);
            }
        }

        function aiMove() {
            let available = board.map((v,i) => v ? null : i).filter(v=>v!==null);
            if (available.length === 0) return;
            const randomIdx = available[Math.floor(Math.random() * available.length)];
            board[randomIdx] = 'O';

            const cell = boardEl.querySelector(`[data-index="${randomIdx}"]`);
            cell.textContent = 'O';
            cell.classList.add('O');

            if (checkWin('O')) {
                statusEl.textContent = 'Победил O (компьютер)!';
                wins.O++;
                updateScore();
                gameOver = true;
                return;
            }
            if (board.every(v => v)) {
                statusEl.textContent = 'Ничья!';
                gameOver = true;
                return;
            }

            currentPlayer = 'X';
            statusEl.textContent = `Ход: ${currentPlayer}`;
        }

        function checkWin(player) {
            const wins = [
                [0,1,2], [3,4,5], [6,7,8],
                [0,3,6], [1,4,7], [2,5,8],
                [0,4,8], [2,4,6]
            ];
            return wins.some(combo => 
                combo.every(i => board[i] === player)
            );
        }

        function updateScore() {
            winXEl.textContent = wins.X;
            winOEl.textContent = wins.O;
        }

        function resetGame() {
            board = Array(9).fill(null);
            currentPlayer = 'X';
            gameOver = false;
            statusEl.textContent = 'Ход: X';
            createBoard();
        }

        resetBtn.addEventListener('click', resetGame);
        vsAI.addEventListener('change', resetGame);
        
        createBoard();
    }
    else if (game === 'maze') {
    container.innerHTML = `
        <div class="game maze-game">
            <h3>Лабиринт</h3>
            <p>Время: <span id="maze-timer">0</span> сек</p>
            <p id="maze-message" style="min-height:1.5em; color:#28a745; font-weight:bold;"></p>
            <div id="maze-grid" class="maze-grid"></div>
            <button id="maze-restart">Новая игра</button>
        </div>`;

    const gridEl = document.getElementById('maze-grid');
    const timerEl = document.getElementById('maze-timer');
    const messageEl = document.getElementById('maze-message');
    const restartBtn = document.getElementById('maze-restart');

    let maze = [
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,2,0,0,1,0,0,0,0,0,1],
        [1,1,1,0,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,1],
        [1,1,1,1,1,0,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,1,1,1]
    ];

    const ROWS = maze.length;
    const COLS = maze[0].length;

    let playerRow, playerCol;
    let startTime;
    let timerInterval;
    let gameActive = false;

    function findStartAndGoal() {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (maze[r][c] === 2) { playerRow = r; playerCol = c; }
                if (maze[r][c] === 3) { }
    }
}
    }

    function renderMaze() {
        gridEl.innerHTML = '';
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = document.createElement('div');
                cell.classList.add('maze-cell');

                if (maze[r][c] === 1) {
                    cell.classList.add('wall');
                } else if (r === playerRow && c === playerCol) {
                    cell.classList.add('player');
                } else if (maze[r][c] === 3) {
                    cell.classList.add('goal');
                } else {
                    cell.classList.add('path');
                }

                gridEl.appendChild(cell);
            }
        }
    }

    function movePlayer(dr, dc) {
        if (!gameActive) return;
        const newRow = playerRow + dr;
        const newCol = playerCol + dc;

        if (
            newRow >= 0 && newRow < ROWS &&
            newCol >= 0 && newCol < COLS &&
            maze[newRow][newCol] !== 1
        ) {
            playerRow = newRow;
            playerCol = newCol;
            renderMaze();

            if (maze[playerRow][playerCol] === 3) {
                gameActive = false;
                clearInterval(timerInterval);
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                messageEl.textContent = `Победа! Время: ${timeSpent} сек`;
                messageEl.style.color = '#28a745';
            }
        }
    }

    function startTimer() {
        startTime = Date.now();
        timerEl.textContent = '0';
        timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            timerEl.textContent = elapsed;
        }, 1000);
    }

    function startGame() {
        findStartAndGoal();
        messageEl.textContent = '';
        gameActive = true;
        startTimer();
        renderMaze();
    }

    function resetGame() {
        clearInterval(timerInterval);
        timerEl.textContent = '0';
        messageEl.textContent = '';
        gameActive = false;
        startGame();
    }

    function handleKey(e) {
        if (!gameActive) return;
        switch (e.key) {
            case 'ArrowUp':    movePlayer(-1, 0); break;
            case 'ArrowDown':  movePlayer(1, 0);  break;
            case 'ArrowLeft':  movePlayer(0, -1); break;
            case 'ArrowRight': movePlayer(0, 1);  break;
        }
    }

    document.addEventListener('keydown', handleKey);

    restartBtn.addEventListener('click', resetGame);
        
    startGame();
}
}