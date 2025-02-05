const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://nilampancholi61:<db_password>@cluster0.hb79a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> console.log("MongoDB connected"))
.catch(err=> console.log(err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstname: String,
    lastname: String,
    password: String, 
    createon: { type: Date, default: Date.now },
});

const groupMessageSchema = new mongoose.Schema({
    from_user: String,
    room: String,
    message: String,
    date_sent: { type: Date, default: Date.now },
});

const privateMessageSchema = new mongoose.Schema({
    from_user: String,
    to_user: String,
    message: String,
    date_sent: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema);
const PrivateMessage = mongoose.model('PrivateMessage', privateMessageSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public')); 
app.set('view engine', 'ejs'); 



app.post('/signup', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.redirect('/login'); 
    } catch (err) {
        res.status(400).send(err); 
});

