document.addEventListener('DOMContentLoaded', () => {
    const budgetList = document.getElementById('budget-list');
    const createBudgetButton = document.getElementsByClassName('li3Menu')[0];
    const homeContent = document.getElementById('home-content');
    const ordersContent = document.getElementById('orders-content');
    const budgetModal = document.getElementById('budget-modal');
    const closeModal = document.getElementById('close-modal');
    const loggedInUser = localStorage.getItem('loggedInUser');
    const logoutButton = document.getElementById('logout-button');
    const userNameElement = document.getElementById('user-name');
    const totalOrdersElement = document.getElementById('total-orders');
    const balanceElement = document.getElementById('balance');
    const totalSpentElement = document.getElementById('total-spent');

    if (!loggedInUser) {
        window.location.href = '../index.html'; // Redireciona para a página de login se não estiver logado
        return;
    }

    userNameElement.textContent = loggedInUser;

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = '../index.html'; // Redireciona para a página de login
    });

    document.getElementsByClassName('li1Menu')[0].addEventListener('click', (e) => {
        e.preventDefault();
        homeContent.style.display = 'block';
        ordersContent.style.display = 'none';
        budgetModal.style.display = 'none'; // Fecha o modal se estiver aberto
    });

    document.getElementsByClassName('li2Menu')[0].addEventListener('click', (e) => {
        e.preventDefault();
        homeContent.style.display = 'none';
        ordersContent.style.display = 'block';
        budgetModal.style.display = 'none'; // Fecha o modal se estiver aberto
        loadBudgetItems(); // Carrega itens quando a aba "Ordens" é selecionada
    });

    createBudgetButton.addEventListener('click', (e) => {
        e.preventDefault();
        homeContent.style.display = 'none';
        ordersContent.style.display = 'none';
        budgetModal.style.display = 'flex'; // Abre o modal
    });

    closeModal.addEventListener('click', () => {
        homeContent.style.display = 'block';
        budgetModal.style.display = 'none'; // Fecha o modal
        clearForm();
    });

    window.addEventListener('click', (e) => {
        if (e.target === budgetModal) {
            budgetModal.style.display = 'none'; // Fecha o modal se clicar fora
        }
    });

    const budgetForm = document.getElementById('budget-form');

    budgetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const client = document.getElementById('client').value;
        const cpf = document.getElementById('cpf').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const date = document.getElementById('date').value;
        const deliveryDate = document.getElementById('delivery-date').value;
        const closedValue = parseFloat(document.getElementById('closed-value').value);
        const budgetValue = parseFloat(document.getElementById('budget-value').value);
        const material = document.getElementById('material').value;
        const rooms = document.getElementById('rooms').value;
        const spentValue = parseFloat(document.getElementById('spent-value').value);
        const status = document.getElementById('status').value; // Adiciona o status
        const profit = budgetValue - spentValue;

        const budgetItem = {
            id: Date.now(),
            client,
            cpf,
            address,
            phone,
            date,
            deliveryDate,
            closedValue,
            budgetValue,
            material,
            rooms,
            spentValue,
            status, // Inclui o status
            profit
        };

        let usersData = JSON.parse(localStorage.getItem('usersData')) || {};
        if (!usersData[loggedInUser]) {
            usersData[loggedInUser] = [];
        }
        usersData[loggedInUser].push(budgetItem);
        localStorage.setItem('usersData', JSON.stringify(usersData));
        homeContent.style.display = 'block';
        budgetModal.style.display = 'none'; // Fecha o modal
        clearForm(); // Limpa o formulário
        loadBudgetItems(); // Atualiza a lista de orçamentos
        updateSummary(); // Atualiza os totais na página inicial
    });


    function deleteBudgetItem(id) {
        // Exibir modal de confirmação
        const deleteModal = document.getElementById('delete-confirmation-modal');
        deleteModal.style.display = 'block';

        // Quando o usuário clicar em "Sim"
        document.getElementById('confirm-delete').onclick = function () {
            let usersData = JSON.parse(localStorage.getItem('usersData')) || {};
            usersData[loggedInUser] = usersData[loggedInUser].filter(item => item.id != id);
            localStorage.setItem('usersData', JSON.stringify(usersData));
            deleteModal.style.display = 'none';
            loadBudgetItems();
            updateSummary(); // Atualiza os totais após exclusão
        };

        // Quando o usuário clicar em "Não"
        document.getElementById('cancel-delete').onclick = function () {
            deleteModal.style.display = 'none';
        };
    }
    function editBudgetItem(id) {
        let usersData = JSON.parse(localStorage.getItem('usersData')) || {};
        const item = usersData[loggedInUser].find(item => item.id == id);
    
        console.log("Item encontrado para edição:", item);
    
        // Adicionar o modal de edição ao corpo do documento
        document.body.insertAdjacentHTML('beforeend', `
            <div id="edit-modal" class="modal-edit">
                <div class="modal-content-edit">
                    <span class="close-btn">X</span>
                    <form id="edit-budget-form">
                        <input type="text" id="edit-client" value="${item.client}" required placeholder="Cliente">
                        <input type="text" id="edit-cpf" value="${item.cpf}" required placeholder="CPF">
                        <input type="text" id="edit-address" value="${item.address}" required placeholder="Endereço">
                        <input type="text" id="edit-phone" value="${item.phone}" required placeholder="Telefone">
                        <input type="date" id="edit-date" value="${item.date}" required>
                        <input type="text" id="edit-delivery-date" value="${item.deliveryDate}" required placeholder="Prazo de Entrega">
                        <input type="number" id="edit-closed-value" value="${item.closedValue}" required placeholder="Orçamento">
                        <input type="number" id="edit-budget-value" value="${item.budgetValue}" required placeholder="Valor Fechado">
                        <input type="text" id="edit-material" value="${item.material}" required placeholder="Material Determinado">
                        <input type="text" id="edit-rooms" value="${item.rooms}" required placeholder="Cômodos">
                        <input type="number" id="edit-spent-value" value="${item.spentValue}" required placeholder="Valor Gasto">
                        <select id="edit-status" required>
                            <option value="Em processo" ${item.status === 'Em processo' ? 'selected' : ''}>Em processo</option>
                            <option value="Parcial" ${item.status === 'Parcial' ? 'selected' : ''}>Parcial</option>
                            <option value="Cancelado" ${item.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                            <option value="Pendente" ${item.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                            <option value="Completo" ${item.status === 'Completo' ? 'selected' : ''}>Completo</option>
                        </select>
                        <button type="submit" id="edit-btnSalvar">Salvar</button>
                    </form>
                </div>
            </div>
        `);
    
        // Exibir o modal
        document.getElementById('edit-modal').style.display = 'block';
    
        const editBudgetForm = document.getElementById('edit-budget-form');
        const closeModal = document.querySelector('.close-btn');
    
        closeModal.addEventListener('click', () => {
            document.getElementById('edit-modal').style.display = 'none';
            document.getElementById('edit-modal').remove();
        });
    
        editBudgetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedItem = {
                id: item.id,
                client: document.getElementById('edit-client').value,
                cpf: document.getElementById('edit-cpf').value,
                address: document.getElementById('edit-address').value,
                phone: document.getElementById('edit-phone').value,
                date: document.getElementById('edit-date').value,
                deliveryDate: document.getElementById('edit-delivery-date').value,
                closedValue: parseFloat(document.getElementById('edit-closed-value').value),
                budgetValue: parseFloat(document.getElementById('edit-budget-value').value),
                material: document.getElementById('edit-material').value,
                rooms: document.getElementById('edit-rooms').value,
                spentValue: parseFloat(document.getElementById('edit-spent-value').value),
                status: document.getElementById('edit-status').value,
                profit: parseFloat(document.getElementById('edit-budget-value').value) - parseFloat(document.getElementById('edit-spent-value').value)
            };
    
            console.log("Item atualizado:", updatedItem);
    
            usersData[loggedInUser] = usersData[loggedInUser].map(item => item.id == id ? updatedItem : item);
            localStorage.setItem('usersData', JSON.stringify(usersData));
    
            console.log("Dados salvos no localStorage:", JSON.parse(localStorage.getItem('usersData')));
    
            // Ocultar o modal
            document.getElementById('edit-modal').style.display = 'none';
            document.getElementById('edit-modal').remove(); // Remover o modal do DOM
            loadBudgetItems();
            updateSummary(); // Atualiza os totais após edição
        });
    }

    function loadBudgetItems() {
        let usersData = JSON.parse(localStorage.getItem('usersData')) || {};
        let budgets = usersData[loggedInUser] || [];

        // Obtém o valor do filtro de status
        let filterStatus = document.getElementById('status-filter-select').value;

        // Elemento onde os itens serão inseridos
        const budgetList = document.getElementById('budget-list');
        budgetList.innerHTML = '';

        // Filtra e mapeia os itens conforme o filtro de status
        const filteredBudgets = budgets
            .filter(item => filterStatus === 'Todos' || item.status === filterStatus)
            .map(item => `
                <li class="budget-item-container" data-id="${item.id}">
                    <div class="budget-item-details">
                        <p class="budget-item-field"><strong>Cliente:</strong> ${item.client}</p>
                        <p class="budget-item-field"><strong>CPF:</strong> ${item.cpf}</p>
                        <p class="budget-item-field"><strong>Endereço:</strong> ${item.address}</p>
                        <p class="budget-item-field"><strong>Telefone:</strong> ${item.phone}</p>
                        <p class="budget-item-field"><strong>Data:</strong> ${item.date}</p>
                        <p class="budget-item-field"><strong>Prazo de entrega:</strong> ${item.deliveryDate}</p>
                        <p class="budget-item-field"><strong>Orçamento:</strong> R$ ${item.closedValue.toFixed(2)}</p>
                        <p class="budget-item-field"><strong>Valor fechado:</strong> R$ ${item.budgetValue.toFixed(2)}</p>
                        <p class="budget-item-field"><strong>Material Determinado:</strong> ${item.material}</p>
                        <p class="budget-item-field"><strong>Cômodos:</strong> ${item.rooms}</p>
                        <p class="budget-item-field"><strong>Valor gasto:</strong> R$ ${item.spentValue.toFixed(2)}</p>
                        <p class="budget-item-field"><strong>Lucro:</strong> R$ ${item.profit.toFixed(2)}</p>
                        <p class="budget-item-field"><strong>Status:</strong> ${item.status}</p>
                    </div>
                    <div class="budget-item-actions">
                        <button class="budget-item-edit">Editar</button>
                        <button class="budget-item-delete">Excluir</button>
                    </div>
                </li>
            `).join('');

        // Insere os itens filtrados na lista
        budgetList.innerHTML = filteredBudgets;

        // Adicionar event listeners aos botões de editar e deletar
        document.querySelectorAll('.budget-item-edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.closest('.budget-item-container').dataset.id;
                editBudgetItem(id);
            });
        });

        document.querySelectorAll('.budget-item-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.closest('.budget-item-container').dataset.id;
                deleteBudgetItem(id);
            });
        });

        // Atualiza o resumo com os valores corretos
        updateSummary();
    }

    // Função para aplicar o filtro quando o valor mudar
    document.getElementById('status-filter-select').addEventListener('change', loadBudgetItems);

    // Chamada inicial para carregar os itens
    loadBudgetItems();

    function updateSummary() {
        let usersData = JSON.parse(localStorage.getItem('usersData')) || {};
        const userBudgets = usersData[loggedInUser] || [];
    
        // Calcular totais
        const totalOrders = userBudgets.length;
        const totalSpent = userBudgets.reduce((acc, item) => acc + parseFloat(item.spentValue || 0), 0);
        const totalProfit = userBudgets.reduce((acc, item) => acc + parseFloat(item.profit || 0), 0);
    
        // Formatar os valores como BRL
        const formattedTotalSpent = totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const formattedTotalProfit = totalProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
        // Atualizar o DOM com os valores calculados e formatados
        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('total-spent').textContent = formattedTotalSpent;
        document.getElementById('balance').textContent = formattedTotalProfit;
    }
    
});

function clearForm() {
    document.getElementById('client').value = '';
    document.getElementById('cpf').value = '';
    document.getElementById('address').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('date').value = '';
    document.getElementById('delivery-date').value = '';
    document.getElementById('closed-value').value = '';
    document.getElementById('budget-value').value = '';
    document.getElementById('material').value = '';
    document.getElementById('rooms').value = '';
    document.getElementById('spent-value').value = '';
}
