document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const taskTimeInput = document.getElementById("taskTime");
    const taskDateInput = document.getElementById("taskDate");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    let tasks = [];

    // Load tasks from local storage on page load
    if (localStorage.getItem("tasks")) {
        tasks = JSON.parse(localStorage.getItem("tasks"));
        renderTasks();
    }

   // Add a task to the list and save to local storage
	function addTask() {
	    const taskText = taskInput.value.trim();
	    const taskTime = taskTimeInput.value.trim();
	    const taskDate = taskDateInput.value;
	    
	    // Check if taskText is empty or if both taskDate and taskTime are empty
	    if (taskText === "" || (taskDate === "" && taskTime === "")) {
	        alert("Please fill in the task description and provide a date and/or time.");
	        return;
	    }

	    tasks.push({ text: taskText, time: taskTime, date: taskDate, completed: false });
	    saveTasksToLocalStorage();
	    renderTasks();

	    // Clear the input fields
	    taskInput.value = "";
	    taskTimeInput.value = "";
	    taskDateInput.value = "";
	}

    // Mark a task as completed and save to local storage
    function toggleTaskCompletion(e) {
        if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
            const taskIndex = e.target.parentElement.dataset.index;
            tasks[taskIndex].completed = e.target.checked;
            saveTasksToLocalStorage();
        }
    }

    // Edit a task and save to local storage
    function editTask(e) {
        if (e.target.classList.contains("edit-task")) {
            const taskIndex = e.target.parentElement.dataset.index;
            const newText = prompt("Edit task:", tasks[taskIndex].text);
            if (newText !== null && newText.trim() !== "") {
                tasks[taskIndex].text = newText;
                saveTasksToLocalStorage();
                renderTasks();
            }
        }
    }

    // Delete a task and ask for confirmation
    function deleteTask(e) {
        if (e.target.classList.contains("delete-task")) {
            const taskIndex = e.target.parentElement.dataset.index;
            const taskText = tasks[taskIndex].text;

            // Use a confirm dialog to ask for deletion confirmation
            if (confirm(`Are you sure you want to delete the task: "${taskText}"?`)) {
                tasks.splice(taskIndex, 1);
                saveTasksToLocalStorage();
                renderTasks();
            }
        }
    }

    // Save tasks to local storage
    function saveTasksToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

	// Render tasks to the taskList element with human-readable date and time
	function renderTasks() {
	    taskList.innerHTML = "";
	    tasks.forEach((task, index) => {
	        const taskItem = document.createElement("li");
	        taskItem.dataset.index = index;

	        // Create Date objects for the task's date and current date
	        const taskDate = new Date(task.date);
	        const currentDate = new Date();

	        // Remove the time component from the Date objects for accurate comparison
	        taskDate.setHours(0, 0, 0, 0);
	        currentDate.setHours(0, 0, 0, 0);

	        let taskDateText = "";

	        // Calculate the difference in days
	        const daysDiff = Math.floor((taskDate - currentDate) / (1000 * 60 * 60 * 24));

	        // Format time in 12-hour format with "AM" or "PM"
	        const formattedTime = task.time
	            ? new Date(`2000-01-01T${task.time}:00`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })
	            : "";

	        if (daysDiff === 0) {
	            // Task is for today
	            taskDateText = `today 📅 - ${formattedTime} 🕑`;
	        } else if (daysDiff === 1) {
	            // Task is for tomorrow
	            taskDateText = `tomorrow 📅 - ${formattedTime} 🕑`;
	        } else if (daysDiff === -1) {
	            // Task was for yesterday
	            taskDateText = `yesterday 📅 - ${formattedTime} 🕑`;
	        } else {
	            // Task is for a different day
	            const diffInMilliseconds = taskDate - currentDate;

	            // Calculate the difference in weeks and days
	            const diffInWeeks = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 7));
	            const remainingDays = Math.floor((diffInMilliseconds % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));

	            if (diffInWeeks >= 1) {
	                taskDateText = `${diffInWeeks} wks 📅  - ${formattedTime} 🕑`;
	            } else if (remainingDays === 1) {
	                taskDateText = `1 day 📅 - ${formattedTime} 🕑`;
	            } else if (remainingDays > 1) {
	                taskDateText = `${remainingDays} days 📅 - ${formattedTime} 🕑`;
	            } else if (remainingDays === -1) {
	                taskDateText = `1 day ago 📅 - ${formattedTime} 🕑`;
	            } else if (remainingDays < -1) {
	                taskDateText = `${-remainingDays} days ago 📅 - ${formattedTime} 🕑`;
	            } else {
	                // Default to full date if beyond 1 year
	                const formattedDate = taskDate.toLocaleDateString("en-US", { weekday: "long" });
	                taskDateText = `${formattedDate} - ${formattedTime}`;
	            }
	        }

	        taskItem.innerHTML = `
	            <input type="checkbox" ${task.completed ? "checked" : ""}>
	            <span class="${task.completed ? "completed" : ""}">${task.text}</span>
	            <span class="task-date">${taskDateText}</span>
	            <span class="edit-task">Edit</span>
		        <span class="delete-task"></span>
	        `;
	        taskList.appendChild(taskItem);
	    });
	}






    // Event listeners
    addTaskButton.addEventListener("click", addTask);
    taskList.addEventListener("click", deleteTask);
    taskList.addEventListener("click", toggleTaskCompletion);
    taskList.addEventListener("click", editTask);

    // Event listener for "Enter" key press in the input field
	taskInput.addEventListener("keypress", function (event) {
	    if (event.key === "Enter") {
	        addTask();
	    }
	});

});
