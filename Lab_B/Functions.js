// Functions.js

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const taskList = document.getElementById("task-list");
    const newTaskInput = document.getElementById("new-task");
    const dueDateInput = document.getElementById("due-date");
    const addTaskButton = document.getElementById("add-task");
    const tasks = [];

    function updateLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem("tasks"));
        if (storedTasks) {
            tasks.push(...storedTasks);
            tasks.forEach(task => createTaskElement(task));
        }
    }

    function createTaskElement(task) {
        const taskElement = document.createElement("li");
        taskElement.innerHTML = `
            <span id="task-name-${task.name}">${task.name}</span>
            <span id="due-date-display-${task.name}">Termin: ${task.dueDate}</span>
            <input type="text" id="task-edit-${task.name}" style="display: none;" value="${task.name}">
            <input type="datetime-local" id="due-date-${task.name}" style="display: none;" value="${task.dueDate}">
            <button class="edit">Edytuj</button>
            <button class="delete">Usuń</button>
        `;
        taskList.appendChild(taskElement);

        const editButton = taskElement.querySelector(".edit");
        const deleteButton = taskElement.querySelector(".delete");
        const deleteButtonAll = taskElement.querySelector(".delete-all");

        editButton.addEventListener("click", () => {
            const taskNameDisplay = taskElement.querySelector(`#task-name-${task.name}`);
            const dueDateDisplay = taskElement.querySelector(`#due-date-display-${task.name}`);
            const taskNameEdit = taskElement.querySelector(`#task-edit-${task.name}`);
            const dueDateEdit = taskElement.querySelector(`#due-date-${task.name}`);

            taskNameDisplay.style.display = "none";
            dueDateDisplay.style.display = "none";
            taskNameEdit.style.display = "inline";
            dueDateEdit.style.display = "inline";
            taskNameEdit.focus();
        });

        const taskNameEdit = taskElement.querySelector(`#task-edit-${task.name}`);
        taskNameEdit.addEventListener("blur", () => {
            const taskNameDisplay = taskElement.querySelector(`#task-name-${task.name}`);
            const taskNameEdit = taskElement.querySelector(`#task-edit-${task.name}`);

            taskNameDisplay.textContent = taskNameEdit.value;
            taskNameDisplay.style.display = "inline";
            taskNameEdit.style.display = "none";
            task.name = taskNameEdit.value;
            updateLocalStorage();
        });

        const dueDateEdit = taskElement.querySelector(`#due-date-${task.name}`);
        dueDateEdit.addEventListener("blur", () => {
            const dueDateDisplay = taskElement.querySelector(`#due-date-display-${task.name}`);
            const dueDateEdit = taskElement.querySelector(`#due-date-${task.name}`);

            dueDateDisplay.textContent = `Termin: ${dueDateEdit.value}`;
            dueDateDisplay.style.display = "inline";
            dueDateEdit.style.display = "none";
            task.dueDate = dueDateEdit.value;
            updateLocalStorage();
        });

        deleteButton.addEventListener("click", () => {
            const index = tasks.indexOf(task);
            if (index > -1) {
                tasks.splice(index, 1);
            }
            taskList.removeChild(taskElement);
            updateLocalStorage();
        });

        
    }

    loadTasks();

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        tasks.forEach(task => {
            const taskElement = taskList.querySelector(`li span[id^="task-name-${task.name}"]`);
            if (taskElement) {
                const taskText = task.name.toLowerCase();
                const index = taskText.indexOf(query);
    
                if (index !== -1) {
                    const highlightedText = task.name.substring(0, index) +
                        `<span class="highlight">${task.name.substring(index, index + query.length)}</span>` +
                        task.name.substring(index + query.length);
    
                    taskElement.innerHTML = `<span id="task-name-${task.name}">${highlightedText}</span>`;
                    taskElement.closest("li").style.display = "block";
                } else {
                    taskElement.closest("li").style.display = "none";
                }
            }
        });
    });
    
    addTaskButton.addEventListener("click", () => {
        const name = newTaskInput.value;
        const dueDate = dueDateInput.value;

        if (name.length < 3 || name.length > 255) {
            alert("Nazwa zadania musi mieć co najmniej 3 znaki i nie więcej niż 255 znaków.");
            return;
        }

        if (new Date(dueDate).getTime() <= Date.now()) {
            alert("Termin wykonania zadania musi być w przyszłości.");
            return;
        }

        const task = { name, dueDate };
        tasks.push(task);
        createTaskElement(task);
        newTaskInput.value = "";
        dueDateInput.value = "";
        updateLocalStorage();
    });
});
