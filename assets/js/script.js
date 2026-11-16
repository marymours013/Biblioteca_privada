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

// Painel de detalhes
const painelDetalhes = document.querySelector("#detalhes");
const detalhesVazio = document.querySelector("#detalhes-vazio");
const detalhesLivro = document.querySelector("#detalhes-livro");
const detTitulo = document.querySelector("#det-titulo");
const detAutor = document.querySelector("#det-autor");
const detCategoria = document.querySelector("#det-categoria");
const detAno = document.querySelector("#det-ano");
const detPaginas = document.querySelector("#det-paginas");
const detStatus = document.querySelector("#det-status");
const detAvaliacao = document.querySelector("#det-avaliacao");
const detData = document.querySelector("#det-data");
const detNotas = document.querySelector("#det-notas");

// Guarda qual livro está aberto nos detalhes (null = nenhum)
let livroSelecionadoId = null;
const btnExcluirDetalhe = document.querySelector("#btn-excluir-detalhe");
const btnEditarDetalhe = document.querySelector("#btn-editar-detalhe");

// Elementos do cadastro usados na edição
const secaoCadastro = document.querySelector("#cadastro");
const tituloCadastro = document.querySelector("#titulo-cadastro");
const botaoSalvar = document.querySelector("#btn-salvar");
const botaoCancelar = document.querySelector("#btn-cancelar");

// Guarda o id do livro em edição (null = cadastrando um livro novo)
let livroEmEdicaoId = null;

// Pesquisa, filtros e ordenação
const formFiltros = document.querySelector("#form-filtros");
const campoBusca = document.querySelector("#busca");
const filtroCategoria = document.querySelector("#filtro-categoria");
const filtroStatus = document.querySelector("#filtro-status");
const botaoLimparFiltros = document.querySelector("#btn-limpar-filtros");
const selectOrdenar = document.querySelector("#ordenar");

// Busca no catálogo Open Library (API)
const formApi = document.querySelector("#form-api");
const campoBuscaApi = document.querySelector("#busca-api");
const botaoBuscarApi = document.querySelector("#btn-buscar-api");
const mensagemApi = document.querySelector("#mensagem-api");
const resultadosApi = document.querySelector("#resultados-api");

// ===== Mensagens para o usuário =====
// tipo: "sucesso" ou "erro"
function mostrarMensagem(texto, tipo) {
  mensagemCadastro.textContent = texto;
  mensagemCadastro.className = "mensagem mensagem-" + tipo;
  mensagemCadastro.hidden = false;
}

function esconderMensagem() {
  mensagemCadastro.hidden = true;
}

// ===== Leitura do formulário =====
// Campos numéricos vazios viram null; os demais são convertidos para número.
function lerNumero(campo) {
  if (campo.value === "") {
    return null;
  }
  return Number(campo.value);
}

function lerFormulario() {
  const statusMarcado = document.querySelector('input[name="status"]:checked');

  return {
    titulo: campoTitulo.value.trim(),
    autor: campoAutor.value.trim(),
    categoria: campoCategoria.value,
    ano: lerNumero(campoAno),
    paginas: lerNumero(campoPaginas),
    status: statusMarcado ? statusMarcado.value : "",
    avaliacao: lerNumero(campoAvaliacao),
    dataLeitura: campoDataLeitura.value,
    notas: campoNotas.value.trim()
  };
}

// ===== Validação =====
// Retorna uma lista de erros; cada erro tem o campo com problema e o texto.
function validarLivro(dados) {
  const erros = [];

  if (dados.titulo === "") {
    erros.push({ campo: campoTitulo, texto: "Informe o título." });
  }

  if (dados.autor === "") {
    erros.push({ campo: campoAutor, texto: "Informe o autor." });
  }

  if (dados.categoria === "") {
    erros.push({ campo: campoCategoria, texto: "Escolha a categoria." });
  }

  if (dados.status === "") {
    erros.push({ campo: campoStatusQuero, texto: "Escolha o status de leitura." });
  }

  if (dados.ano !== null && (dados.ano < 1000 || dados.ano > 2100)) {
    erros.push({ campo: campoAno, texto: "O ano deve estar entre 1000 e 2100." });
  }

  if (dados.paginas !== null && dados.paginas < 1) {
    erros.push({ campo: campoPaginas, texto: "O número de páginas deve ser maior que zero." });
  }

  if (dados.avaliacao !== null && (dados.avaliacao < 1 || dados.avaliacao > 5)) {
    erros.push({ campo: campoAvaliacao, texto: "A avaliação deve ser de 1 a 5." });
  }

  return erros;
}



























