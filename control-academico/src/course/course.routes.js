import express from 'express'
import { isAdmin, isOneSelf, validateJwt } from '../middlewares/validate-jwt.js'
import { createCourse, deleteCourse, getCourses, inscribeStudent, inscribeTeacher, studentCourses, updateCourse } from './course.controller.js'

const api = express.Router()

api.post('/createCourse', [validateJwt], [isAdmin], createCourse)
api.put('/inscribeTeacher/:id', [validateJwt], [isAdmin], inscribeTeacher)
api.put('/inscribeStudent/:id', [validateJwt], inscribeStudent)
api.put('/updateCourse/:id', [validateJwt], [isAdmin], updateCourse)
api.delete('/deleteCourse/:id', [validateJwt], [isAdmin], deleteCourse)
api.get('/studentCourses/:id', [validateJwt], studentCourses)
api.get('/getCourses', [validateJwt], getCourses)

export default api

