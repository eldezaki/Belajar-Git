document.addEventListener('DOMContentLoaded', () => {
    const API = 'api/books.php';

    const tbody    = document.getElementById('admin-book-list');
    const countEl  = document.getElementById('book-count');
    const searchEl = document.getElementById('book-search');
    const popup    = document.getElementById('book-popup');
    const form     = document.getElementById('form-add-book');
    const titleEl  = document.getElementById('book-popup-title');

    const f = {
        id:        document.getElementById('book-id'),
        judul:     document.getElementById('book-judul'),
        penulis:   document.getElementById('book-penulis'),
        kategori:  document.getElementById('book-kategori'),
        kondisi:   document.getElementById('book-kondisi'),
        harga:     document.getElementById('book-harga'),
        stok:      document.getElementById('book-stok'),
        deskripsi: document.getElementById('book-deskripsi'),
    };

    let books = [];

    const rupiah = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

    // WAJIB: cegah XSS. Data dari database tidak boleh masuk innerHTML mentah-mentah.
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));

    // pembungkus fetch: lempar error kalau server membalas gagal
    async function request(url, options = {}) {
        const res = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Permintaan gagal.');
        return data;
    }

    function render() {
        countEl.textContent = `Menampilkan ${books.length} buku`;

        if (books.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Tidak ada buku ditemukan.</td></tr>';
            return;
        }

        tbody.innerHTML = books.map((b) => {
            const stok = b.stok === 0
                ? '<span class="stock-out">Habis</span>'
                : b.stok <= 2 ? `<span class="stock-low">${b.stok}</span>` : b.stok;

            return `
                <tr data-id="${b.id}">
                    <td><strong>${esc(b.judul)}</strong></td>
                    <td>${esc(b.penulis)}</td>
                    <td>${esc(b.kategori)}</td>
                    <td>${rupiah(b.harga)}</td>
                    <td>${stok}</td>
                    <td><span class="badge">${esc(b.kondisi)}</span></td>
                    <td>
                        <button class="btn-sm btn-secondary" data-act="edit">Edit</button>
                        <button class="btn-sm btn-danger" data-act="delete">Hapus</button>
                    </td>
                </tr>`;
        }).join('');
    }

    async function loadBooks() {
        try {
            const q = encodeURIComponent(searchEl.value.trim());
            const data = await request(`${API}?q=${q}`);
            books = data.data;
            render();
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="7">${esc(err.message)}</td></tr>`;
        }
    }

    // pencarian: tunggu 300 ms setelah berhenti mengetik
    let timer;
    searchEl.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(loadBooks, 300);
    });

    // tombol tambah
    document.getElementById('btn-add-book').addEventListener('click', () => {
        form.reset();
        f.id.value = '';
        titleEl.textContent = 'Tambah Buku Baru';
        popup.hidden = false;
        f.judul.focus();
    });

    // tombol edit / hapus di tabel (event delegation)
    tbody.addEventListener('click', async (e) => {
        const btn = e.target.closest('button[data-act]');
        if (!btn) return;

        const id = Number(btn.closest('tr').dataset.id);
        const book = books.find((b) => b.id === id);

        if (btn.dataset.act === 'edit') {
            f.id.value        = book.id;
            f.judul.value     = book.judul;
            f.penulis.value   = book.penulis;
            f.kategori.value  = book.kategori;
            f.kondisi.value   = book.kondisi;
            f.harga.value     = book.harga;
            f.stok.value      = book.stok;
            f.deskripsi.value = book.deskripsi ?? '';
            titleEl.textContent = 'Edit Buku';
            popup.hidden = false;
        }

        if (btn.dataset.act === 'delete') {
            if (!confirm(`Hapus "${book.judul}" dari daftar buku?`)) return;
            try {
                await request(`${API}?id=${id}`, { method: 'DELETE' });
                loadBooks();
            } catch (err) {
                alert(err.message);
            }
        }
    });

    // tombol simpan (tambah atau edit, tergantung ada id atau tidak)
    document.getElementById('btn-save-book').addEventListener('click', async () => {
        const id = f.id.value;
        const payload = {
            judul:     f.judul.value,
            penulis:   f.penulis.value,
            kategori:  f.kategori.value,
            kondisi:   f.kondisi.value,
            harga:     f.harga.value,
            stok:      f.stok.value,
            deskripsi: f.deskripsi.value,
        };

        try {
            await request(id ? `${API}?id=${id}` : API, {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(payload),
            });
            popup.hidden = true;
            loadBooks();
        } catch (err) {
            alert(err.message);
        }
    });

    loadBooks();
});