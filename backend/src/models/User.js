const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },

    lastname: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // security
    },

    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/domqfbn8t/image/upload/v1691570066/user3_i55cvk.png",
    },

    cover: {
      type: String,
      default:
        "https://res.cloudinary.com/domqfbn8t/image/upload/v1691570985/blue-sky-and-puffy-clouds.jpg",
    },

    channelDescription: {
      type: String,
      default: "",
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

