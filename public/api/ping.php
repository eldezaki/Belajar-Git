<?php
require __DIR__ . '/../../src/db.php';
header('Content-Type: application/json');

$row = db()->query('SELECT now() AS waktu')->fetch();
echo json_encode($row);