import express from 'express'
import { validateJwt, isAdmin, isOneSelf } from '../middlewares/validate-jwt.js'
import { deleteProfile, login, registerStudent, registerTeacher, updateProfile } from './user.controller.js'

const api = express.Router()

api.post('/registerStudent', registerStudent)
api.post('/registerTeacher', [validateJwt], [isAdmin], registerTeacher)
api.post('/login', login)
api.put('/updateProfile/:id', [validateJwt], [isOneSelf], updateProfile)
api.delete('/deleteProfile/:id', [validateJwt], [isOneSelf], deleteProfile)

export default api