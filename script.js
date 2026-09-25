const modal = document.getElementById('modal-anuncio');
const btnAnunciar = document.getElementById('btn-anunciar');
const btnFechar = document.getElementById('btn-fechar');
const formProduto = document.getElementById('form-produto');
const vitrineProdutos = document.getElementById('vitrine-produtos');

const btnCarrinho = document.getElementById('btn-carrinho');
const btnFecharCarrinho = document.getElementById('btn-fechar-carrinho');
const carrinhoLateral = document.getElementById('carrinho-lateral');
const carrinhoLista = document.getElementById('carrinho-itens-lista');
const carrinhoContador = document.getElementById('carrinho-contador');
const carrinhoTotalValor = document.getElementById('carrinho-total-valor');
const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');

const produtos = [
    { id: 1, nome: "Memória RAM HyperX 8GB DDR4", preco: 150, tipo: "Venda" },
    { id: 2, nome: "Processador Intel i5 7ª Gen", preco: 0, tipo: "Doação" },
    { id: 3, nome: "Procuro Placa de Vídeo RTX 3060", preco: 1200, tipo: "Compra" }
];

let carrinho = [];

btnAnunciar.addEventListener('click', () => modal.className = 'modal-visivel');
btnFechar.addEventListener('click', () => modal.className = 'modal-oculto');

/* ABRE E FECHA O CARRINHO DIRETO PONTUALMENTE */
btnCarrinho.addEventListener('click', () => carrinhoLateral.style.transform = 'translateX(0)');
btnFecharCarrinho.addEventListener('click', () => carrinhoLateral.style.transform = 'translateX(100%)');

function renderizarProdutos() {
    vitrineProdutos.innerHTML = ""; 
    
    produtos.forEach(prod => {
        const precoFormatado = prod.tipo === "Doação" ? "Grátis (Doação)" : `R$ ${prod.preco}`;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div>
                <span class="tag ${prod.tipo}">${prod.tipo}</span>
                <h3>${prod.nome}</h3>
            </div>
            <div>
                <p class="preco">${precoFormatado}</p>
                <button class="btn-card" onclick="adicionarAoCarrinho(${prod.id})">Adicionar ao Carrinho</button>
            </div>
        `;
        vitrineProdutos.appendChild(card);
    });
}

function adicionarAoCarrinho(id) {
    const produtoSelecionado = produtos.find(p => p.id === id);
    if (produtoSelecionado) {
        carrinho.push(produtoSelecionado);
        atualizarCarrinho();
        /* ABRE O CARRINHO SOZINHO NA TELA AO ADICIONAR */
        carrinhoLateral.style.transform = 'translateX(0)';
    }
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    carrinhoContador.innerText = carrinho.length;
    carrinhoLista.innerHTML = "";
    
    let total = 0;
    
    carrinho.forEach((item, index) => {
        total += item.preco;
        const textoPreco = item.tipo === "Doação" ? "Grátis" : `R$ ${item.preco}`;
        
        const divItem = document.createElement('div');
        divItem.className = 'item-no-carrinho';
        divItem.innerHTML = `
            <div>
                <h4>${item.nome}</h4>
                <span>${textoPreco}</span>
            </div>
            <button class="btn-remover-item" onclick="removerDoCarrinho(${index})">Remover</button>
        `;
        carrinhoLista.appendChild(divItem);
    });
    
    carrinhoTotalValor.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

/* SISTEMA DE PERGUNTAS DE PAGAMENTO (PIX E CARTÃO) */
btnFinalizarCompra.addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const valorTotal = carrinho.reduce((sum, item) => sum + item.preco, 0);

    /* Se for tudo grátis (doação), pula o pagamento */
    if (valorTotal === 0) {
        alert("Pedido de doação processado! Combine a entrega com o doador.");
        carrinho = [];
        atualizarCarrinho();
        carrinhoLateral.style.transform = 'translateX(100%)';
        return;
    }

    /* 1. Pergunta se é Pix ou Cartão */
    const formaPagamento = prompt("Como deseja pagar?\nDigite 1 para PIX\nDigite 2 para CARTÃO");

    if (formaPagamento === "1") {
        /* Se escolher PIX, mostra a chave informada */
        alert("Você escolheu PIX!\n\nA chave para pagamento é: 12376598709\n\nPor favor, realize a transferência.");
        alert("Compra realizada com sucesso!");
        
        carrinho = [];
        atualizarCarrinho();
        carrinhoLateral.style.transform = 'translateX(100%)';

    } else if (formaPagamento === "2") {
        /* 2. Se escolher Cartão, pergunta se é Crédito ou Débito */
        const tipoCartao = prompt("Qual a função do cartão?\nDigite 1 para CRÉDITO\nDigite 2 para DÉBITO");

        if (tipoCartao === "1") {
            alert("Pagamento processado na função CRÉDITO!");
            alert("Compra realizada com sucesso!");
            
            carrinho = [];
            atualizarCarrinho();
            carrinhoLateral.style.transform = 'translateX(100%)';
        } else if (tipoCartao === "2") {
            alert("Pagamento processado na função DÉBITO!");
            alert("Compra realizada com sucesso!");
            
            carrinho = [];
            atualizarCarrinho();
            carrinhoLateral.style.transform = 'translateX(100%)';
        } else {
            alert("Opção de cartão inválida. Compra cancelada.");
        }

    } else {
        alert("Opção de pagamento inválida. Compra cancelada.");
    }
});

formProduto.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const novoProd = {
        id: Date.now(),
        nome: document.getElementById('nome').value,
        preco: parseFloat(document.getElementById('preco').value) || 0,
        tipo: document.getElementById('tipo').value
    };

    produtos.unshift(novoProd); 
    renderizarProdutos(); 
    formProduto.reset(); 
    modal.className = 'modal-oculto'; 
});

renderizarProdutos();
