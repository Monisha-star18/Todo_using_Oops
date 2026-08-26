import { Task } from './services/task.js'
import { checkAuth, showLandingPage } from './auth.js'

let taskObject = null

// ==================== INITIALIZATION ====================

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = checkAuth()
    if (isLoggedIn) {
        taskObject = new Task()
        display()
        delectedCardsDisplay()
    }
})

// Listen for login events
document.addEventListener('userLoggedIn', function(e) {
    taskObject = new Task()
    display()
    delectedCardsDisplay()
})

// Listen for logout events
document.addEventListener('userLoggedOut', function() {
    taskObject = null
    const container = document.querySelector(".display-container")
    if (container) container.innerHTML = ''
    const deletedContainer = document.querySelector(".delected-task")
    if (deletedContainer) deletedContainer.innerHTML = ''
})

// ==================== TASK FUNCTIONS ====================

// Add task
document.getElementById("addTask-btn").addEventListener('click', function() {
    if (!taskObject) {
        alert('Please login first')
        return
    }
    addTask()
})

// Clear input
document.getElementById("clear-btn").addEventListener('click', clear)

async function addTask() {
    try {
        if (!taskObject) {
            throw new Error('Task service not initialized. Please login again.')
        }
        const CardDetails = cardData()
        await taskObject.postTask(CardDetails)
        await display()
        clear()
    } catch (err) {
        alert(err.message)
    }
}

function clear() {
    document.getElementById("todo-input").value = ''
}

function cardData() {
    let inputValue = document.getElementById("todo-input").value

    if (inputValue.trim() != '') {
        let taskDetails = {
            taskName: inputValue,
            isDeleted: false,
            dateOfCreation: new Date()
        }
        return taskDetails
    } else {
        throw new Error('The input is empty')
    }
}

// Delete task
document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('delete-btn')) {
        if (!taskObject) {
            alert('Please login first')
            return
        }
        const deleteId = e.target.dataset.id
        const deleteBody = { isDeleted: true, updatedDate: new Date() }

        try {
            await taskObject.edit(deleteId, deleteBody)
            await display()
            await delectedCardsDisplay()
        } catch (err) {
            alert(err.message)
        }
    }
})

// Display active tasks
async function display() {
    try {
        if (!taskObject) {
            console.warn('Task service not initialized')
            return
        }
        const displayTask = await taskObject.displayCards(false)
        const container = document.querySelector(".display-container")
        if (!container) return
        container.innerHTML = ''

        if (displayTask.length === 0) {
            container.innerHTML = '<div class="text-center text-muted py-4 w-100">✨ No tasks yet. Add one above!</div>'
            return
        }

        displayTask.forEach(task => {
            const cardStruc = `<div class="col-5 card p-3 mx-2 my-2 rounded-5">
                                    <div class="card-body">
                                        <h6 class="card-title">${task.taskName}</h6>
                                        <p> 📅 created : ${new Date(task.dateOfCreation).toLocaleDateString()}</p>
                                        <div class="btnGroup">
                                            <button class="btn btn-warning edit-btn" data-id="${task.id}">Edit</button>
                                            <button class="btn btn-danger delete-btn" data-id="${task.id}">Delete</button>
                                        </div>
                                    </div>
                                </div>`
            container.insertAdjacentHTML('afterbegin', cardStruc)
        })
    } catch (err) {
        console.error('Display error:', err)
        alert('Failed to display tasks: ' + err.message)
    }
}

// Display deleted tasks
async function delectedCardsDisplay() {
    try {
        if (!taskObject) {
            console.warn('Task service not initialized')
            return
        }
        const displayTask = await taskObject.displayCards(true)
        const container = document.querySelector(".delected-task")
        if (!container) return
        container.innerHTML = ''

        if (displayTask.length === 0) {
            container.innerHTML = '<div class="text-center text-muted py-4 w-100">🗑️ No deleted tasks</div>'
            return
        }

        displayTask.forEach(task => {
            const cardStruc = `<div class="col-5 card p-3 mx-2 my-2 text-light rounded-5">
                                    <div class="card-body">
                                        <h6 class="card-title">${task.taskName}</h6>
                                        <div class="btnGroup">
                                            <button class="btn btn-light restore-btn" data-id="${task.id}">Restore</button>
                                        </div>
                                    </div>
                                </div>`
            container.insertAdjacentHTML('afterbegin', cardStruc)
        })
    } catch (err) {
        console.error('Deleted display error:', err)
        alert('Failed to display deleted tasks: ' + err.message)
    }
}

// Restore task
document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('restore-btn')) {
        if (!taskObject) {
            alert('Please login first')
            return
        }
        const restoreId = e.target.dataset.id
        const restoreBody = { isDeleted: false, updatedDate: new Date() }

        try {
            await taskObject.edit(restoreId, restoreBody)
            await display()
            await delectedCardsDisplay()
        } catch (err) {
            alert(err.message)
        }
    }
})

// Edit - open modal
let editId
let originalTaskName = ""

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-btn')) {
        if (!taskObject) {
            alert('Please login first')
            return
        }
        editId = e.target.dataset.id
        Edit(editId)
    }
})

// Edit - save
const editModalBtn = document.querySelector('.editModal-btn')
if (editModalBtn) {
    editModalBtn.addEventListener('click', async function() {
        try {
            if (!taskObject) {
                alert('Please login first')
                return
            }
            const editedTaskName = document.getElementById("edit-text").value.trim()

            if (editedTaskName === "") {
                alert("Task name cannot be empty")
                return
            }

            if (editedTaskName.length < 5) {
                alert("Task name must contain at least 5 characters")
                return
            }

            if (originalTaskName === editedTaskName) {
                alert("Please edit the task name")
                return
            }

            const bodyContent = {
                taskName: editedTaskName,
                updatedDate: new Date()
            }

            await taskObject.edit(editId, bodyContent)

            const modalElement = document.getElementById('editModal')
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement)
                if (modal) {
                    modal.hide()
                }
            }

            await display()
        } catch (err) {
            alert(err.message)
        }
    })
}

async function Edit(editId) {
    try {
        if (!taskObject) {
            throw new Error('Task service not initialized')
        }
        const edit = await taskObject.displayCardsid(false, editId)
        if (edit && edit.length > 0) {
            originalTaskName = edit[0].taskName
            document.getElementById("edit-text").value = originalTaskName

            const modalElement = document.getElementById("editModal")
            if (modalElement) {
                const modal = bootstrap.Modal.getOrCreateInstance(modalElement)
                modal.show()
            }
        } else {
            throw new Error('Task not found')
        }
    } catch (ERR) {
        alert(ERR.message)
    }
}