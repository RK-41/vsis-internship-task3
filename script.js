document.addEventListener('DOMContentLoaded', loadTodos);
document.getElementById('add-btn').addEventListener('click', addTodo);

function loadTodos() {
	const todos = JSON.parse(localStorage.getItem('todos')) || [];
	todos.forEach((todo) => {
		addTodoToDOM(todo.text, todo.completed);
	});
}

function addTodo() {
	const todoText = document.getElementById('new-todo').value.trim();
	if (todoText === '') return;

	addTodoToDOM(todoText);
	saveTodoToLocalStorage(todoText);
	document.getElementById('new-todo').value = '';
}

function addTodoToDOM(todoText, completed = false) {
	const todoList = document.getElementById('todo-list');
	const todoItem = document.createElement('li');
	todoItem.className = 'todo-item';
	if (completed) {
		todoItem.classList.add('completed');
	}
	todoItem.innerHTML = `
        <span class="todo-text">${todoText}</span>
        <div>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
            <button class="complete-btn">Complete</button>
        </div>
    `;

	todoList.appendChild(todoItem);

	const deleteBtn = todoItem.querySelector('.delete-btn');
	const editBtn = todoItem.querySelector('.edit-btn');
	const completeBtn = todoItem.querySelector('.complete-btn');

	deleteBtn.addEventListener('click', () => {
		todoItem.remove();
		removeTodoFromLocalStorage(todoText);
	});

	editBtn.addEventListener('click', () => {
		editTodoItem(todoItem, todoText);
	});

	completeBtn.addEventListener('click', () => {
		todoItem.classList.toggle('completed');
		updateTodoStatusInLocalStorage(
			todoText,
			todoItem.classList.contains('completed')
		);
	});
}

function editTodoItem(todoItem, oldText) {
	const todoTextElement = todoItem.querySelector('.todo-text');
	const currentText = todoTextElement.textContent;
	const newText = prompt('Edit your todo', currentText);
	if (newText !== null && newText.trim() !== '') {
		todoTextElement.textContent = newText.trim();
		updateTodoTextInLocalStorage(oldText, newText.trim());
	}
}

function saveTodoToLocalStorage(todoText) {
	const todos = JSON.parse(localStorage.getItem('todos')) || [];
	todos.push({ text: todoText, completed: false });
	localStorage.setItem('todos', JSON.stringify(todos));
}

function removeTodoFromLocalStorage(todoText) {
	let todos = JSON.parse(localStorage.getItem('todos')) || [];
	todos = todos.filter((todo) => todo.text !== todoText);
	localStorage.setItem('todos', JSON.stringify(todos));
}

function updateTodoStatusInLocalStorage(todoText, completed) {
	const todos = JSON.parse(localStorage.getItem('todos')) || [];
	const todoIndex = todos.findIndex((todo) => todo.text === todoText);
	if (todoIndex !== -1) {
		todos[todoIndex].completed = completed;
		localStorage.setItem('todos', JSON.stringify(todos));
	}
}

function updateTodoTextInLocalStorage(oldText, newText) {
	const todos = JSON.parse(localStorage.getItem('todos')) || [];
	const todoIndex = todos.findIndex((todo) => todo.text === oldText);
	if (todoIndex !== -1) {
		todos[todoIndex].text = newText;
		localStorage.setItem('todos', JSON.stringify(todos));
	}
}
