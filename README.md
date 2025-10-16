# 🛒 Express.js Product API

## 🚀 Overview
This is a RESTful API built using **Express.js** for managing products.  
It supports full CRUD (Create, Read, Update, Delete) operations with middleware for logging, authentication, and error handling.

---

## ⚙️ Instructions to Run the Server

### 1️⃣ Requirements
- Node.js **v18 or higher**
- npm (Node Package Manager)

### 2️⃣ Installation Steps
1. Clone your repository:
   ```bash
   git clone https://github.com/PLP-MERN-Stack-Development/express-js-server-side-framework-YourUsername.git


1. Navigate to the project folder:
   cd express-js-server-side-framework-YourUsername

2. Install dependencies:
   npm install

3. Run the server:
   npm start

The server will start at:
http://localhost:3000


🔑 Environment Variables
Create a .env file in your root directory (or use .env.example as a template):

PORT=3000
API_KEY=my-secret-key

📚 API Documentation
🔹 Base URL:
http://localhost:3000/api/products

🟢 GET /api/products
Get all products.

Request:
GET http://localhost:3000/api/products

Response:
[
  {
    "id": "1",
    "name": "Laptop",
    "description": "High-performance laptop with 16GB RAM",
    "price": 1200,
    "category": "electronics",
    "inStock": true
  },
  {
    "id": "2",
    "name": "Smartphone",
    "description": "Latest model with 128GB storage",
    "price": 800,
    "category": "electronics",
    "inStock": true
  }
]

🟢 GET /api/products/:id
Get a single product by ID.

Request:
GET http://localhost:3000/api/products/1

Response:
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}

🟡 POST /api/products
Create a new product.
🔐 Requires an API key in headers (x-api-key).

Request:
POST http://localhost:3000/api/products

Headers:
Key	          Value
x-api-key	    my-secret-key
Content-Type	 application/json


Body:
{
  "name": "Tablet",
  "description": "Android tablet with 10-inch display",
  "price": 400,
  "category": "electronics",
  "inStock": true
}


Response:
{
  "success": true,
  "data": {
    "id": "f1a3e9b2-9d34-4a77-9d33-6e7c38b0c01f",
    "name": "Tablet",
    "description": "Android tablet with 10-inch display",
    "price": 400,
    "category": "electronics",
    "inStock": true
  }
}


🟠 PUT /api/products/:id
Update an existing product.
🔐 Requires x-api-key header.

Request:
PUT http://localhost:3000/api/products/1


Body:
{
  "price": 999,
  "inStock": false
}


Response:
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "1",
    "name": "Laptop",
    "price": 999,
    "inStock": false
  }
}

🔴 DELETE /api/products/:id

Delete a product by ID.
🔐 Requires x-api-key header.

Request:
DELETE http://localhost:3000/api/products/1

Response:
{
  "success": true,
  "message": "Product deleted successfully"
}


⚠️ Error Responses
Status	Message	Example
400	Bad Request	{ "error": "Invalid data" }
401	Unauthorized	{ "message": "Unauthorized: Invalid API key" }
404	Not Found	{ "error": "Product not found" }
500	Server Error	{ "error": "Internal Server Error" }


🧰 Example Testing in Postman
Open Postman
Create a new request for each endpoint above

For protected routes (POST, PUT, DELETE):
Go to the Headers tab
Add:
x-api-key: my-secret-key

For POST or PUT, go to the Body tab:
Select raw → JSON

Paste the example body
Click Send

📦 Dependencies
express
body-parser
uuid
dotenv

👨‍💻 Author

AntolTECHS
PLP MERN Stack Development Program – Week 2: Express.js Assignment