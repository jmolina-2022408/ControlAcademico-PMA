import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    },
    role: {
        type: String,
        uppercase: true,
        enum: ['TEACHER_ROLE', 'STUDENT_ROLE'],
        required: true
    },
    courses: {
        type: Number,
        required: false
    }
}, {
    versionKey: false
})

export default mongoose.model('user', userSchema)