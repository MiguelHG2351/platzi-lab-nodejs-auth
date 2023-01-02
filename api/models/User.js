import bcrypt from 'bcrypt';
import Mongoose from 'mongoose';

export const UserSchema = new Mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
  },
  { timestamps: true }
);


UserSchema.pre('save',  async function (next) {
  const salt = await bcrypt.genSalt(10)
  this.password = bcrypt.hashSync(this.password, salt);
  next()
})

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

export const UserModel = Mongoose.model('user', UserSchema);
