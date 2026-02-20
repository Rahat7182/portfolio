document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 50;
            if (scrollY >= top) current = section.id;
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.href.includes(`#${current}`)) link.classList.add('active');
        });
    });

    document.getElementById('contact-form').addEventListener('submit', e => {
        e.preventDefault();
        if (e.target.checkValidity()) alert('Отправлено!');
    });
});

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
        let score = 0, time = 30, interval;
        const scoreEl = document.getElementById('score');
        const timerEl = document.getElementById('timer');
        const recordEl = document.getElementById('record');
        document.getElementById('click-btn').addEventListener('click', () => {
            if (time > 0) score++;
            scoreEl.textContent = score;
        });
        document.getElementById('reset-btn').addEventListener('click', () => { score = 0; scoreEl.textContent = 0; });
        interval = setInterval(() => {
            time--;
            timerEl.textContent = time;
            if (time <= 0) {
                clearInterval(interval);
                alert(`Игра окончена! Счёт: ${score}`);
                let record = localStorage.getItem('clickerRecord') || 0;
                if (score > record) {
                    localStorage.setItem('clickerRecord', score);
                    recordEl.textContent = score;
                }
            }
        }, 1000);
    } else if (game === 'adventure') {
        container.innerHTML = `
            <div class="game adventure-game">
                <h2>Генератор приключений</h2>
                <p id="adventure-text" class="story-text"></p>
                <button id="generate-btn">Сгенерировать</button>
                <button id="generate-again">Ещё раз</button>
                <div id="history" class="history-list"></div>
            </div>`;
        const textEl = document.getElementById('adventure-text');
        const historyEl = document.getElementById('history');
        const characters = ['рыцарь', 'маг', 'вор'];
        const locations = ['тёмный лес', 'заброшенный замок', 'подводное царство'];
        const villains = ['дракон', 'колдун', 'гоблин'];
        let adventures = JSON.parse(localStorage.getItem('adventures') || '[]');
        adventures.forEach(adv => {
            let p = document.createElement('p');
            p.textContent = adv;
            historyEl.appendChild(p);
        });
        function generate() {
            const char = characters[Math.floor(Math.random() * characters.length)];
            const loc = locations[Math.floor(Math.random() * locations.length)];
            const vill = villains[Math.floor(Math.random() * villains.length)];
            const text = `Ваш персонаж — ${char} находится в ${loc} и сражается с ${vill}.`;
            textEl.textContent = text;
            adventures.push(text);
            localStorage.setItem('adventures', JSON.stringify(adventures));
            let p = document.createElement('p');
            p.textContent = text;
            historyEl.appendChild(p);
        }
        document.getElementById('generate-btn').addEventListener('click', generate);
        document.getElementById('generate-again').addEventListener('click', generate);
    } else if (game === 'guess') {
        container.innerHTML = `
            <div class="game">
                <p>Осталось попыток: <span id="attempts">10</span></p>
                <input type="number" id="guess-input" min="1" max="100">
                <button id="guess-btn">Проверить</button>
                <p id="message"></p>
                <button id="restart-btn">Новая игра</button>
            </div>`;
        let number = Math.floor(Math.random() * 100) + 1;
        let attempts = 10;
        const messageEl = document.getElementById('message');
        const attemptsEl = document.getElementById('attempts');
        document.getElementById('guess-btn').addEventListener('click', () => {
            const guess = parseInt(document.getElementById('guess-input').value);
            if (isNaN(guess) || guess < 1 || guess > 100) return alert('Неверный ввод');
            attempts--;
            attemptsEl.textContent = attempts;
            if (guess < number) messageEl.textContent = 'Больше!';
            else if (guess > number) messageEl.textContent = 'Меньше!';
            else { messageEl.textContent = 'Правильно!'; alert('Победа!'); }
            if (attempts <= 0) { alert(`Игра окончена! Число: ${number}`); }
        });
        document.getElementById('restart-btn').addEventListener('click', () => {
            number = Math.floor(Math.random() * 100) + 1;
            attempts = 10;
            attemptsEl.textContent = 10;
            messageEl.textContent = '';
        });
    }
}