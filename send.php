<?php
header('Content-Type: application/json');

// Allow POST only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["ok" => false, "error" => "Method Not Allowed"]);
    exit;
}

// Honeypot spam protection
if (!empty($_POST['website'])) {
    echo json_encode(["ok" => true]);
    exit;
}

// Sanitize inputs
$name    = trim(strip_tags($_POST['name'] ?? ''));
$email   = trim($_POST['email'] ?? '');
$subject = trim(strip_tags($_POST['subject'] ?? ''));
$message = trim(strip_tags($_POST['message'] ?? ''));

// Validate required fields
if ($name === '' || $email === '' || $subject === '' || $message === '') {
    echo json_encode(["ok" => false, "error" => "Please fill in all fields"]);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["ok" => false, "error" => "Invalid email address"]);
    exit;
}

// Destination email (must exist on your domain)
$to = "yosef.luleseged@addispcb.com";

// Use a domain-based FROM address (VERY IMPORTANT)
$fromEmail = "yosef.luleseged@addispcb";
$fromName  = "Addis PCB Website";

// Email headers
$headers  = "From: {$fromName} <{$fromEmail}>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Email body
$body =
"New Contact Form Submission\n\n" .
"Name: {$name}\n" .
"Email: {$email}\n" .
"Subject: {$subject}\n\n" .
"Message:\n{$message}\n";

// Encode subject for UTF-8 safety
$encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";

// Send mail
if (mail($to, $encodedSubject, $body, $headers)) {
    echo json_encode(["ok" => true, "message" => "Message sent successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => "Server mail configuration error"]);
}
