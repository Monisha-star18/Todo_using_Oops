import {baseUrl} from '../shared/shared.js' 


export class Task
{

    async postTask(CardDetails) {
        
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

    async displayCards()
    {

        const res = await fetch(`${baseUrl}/task?isDeleted=false`)
        
        if (!res.ok)
        {
            throw new Error ('Cannot diaply the cards')
        }

        return await res.json()
    }

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
}
