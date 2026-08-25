import {baseUrl} from '../shared/shared.js' 


export class Task
{
    //post the task
    async postTask(CardDetails) 
    {
        
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

        return await postResult.json()
    }

    //disply the task
    async displayCards(cardType)
    {

        const res = await fetch(`${baseUrl}/task?isDeleted=${cardType}`)
        
        if (!res.ok)
        {
            throw new Error ('Cannot diaply the cards')
        }

        return await res.json()
    }

    async displayCardsid(cardType,id)
    {

        const result = await fetch(`${baseUrl}/task?isDeleted=${cardType}&id=${id}`)
        
        if (!result.ok)
        {
            throw new Error ('Cannot diaply the cards')
        }

        return await result.json()
    }

    //softdelet the  task 
    async softdelect(id)
    {
        const soft = await fetch(`${baseUrl}/task/${id}`,{
                    method : 'PATCH',
                    headers : {'Content-type':'application/json'},
                    body:JSON.stringify({isDeleted: true})
        })

        if (!soft.ok)
        {
            throw new Error ('Cannot diaply the cards')
        }

    }

    //restore the  task 
    async restore(id)
    {
        const soft = await fetch(`${baseUrl}/task/${id}`,{
                    method : 'PATCH',
                    headers : {'Content-type':'application/json'},
                    body:JSON.stringify({isDeleted: false})
        })

        if (!soft.ok)
        {
            throw new Error ('Cannot diaply the cards')
        }

    }

    async edit(id,bodyContent)
    {
        const soft = await fetch(`${baseUrl}/task/${id}`,{
                    method : 'PATCH',
                    headers : {'Content-type':'application/json'},
                    body:JSON.stringify(bodyContent)
        })

        if (!soft.ok)
        {
            throw new Error ('Cannot edit the cards')
        }

    }


    
}
