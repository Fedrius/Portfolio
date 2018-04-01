<?php

require_once('email_config.php');
require('phpmailer/PHPMailer/PHPMailerAutoload.php');

//validate post inputsd
$message = [];
$output = [
    'success' => null,
    'messages' => []
];

//sanitize name field
$message['name'] = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
if(empty($message['name'])){
    $output['success'] = false;
    $output['messages'][] = 'missing name key';
}

//validatte email field
$message['email'] = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
if(empty($message['email'])){
    $output['success'] = false;
    $output['messages'][] = 'missing email key';
}

//$message['subject'] = filter_var($_POST['subject'], FILTER_SANITIZE_STRING);
//if(empty($message['subject'])){
//    $output['success'] = false;
//    $output['messages'][] = 'missing subject key';
//}

$message['message'] = filter_var($_POST['message'], FILTER_SANITIZE_STRING);
if(empty($message['message'])){
    $output['success'] = false;
    $output['messages'][] = 'missing message key';
}

if($output['success'] !== null){
    echo json_encode($output);
    exit();
}

$mail = new PHPMailer;
$mail->SMTPDebug = 0;
$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = EMAIL_USER;
$mail->Password = EMAIL_PASS;
$mail->SMTPSecure = 'tls';
$mail->Port = 587;
$options = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);
$mail->smtpConnect($options);
$mail->From = $message['email'];
$mail->FromName = $message['name'];
$mail->addAddress(EMAIL_USER);
$mail->addReplyTo($message['email'], $message['name']);

$mail->isHTML(true);
$mail->Subject = 'Message From Porfolio Site'; //$message['subject'];
$mail->Body    = nl2br($message['message']);
$mail->AltBody = htmlentities($message['message']);

if(!$mail->send()) {
    $output['success'] = false;
    $output['messages'][] = $mail -> ErrorInfo;
} else {
    $output['success'] = true;
}
echo json_encode($output);
?>
