🧪 1. Example payloads for Swagger
### 🔹 POST /api/auth/signup (referrer)
Request:

    {
    "email": "bappa@example.com",
    "password": "bappa123",
    "name": "Bappa Saha"
    }


Response:

    {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZjNkMTY1YTBlYjQ3NTI3YjhhNTY2ZCIsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3NjA4MDkzMTcsImV4cCI6MTc2MTQxNDExN30.gVSCRiGbvxxVIxfJDA3yyLlG0VfIzKIIC_FHAiROa3E",
    "user": {
        "id": "68f3d165a0eb47527b8a566d",
        "email": "bappa@example.com",
        "name": "Bappa Saha",
        "referralCode": "V5ULT78P"
    }
    }



### 🔹 **POST /api/auth/signup (referred user)**

    {
    "email": "bapi@example.com",
    "password": "bapi12345",
    "name": "Bapi Saha",
    "referralCode": "V5ULT78P"
    }


Response

    {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZjNkNDExYTBlYjQ3NTI3YjhhNTY3MiIsImVtYWlsIjoiYm9iQGV4YW1wbGUuY29tIiwiaWF0IjoxNzYwODEwMDAyLCJleHAiOjE3NjE0MTQ4MDJ9.yWFZLaymVoXm8w60bfnjC4nTe6dl4uvY6-QZ3WN3Kkk",
    "user": {
        "id": "68f3d411a0eb47527b8a5672",
        "email": "bapi@example.com",
        "name": "bapi Saha",
        "referralCode": "9KSCQHFH"
    }
    }


### **🔹 GET /api/referrals/link**

- Use Bappa’s JWT (Bearer <token>).

- first log in as bappa email, password and then set the token to authorization header.

then, hit the api and get the below response

📋 Response:

    {
    "referralCode": "V5ULT78P",
    "referralLink": "http://localhost:4000/signup?ref=V5ULT78P"
    }

Response

    {
    "referralCode": "V5ULT78P",
    "referralLink": "http://localhost:4000/signup?ref=V5ULT78P"
    }

### 🔹 GET /api/referrals

Use Bappa’s token again.

📋 Response before purchase:    

	
    Response body
    {
    "referrals": [
        {
        "_id": "68f3d411a0eb47527b8a5674",
        "referrerId": "68f3d165a0eb47527b8a566d",
        "referredUserId": {
            "_id": "68f3d411a0eb47527b8a5672",
            "name": "Bapi Saha",
            "email": "bapi@example.com",
            "createdAt": "2025-10-18T17:53:21.448Z"
        },
        "status": "PENDING",
        "createdAt": "2025-10-18T17:53:21.860Z",
        "__v": 0
        }
    ]
    }


### 🔹 POST /api/purchases (simulate bapi’s first purchase)

Use bapi’s JWT.


Response body

    {
    "purchase": {
        "userId": "68f3d411a0eb47527b8a5672",
        "amount": 1999,
        "isFirst": true,
        "_id": "68f3d9b1455712e68305aa9f",
        "createdAt": "2025-10-18T18:17:21.739Z",
        "__v": 0
    }
    }

### 🔹 GET /api/dashboard

For Bappa (referrer):



For bapi (referred user):