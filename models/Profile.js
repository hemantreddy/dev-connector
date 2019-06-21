const mongoose = require('mongoose');
const Schema = mongoose.Schema

const profileSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    handle : {
        type : String,
        required : true
    },
    company : {
        type : String,
    },
    website : {
        type : String
    },
    location : {
        type : String
    },
    status : {
        type : String
    }, 
    skills : {
        type : [String],
        required : true
    },
    bio : {
        type : String
    },
    githubusername :{
        type : String
    },
    experience : [
        {
            title : {
                type : String,
                required : true
            },
            company : {
                type : String, 
                required : true
            },
            location : {
                type : String,
            },
            from : {
                type : Date,
                required : true
            },
            to : {
                type : Date
            },
            current : {
                type : Boolean, 
                default : false
            }
        }
    ],
    education: [
        {
        school: {
            type: String,
            required: true
        },
        degree: {
            type: String,
            required: true
        },
        fieldofstudy: {
            type: String,
            required: true
        },
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date
        },
        current: {
            type: Boolean,
            default: false
        },
        description: {
            type: String
        }
    }
],
    social : {
        youtube : {
            type : String
        },
        twitter : {
            type : String
        },
        instagram : {
            type : String
        },
        facebook : {
            type : String
        },
        linkedin : {
            type : String
        }
    },
    date : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('Profile', profileSchema);