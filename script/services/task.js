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

        const res = await fetch(`${baseUrl}/task`)
        
        if (!res.ok)
        {
            throw new Error ('Cannot diaply the cards')
        }

        return await res.json()
    }
}
