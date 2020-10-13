const { Router } = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const asyncHandler = require('express-async-handler')
const { authToken } = require('../middlewares/verifyToken')
const { checkView } = require('../middlewares/checkRepoView')

const router = Router()

const {
  getAllRepositories,
  createRepository,
  updateRepository,
  deleteRepository,
  uploadToRepository
} = require('../controllers/repository')

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

const upload = multer({storage: storage})
const numFilesLimit = 20

router
  .route('/:username/repos')
  .get(checkView, asyncHandler(getAllRepositories))

router.route('/:username/new').post(authToken, asyncHandler(createRepository))

router
  .route('/:username/:repo/settings')
  .put(authToken, asyncHandler(updateRepository))
  .delete(authToken, asyncHandler(deleteRepository))

router
  .route('/:username/:repo/upload')
  .post(authToken, upload.array('files', numFilesLimit), asyncHandler(uploadToRepository))   //'files' is the field name

module.exports = router
