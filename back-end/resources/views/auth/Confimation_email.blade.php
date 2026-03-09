<!DOCTYPE html>
<html>
<head>
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <h1>{{ $title }}</h1>
    
    <p>Hello <strong>{{ $userName }}</strong>,</p>
    
    <p>Thank you for registering. Please click the button below to verify your email address:</p>
    
    <a href="{{ $confirmationUrl }}" class="button">Verify Email Address</a>
    
    <p>If the button doesn't work, you can also click this link:</p>
    <p><a href="{{ $confirmationUrl }}">{{ $confirmationUrl }}</a></p>
    
    <p>This link will expire in 24 hours.</p>
    
    <div class="footer">
        <p>If you didn't create an account, no further action is required.</p>
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</body>
</html>