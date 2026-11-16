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

// Mensagens para o usuário 
// tipo: sucesso ou erro
function mostrarMensagem(texto, tipo) {
  mensagemCadastro.textContent = texto;
  mensagemCadastro.className = "mensagem mensagem-" + tipo;
  mensagemCadastro.hidden = false;
}

function esconderMensagem() {
  mensagemCadastro.hidden = true;
}

// Leitura do formulário
// Campos numéricos vazios viram null, os demais são convertidos para número.
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

//  Validação 
// Retorna uma lista de erros, cada erro tem o campo com problema e o texto
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

// ---- Cadastro -----
function limparFormulario() {
  formLivro.reset();
}

function cadastrarLivro(dados) {
  dados.id = Date.now();
  livros.push(dados);
  salvarLivros(); 
}

formLivro.addEventListener("submit", function (evento) {
  evento.preventDefault(); 

  const dados = lerFormulario();
  const erros = validarLivro(dados);

  if (erros.length > 0) {
    const textos = erros.map(function (erro) {
      return erro.texto;
    });
    mostrarMensagem(textos.join(" "), "erro");
    erros[0].campo.focus();
    return;
  }

  if (livroEmEdicaoId === null) {
    cadastrarLivro(dados);
    limparFormulario();
    mostrarMensagem("Livro salvo com sucesso!", "sucesso");
    atualizarTela(); 
  } else {
    atualizarLivro(livroEmEdicaoId, dados);
  }
});

botaoLimpar.addEventListener("click", function () {
  limparFormulario();
  esconderMensagem();
});

// ---- Listagem -----
// Textos que aparecem na tela para cada valor guardado
const NOMES_CATEGORIA = {
  "romance": "Romance",
  "ficcao-cientifica": "Ficção científica",
  "fantasia": "Fantasia",
  "tecnologia": "Tecnologia",
  "biografia": "Biografia",
  "outros": "Outros"
};

const NOMES_STATUS = {
  "quero-ler": "Quero ler",
  "lendo": "Lendo",
  "lido": "Lido"
};

// Classe CSS do selo de cada status
const CLASSES_STATUS = {
  "quero-ler": "selo-quero",
  "lendo": "selo-lendo",
  "lido": "selo-lido"
};

// Mostra um traço quando o campo não foi preenchido
function textoOuTraco(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return "—";
  }
  return valor;
}

function criarCelula(texto) {
  const celula = document.createElement("td");
  celula.textContent = texto; // textContent evita que texto digitado vire HTML
  return celula;
}

function criarBotao(texto, classes) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = classes;
  botao.textContent = texto;
  return botao;
}

function criarLinha(livro, numero) {
  const linha = document.createElement("tr");

  if (livro.id === livroSelecionadoId) {
    linha.classList.add("selecionada"); 
  }

  linha.appendChild(criarCelula(numero));

  const celulaTitulo = document.createElement("th");
  celulaTitulo.scope = "row";
  celulaTitulo.textContent = livro.titulo;
  linha.appendChild(celulaTitulo);

  linha.appendChild(criarCelula(livro.autor));
  linha.appendChild(criarCelula(NOMES_CATEGORIA[livro.categoria] || livro.categoria));
  linha.appendChild(criarCelula(textoOuTraco(livro.ano)));

  // O status aparece como um selo colorido
  const celulaStatus = document.createElement("td");
  const selo = document.createElement("span");
  selo.className = "selo " + CLASSES_STATUS[livro.status];
  selo.textContent = NOMES_STATUS[livro.status] || livro.status;
  celulaStatus.appendChild(selo);
  linha.appendChild(celulaStatus);

  linha.appendChild(criarCelula(textoOuTraco(livro.avaliacao)));

  // Botões de ação
  const celulaAcoes = document.createElement("td");
  const botaoDetalhes = criarBotao("Detalhes", "btn btn-secundario btn-pequeno");
  botaoDetalhes.addEventListener("click", function () {
    mostrarDetalhes(livro.id);
  });
  celulaAcoes.appendChild(botaoDetalhes);

  const botaoExcluir = criarBotao("Excluir", "btn btn-perigo btn-pequeno");
  botaoExcluir.addEventListener("click", function () {
    excluirLivro(livro.id);
  });
  celulaAcoes.appendChild(botaoExcluir);
  linha.appendChild(celulaAcoes);

  return linha;
}

function atualizarContador(quantidade) {
  if (quantidade === 1) {
    contador.textContent = "1 livro encontrado.";
  } else {
    contador.textContent = quantidade + " livros encontrados.";
  }
}

// Desenha a tabela a partir de uma lista de livros
function renderizarLista(listaParaMostrar) {
  listaLivros.textContent = ""; 

  listaParaMostrar.forEach(function (livro, indice) {
    listaLivros.appendChild(criarLinha(livro, indice + 1));
  });

  atualizarContador(listaParaMostrar.length);
  mensagemVazia.hidden = listaParaMostrar.length > 0;
}

