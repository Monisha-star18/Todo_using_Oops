
import {baseUrl} from './shared/shared.js' 
import {Task} from './services/task.js'

// the object of the task class 
const taskObject =  new Task(baseUrl)

//on click on the add task it calls the add task 
$("#addTask-btn").on('click',function(){
    addTask()
})  

// on click on the clear it calls the clear function 
$("#clear-btn").on('click',function(){
    clear()
})

    // function to create a new task and then post in the db
    async function addTask() 
    { 
        try
        {
            //cardData function give the data object that have the task name , isdelected and date of creation 
            const CardDetails = cardData()

            // calls the function to post the task 
            await taskObject.postTask(CardDetails)

            // DISPLAY function is called so the post element can be showed 
            display()
            
            //after the elemnt is posted the task name is been cleared 
            clear()

        }
        catch(err) { alert(err) }
    }

    // clear function used to clear the input form 
    function clear()
    {
        $("#todo-input").val('')
    }

    // this function is used to create a object that is been posted when a task is created 
    function cardData()
    {
        let inputValue = $("#todo-input").val()

        if (inputValue.trim() != '')
        {
            // object that will be posted 
            let taskDetails = { taskName : inputValue ,
                                isDeleted : false,
                                dateOfCreation : new Date() }

            return taskDetails
        }
        
        else
        {
            throw new Error ('the input is empty')
        }
        
    }

    // when a delete button is clicked
    $(document).on('click','.delete-btn',async function()
    {
        //the id of specific task is been stored 
        const deleteId = $(this).data('id')
        
        const deleteBody = { isDeleted: true }

        //function for edit is called
        await taskObject.edit(deleteId ,deleteBody)

        //the functionality to refersh and show the currect cards and the show deleted cards 
        display()
        delectedCardsDisplay()
    })

    //function used to display all the task 
    async function display() 
    {
        try
        {
            // call the get function and store the values
            const displayTask = await taskObject.displayCards(false)

            $(".display-container").empty()
            
            //add the task in the task card and have a structure 
            displayTask.forEach(task => 
            {
           
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
        catch(err) { alert(err) }
       
    }

    //function used to display all the task in delete
    async function delectedCardsDisplay() 
    {
        try
        {
            // call the get function and store the values of the deleted task
            const displayTask = await taskObject.displayCards(true)

            $(".delected-task").empty()

            //add the task in the task card and have a structure 
            displayTask.forEach(task => 
            {
           
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
        catch(err) { alert(err) }
    }

    // when a restore button is clicked
    $(document).on('click','.restore-btn',async function()
    {
        //the id of specific task is been stored 
        const restoreId = $(this).data('id')
        
        const restoreBody = { isDeleted: false}

        //function for edit is called
        await taskObject.edit(restoreId , restoreBody)

        //the functionality to refersh and show the currect cards and the show deleted cards 
        display()
        delectedCardsDisplay()
    })

    // made the edit id as global so can be used when needed 
    let editId

    // when a restore button is clicked
    $(document).on('click','.edit-btn',function()
    {
        //the id of specific task is been stored 
        editId = $(this).data('id')
        //the edit function is called
        Edit(editId)
    })

    // when a edit button on the modal is clicked button is clicked
    $(document).on('click','.editModal-btn',async function()
    {
        // the task name edit is store 
        const editedTaskName =  $("#edit-text").val()

        //the original task name is stored 
        const originalEdit = await Edit(editId)

        // check whether anything is chnaged to get stored 
        if(originalEdit === editedTaskName)
        {
            alert("edit the task name")
        }

        else
        {
            // make the body object to post as its edited 
            const bodyContent = { taskName : editedTaskName , updatedDate : new Date()}
            
            //post the data updated 
            await taskObject.edit(editId,bodyContent)

            //the edit modal is used 
            document.getElementById('editModal').style.display = 'none';

            //refersh and then task cards
            display()

        }
    })
 
   
    async function Edit(editId)
        {
            try
            {
                //get the data of the particular task card clicked 
                const edit = await taskObject.displayCardsid(false,editId)

                //the particular task name is extracted 
                const originalTaskName =  edit[0].taskName

                //the task name extracted is been filled in the edit modal 
                $("#edit-text").val(originalTaskName)

                //display the edit modal 
                document.getElementById('editModal').style.display = 'block';

                // return the task name do it can be checked in the time of posting
                return originalTaskName
            }
            catch(ERR) { alert(ERR) }
                
        }

    // display when its the not doing any functionality 
    display()
    delectedCardsDisplay() 