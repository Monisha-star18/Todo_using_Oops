export const baseUrl = "http://localhost:3000"

// Session management
export let currentUser = null

export function setCurrentUser(user) {
    currentUser = user
    sessionStorage.setItem('currentUser', JSON.stringify(user))
}

export function getCurrentUser() {
    if (!currentUser) {
        const stored = sessionStorage.getItem('currentUser')
        if (stored) {
            currentUser = JSON.parse(stored)
        }
    }
    return currentUser
}

export function clearCurrentUser() {
    currentUser = null
    sessionStorage.removeItem('currentUser')
}

export function isAuthenticated() {
    return getCurrentUser() !== null
}