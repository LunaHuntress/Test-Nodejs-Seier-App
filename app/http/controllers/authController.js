const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'courier' ? '/admin/purchases' : '/customers/purchases'
    }
    return {
        login(req, res) {
            res.render('auth/login')
        },
        postLogin(req,res,next){
            const { username, password } = req.body
            // Validate request
            if (!username || !password) {
                req.flash('error', 'All fields are required')
                
                return res.redirect('/login')
            }
        passport.authenticate('local', (err,user, info) => {
            if(err) {
                req.flash('error', info.message )
                return next(err)
            } 

            if(!user) {
                req.flash('error', info.message)
                return res.redirect('/login')
            }
            req.logIn(user, (err) => {
                if(err) {
                    req.flash('error', info.message)
                    return next(err)
                }

                return res.redirect(_getRedirectUrl(req))
            })
        })(req,res,next)

    },

        register(req, res) {
            res.render('auth/register')
        },
        async postRegister (req, res){
            const { name, username, password} = req.body
           // Validate request
           if(!name || !username || !password) {
               req.flash('error', 'All fields are required')
               req.flash('name', name)
               req.flash('username', username)
               return res.redirect('/register')
           }


           // Check if email exists
           User.exists({ username: username}, (err, results) => {
               if(results) {
                   req.flash('error', 'Username already taken')
                   req.flash('name', name)
                   req.flash('username', username)
                   return res.redirect('/register')
               }
           })

           // Hash password
           const hashedPassword = await bcrypt.hash(password, 10)


           // Create a user
           const user = new User ({
               name,
               username,
               password: hashedPassword
           })

           user.save().then(() => {
            // Login
            return res.redirect('/')
           }).catch(err => {
               req.flash('error', 'Something went wrong')
               return res.redirect('/register')
           })
        },
        logout(req, res) {
            req.logout()
            return res.redirect('/login')
        }
    }
}

module.exports = authController