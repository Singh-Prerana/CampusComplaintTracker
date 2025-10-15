import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        email: {
            type: String,
            required: true,
            unique:true
        },
        password: {
            type: String,
            required:true
        },
        role: {
            type: String,
            enum: ["student", "admin"],
            default:"student"
        },
        rollNo: {
            type:String
        },
        staffId: {
            type:String
        },
        avatarUrl: {
            type:String
        },
      
        refreshToken: {
            type:String
        },
        otpCode: {
            type: String
        },
        otpExpires: {
            type: Date
        }
        // resetPasswordToken: {
        //     type:String
        // },
        // resetPasswordExpires: {
        //     type:Date
        // },
    },{timestamps:true}
)

export default mongoose.model("User", userSchema);