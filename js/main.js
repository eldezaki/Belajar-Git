document.addEventListener('DOMContentLoaded', () => {
    // --- 1. MODAL AUTH (MASUK / DAFTAR) ---
    const modalAuth = document.getElementById('modal-auth');
    const openLoginBtn = document.getElementById('open-login');
    const openRegisterBtn = document.getElementById('open-register');
    const closeModalBtn = document.getElementById('close-modal');
    const tabLoginBtn = document.getElementById('tab-login-btn');
    const tabRegisterBtn = document.getElementById('tab-register-btn');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    if (modalAuth) {  
        function openModal(tab) {
            modalAuth.style.display = 'flex';
            if (tab === 'login') {
                switchTab(tabLoginBtn, formLogin, tabRegisterBtn, formRegister);
            } else {
                switchTab(tabRegisterBtn, formRegister, tabLoginBtn, formLogin);
            }
        }

        function switchTab(activeBtn, activeForm, inactiveBtn, inactiveForm) {
            activeBtn.classList.add('active');
            inactiveBtn.classList.remove('active');
            activeForm.classList.add('active');
            inactiveForm.classList.remove('active');
        }

        if (openLoginBtn) openLoginBtn.addEventListener('click', () => openModal('login'));
        if (openRegisterBtn) openRegisterBtn.addEventListener('click', () => openModal('register'));
        if (closeModalBtn) closeModalBtn.addEventListener('click', () => modalAuth.style.display = 'none');
        if (tabLoginBtn) tabLoginBtn.addEventListener('click', () => switchTab(tabLoginBtn, formLogin, tabRegisterBtn, formRegister));
        if (tabRegisterBtn) tabRegisterBtn.addEventListener('click', () => switchTab(tabRegisterBtn, formRegister, tabLoginBtn, formLogin));

        window.addEventListener('click', (e) => {
            if (e.target === modalAuth) modalAuth.style.display = 'none';
        });
    }

    // --- 2. PENCARIAN & FILTERING KATALOG BUKU ---
    const searchInput = document.getElementById('search-input');
    const filterTags = document.getElementById('filter-tags');
    const bookCards = document.querySelectorAll('.book-card');
    const noResultText = document.getElementById('no-result');

    if (searchInput && bookCards.length > 0) {
        let currentCategory = 'semua';

        function filterBooks() {
            const query = searchInput.value.toLowerCase().trim();
            let visibleCount = 0;

            bookCards.forEach(card => {
                const title = card.querySelector('.book-title').textContent.toLowerCase();
                const author = card.querySelector('.author').textContent.toLowerCase();
                const category = card.getAttribute('data-category');

                const matchesSearch = title.includes(query) || author.includes(query);
                const matchesCategory = (currentCategory === 'semua') || (category === currentCategory);

                if (matchesSearch && matchesCategory) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (noResultText) {
                noResultText.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        }

        searchInput.addEventListener('input', filterBooks);

        if (filterTags) {
            filterTags.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    filterTags.querySelectorAll('.tag').forEach(tag => tag.classList.remove('active'));
                    e.target.classList.add('active');
                    currentCategory = e.target.getAttribute('data-category');
                    filterBooks();
                }
            });
        }
    }

    // --- 3. DUMMY KALENDER JADWAL RESERVASI ---
    const calendarDays = document.getElementById('calendar-days');
    if (calendarDays) {
        const totalDays = 30; // Simulasi bulan 30 hari
        const bookedDays = [12, 18, 25]; // Contoh tanggal yang terisi

        for (let day = 1; day <= totalDays; day++) {
            const dayElem = document.createElement('span');
            dayElem.textContent = day;

            if (bookedDays.includes(day)) {
                dayElem.classList.add('has-event');
            }

            dayElem.addEventListener('click', () => {
                document.querySelectorAll('.calendar-days span').forEach(el => el.classList.remove('selected'));
                dayElem.classList.add('selected');
            });

            calendarDays.appendChild(dayElem);
        }
    }

    // --- 4. PROFILE PAGE INTERACTIONS ---
const avatarInput = document.getElementById('avatar-input');
const profilePreviewImg = document.getElementById('profile-preview-img');
const formEditProfile = document.getElementById('form-edit-profile');

if (avatarInput && profilePreviewImg) {
    // Preview Gambar saat user upload foto baru
    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                profilePreviewImg.src = event.target.result;
                const navAvatar = document.getElementById('nav-avatar-img');
                if (navAvatar) navAvatar.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

if (formEditProfile) {
    formEditProfile.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newDisplayName = document.getElementById('input-display-name').value;
        const newEmail = document.getElementById('input-email').value;

        // Update teks di kartu profil dan navbar secara langsung
        document.getElementById('display-name-text').textContent = newDisplayName;
        document.getElementById('display-email-text').textContent = newEmail;
        
        const navUserName = document.getElementById('nav-user-name');
        if (navUserName) navUserName.textContent = newDisplayName;

        alert('Profil berhasil diperbarui!');
    });
}
});