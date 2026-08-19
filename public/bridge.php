<?php
/**
 * SMTP Bridge for Contact Form
 * Handles POST requests from Astro frontend and sends emails via PHPMailer.
 */

header('Content-Type: application/json');

// Load Composer's autoloader
$autoloadPath = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server configuration error: PHPMailer not found.']);
    exit;
}

require $autoloadPath;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request body']);
    exit;
}

// Basic Validation
$nombre = filter_var($data['nombre'] ?? '', FILTER_SANITIZE_STRING);
$email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
$mensaje = filter_var($data['mensaje'] ?? '', FILTER_SANITIZE_STRING);
$botField = $data['bot_field'] ?? '';

if (!empty($botField)) {
    // Silently fail for bots
    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    exit;
}

if (!$nombre || !$email || !$mensaje) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields correctly.']);
    exit;
}

// SMTP Configuration from Environment Variables
$smtpHost = getenv('SMTP_HOST');
$smtpUser = getenv('SMTP_USER');
$smtpPass = getenv('SMTP_PASS');
$smtpPort = getenv('SMTP_PORT') ?: 587;
$smtpAuth = getenv('SMTP_AUTH') === 'true';
$smtpSecure = getenv('SMTP_SECURE') ?: 'tls'; // 'tls' or 'ssl'
$emailFrom = getenv('SMTP_FROM_EMAIL');
$emailFromName = getenv('SMTP_FROM_NAME') ?: 'Sitio Web Garcete Suárez Ronco';
$emailTo = getenv('SMTP_TO_EMAIL');

if (!$smtpHost || !$smtpUser || !$smtpPass || !$emailTo) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server SMTP configuration is missing.']);
    exit;
}

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = $smtpAuth;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;
    $mail->SMTPSecure = $smtpSecure;
    $mail->Port       = $smtpPort;
    $mail->CharSet    = 'UTF-8';

    // Recipients
    $mail->setFrom($emailFrom, $emailFromName);
    $mail->addAddress($emailTo);
    $mail->addReplyTo($email, $nombre);

    // Content
    $mail->isHTML(true);
    $mail->Subject = "Nuevo contacto desde la web: $nombre";

    $body = "<h2>Nuevo mensaje de contacto</h2>";
    $body .= "<p><strong>Nombre:</strong> $nombre</p>";
    $body .= "<p><strong>Email:</strong> $email</p>";
    $body .= "<p><strong>Mensaje:</strong><br>" . nl2br(htmlspecialchars($mensaje)) . "</p>";

    $mail->Body = $body;
    $mail->AltBody = "Nombre: $nombre\nEmail: $email\nMensaje: $mensaje";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Your message has been sent successfully.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => "Mailer Error: {$mail->ErrorInfo}"]);
}
