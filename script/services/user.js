import { baseUrl } from '../shared/shared.js'

export class User {
    // Hash password using SHA-256
    async hashPassword(password) {
        const encoder = new TextEncoder()
        const data = encoder.encode(password)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    }

    // Sign up new user
    async signUp(username, email, password) {
        try {
            // Check if username exists
            const checkRes = await fetch(`${baseUrl}/users?username=${username}`)
            const existingUsers = await checkRes.json()
            
            if (existingUsers.length > 0) {
                throw new Error('Username already exists')
            }

            // Check email
            const emailCheck = await fetch(`${baseUrl}/users?email=${email}`)
            const existingEmails = await emailCheck.json()
            
            if (existingEmails.length > 0) {
                throw new Error('Email already registered')
            }

            // Hash password
            const hashedPassword = await this.hashPassword(password)

            const userData = {
                username,
                email,
                password: hashedPassword,
                createdAt: new Date().toISOString()
            }

            const response = await fetch(`${baseUrl}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })

            if (!response.ok) {
                throw new Error('Failed to create account')
            }

            const newUser = await response.json()
            const { password: _, ...userWithoutPassword } = newUser
            return userWithoutPassword
        } catch (error) {
            throw new Error(error.message)
        }
    }

    // Login user
    async login(usernameOrEmail, password) {
        try {
            // Try to find by username or email
            let response = await fetch(`${baseUrl}/users?username=${usernameOrEmail}`)
            let users = await response.json()

            if (users.length === 0) {
                response = await fetch(`${baseUrl}/users?email=${usernameOrEmail}`)
                users = await response.json()
            }

            if (users.length === 0) {
                throw new Error('User not found')
            }

            const user = users[0]
            const hashedPassword = await this.hashPassword(password)

            if (user.password !== hashedPassword) {
                throw new Error('Invalid password')
            }

            const { password: _, ...userWithoutPassword } = user
            return userWithoutPassword
        } catch (error) {
            throw new Error(error.message)
        }
    }
}