import mongoose from 'mongoose';
import { Password } from '../services/password';

// an interface that describes the properties that are required to create a new user
interface UserAttrs {
    email: string;
    password: string;
}

// an interface that describes the properties that a User model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// an interface that describes the properties that a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    // alter the returned object, don't want to include 'password' property
    toJSON: {
        transform(doc, ret) {
            // change '_id' to follow 'id' format in case other services refer to id as 'id'
            ret.id = ret._id;
            delete ret._id;
            // don't return 'password' and '__v' properties
            delete ret.password;
            delete ret.__v;
        }
    }
});

// if trying to save user, intercept it
userSchema.pre('save', async function(done) {
    // mongoose considers password to be modified even when the user is just being created
    // intercept the current password, hash it, and then set the password as the hashed password
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    // mongoose requires to call done() when finished with async operation on pre-save hook
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };