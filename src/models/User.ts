import mongoose, { Schema } from "mongoose";
import { ACCESS_ROLES } from "@/types/employee";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ACCESS_ROLES,
      default: "Admin",
    },
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