// Atualiza tudo que depende da lista de livros
function atualizarTela() {
  renderizarLista(obterLivrosVisiveis());
}

// ----- Detalhes -----
// Transforma "2026-08-15" em "15/08/2026"
function formatarData(texto) {
  if (texto === "" || texto === undefined || texto === null) {
    return "—";
  }
  const partes = texto.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function buscarLivroPorId(id) {
  return livros.find(function (livro) {
    return livro.id === id;
  });
}

function preencherDetalhes(id) {
  const livro = buscarLivroPorId(id);

  if (livro === undefined) {
    return;
  }

  livroSelecionadoId = id;

  detTitulo.textContent = livro.titulo;
  detAutor.textContent = "por " + livro.autor;
  detCategoria.textContent = NOMES_CATEGORIA[livro.categoria] || livro.categoria;
  detAno.textContent = textoOuTraco(livro.ano);
  detPaginas.textContent = textoOuTraco(livro.paginas);
  detStatus.textContent = NOMES_STATUS[livro.status] || livro.status;
  detAvaliacao.textContent = livro.avaliacao === null ? "—" : livro.avaliacao + " de 5";
  detData.textContent = formatarData(livro.dataLeitura);
  detNotas.textContent = textoOuTraco(livro.notas);

  detalhesVazio.hidden = true;
  detalhesLivro.hidden = false;

  atualizarTela(); 
}

// Abre os detalhes e leva a tela até o painel
function mostrarDetalhes(id) {
  preencherDetalhes(id);
  painelDetalhes.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ----- Exclusão -----
// Fecha o painel de detalhes e volta para a mensagem inicial
function limparDetalhes() {
  livroSelecionadoId = null;
  detalhesLivro.hidden = true;
  detalhesVazio.hidden = false;
}

function excluirLivro(id) {
  const livro = buscarLivroPorId(id);

  if (livro === undefined) {
    return;
  }

  const confirmou = confirm('Excluir o livro "' + livro.titulo + '"? Essa ação não pode ser desfeita.');

  if (!confirmou) {
    return;
  }

  // filter mantém todos os livros, menos o que foi excluído
  livros = livros.filter(function (item) {
    return item.id !== id;
  });

  salvarLivros(); 

  if (livroSelecionadoId === id) {
    limparDetalhes();
  }

  if (livroEmEdicaoId === id) {
    sairDoModoEdicao();
  }

  atualizarTela();
}

btnExcluirDetalhe.addEventListener("click", function () {
  excluirLivro(livroSelecionadoId);
});

// ----- Edição ------
// Campos vazios (null) aparecem em branco no formulário
function valorOuVazio(valor) {
  if (valor === null || valor === undefined) {
    return "";
  }
  return valor;
}

function iniciarEdicao(id) {
  const livro = buscarLivroPorId(id);

  if (livro === undefined) {
    return;
  }

  livroEmEdicaoId = id;

  // Coloca os dados do livro no formulário de cadastro
  campoTitulo.value = livro.titulo;
  campoAutor.value = livro.autor;
  campoCategoria.value = livro.categoria;
  campoAno.value = valorOuVazio(livro.ano);
  campoPaginas.value = valorOuVazio(livro.paginas);
  campoAvaliacao.value = valorOuVazio(livro.avaliacao);
  campoDataLeitura.value = valorOuVazio(livro.dataLeitura);
  campoNotas.value = valorOuVazio(livro.notas);
  document.querySelector('input[name="status"][value="' + livro.status + '"]').checked = true;

  // Deixa claro que o formulário está no modo de edição
  tituloCadastro.textContent = "Editar livro";
  botaoSalvar.textContent = "Salvar alterações";
  botaoCancelar.hidden = false;
  secaoCadastro.classList.add("modo-edicao");

  esconderMensagem();
  secaoCadastro.scrollIntoView({ behavior: "smooth", block: "start" });
  campoTitulo.focus();
}

function sairDoModoEdicao() {
  livroEmEdicaoId = null;
  tituloCadastro.textContent = "Cadastrar livro";
  botaoSalvar.textContent = "Salvar livro";
  botaoCancelar.hidden = true;
  secaoCadastro.classList.remove("modo-edicao");
  limparFormulario();
}

function atualizarLivro(id, dados) {
  // findIndex devolve a posição do livro na lista (ou -1 se não achar)
  const posicao = livros.findIndex(function (livro) {
    return livro.id === id;
  });

  if (posicao === -1) {
    return;
  }

  dados.id = id; // o livro mantém o mesmo id
  livros[posicao] = dados;
  salvarLivros(); // atualiza o localStorage

  sairDoModoEdicao();
  mostrarMensagem("Livro atualizado com sucesso!", "sucesso");

  if (livroSelecionadoId === id) {
    preencherDetalhes(id); // atualiza o painel de detalhes
  } else {
    atualizarTela();
  }
}

btnEditarDetalhe.addEventListener("click", function () {
  iniciarEdicao(livroSelecionadoId);
});

botaoCancelar.addEventListener("click", function () {
  sairDoModoEdicao();
  esconderMensagem();
});

















