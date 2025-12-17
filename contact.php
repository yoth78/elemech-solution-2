<?php
// Mobile-friendly contact form handler
header('Content-Type: application/json; charset=utf-8');

// Enable CORS for mobile app compatibility
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get and sanitize form data
    $name = filter_var(trim($_POST['name'] ?? ''), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $phone = filter_var(trim($_POST['phone'] ?? ''), FILTER_SANITIZE_STRING);
    $service = filter_var(trim($_POST['service'] ?? ''), FILTER_SANITIZE_STRING);
    $message = filter_var(trim($_POST['message'] ?? ''), FILTER_SANITIZE_STRING);
    
    // Validation
    $errors = [];
    
    if (empty($name) || strlen($name) < 2) {
        $errors[] = "Please enter a valid name (minimum 2 characters).";
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Please enter a valid email address.";
    }
    
    if (empty($message) || strlen($message) < 10) {
        $errors[] = "Please enter a message with at least 10 characters.";
    }
    
    // If there are validation errors
    if (!empty($errors)) {
        echo json_encode([
            'success' => false,
            'message' => implode(' ', $errors),
            'errors' => $errors
        ]);
        exit;
    }
    
    // Prepare email
    $to = "Yosef.Luleseged@addispcb.com";
    $subject = "New Contact Form Submission - Elemech Solution P.L.C";
    
    // Email content with better formatting
    $email_content = "NEW CONTACT FORM SUBMISSION\n";
    $email_content .= "=============================\n\n";
    $email_content .= "**Name:** $name\n";
    $email_content .= "**Email:** $email\n";
    $email_content .= "**Phone:** " . ($phone ? $phone : "Not provided") . "\n";
    $email_content .= "**Service Interest:** " . ($service ? ucfirst(str_replace('-', ' ', $service)) : "Not specified") . "\n\n";
    $email_content .= "**Message:**\n";
    $email_content .= wordwrap($message, 70) . "\n\n";
    $email_content .= "=============================\n";
    $email_content .= "Submitted: " . date('Y-m-d H:i:s') . "\n";
    $email_content .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $email_content .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "\n";
    
    // Email headers
    $headers = "From: Elemech Website <noreply@elemechsolution.com>\r\n";
    $headers .= "Reply-To: $name <$email>\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    
    // Attempt to send email
    try {
        if (mail($to, $subject, $email_content, $headers)) {
            // Also save to database or file for backup (optional)
            $log_data = [
                'timestamp' => date('Y-m-d H:i:s'),
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'service' => $service,
                'ip' => $_SERVER['REMOTE_ADDR']
            ];
            
            // Log to file (optional)
            file_put_contents('contact_log.txt', json_encode($log_data) . PHP_EOL, FILE_APPEND);
            
            echo json_encode([
                'success' => true,
                'message' => 'Thank you for your message! We will contact you within 24 hours.',
                'redirect' => false
            ]);
        } else {
            throw new Exception('Mail function failed');
        }
    } catch (Exception $e) {
        // Log error
        error_log('Contact form error: ' . $e->getMessage());
        
        echo json_encode([
            'success' => false,
            'message' => 'Sorry, there was an error sending your message. Please try again or call us directly.',
            'error' => 'Mail delivery failed'
        ]);
    }
} else {
    // Invalid request method
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method. Please use the form to submit your message.',
        'error' => 'Invalid method'
    ]);
}

// Rate limiting check (optional)
function checkRateLimit($ip) {
    $limit = 3; // 3 submissions per hour
    $timeframe = 3600; // 1 hour in seconds
    
    $filename = 'rate_limit.txt';
    $data = [];
    
    if (file_exists($filename)) {
        $data = json_decode(file_get_contents($filename), true);
    }
    
    $current_time = time();
    $user_submissions = array_filter($data[$ip] ?? [], function($time) use ($current_time, $timeframe) {
        return ($current_time - $time) < $timeframe;
    });
    
    if (count($user_submissions) >= $limit) {
        return false;
    }
    
    $data[$ip][] = $current_time;
    file_put_contents($filename, json_encode($data));
    return true;
}
?>