import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/wav') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

export const uploadMiddleware = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 
    },
    fileFilter: fileFilter
});