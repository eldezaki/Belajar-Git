document.addEventListener('DOMContentLoaded', () => {
    // --- 1. TAB SWITCHING LOGIC ---
    const sidebarBtns = document.querySelectorAll('.sidebar-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sidebarBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });
});

// --- 2. POS KASIR TRANSAKSI LOGIC ---
let cart = [];

function addToCart(title, price) {
    const existingItem = cart.find(item => item.title === title);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ title, price, qty: 1 });
    }
    renderCart();
}

function renderCart() {
    const cartTbody = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartTbody.innerHTML = '';

    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.title}</td>
            <td>${item.qty}x</td>
            <td>Rp ${subtotal.toLocaleString('id-ID')}</td>
        `;
        cartTbody.appendChild(tr);
    });

    cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function processPayment() {
    if (cart.length === 0) {
        alert('Keranjang kasir masih kosong!');
        return;
    }
    alert('Transaksi Berhasil! Invoice telah diproses dan dicetak.');
    cart = [];
    renderCart();
}

// --- 3. RESERVASI STATUS UPDATE LOGIC ---
function updateStatus(id, newStatus) {
    const statusElem = document.getElementById(`status-${id}`);
    if (statusElem) {
        statusElem.textContent = newStatus;
        if (newStatus === 'Disetujui') {
            statusElem.className = 'badge badge-success';
        } else {
            statusElem.className = 'badge badge-warning';
        }
    }
}

const formAddSchedule = document.getElementById('form-admin-add-schedule');
if (formAddSchedule) {
    formAddSchedule.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const ruangan = document.getElementById('admin-ruangan').value;
        const tanggal = document.getElementById('admin-tanggal').value;
        const jamMulai = document.getElementById('admin-jam-mulai').value;
        const jamSelesai = document.getElementById('admin-jam-selesai').value;
        const pemohon = document.getElementById('admin-pemohon').value;

        // Validasi sederhana: jam selesai tidak boleh lebih awal dari jam mulai
        if (jamSelesai <= jamMulai) {
            alert('Jam selesai harus lebih lambat dari jam mulai!');
            return;
        }

        // Format tampilan konsisten HH:MM - HH:MM WIB
        const formatWaktu = `${jamMulai} - ${jamSelesai} WIB`;

        const tbody = document.getElementById('admin-schedule-list');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${ruangan}</strong></td>
            <td>${tanggal}</td>
            <td>${formatWaktu}</td>
            <td>${pemohon}</td>
            <td>
                <button class="btn-sm btn-danger" onclick="this.closest('tr').remove()">Hapus Jadwal</button>
            </td>
        `;
        
        tbody.prepend(tr);
        formAddSchedule.reset();
        alert('Jadwal reservasi berhasil diplot ke web!');
    });
}