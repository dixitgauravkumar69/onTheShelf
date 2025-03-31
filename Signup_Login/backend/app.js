const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
const bodyParser=require('body-parser');

const SignupRouter=require('./router/Signup'); 
const LoginRouter=require('./router/login'); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/EduNex_Users',{
   }).then(()=>{
    console.log('MongoDB connected');
}).catch(err=>{
    console.log('MongoDB connection error:',err);
});

app.use('/api',SignupRouter); 
app.use('/api',LoginRouter);

app.get('/',(req,res)=>{
    res.send('I am server of EduNex');
});


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});
