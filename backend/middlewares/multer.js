import multer from 'multer';
import path from 'path';

// Configure storage for single image uploads
const storageSingleImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where images will be temporarily stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Configure storage for CSV uploads
const storageCSV = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where CSV files will be temporarily stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to validate image uploads
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
  }
};

// File filter to validate CSV uploads
const csvFileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV files are allowed.'));
  }
};

export const uploadSingleImage = multer({
  storage: storageSingleImage,
  fileFilter,
});

export const uploadCSV = multer({
  storage: storageCSV,
  fileFilter: csvFileFilter,
});