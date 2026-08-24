
import {baseUrl} from './shared.js' 

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

            const postResult = await fetch(`${baseUrl}/task`,
                {
                method : 'POST',
                headers:{'Content-Type':'application/json',},
                body : JSON.stringify(CardDetails)
                })

            if(postResult.status != 201)
            {
                 throw new Error ('cannot post')
            }
            else
            {
                const responseData = await postResult.json()
                const taskId = responseData.id 

                alert('posted successfully')
                $(".display-container").prepend
                (
                    taskCardStru(inputValue,taskId)
                )

                clear()

                
            }
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
                                        <button class="btn btn-danger" data-id="${taskId}">Delete</button>
                                    </div>
                                </div>
                            </div>`
    }


    $(document).on('click','.edit-btn',function(){
        const editId = $(this).data('id')
        console.log(editId)
    })