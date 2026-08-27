<?php
declare(strict_types=1);
session_start();
require __DIR__ . '/../api/bootstrap.php';
function h(?string $value): string { return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'); }
if (isset($_POST['logout'])) { session_destroy(); header('Location: index.php'); exit; }
if (!isset($_SESSION['portfolio_admin'])) {
    $error = '';
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (hash_equals((string) $config['admin_password'], (string) ($_POST['password'] ?? ''))) { $_SESSION['portfolio_admin'] = true; header('Location: index.php'); exit; }
        $error = 'Incorrect password.';
    }
    ?><!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Portfolio admin</title><link rel="stylesheet" href="../styles.css"></head><body><main><section class="section"><div class="shell"><p class="eyebrow">Private area</p><h1>Portfolio admin</h1><form method="post" class="card" style="max-width:440px"><label>Password<br><input required type="password" name="password" autocomplete="current-password"></label><p><button class="button">Sign in</button></p><?php if ($error): ?><p><?= h($error) ?></p><?php endif; ?></form></div></section></main></body></html><?php exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete'])) {
    $pdo->prepare('DELETE FROM portfolio_items WHERE id = :id')->execute(['id' => (int) $_POST['delete']]);
    header('Location: index.php?message=deleted'); exit;
}
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save'])) {
    $fields = ['category','title','subtitle','description','item_date','tags','image_url','proof_url','external_url'];
    $item = [];
    foreach ($fields as $field) $item[$field] = trim((string) ($_POST[$field] ?? ''));
    $item['is_published'] = isset($_POST['is_published']) ? 1 : 0;
    if (!array_key_exists($item['category'], PORTFOLIO_CATEGORIES) || $item['title'] === '' || $item['description'] === '') $message = 'Category, title and description are required.';
    else {
        foreach (['subtitle','item_date','tags','image_url','proof_url','external_url'] as $nullable) if ($item[$nullable] === '') $item[$nullable] = null;
        $pdo->prepare('INSERT INTO portfolio_items (category,title,subtitle,description,item_date,tags,image_url,proof_url,external_url,is_published) VALUES (:category,:title,:subtitle,:description,:item_date,:tags,:image_url,:proof_url,:external_url,:is_published)')->execute($item);
        header('Location: index.php?message=saved'); exit;
    }
}
$items = $pdo->query('SELECT id, category, title, item_date, is_published FROM portfolio_items ORDER BY COALESCE(item_date, DATE(created_at)) DESC, id DESC')->fetchAll();
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Portfolio admin</title><link rel="stylesheet" href="../styles.css"><style>input,textarea,select{width:100%;box-sizing:border-box;margin:6px 0 16px;padding:10px;border:1px solid var(--line);border-radius:8px;font:inherit}textarea{min-height:110px}.admin-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.admin-list{margin-top:45px}.admin-row{display:flex;gap:12px;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--line)}@media(max-width:640px){.admin-grid{grid-template-columns:1fr}.admin-row{align-items:flex-start;flex-direction:column}}</style></head><body><main><section class="section"><div class="shell"><form method="post" style="float:right"><button class="button ghost" name="logout">Log out</button></form><p class="eyebrow">Private area</p><h1>Add a portfolio entry</h1><p class="intro">The latest three published entries in each category appear automatically on the portfolio. Older entries stay in that category’s See more archive.</p><?php if ($message || isset($_GET['message'])): ?><p class="tag"><?= h($message ?: 'Entry ' . $_GET['message'] . '.') ?></p><?php endif; ?><form method="post" class="card"><input type="hidden" name="save" value="1"><div class="admin-grid"><label>Category<select required name="category"><?php foreach (PORTFOLIO_CATEGORIES as $key => $label): ?><option value="<?= h($key) ?>"><?= h($label) ?></option><?php endforeach; ?></select></label><label>Date (controls newest-first order)<input type="date" name="item_date"></label></div><label>Title<input required maxlength="180" name="title"></label><label>Role, issuer or short label<input maxlength="180" name="subtitle"></label><label>Description<textarea required name="description"></textarea></label><label>Tags — comma separated<input maxlength="500" name="tags" placeholder="Power BI, SQL, Dashboard"></label><div class="admin-grid"><label>Image path or URL<input name="image_url" placeholder="assets/projects/example.jpg"></label><label>Proof / credential URL<input type="url" name="proof_url"></label></div><label>Project / detail URL<input type="url" name="external_url"></label><label><input style="width:auto" type="checkbox" name="is_published" checked> Publish immediately</label><p><button class="button">Add entry</button></p></form><div class="admin-list"><p class="eyebrow">Published and draft entries</p><?php foreach ($items as $item): ?><div class="admin-row"><span><strong><?= h($item['title']) ?></strong><br><small><?= h(PORTFOLIO_CATEGORIES[$item['category']]) ?><?= $item['item_date'] ? ' · ' . h($item['item_date']) : '' ?><?= $item['is_published'] ? '' : ' · Draft' ?></small></span><form method="post" onsubmit="return confirm('Delete this entry?')"><button class="button ghost" name="delete" value="<?= (int) $item['id'] ?>">Delete</button></form></div><?php endforeach; ?></div></div></section></main></body></html>
