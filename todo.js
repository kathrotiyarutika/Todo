const taskInput = document.querySelector('.task-input input'),
    filters = document.querySelectorAll('.filters span'),
    uncheckedCountSpan = document.getElementById('unchecked-count'),
    taskBox = document.querySelector('.task-box');

let editId;
let isEditedTask = false;
let todos = JSON.parse(localStorage.getItem("todo-list"));

let currentFilter = "all";                                                      //pending and completed fitter
// console.log(currentFilter);                                                     

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        // console.log(btn);
        document.querySelector('span.active').classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
        currentFilter = btn.id;                                                 //pending and completed fitter
        countItem();
        // console.log(btn.id);
    });
});

function showTodo(filter) {
    let li = "";
    if (todos) {
        todos.forEach((todo, id) => {
            // console.log(todo);
            let isCompleted = todo.status === "completed" ? "checked" : " ";
            // console.log("completed", isCompleted);
            if (filter == todo.status || filter == "all") {
                li += ` <li class="task">
    <label for="${id}">
        <input onclick="updateStatus(this)" type="checkbox"  id="${id}" ${isCompleted}>
        <p class="${isCompleted}">${todo.name}</p>
    </label>
    <div class="settings">
      <i onclick ="showMenu(this)"> ...</i>
        <ul class="task-menu">
            <li onclick ="editTask(${id}, '${todo.name}')"><i class="edit"></i>Edit</li>
            <li onclick ="deleteTask(${id})"><i class="delete"></i>Delete</li>
        </ul>
    </div>
</li>`;
            }
        });
    }
    taskBox.innerHTML = li;
}
showTodo(currentFilter);
countItem();


function showMenu(selectedTask) {
    // console.log(selectedTask);
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener('click', e => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    })
}

function editTask(taskId, taskName) {
    // console.log(taskId, taskName);
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}

function deleteTask(deleteId) {
    // console.log(deleteId);
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(currentFilter);
    countItem();
}

const clearButton = () => {
    // console.log("clearBtn");
    var newArray = [...todos];
    var newItem = newArray.filter((element => element.status !== "completed"));
    todos = [...newItem];
    //  console.log(newItem);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(currentFilter);
}

function updateStatus(selectedTask) {
    // console.log(selectedTask);
    let taskName = selectedTask.parentElement.lastElementChild;
    // console.log(selectedTask.checked);
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
        // alert("Are you sure?")
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
    showTodo(currentFilter);                                                                 //pending and completed fitter
    countItem();
}


taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value;
    if (e.key == "Enter" && userTask) {
        if (!isEditedTask) {
            if (!todos) {
                todos = [];
            }
            let taskInfo = { name: userTask, status: "pending" }
            todos.push(taskInfo);
        } else {
            isEditedTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(currentFilter);
        countItem();
    }
    // console.log(todos);
});


function countItem() {
    var newActiveArr = [...todos];
    var newItems = newActiveArr.filter((element => element.status === "pending"));
    newActiveArr = [...newItems];
    // console.log(newItems);
    let uncheckedCount = newActiveArr.length
    uncheckedCountSpan.innerHTML = uncheckedCount
    uncheckedCount = newItems;

}
