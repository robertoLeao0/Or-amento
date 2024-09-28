document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const createAccountLink = document.getElementById('create-account-link');
    const registerModal = document.getElementById('register-modal');
    const closeModalButton = document.getElementById('close-modal');

    createAccountLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', () => {
        registerModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == registerModal) {
            registerModal.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.usuario === usuario && user.password === password);

        if (user) {
            localStorage.setItem('loggedInUser', usuario);
            window.location.href = '../pages/logado.html'; // Redireciona para a página de orçamento
        } else {
            alert('Credenciais inválidas!');
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const usuario = document.getElementById('register-usuario').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.find(user => user.usuario === usuario);

        if (userExists) {
            alert('Usuário já registrado!');
        } else {
            users.push({ usuario, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Usuário registrado com sucesso!');
            registerModal.style.display = 'none';
        }
    });
});
