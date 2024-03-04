'use strict'

import Course from './course.model.js'
import User from '../user/user.model.js'

export const createCourse = async (req, res) => {
    try {
        let data = req.body
        let course = new Course(data)
        await course.save()
        return res.send({ message: `Course saved succesfully: ${course.name}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving course' })
    }
}

export const inscribeTeacher = async (req, res) => {
    try {
        let userId = req.user.id;
        let { id } = req.params
        let course = await Course.findOne({ _id: id })
        let user = await User.findOne({ _id: userId, role: 'TEACHER_ROLE' })
        if (!course || !user) return res.status(400).send({ message: 'Course or teacher not exists' })
        if (course.teacher) return res.status(400).send({ message: 'Already has a teacher' })
        course.teacher = userId;
        await course.save();
        return res.send({ message: 'Teacher inscribe succesfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error editing course' })
    }
}

export const inscribeStudent = async (req, res) => {
    try {
        let userId = req.user.id;
        let { id } = req.params;
        let course = await Course.findOne({ _id: id });
        let user = await User.findOne({ _id: userId, role: 'STUDENT_ROLE' });
        if (!course || !user) {
            return res.status(400).send({ message: 'Course or student not exists' });
        }
        if (course.students.includes(userId)) {
            return res.status(400).send({ message: 'Already has enrolled' });
        }
        if (user.courses >= 3) {
            user.courses
            return res.status(400).send({ message: 'Maximum number of courses reached' });
        }
        user.courses += 1;
        await user.save();
        course.students.push(userId);
        await course.save();
        return res.send({ message: 'Student enrolled successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error inscribe student' });
    }
}

export const updateCourse = async (req, res) => {
    try {
        let data = req.body
        let { id } = req.params
        let userId = req.user.id
        let course = await Course.findOne({ _id: id })
        if (!course) return res.status(404).send({ message: 'Course not exists' })
        let user = await User.findOne({ _id: userId, role: 'TEACHER_ROLE' })
        if (!user || !course.teacher.equals(userId)) {
            return res.status(403).send({ message: 'You do not have permission to edit this course' });
        }
        await Course.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        return res.send({ message: 'Course edit successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error editing course' })
    }
}

export const deleteCourse = async (req, res) => {
    try {
        let { id } = req.params
        let userId = req.user.id
        let course = await Course.findOne({ _id: id })
        if (!course) return res.status(404).send({ message: 'Course not exists' })
        let user = await User.findOne({ _id: userId, role: 'TEACHER_ROLE' })
        if (!user || !course.teacher.equals(userId)) {
            return res.status(403).send({ message: 'You do not have permission to delete this course' });
        }
        let courseU = await Course.findOneAndDelete({ _id: id });
        if (courseU) {
            for (let studentsId of courseU.students) {
                let studentU = await User.findOne({ _id: studentsId });
                if (studentU) {
                    studentU.courses -= 1;
                    await studentU.save();
                } else {
                    return res.send({ message: 'Student not exists' });
                }
            }
        }
        return res.send({ message: 'Deleted course successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deliting course' })
    }
}

export const studentCourses = async (req, res) => {
    try {
        let { id } = req.params;
        let student = await User.findOne({ _id: id, role: 'STUDENT_ROLE' });
        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }
        let courses = await Course.find({ students: id }).populate('students', ['name', 'username']);
        if (courses.length === 0) {
            return res.status(404).send({ message: 'Student is not enrolled in any courses' });
        }
        return res.send({ courses });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error searching courses' })
    }
}

export const getCourses = async (req, res) => {
    try {
        let courses = await Course.find()
        if (!courses) return res.status(404).send({ message: 'Not courses found' })
        return res.send({ courses });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error searching courses' })
    }
}