"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerificationTemplate = exports.forgetPasswordTemplate = void 0;
const forgetPasswordTemplate = (code, username) => `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f0f2f5;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .email-header {
      background: linear-gradient(90deg, #007BFF, #0056b3);
      color: white;
      text-align: center;
      padding: 25px 10px;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 25px;
      color: #333;
      line-height: 1.6;
    }
    .email-body h2 {
      color: #007BFF;
      margin-top: 0;
    }
    .otp-box {
      display: inline-block;
      background-color: #f8f9fa;
      color: #007BFF;
      font-size: 28px;
      letter-spacing: 4px;
      padding: 10px 20px;
      border: 2px dashed #007BFF;
      border-radius: 8px;
      margin: 20px 0;
      font-weight: bold;
    }
    .email-footer {
      background-color: #f8f9fa;
      text-align: center;
      padding: 15px;
      color: #888;
      font-size: 14px;
    }
    .email-footer a {
      color: #007BFF;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="email-body">
      <h2>Hello ${username},</h2>
      <p>We received a request to reset your password for your <b>lexyApplication</b> account.</p>
      <p>Use the following verification code to reset your password:</p>
      <div class="otp-box">${code}</div>
      <p>This code will expire in <b>10 minutes</b>. If you didn’t request a password reset, you can safely ignore this email.</p>
      <p>Thanks,<br>The lexy Application Team</p>
    </div>
    <div class="email-footer">
      <p>&copy; lexyApplication. All rights reserved.</p>
      <p><a href="[SupportLink]">Contact Support</a> | <a href="[UnsubscribeLink]">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;
exports.forgetPasswordTemplate = forgetPasswordTemplate;
const emailVerificationTemplate = (code, username) => `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f0f2f5;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .email-header {
      background: linear-gradient(90deg, #007BFF, #0056b3);
      color: #ffffff;
      text-align: center;
      padding: 25px 10px;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .email-body {
      padding: 25px;
      color: #333333;
      line-height: 1.6;
    }
    .email-body h2 {
      color: #007BFF;
      margin-top: 0;
    }
    .otp-box {
      display: inline-block;
      background-color: #f8f9fa;
      color: #007BFF;
      font-size: 28px;
      letter-spacing: 4px;
      padding: 10px 20px;
      border: 2px dashed #007BFF;
      border-radius: 8px;
      margin: 20px 0;
      font-weight: bold;
    }
    .email-footer {
      background-color: #f8f9fa;
      text-align: center;
      padding: 15px;
      color: #888;
      font-size: 14px;
    }
    .email-footer a {
      color: #007BFF;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Email Verification Code</h1>
    </div>
    <div class="email-body">
      <h2>Hello ${username},</h2>
      <p>Welcome to <b>lexyApplication</b> 🎉</p>
      <p>To complete your registration, please use the following code to verify your email address:</p>
      <div class="otp-box">${code}</div>
      <p>This code will expire in <b>15 minutes</b>. Enter it in the app to activate your account.</p>
      <p>If you didn’t create this account, please ignore this message.</p>
      <p>Best regards,<br>The lexyApplication Team</p>
    </div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} lexyApplication. All rights reserved.</p>
      <p><a href="[SupportLink]">Contact Support</a> | <a href="[UnsubscribeLink]">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;
exports.emailVerificationTemplate = emailVerificationTemplate;
//# sourceMappingURL=email.tempelate.js.map