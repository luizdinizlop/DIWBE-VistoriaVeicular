

const usuario = exigirLogin('operador');
let vistorias = [];        // todas as vistorias vindas do banco
let filtroSituacoes = [];  // situações marcadas no filtro

// ---------- Listagem, busca e filtro ----------
function carregarVistorias() {
    api('/vistorias').then(function (lista) {
        vistorias = lista;
        mostrarTabela();
    }).catch(function (e) {
        mostrarAviso(e.message, true);
    });
}

function mostrarTabela() {
    let busca = document.getElementById('busca').value.trim().toUpperCase();
    let corpo = document.getElementById('corpoTabela');
    let html = '';

    for (let i = 0; i < vistorias.length; i++) {
        let v = vistorias[i];

        // Busca por placa ou modelo
        let texto = (v.placa + ' ' + v.modelo).toUpperCase();
        if (busca && texto.indexOf(busca) == -1) continue;

        // Filtro por situação
        if (filtroSituacoes.length > 0 && filtroSituacoes.indexOf(v.situacao) == -1) continue;

        html += '<tr>' +
            '<td class="col-id">' + v.id + '</td>' +
            '<td class="placa-texto">' + escapar(v.placa) + '</td>' +
            '<td>' + escapar(v.modelo) + '</td>' +
            '<td>' + formatarData(v.data_hora) + '</td>' +
            '<td>' + badgeSituacao(v.situacao) + '</td>' +
            '<td class="col-acao"><button class="btn btn-contorno btn-pequeno" onclick="abrirOpcoes(event, ' + v.id + ')">Opções &#9662;</button></td>' +
            '</tr>';
    }

    if (html == '') {
        html = '<tr><td colspan="6" class="tabela-vazia">Nenhuma vistoria encontrada.</td></tr>';
    }
    corpo.innerHTML = html;
}

// RECONSTRUÍDO: procura a vistoria na lista em memória
function buscarVistoria(id) {
    return vistorias.find(function (v) { return v.id == id; });
}

// ---------- Menu "Opções" ----------
function abrirOpcoes(evento, id) {
    evento.stopPropagation();
    let menu = document.getElementById('menuOpcoes');
    let v = buscarVistoria(id);
    let pendente = v.situacao == 'Pendente';

    // Só dá para editar ou cancelar enquanto estiver pendente
    document.getElementById('opEditar').disabled = !pendente;
    document.getElementById('opCancelar').disabled = !pendente;

    document.getElementById('opVer').onclick = function () { window.location.href = 'vistoria.html?id=' + id; };
    document.getElementById('opEditar').onclick = function () { fecharOpcoes(); editarVistoria(id); };
    document.getElementById('opCancelar').onclick = function () { fecharOpcoes(); cancelarVistoria(id); };
    document.getElementById('opExcluir').onclick = function () { fecharOpcoes(); excluirVistoria(id); };

    // Posiciona o menu logo abaixo do botão clicado
    let botao = evento.currentTarget.getBoundingClientRect();
    menu.classList.add('aberto');
    let esquerda = botao.right - menu.offsetWidth;
    let topo = botao.bottom + 6;
    if (topo + menu.offsetHeight > window.innerHeight) {
        topo = botao.top - menu.offsetHeight - 6; // abre para cima se não couber
    }
    menu.style.left = Math.max(8, esquerda) + 'px';
    menu.style.top = topo + 'px';
}

// RECONSTRUÍDO: fecha o menu (também ao clicar em qualquer lugar da página)
function fecharOpcoes() {
    document.getElementById('menuOpcoes').classList.remove('aberto');
}
document.addEventListener('click', fecharOpcoes);

// ---------- Incluir e editar ----------
function carregarAvaliadores() {
    api('/avaliadores').then(function (lista) {
        let html = '<option value="">Selecione...</option>';
        for (let i = 0; i < lista.length; i++) {
            html += '<option value="' + lista[i].id + '">' + escapar(lista[i].nome) + '</option>';
        }
        document.getElementById('avaliador').innerHTML = html;
    });
}

function abrirInclusao() {
    document.getElementById('formVistoria').reset();
    document.getElementById('vistoriaId').value = '';
    document.getElementById('tituloFormulario').innerText = 'Inclusão de vistorias';
    document.getElementById('erroVistoria').style.display = 'none';
    abrirModal('modalVistoria');
}

