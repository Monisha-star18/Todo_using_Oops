import { baseUrl, getCurrentUser } from '../shared/shared.js'

export class Task {
    //post the task
    async postTask(CardDetails) {
        const currentUser = getCurrentUser()
        if (!currentUser) {
            throw new Error('Please login first')
        }

        const taskWithUser = {
            ...CardDetails,
            userId: currentUser.id
        }

        const postResult = await fetch(`${baseUrl}/task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskWithUser)
        })

        if (postResult.status != 201) {
            throw new Error('Cannot post')
        }

        return await postResult.json()
    }

    //display the task
    async displayCards(cardType) {
        const currentUser = getCurrentUser()
        if (!currentUser) {
            throw new Error('Please login first')
        }

        const res = await fetch(`${baseUrl}/task?isDeleted=${cardType}&userId=${currentUser.id}`)

        if (!res.ok) {
            throw new Error('Cannot display the cards')
        }

        return await res.json()
    }

    //get particular task with id 
    async displayCardsid(cardType, id) {
        const currentUser = getCurrentUser()
        if (!currentUser) {
            throw new Error('Please login first')
        }

        const result = await fetch(`${baseUrl}/task?isDeleted=${cardType}&id=${id}&userId=${currentUser.id}`)

        if (!result.ok) {
            throw new Error('Cannot display the cards')
        }

        return await result.json()
    }

    //update the cards either task edit or softdelete or restore
    async edit(id, bodyContent) {
        const currentUser = getCurrentUser()
        if (!currentUser) {
            throw new Error('Please login first')
        }

        // Verify task belongs to user
        const taskCheck = await fetch(`${baseUrl}/task/${id}`)
        const task = await taskCheck.json()
        
        if (task.userId !== currentUser.id) {
            throw new Error('You do not have permission to edit this task')
        }

        const soft = await fetch(`${baseUrl}/task/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyContent)
        })

        if (!soft.ok) {
            throw new Error('Cannot edit the cards')
        }
    }
}