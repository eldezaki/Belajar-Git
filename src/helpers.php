<?php
// Kirim respons JSON lalu hentikan skrip
function json_out($data, int $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Baca body JSON dari request (dipakai POST dan PUT)
function json_body(): array {
    $data = json_decode(file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

// Validasi data buku. Mengembalikan [data_bersih, daftar_error]
function validate_book(array $in): array {
    $errors = [];

    $judul    = trim((string)($in['judul'] ?? ''));
    $penulis  = trim((string)($in['penulis'] ?? ''));
    $kategori = trim((string)($in['kategori'] ?? ''));
    $kondisi  = (string)($in['kondisi'] ?? '');
    $harga    = filter_var($in['harga'] ?? null, FILTER_VALIDATE_INT);
    $stok     = filter_var($in['stok'] ?? null, FILTER_VALIDATE_INT);
    $deskripsi = trim((string)($in['deskripsi'] ?? ''));

    $kategoriValid = ['Sastra', 'Sejarah', 'Filsafat', 'Sains', 'Anak', 'Lainnya'];

    if ($judul === '')   $errors[] = 'Judul wajib diisi.';
    if ($penulis === '') $errors[] = 'Penulis wajib diisi.';
    if (!in_array($kategori, $kategoriValid, true)) $errors[] = 'Kategori tidak valid.';
    if (!in_array($kondisi, ['Baru', 'Bekas'], true)) $errors[] = 'Kondisi tidak valid.';
    if ($harga === false || $harga < 0) $errors[] = 'Harga harus berupa angka bulat 0 atau lebih.';
    if ($stok === false || $stok < 0)   $errors[] = 'Stok harus berupa angka bulat 0 atau lebih.';

    return [[
        'judul'     => $judul,
        'penulis'   => $penulis,
        'kategori'  => $kategori,
        'kondisi'   => $kondisi,
        'harga'     => $harga,
        'stok'      => $stok,
        'deskripsi' => $deskripsi === '' ? null : $deskripsi,
    ], $errors];
}