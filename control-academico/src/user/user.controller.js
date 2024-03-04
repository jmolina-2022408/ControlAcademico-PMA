'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const registerStudent = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'STUDENT_ROLE'
        data.courses = 0;
        let user = new User(data)
        await user.save()
        return res.send({ message: `Registered successfully, can be logged with user ${user.username}` })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error registering user' })
    }
}

export const registerTeacher = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'TEACHER_ROLE'
        let user = new User(data)
        await user.save()
        return res.send({ message: `Registered successfully, can be logged with user ${user.username}` })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error registering user' })
    }
}

const defaultTeacher = {
    name: 'Josue Noj',
    username: 'josuenoj',
    password: '12345678',
    email: 'josuenoj@kinal.org.gt',
    phone: '12345678',
    role: 'TEACHER_ROLE'
}

export const teacherDefault = async (req, res) => {
    try {
        let teacher = await User.findOne({ username: defaultTeacher.username })
        if (teacher) {
            console.log('This teacher already exists')
        } else {
            defaultTeacher.password = await encrypt(defaultTeacher.password)
            let newTeacher = await User.create(defaultTeacher)
            console.log(`A default teacher is create, can be logged with user: ${newTeacher.username}`)
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user' })
    }
}

export const login = async (req, res) => {
    try {
        let { username, password } = req.body
        let user = await User.findOne({ username })
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send({ message: `Welcome ${user.name}`, loggedUser, token })
        }
        return res.status(404).send({ message: 'Invalid Credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error to login' })
    }
}

export const updateProfile = async (req, res) => {
    let { id } = req.params
    let data = req.body
    if (data.password) {
        data.password = await encrypt(data.password);
    }
    let token = req.user;
    let update = checkUpdate(data, token)
    if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be update' })
    let updatedUser = await User.findOneAndUpdate(
        { _id: id },
        data,
        { new: true }
    )
    if (!updatedUser) return res.status(404).send({ message: 'User not found and not update' })
    return res.send({ message: 'Update user', updatedUser })
}

export const deleteProfile = async (req, res) => {
    try {
        let { id } = req.params
        let deletedUser = await User.findOneAndDelete({ _id: id })
        if (!deletedUser) return res.status(404).send({ message: 'Account not found and not deleted' })
        return res.send({ message: `Account with username ${deletedUser.username} deleted successfully` })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error deleting account' })
    }
}