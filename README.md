# Bulk Vegetable/Fruit Order Management Web Application

This is a full-stack web application designed to facilitate bulk vegetable/fruit orders. The platform allows buyers to browse available products, place bulk orders, and track their order status. Admins can efficiently manage orders, inventory, and product details through a dedicated dashboard.

**🌐 Deployed App**: [agro-assignment.vercel.app](https://agro-assignment.vercel.app)

---

## **Objective**

The primary goal of this project is to create a web application that streamlines the process of bulk ordering vegetables and fruits. The application is designed with the following objectives:

- Provide a **user-friendly interface** for buyers to browse and order products.
- Enable admins to **manage inventory and orders efficiently**.
- Develop a **robust backend** to handle business logic and data processing.
- Implement an **efficient database design** for scalability and performance.

---

## **Features**

### **Buyer Features**

- **Product Browsing**:
  - View a list of available vegetables and fruits with details like name, price, and type.
- **Cart Management**:
  - Add products to the cart, update quantities, and remove items.
- **Bulk Order Placement**:
  - Place bulk orders with buyer details (name, contact, and address).
- **Order Tracking**:
  - View order history and track the status of placed orders.

### **Admin Features**

- **Product Management**:
  - Add new products with images.
  - Bulk upload products via CSV files.
  - Update product prices and delete products.
- **Order Management**:
  - View all orders placed by buyers.
  - Update order statuses (e.g., Pending, Processing, Delivered).
  - Notify buyers about order status updates.
- **Inventory Management**:
  - Manage stock levels and ensure product availability.

---

## **Setup Instructions**

### **Prerequisites**

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image uploads)

### **Steps to Run the Project**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/VENKYREDDY14/Agro-assignment.git
   cd agro-assignment
   ```

2. **Install Dependencies**:
   Navigate to the frontend and backend directories and install dependencies:

   ```bash
   # For backend
   cd backend
   npm install

   # For frontend
   cd ../frontend
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the backend directory with the following content:

   ```env
   MONGODB_URI='mongodb+srv://venkyreddy:venkyreddy@agro.umqae6c.mongodb.net/agro'
   JWT_SECRET='agro'
   EMAIL_USER='venkyreddy2031@gmail.com'
   EMAIL_PASS='xlrl lhxl xusg pkxz'
   CLOUDINARY_NAME='dsad92ak9'
   CLOUDINARY_API_KEY='269325178652367'
   CLOUDINARY_SECRET_KEY='skiUay9_yGFQUhRYOXZQE8kNbXM'
   ```

   Create a `.env` file in the frontend directory with the following content:
   ```env
   REACT_APP_BACKEND_URL='http://localhost:4000'
   REACT_APP_ADMIN_GMAIL='admin@gmail.com'
   REACT_APP_ADMIN_PASSWORD='admin@password'
   ```

4. **Start the Backend Server**:
   ```bash
   cd backend
   npm start
   ```

5. **Start the Frontend Development Server**:
   ```bash
   cd ../frontend
   npm start
   ```

6. **Access the Application**:  
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

---

## **Database Mock Data**

### **Users Collection**
```json
{
  "_id": "6801334594f1adef97dcb56f",
  "username": "Venky Reddy",
  "gmail": "venkyreddyy2004@gmail.com",
  "number": "9948167365",
  "password": "$2b$10$esAaAdihXo/hLlXJF6esqefqkepnkaoQeEPsPFuPV22pjDKOunNQq",
  "role": "user",
  "otp": null,
  "otpExpiresAt": null,
  "createdAt": "2025-04-17T16:58:45.354Z"
}
```

### **Products Collection**
```json
{
  "_id": "68025ca6bd5f860fe8ce664b",
  "name": "Apple",
  "price": 120,
  "type": "fruit",
  "img": "https://res.cloudinary.com/your-cloud-name/image/upload/...",
  "createdAt": "2025-04-18T14:07:34.760Z",
  "updatedAt": "2025-04-18T14:07:34.760Z"
}
```

### **Orders Collection**
```json
{
  "_id": "6801e54a47aaefaae5137796",
  "buyer_name": "reddy",
  "buyer_contact": "9948167365",
  "delivery_address": "giddaluru",
  "items": [
    {
      "_id": "680163c132abcc0e47d34c69",
      "name": "Apple",
      "price": 120,
      "type": "fruit",
      "img": "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format...",
      "quantity": 2
    }
  ],
  "status": "Processing",
  "userId": "6801334594f1adef97dcb56f",
  "createdAt": "2025-04-18T05:38:18.769Z",
  "updatedAt": "2025-04-18T11:38:07.009Z"
}
```

---

## **API Endpoints**

### **User Routes**

| Method | Endpoint        | Description                  |
|--------|------------------|------------------------------|
| POST   | /register        | Register a new user          |
| POST   | /verify-user     | Verify user OTP              |
| DELETE | /users/:gmail    | Delete unverified users      |
| POST   | /login           | Login a user                 |
| POST   | /place-order     | Place an order (protected)   |
| GET    | /products        | Fetch all products           |
| GET    | /orders          | Fetch user-specific orders (protected) |

### **Admin Routes**

| Method | Endpoint                   | Description                        |
|--------|-----------------------------|------------------------------------|
| POST   | /add-products               | Add a new product                  |
| POST   | /products/bulk-upload       | Bulk upload products via CSV       |
| PUT    | /update-product/:id         | Update product details             |
| GET    | /orders                     | Fetch all orders                   |
| PUT    | /update-order/:id           | Update order status                |

---

## **Technologies Used**

### **Frontend**

- React.js  
- Tailwind CSS  
- Axios  
- React Router  
- React Toastify  

### **Backend**

- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- Cloudinary (for image uploads)  
- Multer (for file uploads)  
- JWT (for authentication)  

---

## **Learning Outcomes**

By completing this project, the following skills were developed:

### **Frontend Development**
- Building responsive and user-friendly interfaces using React.js and Tailwind CSS.

### **Backend Development**
- Developing RESTful APIs using Node.js and Express.js.
- Implementing authentication and authorization using JWT.

### **Database Management**
- Designing and managing a MongoDB database with Mongoose.

### **File Uploads**
- Handling image and CSV uploads using Cloudinary and Multer.

### **Deployment**
- Deploying the application to a production environment (e.g., Vercel, Heroku, or AWS)

---

## **Contributing**

This project was developed as part of an assignment. Contributions are not expected but feel free to fork the repository for learning purposes.
