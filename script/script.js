
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
            delectedCardsDisplay()
           

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

    


   

    $(document).on('click','.delete-btn',async function(){
        const deleteId = $(this).data('id')
        await taskObject.softdelect(deleteId)
        display()
        delectedCardsDisplay()
    })

    


    async function display() {
        
        try{
             const displayTask = await taskObject.displayCards(false)

              $(".display-container").empty()
        displayTask.forEach(task => {
           
           const cardStruc = `<div class="col-5 card p-3 mx-2 my-2 bg-primary text-light">
                                <div class="card-body">
                                    <h6 class="card-title">${task.taskName}</h6>
                                    <div class="btnGroup">
                                        <button class="btn btn-warning edit-btn" data-id="${task.id}">Edit</button>
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

    async function delectedCardsDisplay() {
        try{
             const displayTask = await taskObject.displayCards(true)

              $(".delected-task").empty()
        displayTask.forEach(task => {
           
           const cardStruc = `<div class="col-5 card p-3 mx-2 my-2 bg-primary text-light">
                                <div class="card-body">
                                    <h6 class="card-title">${task.taskName}</h6>
                                    <div class="btnGroup">
                                        <button class="btn btn-light restore-btn" data-id="${task.id}">Restore</button>
                                    </div>
                                </div>
                            </div>`

            $(".delected-task").prepend (cardStruc)
            
        });
        }
        catch(err)
        {
            alert(err)
        }
    }

    $(document).on('click','.restore-btn',async function(){
        const restoreId = $(this).data('id')
        await taskObject.restore(restoreId)
        display()
        delectedCardsDisplay()
    })


    let editId
     $(document).on('click','.edit-btn',function(){
         editId = $(this).data('id')
        Edit(editId)
    })

    $(document).on('click','.editModal-btn',async function(){
        
         const editedTaskName =  $("#edit-text").val()

         const originalEdit = await Edit(editId)

         if(originalEdit === editedTaskName)
        {
            alert("edit the task name")
        }
        else
        {
            const bodyContent = { taskName : editedTaskName}
            await taskObject.edit(editId,bodyContent)
             document.getElementById('editModal').style.display = 'none';
             display()

        }
    })
 
    display()
    delectedCardsDisplay() 
async function Edit(editId )
        {
            try{
                const edit = await taskObject.displayCardsid(false,editId)
                const originalTaskName =  edit[0].taskName
                $("#edit-text").val(originalTaskName)
               document.getElementById('editModal').style.display = 'block';
                return originalTaskName

            }
            catch(ERR)
            {
                alert(ERR)
            }
                
        }
