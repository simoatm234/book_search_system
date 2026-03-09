<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">

    <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center">
                <table width="500" style="background:white; padding:30px; border-radius:8px;">
                    
                    <tr>
                        <td align="center">
                            <h2>Password Reset Request</h2>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <p>Hello, {{$email}}</p>

                            <p>
                                We received a request to reset your password.
                                Use the verification code below to continue.
                            </p>

                            <div style="text-align:center; margin:30px 0;">
                                <span style="
                                    font-size:28px;
                                    font-weight:bold;
                                    letter-spacing:5px;
                                    background:#f2f2f2;
                                    padding:15px 25px;
                                    border-radius:6px;
                                ">
                                    {{ $code }}
                                </span>
                            </div>

                            <p>
                                This code will expire in <strong>10 minutes</strong>.
                            </p>

                            <p>
                                If you did not request a password reset, please ignore this email.
                            </p>

                            <p>
                                Thanks,<br>
                                {{ config('app.name') }}
                            </p>

                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>