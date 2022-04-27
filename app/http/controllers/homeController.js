const List = require('../../models/list')
function homeController(){
    return {
        async index(req,res)
        {
            const trackings = await List.find()
            return res.render('home', { trackings: trackings})
            // List.find().then(function(trackings){
            //     console.log(trackings)
            //     res.render('home', { trackings: trackings})
            // })
            
        }
    }
}

module.exports = homeController