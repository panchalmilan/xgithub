const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
      const uname = req.params.username
      const repo = req.params.repo
      const dir =  `./uploads/${uname}/${repo}`
      if (!fs.existsSync(dir)) 
        fs.mkdirSync(dir, {recursive: true})
      cb(null, dir)
    },
    filename: (req, file, cb)=> {
      console.log(file)
      cb(null, Date.now() + path.extname(file.originalname)) //This will be the file name
    }
  })
  //No file filter since no restriction on uploaded file extensions

  module.exports = multer({storage: storage})