
import {baseUrl} from './shared/shared.js' 
import {Task} from './services/task.js'

const taskObject =  new Task(baseUrl)

$("#addTask-btn").on('click',function(){
    addTask()
})  

$("#clear-btn").on('click',function(){
    clear()
})

    async function addTask() 
    { 
        try
        {
            const CardDetails = cardData()

              await taskObject.postTask(CardDetails)

            display()
           

                clear()

        }
        catch(err)
        {
            alert(err)
        }
        

    }

    function clear()
    {
        $("#todo-input").val('')
    }


    function cardData()
    {
        let inputValue = $("#todo-input").val()

        if (inputValue.trim() != '')
        {
            let taskDetails = {
        taskName : inputValue ,
        isDeleted : false,
        dateOfCreation : new Date()}

        return taskDetails
        }
        
        else
        {
            throw new Error ('the input is empty')
        }
        
    }

    


    $(document).on('click','.edit-btn',function(){
        const editId = $(this).data('id')
        console.log(editId)
    })

    $(document).on('click','.delete-btn',function(){
        const deleteId = $(this).data('id')
        console.log(deleteId)
    })


    async function display() {
        
        try{
             const displayTask = await taskObject.displayCards()

        displayTask.forEach(task => {
           
           const cardStruc = `<div class="card m-4 p-3 bg-primary text-light">
                                <div class="card-body">
                                    <h1 class="card-title">${task.taskName}</h1>
                                    <div class="btnGroup">
                                        <button class="btn btn-warning edit-btn" data-id="${task.id}">Edit the task</button>
                                        <button class="btn btn-danger delete-btn" data-id="${task.id}">Delete</button>
                                    </div>
                                </div>
                            </div>`

            $(".display-container").prepend (cardStruc)
            
        });
        }
        catch(err)
        {
            alert(err)
        }
       
    }

    display()