import { min } from "moment"

export const required = (value) => {
    return value ? true : 'This field is required'
}

export const email = (value) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return !value || regex.test(value) ? true : 'Invalid email address'
}

export const minLength = (min) => (value) => {
    return !value || value.length >= min 
    ? true 
    : `This field must be at least ${min} characters`
}

export const maxLength = (max) => (value) => {
    return !value || value.length <= max 
    ? true 
    : `This field must be less than ${max} characters`
}

export const numeric = (value) => {
    return !value || /^\d+$/.test(value) 
    ? true 
    : 'This field must be a number'
}

export const password = (value) => {
    return !value || value.length >= 6 
    ? true 
    : 'Password must be at least 6 characters'
}

export const passwordMatch = (password) => (value) => {
    return !value || value === password 
    ? true 
    : 'Passwords do not match'
}
