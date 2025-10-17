let tasks = [];
let editingIndex = -1;
let currentFilter = 'all';

function renderTasks() {
    const taskList = document.getElementById('task-list');
    let filteredTasks = filterTasksByType(tasks, currentFilter);
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state">No tasks found</div>';
    } else {
        taskList.innerHTML = filteredTasks.map((task, index) => {
            const originalIndex = tasks.indexOf(task);
            return `
            <div class="task-item">
                <div class="task-content">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${originalIndex})">
                    <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                </div>
                <span class="task-date">${task.date}</span>
                <div class="task-actions">
                    <button class="edit-btn" onclick="openEditModal(${originalIndex})" title="Edit">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#DDC3C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#DDC3C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="delete-task-btn" onclick="deleteTask(${originalIndex})" title="Delete">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="#DDC3C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                        <line x1="10" y1="11" x2="10" y2="17" stroke="#DDC3C3" stroke-width="2" stroke-linecap="round"/>
                        <line x1="14" y1="11" x2="14" y2="17" stroke="#DDC3C3" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        }).join('');
    }
}

function addTask() {
    const input = document.getElementById('todo-input');
    const dateInput = document.getElementById('todo-date');
    const taskText = input.value.trim();
    const taskDate = dateInput.value;
    
    if (taskText && taskDate) {
        const formattedDate = new Date(taskDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        tasks.push({
            text: taskText,
            date: formattedDate,
            rawDate: taskDate,
            completed: false
        });
        
        input.value = '';
        dateInput.value = '';
        renderTasks();
    } else {
        alert('Please fill in both task and due date!');
    }
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks.splice(index, 1);
        renderTasks();
    }
}

function deleteAllTasks() {
    if (tasks.length > 0) {
        if (confirm('Are you sure you want to delete all tasks?')) {
            tasks = [];
            renderTasks();
        }
    }
}

// Edit Modal Functions
function openEditModal(index) {
    editingIndex = index;
    const task = tasks[index];
    
    document.getElementById('edit-input').value = task.text;
    document.getElementById('edit-date').value = task.rawDate;
    document.getElementById('edit-modal').classList.add('active');
}

function closeEditModal() {
    editingIndex = -1;
    document.getElementById('edit-modal').classList.remove('active');
}

function saveEdit() {
    const newText = document.getElementById('edit-input').value.trim();
    const newDate = document.getElementById('edit-date').value;
    
    if (newText && newDate && editingIndex !== -1) {
        const formattedDate = new Date(newDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        tasks[editingIndex].text = newText;
        tasks[editingIndex].date = formattedDate;
        tasks[editingIndex].rawDate = newDate;
        
        closeEditModal();
        renderTasks();
    } else {
        alert('Please fill in all fields!');
    }
}

// Filter Functions
function toggleFilterMenu() {
    const filterMenu = document.getElementById('filter-menu');
    filterMenu.classList.toggle('active');
}

function filterTasks(filterType) {
    currentFilter = filterType;
    toggleFilterMenu();
    renderTasks();
}

function filterTasksByType(taskList, filterType) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch(filterType) {
        case 'all':
            return taskList;
        
        case 'today':
            return taskList.filter(task => {
                const taskDate = new Date(task.rawDate);
                taskDate.setHours(0, 0, 0, 0);
                return taskDate.getTime() === today.getTime();
            });
        
        case 'week':
            const weekFromNow = new Date(today);
            weekFromNow.setDate(today.getDate() + 7);
            return taskList.filter(task => {
                const taskDate = new Date(task.rawDate);
                return taskDate >= today && taskDate <= weekFromNow;
            });
        
        case 'month':
            const monthFromNow = new Date(today);
            monthFromNow.setMonth(today.getMonth() + 1);
            return taskList.filter(task => {
                const taskDate = new Date(task.rawDate);
                return taskDate >= today && taskDate <= monthFromNow;
            });
        
        case 'completed':
            return taskList.filter(task => task.completed);
        
        case 'pending':
            return taskList.filter(task => !task.completed);
        
        default:
            return taskList;
    }
}

// Close filter menu when clicking outside
document.addEventListener('click', function(event) {
    const filterBtn = document.getElementById('filter-btn');
    const filterMenu = document.getElementById('filter-menu');
    
    if (!filterBtn.contains(event.target) && !filterMenu.contains(event.target)) {
        filterMenu.classList.remove('active');
    }
});

// Close modal when clicking outside
document.getElementById('edit-modal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeEditModal();
    }
});

// Allow Enter key to add task
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('todo-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Initial render
    renderTasks();
});