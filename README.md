NOTE: PUT /api before all of the routes
ex: www.example.com/api/auth/signup

POST /auth/signup

Description:
Registers a new user. The user data is stored temporarily in the Pending Users table, and an OTP is sent to the user’s email for verification.

Request Body:

{
  "name": "string",
  "username": "string",
  "email": "string (email format)",
  "password": "string",
  "role": "User | Guardian",
  "birthdate": "date"
}


Response:

{
  "message": "Signup successful. A confirmation email has been sent."
}

POST /auth/confirmEmail

Description:
Confirms the user’s email using the OTP sent earlier.
After successful confirmation, the user is moved from the Pending Users table to the Users table.

Request Body:

{
  "email": "string (email format)",
  "otp": "string (6 digits)"
}


Response:

{
  "message": "user logged in successfully",
  "Credentials": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}

POST /auth/login

Description:
Logs in an existing user using email and password.

Request Body:

{
  "email": "string (email format)",
  "password": "string"
}


Response:

{
  "message": "user logged in successfully",
  "Credentials": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}

POST /auth/oauth

Description:
Logs in or signs up a user using an OAuth provider (Google or Facebook).
If the user doesn’t exist, a new one is created automatically.

Request Body:

{
  "provider": "google | facebook",
  "token": "string (OAuth access token or ID token)",
  "role": "User | Guardian"
}


Response:

{
  "message": "Login success",
  "Credentials": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}

POST /auth/forget-password

Description:
Sends an OTP to the user’s email for password reset.

Request Body:

{
  "email": "string (email format)"
}


Response:

{
  "message": "otp sent successfully"
}


POST /auth/verify-forgot-otp

Description:
Verifies the OTP that was sent to the user’s email and returns a short-lived reset token.

Request Body:

{
  "email": "string (email format)",
  "otp": "string (6 digits)"
}


Response:

{
  "message": "OTP verified successfully",
  "resetToken": "string (JWT, expires in 5 minutes)"
}


PATCH /auth/reset-password

Description:
Resets the user’s password using a valid reset token obtained from /verify-forgot-otp.

Headers:

Authorization: Bearer <resetToken>


Request Body:

{
  "password": "string",
  "confirmPassword": "string"
}


Response:

{
  "message": "Password reset successfully"
}

POST /auth/logout

Description:
Logs out the user by revoking their current access token (added to a revoked token list).

Headers:

Authorization: Bearer <accessToken>


Response:

{
  "message": "Logged out successfully"
}

POST /auth/refresh-token

Description:
Generates a new access and refresh token using a valid refresh token, then revokes the old one.

Headers:

Authorization: Bearer <refreshToken>


Response:

{
  "message": "new Credentials",
  "credentials": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}

POST /user/signup-for-Child

Description:
Allows a logged-in parent (Guardian) to create a child account linked to their own.

Headers:

Authorization: Bearer <accessToken>


Request Body:

{
  "name": "string",
  "username": "string",
  "email": "string (email format)",
  "password": "string",
  "birthdate": "date"
}


Response:

{
  "message": "child Created Successfully",
  "credentials": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}