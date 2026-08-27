<?php
declare(strict_types=1);

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    http_response_code(503);
    exit('Portfolio database is not configured. Copy api/config.php.example to api/config.php.');
}
$config = require $configFile;

try {
    $pdo = new PDO(
        "mysql:host={$config['host']};dbname={$config['database']};charset=utf8mb4",
        $config['username'],
        $config['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (PDOException $exception) {
    http_response_code(503);
    exit('Portfolio database connection failed. Check api/config.php.');
}

const PORTFOLIO_CATEGORIES = [
    'innovation' => 'Innovation',
    'business_intelligence' => 'Business Intelligence',
    'data_analytics' => 'Data Analytics',
    'web_development' => 'Web Development',
    'certifications' => 'Certifications & Digital Credentials',
    'courses' => 'Professional Development Courses',
    'achievements_extracurricular' => 'Extracurricular Achievements',
    'achievements_academic' => 'Academic Achievements',
    'experience_professional' => 'Professional Experience',
    'experience_leadership' => 'Leadership Committees',
    'experience_ngo' => 'NGO Involvement',
    'events' => 'Event Management Timeline',
    'volunteering' => 'Volunteering',
];
