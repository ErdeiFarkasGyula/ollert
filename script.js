const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addButton');
const toDoList = document.getElementById('toDo');

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
        });
        toDoList.appendChild(listItem);
        taskInput.value = '';
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