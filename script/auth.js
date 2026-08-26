import { User } from './services/user.js'
import { setCurrentUser, getCurrentUser, clearCurrentUser, isAuthenticated } from './shared/shared.js'

const userService = new User()

// DOM Elements
const landingPage = document.getElementById('landingPage')
const authPage = document.getElementById('authPage')
const appPage = document.getElementById('appPage')
const authForm = document.getElementById('authForm')
const authError = document.getElementById('authError')
const authTitle = document.getElementById('authTitle')
const authSubtitle = document.getElementById('authSubtitle')
const submitBtn = document.getElementById('submitBtn')
const toggleAuthText = document.getElementById('toggleAuthText')
const nameGroup = document.getElementById('nameGroup')

// Show pages
export function showLandingPage() {
    landingPage.style.display = 'block'
    authPage.style.display = 'none'
    appPage.style.display = 'none'
}

export function showAuthPage() {
    landingPage.style.display = 'none'
    authPage.style.display = 'block'
    appPage.style.display = 'none'
}

export function showAppPage(username) {
    landingPage.style.display = 'none'
    authPage.style.display = 'none'
    appPage.style.display = 'block'
    const usernameSpan = document.getElementById('currentUsername')
    if (usernameSpan) {
        usernameSpan.textContent = username
    }
}

// Landing page buttons
const signupBtn = document.getElementById('signupBtn-landing')
const loginBtn = document.getElementById('loginBtn-landing')

if (signupBtn) {
    signupBtn.addEventListener('click', () => {
        showAuthPage()
        authTitle.textContent = 'Create Account'
        authSubtitle.textContent = 'Start managing your tasks today'
        nameGroup.style.display = 'block'
        submitBtn.textContent = 'Sign Up'
        toggleAuthText.innerHTML = "Already have an account? <a href='#' id='toggleAuth'>Login</a>"
        authError.style.display = 'none'
        authForm.reset()
    })
}

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        showAuthPage()
        authTitle.textContent = 'Welcome Back'
        authSubtitle.textContent = 'Login to manage your tasks'
        nameGroup.style.display = 'none'
        submitBtn.textContent = 'Login'
        toggleAuthText.innerHTML = "Don't have an account? <a href='#' id='toggleAuth'>Sign Up</a>"
        authError.style.display = 'none'
        authForm.reset()
    })
}

// Toggle between login and signup
document.addEventListener('click', (e) => {
    if (e.target.id === 'toggleAuth') {
        e.preventDefault()
        const currentTitle = authTitle.textContent
        if (currentTitle === 'Welcome Back') {
            // Switch to signup
            authTitle.textContent = 'Create Account'
            authSubtitle.textContent = 'Start managing your tasks today'
            nameGroup.style.display = 'block'
            submitBtn.textContent = 'Sign Up'
            toggleAuthText.innerHTML = "Already have an account? <a href='#' id='toggleAuth'>Login</a>"
        } else {
            // Switch to login
            authTitle.textContent = 'Welcome Back'
            authSubtitle.textContent = 'Login to manage your tasks'
            nameGroup.style.display = 'none'
            submitBtn.textContent = 'Login'
            toggleAuthText.innerHTML = "Don't have an account? <a href='#' id='toggleAuth'>Sign Up</a>"
        }
        authError.style.display = 'none'
        authForm.reset()
    }
})

// Handle auth form submission
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        authError.style.display = 'none'

        try {
            const username = document.getElementById('username').value.trim()
            const email = document.getElementById('email').value.trim()
            const password = document.getElementById('password').value.trim()
            const isLogin = submitBtn.textContent === 'Login'

            if (!email || !password) {
                throw new Error('Please fill all required fields')
            }

            if (!isLogin && !username) {
                throw new Error('Username is required for signup')
            }

            if (!isLogin && username.length < 3) {
                throw new Error('Username must be at least 3 characters')
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters')
            }

            let user
            if (isLogin) {
                user = await userService.login(email, password)
            } else {
                user = await userService.signUp(username, email, password)
            }

            // Store user in session
            setCurrentUser(user)
            showAppPage(user.username)
            authForm.reset()
            
            // Trigger app initialization after successful login
            const event = new CustomEvent('userLoggedIn', { detail: { user } })
            document.dispatchEvent(event)

        } catch (error) {
            authError.textContent = error.message
            authError.style.display = 'block'
        }
    })
}

// Logout
const logoutBtn = document.getElementById('logoutBtn')
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        clearCurrentUser()
        // Trigger logout event
        const event = new CustomEvent('userLoggedOut')
        document.dispatchEvent(event)
        showLandingPage()
    })
}

// Check if user already logged in
export function checkAuth() {
    if (isAuthenticated()) {
        const user = getCurrentUser()
        showAppPage(user.username)
        return true
    } else {
        showLandingPage()
        return false
    }
}