<?php
require __DIR__ . '/../../src/db.php';
require __DIR__ . '/../../src/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

try {
    $pdo = db();

    // ---------- GET: daftar buku (opsional ?q=kata) ----------
    if ($method === 'GET') {
        $q = trim($_GET['q'] ?? '');
        $sql = 'SELECT id, judul, penulis, kategori, kondisi, harga, stok, deskripsi
                FROM books WHERE aktif = true';
        $params = [];
        if ($q !== '') {
            $sql .= ' AND (judul ILIKE :q1 OR penulis ILIKE :q2)';
            $params[':q1'] = $params[':q2'] = '%' . $q . '%';
        }
        $sql .= ' ORDER BY id';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        json_out(['data' => $stmt->fetchAll()]);
    }

    // ---------- POST: tambah buku ----------
    if ($method === 'POST') {
        [$book, $errors] = validate_book(json_body());
        if ($errors) json_out(['error' => implode(' ', $errors)], 422);

        $stmt = $pdo->prepare(
            'INSERT INTO books (judul, penulis, kategori, kondisi, harga, stok, deskripsi)
             VALUES (:judul, :penulis, :kategori, :kondisi, :harga, :stok, :deskripsi)
             RETURNING id'
        );
        $stmt->execute($book);
        json_out(['id' => $stmt->fetchColumn()], 201);
    }

    // ---------- PUT: edit buku (?id=...) ----------
    if ($method === 'PUT') {
        if (!$id) json_out(['error' => 'ID tidak valid.'], 400);
        [$book, $errors] = validate_book(json_body());
        if ($errors) json_out(['error' => implode(' ', $errors)], 422);

        $book['id'] = $id;
        $stmt = $pdo->prepare(
            'UPDATE books SET judul = :judul, penulis = :penulis, kategori = :kategori,
                    kondisi = :kondisi, harga = :harga, stok = :stok, deskripsi = :deskripsi
             WHERE id = :id AND aktif = true'
        );
        $stmt->execute($book);
        if ($stmt->rowCount() === 0) json_out(['error' => 'Buku tidak ditemukan.'], 404);
        json_out(['ok' => true]);
    }

    // ---------- DELETE: nonaktifkan buku (?id=...) ----------
    if ($method === 'DELETE') {
        if (!$id) json_out(['error' => 'ID tidak valid.'], 400);
        $stmt = $pdo->prepare('UPDATE books SET aktif = false WHERE id = :id AND aktif = true');
        $stmt->execute([':id' => $id]);
        if ($stmt->rowCount() === 0) json_out(['error' => 'Buku tidak ditemukan.'], 404);
        json_out(['ok' => true]);
    }

    json_out(['error' => 'Method tidak didukung.'], 405);

} catch (Throwable $e) {
    error_log($e->getMessage());               // detail error: hanya tampil di terminal server
    json_out(['error' => 'Terjadi kesalahan pada server.'], 500);  // pesan umum ke browser
}