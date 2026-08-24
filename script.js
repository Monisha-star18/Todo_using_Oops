
import {baseUrl} from './shared.js' 

$("#addTask-btn").on('click',function(){
    addTask()
})  

$("#clear-btn").on('click',function(){
    $("#todo-input").val('')
})

async function addTask()
    {
        let inputValue = $("#todo-input").val()

        let taskDetails = {
        taskName : inputValue ,
        dateOfCreation : new Date()
        }

        try
        {
            const postResult = await fetch(`${baseUrl}/task`,
                {
                method : 'POST',
                headers:{'Content-Type':'application/json',},
                body : JSON.stringify(taskDetails)
                })

            if(postResult.status != 201)
            {
                 throw new Error ('cannot post')
            }
            else
            {
                console.log(postResult)
                alert('posted successfully')
                $(".display-container").prepend
                (
                            `<div class="card m-4 p-3 bg-primary text-light">
                                <div class="card-body">
                                    <h1 class="card-title">${inputValue}</h1>
                                    <div class="btnGroup">
                                        <button class="btn btn-warning">Edit the task</button>
                                        <button class="btn btn-danger">Delete</button>
                                    </div>
                                </div>
                            </div>`
                )
            }
        }
        catch(err)
        {
            alert('Cannot post')
        }
        

    }
