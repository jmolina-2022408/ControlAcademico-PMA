'use strict'

import { Schema, model } from 'mongoose'

const courseSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: false
    },
    students: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false
    }
}, {
    versionKey: false
})

export default model('course', courseSchema)