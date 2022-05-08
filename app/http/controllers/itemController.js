const List = require('../../models/list')
function itemController() {
    return {
        async index(req, res) {
            const trackings = await List.find()
            return res.render('itemManagement', { trackings: trackings })
           

        },

        // Add Item
        form(req, res){
            res.render('additem')
        },
        async create(req, res) {
            const { name,image, length, width, height, materialusage, colors, fabrics } = req.body
            // Validate request
            if (!name || !image || !length || !width || !height || !materialusage || !colors || !fabrics) {
                req.flash('error', 'All fields are required')
                return res.redirect('/additem')
            }

            const item = new List({
                
                name,
                image,
                length,
                width,
                height,
                materialusage,
                colors,
                fabrics
            })

             item.save().then(() => {
                 // Item Management
                 return res.redirect('/itemManagement')
             }).catch(err => {
                 req.flash('error', 'Something went wrong')
                 return res.redirect('/additem')
             })
        
            
        }

       
    }
}
module.exports = itemController