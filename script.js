const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addButton');
const toDoList = document.getElementById('toDo');

function saveTasksToLocalStorage() {
    const columns = ['toDo', 'inProgress', 'done'];
    const tasks = [];
    columns.forEach(colId => {
        const col = document.getElementById(colId);
        Array.from(col.children).forEach(item => {
            if (item.classList.contains('taskItem')) {
                tasks.push({
                    text: item.childNodes[0].nodeValue,
                    column: colId
                });
            }
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.forEach(task => {
        const listItem = document.createElement('div');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '✖';
        deleteButton.className = 'deleteButton';
        listItem.textContent = task.text;
        listItem.className = `taskItem ${task.column}`;
        listItem.draggable = true;
        listItem.addEventListener('dragstart', handleDragStart);
        listItem.appendChild(deleteButton);
        deleteButton.addEventListener('click', () => {
            listItem.remove();
            saveTasksToLocalStorage();
        });
        document.getElementById(task.column).appendChild(listItem);
    });
}

addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const listItem = document.createElement('div');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '✖';
        deleteButton.className = 'deleteButton';
        listItem.textContent = taskText;
        listItem.className = 'taskItem toDo';
        listItem.draggable = true;
        listItem.addEventListener('dragstart', handleDragStart);
        listItem.appendChild(deleteButton);
        deleteButton.addEventListener('click', () => {
            listItem.remove();
            saveTasksToLocalStorage();
        });
        toDoList.appendChild(listItem);
        taskInput.value = '';
        saveTasksToLocalStorage();
    }
});

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', null);
    e.dataTransfer.setData('taskId', 'dragged');
    window.draggedTask = e.target;
}

function handleDrop(e) {
    e.preventDefault();
    if (window.draggedTask) {
        e.currentTarget.appendChild(window.draggedTask);
        window.draggedTask.classList.remove('toDo', 'inProgress', 'done');
        if (e.currentTarget.id === 'toDo') {
            window.draggedTask.classList.add('toDo');
        } else if (e.currentTarget.id === 'inProgress') {
            window.draggedTask.classList.add('inProgress');
        } else if (e.currentTarget.id === 'done') {
            window.draggedTask.classList.add('done');
        }
        window.draggedTask = null;
        saveTasksToLocalStorage();
    }
}

function handleDragOver(e) {
    e.preventDefault();
}

['toDo', 'inProgress', 'done'].forEach(id => {
    const column = document.getElementById(id);
    column.addEventListener('dragover', handleDragOver);
    column.addEventListener('drop', handleDrop);
});

window.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);