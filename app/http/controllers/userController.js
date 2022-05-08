const { default: axios } = require('axios')
const { update } = require('../../models/user')
const User = require('../../models/user')
function userController(){
 return {
     async index(req, res) {
         const users = await User.find()
        // console.log(users)
         return res.render('userManagement', { users: users})
     },

     // Find user
     async find(req, res) {
        //  const users = await User.find()
            const users = await User.findById(req.params.id) 
        //   console.log(users)
        // //  axios.get('/userManagement', {params: {id:req.query.id}})
         return res.render('edituser', { users })
        

         },

         // Edit User
        async update(req, res) {
             // const id = req.params.id
              const userData = await User.findByIdAndUpdate({ _id: req.params.id},{ $set:{name:req.body.name, username:req.body.username, password:req.body.password} })
             // console.log(userData)
             res.redirect('/userManagement')
         },

         // Delete User
         async delete(req, res){
              const deleteUser = await User.findByIdAndRemove({ _id: req.params.id })
            // //  console.log(deleteUser)
             res.redirect('/userManagement')

         }

        
     }

 }
     


module.exports = userController