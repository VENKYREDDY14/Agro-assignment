import multer from 'multer';
import path from 'path';

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use a unique filename
  },
});

// File filter for single product uploads (allow only images)
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed for images.'));
  }
};

// File filter for bulk uploads (allow only CSV files)
const csvFileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV files are allowed for bulk uploads.'));
  }
};

// Multer instances for single and bulk uploads
export const uploadSingleImage = multer({ storage, fileFilter: imageFileFilter });
export const uploadCSV = multer({ storage, fileFilter: csvFileFilter });