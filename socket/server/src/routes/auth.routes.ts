import path from 'path';
import express from 'express';
import { login, profileUpdate, register } from '../controllers/auth.controllers.ts';
import { protectRoute } from '../middleware/protectRoute.ts';
import multer from 'multer';



const storage = multer.diskStorage({
    destination: "public/",
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname); // .jpg, .png
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  });
  
  const upload = multer({ storage: storage })

// const upload = multer({ dest: 'public/' })
const router = express.Router();


router.post("/register", register)
router.post("/login", login)
router.put("/profile", protectRoute, upload.single("profileImg"), profileUpdate)



export default router;