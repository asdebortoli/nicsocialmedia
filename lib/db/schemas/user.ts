import { USER_ROLES } from "@/lib/utils";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        required: true,
        enum: USER_ROLES,
        default: USER_ROLES.SUPERVISOR
    }
}, {
    timestamps: true,    toJSON: {
        transform: function(doc: any, ret: any) {
            ret.password = undefined;
            return ret;
        }
    }
});

const user = mongoose.models.user || mongoose.model("user", userSchema);

export default user;