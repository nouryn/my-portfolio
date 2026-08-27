<?php
declare(strict_types=1);
require __DIR__ . '/api/bootstrap.php';
$requestedCategories = array_filter(explode(',', (string) ($_GET['category'] ?? '')));
if (!$requestedCategories || array_diff($requestedCategories, array_keys(PORTFOLIO_CATEGORIES))) {
    http_response_code(404);
    exit('Portfolio category not found.');
}
$placeholders = implode(',', array_fill(0, count($requestedCategories), '?'));
$statement = $pdo->prepare("SELECT * FROM portfolio_items WHERE is_published = 1 AND category IN ($placeholders) ORDER BY COALESCE(item_date, DATE(created_at)) DESC, id DESC");
$statement->execute($requestedCategories);
$items = $statement->fetchAll();
function h(?string $value): string { return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'); }
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title><?= h(implode(' & ', array_map(fn($key) => PORTFOLIO_CATEGORIES[$key], $requestedCategories))) ?> | Nouryn Eryssa</title><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="content.css"></head>
<body><header class="nav"><div class="shell nav-inner"></div></header><main><section class="section"><div class="shell"><p class="eyebrow">Complete archive</p><h1><?= h(implode(' & ', array_map(fn($key) => PORTFOLIO_CATEGORIES[$key], $requestedCategories))) ?></h1><p class="intro">Every published entry, newest first.</p><div class="grid project-grid">
<?php foreach ($items as $item): ?><article class="card dynamic-card">
<?php if ($item['image_url']): ?><img class="dynamic-card-image" src="<?= h($item['image_url']) ?>" alt="<?= h($item['title']) ?>"><?php endif; ?>
<?php if ($item['subtitle'] || $item['item_date']): ?><p class="kicker"><?= h($item['subtitle'] ?: date('F Y', strtotime($item['item_date']))) ?></p><?php endif; ?>
<h3><?= h($item['title']) ?></h3><p><?= h($item['description']) ?></p>
<?php foreach (array_filter(array_map('trim', explode(',', (string) $item['tags']))) as $tag): ?><span class="tag"><?= h($tag) ?></span><?php endforeach; ?>
<?php if ($item['external_url'] || $item['proof_url']): ?><a class="button project-card-link" href="<?= h($item['external_url'] ?: $item['proof_url']) ?>"<?= $item['external_url'] ? ' target="_blank" rel="noreferrer"' : '' ?>><?= $item['external_url'] ? 'View project ↗' : 'View proof →' ?></a><?php endif; ?>
</article><?php endforeach; ?>
</div><?php if (!$items): ?><p class="content-empty">No published entries yet.</p><?php endif; ?><a class="button detail-back" href="index.html">← Back to Home</a></div></section></main><footer class="footer"><div class="shell footer-inner"><span>© 2026 Nouryn Eryssa</span></div></footer><script src="script.js"></script></body></html>
