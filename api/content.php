<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/bootstrap.php';

$category = $_GET['category'] ?? '';
$limit = min(max((int) ($_GET['limit'] ?? 3), 1), 100);
if ($category !== '' && !array_key_exists($category, PORTFOLIO_CATEGORIES)) {
    http_response_code(400);
    echo json_encode(['error' => 'Unknown category']);
    exit;
}

$where = 'is_published = 1';
$params = [];
if ($category !== '') {
    $where .= ' AND category = :category';
    $params['category'] = $category;
}
$statement = $pdo->prepare("SELECT id, category, title, subtitle, description, item_date, tags, image_url, proof_url, external_url, created_at
  FROM portfolio_items WHERE $where
  ORDER BY COALESCE(item_date, DATE(created_at)) DESC, id DESC LIMIT $limit");
$statement->execute($params);
echo json_encode(['items' => $statement->fetchAll()], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
