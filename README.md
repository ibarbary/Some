POST /signup

Description:
تسجيل مستخدم جديد، بيعمل حساب في جدول Pending Users وبيبعت OTP لتأكيد الإيميل.

Request Body:

name: string

username: string

email: string (email format)

password: string

role: User | Guardian

birthdate: date

Response:
message: "user created success"
user: {
 name, username, email, role, birthdate, confirmEmailOtp (hashed otp)
}

Errors:
400: user already exists
500: user not created

=============================

POST /confirmEmail

Description:
تأكيد الإيميل باستخدام OTP.

Request Body:

email: string (email format)

otp: string (6 digits)

Response:
message: "user loged in success"
Credentials: { accessToken, refreshToken }

Errors:
404: user not found
400: otp is not valid

=============================

POST /login

Description:
تسجيل الدخول لمستخدم موجود.

Request Body:

email: string (email format)

password: string

Response:
message: "user loged in success"
Credentials: { accessToken, refreshToken }

Errors:
404: user not found
400: password is not valid

=============================

PATCH /forget-password

Description:
بيرسل OTP على الإيميل علشان المستخدم يقدر يعمل Reset للباسورد.

Request Body:

email: string (email format)

Response:
message: "otp sent Success"

Errors:
404: user not found

=============================

PATCH /reset-password

Description:
تغيير كلمة المرور بعد ما المستخدم يدخل OTP اللي وصله على الإيميل.

Request Body:

email: string (email format)

otp: string (6 digits)

password: string

confirmPassword: string

Response:
message: "password reset Success"

Errors:
404: user not found
400: otp is invalid
400: password and confirmPassword must be same



    "accessToken": "...",PATCH /forget-password
✅ Description
