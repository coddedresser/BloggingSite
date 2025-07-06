const mongoose=require('mongoose');
const {createTokenForUser}=require('../service/auth');
const {createHmac,randomBytes}=require('node:crypto');
const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },    
    password:{
        type:String,
        required:true,
    },
    profileImageURL:{
        type:String,
        default:'https://imgs.search.brave.com/NCkNDim9ohRjnUs8j31hVg4uzs0Bbko4mCtCYUuiOVA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAyMS8x/Mi8xMy8xMy81NC9h/dmF0YXItNjg2ODI3/NV82NDAucG5n'
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER',
    }

},{timestamps:true});

userSchema.pre('save',function(next){
    const user=this;
    if(!user.isModified('password')) return next();
    const salt=randomBytes(16).toString();
    const hashedPassword=createHmac('sha256',salt)
    .update(user.password)
    .digest('hex');
    this.salt=salt;
    this.password=hashedPassword;
    next();
});

//virtual function
userSchema.static('matchPasswordAndGenerateToken',async function(email,password){
    const user=await this.findOne({email});
    if(!user) throw new Error('User not found');
    const salt=user.salt;
    const hashedPassword=user.password;

    const userProvidedHash=createHmac('sha256',salt)
    .update(password)
    .digest('hex');
    if(hashedPassword!==userProvidedHash) throw new Error('Incorrect Password');
    const token=createTokenForUser(user);
    return token;
})

const User=mongoose.model('user',userSchema);

module.exports=User;