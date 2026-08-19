# SMTP Configuration Guide for `bridge.php`

The contact form uses a PHP bridge (`bridge.php`) to send emails via an institutional SMTP server. To ensure security and flexibility, credentials are not hardcoded but retrieved from environment variables.

## 1. Installation Requirements

The bridge requires **PHPMailer**. You must install it using Composer in the `public/` directory (or the directory where `bridge.php` is located).

```bash
cd public
composer require phpmailer/phpmailer
```

## 2. Environment Variables

Set the following environment variables on your server (e.g., via `.env` file, Apache `SetEnv`, Nginx `fastcgi_param`, or system-wide env vars):

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `SMTP_HOST` | SMTP Server hostname | `smtp.gmail.com` or `mail.yourdomain.com` |
| `SMTP_USER` | SMTP Username (Email) | `notifications@gsrabogados.com.ar` |
| `SMTP_PASS` | SMTP Password / App Password | `your-secure-password` |
| `SMTP_PORT` | SMTP Port | `587` (TLS) or `465` (SSL) |
| `SMTP_AUTH` | Enable SMTP Authentication | `true` |
| `SMTP_SECURE` | Encryption method | `tls` (for 587) or `ssl` (for 465) |
| `SMTP_FROM_EMAIL` | Email address that sends the mail | `notifications@gsrabogados.com.ar` |
| `SMTP_FROM_NAME` | Name displayed as the sender | `Garcete Suárez Ronco` |
| `SMTP_TO_EMAIL` | Recipient email for contact requests | `info@gsrabogados.com.ar` |

## 3. Server Configuration Examples

### Apache (`.htaccess` or VirtualHost)
```apache
SetEnv SMTP_HOST smtp.example.com
SetEnv SMTP_USER user@example.com
SetEnv SMTP_PASS yourpassword
SetEnv SMTP_PORT 587
SetEnv SMTP_AUTH true
SetEnv SMTP_SECURE tls
SetEnv SMTP_FROM_EMAIL notifications@example.com
SetEnv SMTP_FROM_NAME "Garcete Suárez Ronco"
SetEnv SMTP_TO_EMAIL info@example.com
```

### Nginx (fastcgi_params)
```nginx
fastcgi_param SMTP_HOST smtp.example.com;
fastcgi_param SMTP_USER user@example.com;
fastcgi_param SMTP_PASS yourpassword;
fastcgi_param SMTP_PORT 587;
fastcgi_param SMTP_AUTH true;
fastcgi_param SMTP_SECURE tls;
fastcgi_param SMTP_FROM_EMAIL notifications@example.com;
fastcgi_param SMTP_FROM_NAME "Garcete Suárez Ronco";
fastcgi_param SMTP_TO_EMAIL info@example.com;
```

## 4. Troubleshooting
- **PHP version**: Ensure PHP 7.4+ is installed.
- **Composer**: Make sure `vendor/autoload.php` exists in the same directory as `bridge.php`.
- **Firewall**: Ensure the server allows outgoing connections on the SMTP port (587/465).
- **App Passwords**: If using Gmail or Outlook, use an "App Password" instead of your main account password.
