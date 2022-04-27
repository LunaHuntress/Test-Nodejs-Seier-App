require('dotenv').config()
const express = require('express');
const { get } = require('express/lib/response')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')

const port = process.env.PORT || 5000
const host = '0.0.0.0'
const mongoose = require('mongoose')
const session = require('express-session');
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo');
const passport = require('passport');
const Emitter = require('events')


// Database connection
// const url = 'mongodb://localhost/tracking';
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true,useUnifiedTopology: true});
const connection = mongoose.connection;
connection.on('error', function (err) {
    console.log(err);
});
connection.once('open', () => {
    console.log('Database connected...');
})



//Session store
 const store = new MongoDbStore({
    mongoUrl: process.env.MONGODB_URI,
    collection: 'sessions'
})

// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// Session config
app.use(session({
    secret: 'thisismysectret',
    resave: false,
    store: store,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 *24 } // 24 hours
    
}))

// Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// Assets
app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: false}))
app.use(express.json())


//Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// Set Template Engine
app.use(expressLayout)
app.set('views', path.join(__dirname, './resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)
 app.use((req, res) => {
     res.status(404).render('errors/404')
 })

      

const server = app.listen(port, '0.0.0.0', () => {
    console.log('Listening on port', port)
})

// Socket

const io = require('socket.io')(server)
io.on('connection', (socket) => {
    // Join
     //console.log(socket.id)
    socket.on('join', (purchaseId) => {
        //console.log(purchaseId)
        socket.join(purchaseId)
     })

})

 eventEmitter.on('purchaseUpdated', (data) => {
     io.to(`purchase_${data.id}`).emit('purchaseUpdated', data)
 })

 eventEmitter.on('purchasePlaced', (data) => {
     io.to('adminRoom').emit('purchasePlaced', data)
 })