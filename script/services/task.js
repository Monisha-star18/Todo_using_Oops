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
}