function editarVistoria(id) {
    let v = buscarVistoria(id);
    abrirInclusao();
    document.getElementById('tituloFormulario').innerText = 'Edição de vistoria';
    document.getElementById('vistoriaId').value = v.id;
    document.getElementById('placa').value = v.placa;
    document.getElementById('modelo').value = v.modelo;
    // '2026-11-20 14:30:00' -> '2026-11-20T14:30' (formato do campo datetime-local)
    document.getElementById('dataHora').value = v.data_hora.substring(0, 16).replace(' ', 'T');
    document.getElementById('avaliador').value = v.avaliador_id;
    document.getElementById('motivo').value = v.motivo;
    document.getElementById('endereco').value = v.endereco;
}

// Placa em maiúsculas enquanto digita
document.getElementById('placa').addEventListener('input', function () {
    this.value = this.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
});

// Aceita placa antiga (ABC-1234) e Mercosul (ABC-1D23); devolve ABC-1D23 ou null
function validarPlaca(placa) {
    let limpa = placa.replace('-', '');
    if (!/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(limpa)) {
        return null;
    }
    return limpa.substring(0, 3) + '-' + limpa.substring(3);
}

// Salvar inclusão ou edição (o campo escondido vistoriaId decide)
document.getElementById('formVistoria').addEventListener('submit', function (evento) {
    evento.preventDefault();
    let erro = document.getElementById('erroVistoria');

    let placa = validarPlaca(document.getElementById('placa').value);
    if (!placa) {
        erro.innerText = 'Placa inválida. Use o formato ABC-1234 ou ABC-1D23.';
        erro.style.display = 'block';
        return;
    }

    let vistoria = {
        placa: placa,
        modelo: document.getElementById('modelo').value.trim().toUpperCase(),
        data_hora: document.getElementById('dataHora').value.replace('T', ' ') + ':00',
        avaliador_id: parseInt(document.getElementById('avaliador').value),
        motivo: document.getElementById('motivo').value,
        endereco: document.getElementById('endereco').value.trim()
    };

    let id = document.getElementById('vistoriaId').value;
    let requisicao;
    if (id) {
        vistoria.id = parseInt(id);
        requisicao = api('/vistorias', 'PUT', vistoria);  // edição
    } else {
        requisicao = api('/vistorias', 'POST', vistoria); // inclusão
    }

    requisicao.then(function () {
        fecharModal('modalVistoria');
        mostrarAviso(id ? 'Vistoria atualizada.' : 'Vistoria incluída.');
        carregarVistorias();
    }).catch(function (e) {
        mostrarAviso(e.message, true);
    });
});

// ---------- Cancelar e excluir ----------
// Cancelar NÃO apaga: só muda a situação
function cancelarVistoria(id) {
    confirmar('Tem certeza de que quer cancelar esta vistoria?', 'Cancelar vistoria', function () {
        api('/vistorias', 'PUT', { id: id, situacao: 'Cancelado' }).then(function () {
            mostrarAviso('Vistoria cancelada.');
            carregarVistorias();
        });
    });
}

// Excluir apaga do banco (fotos e características vão junto, por causa do cascade)
function excluirVistoria(id) {
    confirmar('Tem certeza de que quer excluir este item?', 'Excluir', function () {
        api('/vistorias/' + id, 'DELETE').then(function () {
            mostrarAviso('Vistoria excluída.');
            carregarVistorias();
        });
    });
}

// ---------- Filtro por situação ----------
function aplicarFiltro() {
    filtroSituacoes = [];
    let marcados = document.querySelectorAll('input[name="filtroSituacao"]:checked');
    for (let i = 0; i < marcados.length; i++) {
        filtroSituacoes.push(marcados[i].value);
    }

    let aviso = document.getElementById('filtroAtivo');
    if (filtroSituacoes.length > 0) {
        aviso.innerHTML = 'Filtrando por: <strong>' + filtroSituacoes.join(', ') + '</strong>' +
            '<a onclick="limparFiltro()">limpar</a>';
    } else {
        aviso.innerHTML = '';
    }
    fecharModal('modalFiltro');
    mostrarTabela();
}

function limparFiltro() {
    let marcados = document.querySelectorAll('input[name="filtroSituacao"]');
    for (let i = 0; i < marcados.length; i++) {
        marcados[i].checked = false;
    }
    aplicarFiltro();
}

// ---------- Início ----------
if (usuario) {
    carregarAvaliadores();
    carregarVistorias();
}
