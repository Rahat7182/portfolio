
const DIFFICULTY_XP = {
    easy:   10,
    medium: 25,
    hard:   50,
    epic:   100
};

class Character {
    constructor() {
        this.name = "Герой";
        this.level = 1;
        this.xp = 0;
        this.created = new Date().toLocaleDateString("ru-RU");
    }

    addXP(amount) {
        this.xp += amount;
        let needed = this.getNeededXP();
        let leveledUp = false;

        while (this.xp >= needed) {
            this.level++;
            this.xp -= needed;
            needed = this.getNeededXP();
            leveledUp = true;
        }

        this.save();
        this.render();
        if (leveledUp) this.showLevelUp();
    }

    getNeededXP() {
        return this.level * 100;
    }

    save() {
        localStorage.setItem("rpgCharacter", JSON.stringify({
            name: this.name,
            level: this.level,
            xp: this.xp,
            created: this.created
        }));
    }

    load() {
        const data = localStorage.getItem("rpgCharacter");
        if (data) {
            const parsed = JSON.parse(data);
            this.name = parsed.name;
            this.level = parsed.level;
            this.xp = parsed.xp;
            this.created = parsed.created;
        } else {
            const name = prompt("Назови своего героя:", "Герой");
            if (name && name.trim()) this.name = name.trim();
            this.save();
        }
    }

    render() {
        document.getElementById("char-name").textContent = this.name;
        document.getElementById("level").textContent = this.level;
        const needed = this.getNeededXP();
        document.getElementById("xp-text").textContent = `${this.xp} / ${needed} XP`;
        document.getElementById("xp-bar").value = this.xp;
        document.getElementById("xp-bar").max = needed;
        document.getElementById("stats-created").textContent = this.created;
    }

    showLevelUp() {
        showNotification(`✨ Уровень повышен! Теперь ${this.level} уровень! ✨`, 4000);
    }
}

class Task {
    constructor(title, desc = "", difficulty = "easy") {
        this.id = Date.now() + Math.random();
        this.title = title;
        this.desc = desc;
        this.difficulty = difficulty;
        this.xp = DIFFICULTY_XP[difficulty];
        this.completed = false;
        this.dateCompleted = null;
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(title, desc, difficulty) {
        if (!title.trim()) return;
        const task = new Task(title.trim(), desc.trim(), difficulty);
        this.tasks.push(task);
        this.save();
        this.render();
    }

    completeTask(id, completed) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = completed;
            task.dateCompleted = completed ? new Date().toLocaleString("ru-RU") : null;
            this.save();
            this.render();

            if (completed && character) {
                character.addXP(task.xp);
                showNotification(`+${task.xp} XP за квест «${task.title}»`, 3000);
            }
        }
    }

    deleteTask(id) {
        if (!confirm("Удалить этот квест?")) return;
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.save();
        this.render();
    }

    save() {
        localStorage.setItem("rpgTasks", JSON.stringify(this.tasks));
    }

    load() {
        const data = localStorage.getItem("rpgTasks");
        if (data) this.tasks = JSON.parse(data);
    }

    render() {
        const activeList = document.getElementById("active-tasks");
        const completedList = document.getElementById("completed-tasks");

        activeList.innerHTML = "";
        completedList.innerHTML = "";

        this.tasks.forEach(task => {
            const li = document.createElement("li");
            li.classList.add("task-item");
            if (task.completed) li.classList.add("completed");

            li.innerHTML = `
                <input type="checkbox" ${task.completed ? "checked" : ""} 
                       onchange="taskManager.completeTask(${task.id}, this.checked)">
                <div class="task-content">
                    <strong>${task.title}</strong>
                    ${task.desc ? `<p>${task.desc}</p>` : ""}
                    <span class="task-difficulty ${task.difficulty}">${task.difficulty.toUpperCase()} +${task.xp} XP</span>
                    ${task.dateCompleted ? `<small>Завершено: ${task.dateCompleted}</small>` : ""}
                </div>
                <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">×</button>
            `;

            if (task.completed) {
                completedList.appendChild(li);
            } else {
                activeList.appendChild(li);
            }
        });
        
        const completedCount = this.tasks.filter(t => t.completed).length;
        const totalXP = this.tasks.reduce((sum, t) => sum + (t.completed ? t.xp : 0), 0);

        document.getElementById("stats-completed").textContent = completedCount;
        document.getElementById("stats-xp").textContent = totalXP;
    }
}

const character = new Character();
const taskManager = new TaskManager();

function showNotification(text, duration = 3000) {
    const notif = document.getElementById("notification");
    notif.textContent = text;
    notif.classList.add("show");
    setTimeout(() => notif.classList.remove("show"), duration);
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("rpg-tasks")) {
        character.load();
        taskManager.load();

        character.render();
        taskManager.render();

        document.getElementById("add-task-btn").addEventListener("click", () => {
            const title = document.getElementById("task-title").value;
            const desc = document.getElementById("task-desc").value;
            const diff = document.querySelector('input[name="difficulty"]:checked').value;

            taskManager.addTask(title, desc, diff);

            document.getElementById("task-title").value = "";
            document.getElementById("task-desc").value = "";
        });

        document.getElementById("reset-progress").addEventListener("click", () => {
            if (confirm("Сбросить ВЕСЬ прогресс? Это действие нельзя отменить.")) {
                localStorage.removeItem("rpgCharacter");
                localStorage.removeItem("rpgTasks");
                location.reload();
            }
        });
    }
});