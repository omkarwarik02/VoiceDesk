import multer, { memoryStorage } from "multer";
import { HttpError } from "../utils/httpError.js";

export const uploadAudio = multer({
    storage:multer.memoryStorage(),
    limits:{fileSize:10 * 1024 * 1024},
    fileFilter:function(req,file,cb){
        if(file.mimetype.startsWith("audio/")){
            cb(null,true);
        } else {
            cb(new HttpError(400,"Only audio files are allowed"));
        }
    },
}).single("audio")