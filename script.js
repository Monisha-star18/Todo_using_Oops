
import {baseUrl} from './shared.js' 
import {Task} from './task.js'

const taskObject =  new Task(baseUrl)

$("#addTask-btn").on('click',function(){
    addTask()
})  

$("#clear-btn").on('click',function(){
    clear()
})

async function addTask() 
    { 
         let inputValue = $("#todo-input").val()
        try
        {
            const CardDetails = cardData()

           let postResult =  await taskObject.postTask(CardDetails)

            console.log(postResult)
           


                const taskId = postResult.id 

                alert('posted successfully')
                $(".display-container").prepend
                (
                    taskCardStru(inputValue,taskId)
                )

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

    function taskCardStru(inputValue,taskId)
    {
        return `<div class="card m-4 p-3 bg-primary text-light">
                                <div class="card-body">
                                    <h1 class="card-title">${inputValue}</h1>
                                    <div class="btnGroup">
                                        <button class="btn btn-warning edit-btn" data-id="${taskId}">Edit the task</button>
                                        <button class="btn btn-danger delete-btn" data-id="${taskId}">Delete</button>
                                    </div>
                                </div>
                            </div>`
    }


    $(document).on('click','.edit-btn',function(){
        const editId = $(this).data('id')
        console.log(editId)
    })

    $(document).on('click','.delete-btn',function(){
        const deleteId = $(this).data('id')
        console.log(deleteId)
    })

