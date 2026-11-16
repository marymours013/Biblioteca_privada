// ------- Dados da Aplicação -----
//Cada livro é um objeto,a coleção de livros é um array
let livros = [];

// Persistência(localStorage)
//o localStorage (apenas) guarda texto
const CHAVE_LIVROS = "personal-labrary:livros";

function salvarLivros() {
    localStorage.setItem(CHAVE_LIVROS, JSON.stringify(livros));
}

function carregarLivros() {
    const texto = localStorage.getItem(CHAVE_LIVROS);

    if (texto === null){
        return [];
    }

    try {
        const dados = JSON.parse(texto);
        return Array.isArray(dados) ? dados : [];
    } catch (erro) {
        return [];
    }
}

//Ao abrir a página,recupera os livros salvos
livros = carregarLivros();

//----- Elementos da página -----
const formLivro = document.querySelector("#form-livro");
const campoTitulo = document.querySelector("#titulo");
const campoAutor = document.querySelector("#Autor");
const campoCategoria =document.querySelector("#categoria");
const campoAno = document.querySelector("#ano");
const campoPaginas = document.querySelector("#paginas");
const campoAvaliacao = document.querySelector("#avaliacao");
const campoDataLeitura = document.querySelector("#data-leitura");
const campoNotas = document.querySelector("#notas");
const campoStatusQuero = document.querySelector("#status-quero");
const botaoLimpar = document.querySelector("#btn-limpar");
const mensagemCadastro = document.querySelector("#mensagem-cadastro");
const listaLivros = document.querySelector("#lista-livros");
const contador = document.querySelector("#contador");
const mensagemVazia = document.querySelector("#mensagem-vazia");





















