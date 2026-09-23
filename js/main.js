document.addEventListener('DOMContentLoaded', () => {
    const modalAuth = document.getElementById('modal-auth');
    const openLoginBtn = document.getElementById('open-login');
    const openRegisterBtn = document.getElementById('open-register');
    const closeModalBtn = document.getElementById('close-modal');

    const tabLoginBtn = document.getElementById('tab-login-btn');
    const tabRegisterBtn = document.getElementById('tab-register-btn');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    function openModal(tab) {
        if (!modalAuth) return;
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
        if (e.target === modalAuth) {
            modalAuth.style.display = 'none';
        }
    });
});