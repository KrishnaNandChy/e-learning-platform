const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('../utils/ApiError');

// Storage configurations
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, '../../uploads');
    
    // Determine folder based on field name or mimetype
    if (file.fieldname === 'video' || file.mimetype.startsWith('video/')) {
      uploadPath = path.join(uploadPath, 'videos');
    } else if (file.fieldname === 'thumbnail' || file.fieldname === 'avatar' || file.mimetype.startsWith('image/')) {
      uploadPath = path.join(uploadPath, 'images');
    } else {
      uploadPath = path.join(uploadPath, 'documents');
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Memory storage for Cloudinary uploads
const memoryStorage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Define allowed types
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
  const allowedDocTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-zip-compressed',
    'text/plain'
  ];
  
  const allAllowed = [...allowedImageTypes, ...allowedVideoTypes, ...allowedDocTypes];
  
  if (allAllowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `File type ${file.mimetype} is not allowed`), false);
  }
};

// Image file filter
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only image files are allowed'), false);
  }
};

// Video file filter
const videoFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only video files are allowed'), false);
  }
};

// Document file filter
const documentFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only document files (PDF, DOC, PPT, ZIP) are allowed'), false);
  }
};

// Upload configurations
const uploadImage = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  }
});

const uploadImages = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10
  }
});

const uploadVideo = multer({
  storage: memoryStorage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
    files: 1
  }
});

const uploadDocument = multer({
  storage: memoryStorage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 5
  }
});

const uploadAny = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
    files: 10
  }
});

// Helper to process file upload
const processUpload = (type) => {
  return (req, res, next) => {
    let upload;
    
    switch (type) {
      case 'image':
        upload = uploadImage.single('image');
        break;
      case 'avatar':
        upload = uploadImage.single('avatar');
        break;
      case 'thumbnail':
        upload = uploadImage.single('thumbnail');
        break;
      case 'video':
        upload = uploadVideo.single('video');
        break;
      case 'document':
        upload = uploadDocument.single('document');
        break;
      case 'documents':
        upload = uploadDocument.array('documents', 5);
        break;
      case 'resources':
        upload = uploadAny.array('resources', 10);
        break;
      default:
        upload = uploadAny.any();
    }
    
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(ApiError.badRequest('File too large'));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(ApiError.badRequest('Too many files'));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(ApiError.badRequest('Unexpected file field'));
        }
        return next(ApiError.badRequest(err.message));
      }
      
      if (err) {
        return next(err);
      }
      
      next();
    });
  };
};

module.exports = {
  uploadImage,
  uploadImages,
  uploadVideo,
  uploadDocument,
  uploadAny,
  processUpload
};
