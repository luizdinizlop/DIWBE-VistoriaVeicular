
// area do avaliador
// agenda as vistorias do avaliador que esta logado



const usuario = exigirLogin('avaliador');

let vistorias = [];
let filtroSituacoes = [];
let filtroDe = '';
let filtroAte = '';


// listagem

function carregarVistorias() {
    api('/vistorias/avaliador/' + usuario.id).then(function (lista) {
        vistorias = lista;
        mostrarTabela();
    }).catch(function (e) {
        mostrarAviso(e.message, true);
    });
}

function mostrarTabela() {
    let busca = document.getElementById('busca').value.trim().toUpperCase();
    let html = '';

    for (let i = 0; i < vistorias.length; i++) {
        let v = vistorias[i];
        let situacao = situacaoAgendamento(v);
        let dia = v.data_hora.substring(0, 10);

        // busca por placa ou modelo
        let texto = (v.placa + ' ' + v.modelo).toUpperCase();
        if (busca && texto.indexOf(busca) == -1) continue;

        // filtro por situacao
        if (filtroSituacoes.length > 0 && filtroSituacoes.indexOf(situacao) == -1) continue;

        // filtro por periodo
        if (filtroDe && dia < filtroDe) continue;
        if (filtroAte && dia > filtroAte) continue;

        // concluida
        let botao;
        if (situacao == 'Concluída') {
            botao = '<a class="btn btn-contorno btn-pequeno" href="vistoria.html?id=' + v.id + '" onclick="event.stopPropagation()">Ver</a>';
        } else {
            botao = '<a class="btn btn-sucesso btn-pequeno" href="vistoriar.html?id=' + v.id + '" onclick="event.stopPropagation()">Vistoriar</a>';
        }

        html += '<tr class="clicavel" onclick="verDados(' + v.id + ')">' +
            '<td class="col-id">' + v.id + '</td>' +
            '<td class="placa-texto">' + escapar(v.placa) + '</td>' +
            '<td>' + escapar(v.modelo) + '</td>' +
            '<td>' + formatarDataHora(v.data_hora) + '</td>' +
            '<td>' + badgeSituacao(situacao) + '</td>' +
            '<td class="col-acao">' + botao + '</td>' +
            '</tr>';
    }

    if (html == '') {
        html = '<tr><td colspan="6" class="tabela-vazia">Nenhuma vistoria encontrada.</td></tr>';
    }
    document.getElementById('corpoTabela').innerHTML = html;
}


// dados da vistoria

function verDados(id) {
    let v = vistorias.find(function (item) { return item.id == id; });
    document.getElementById('dPlaca').value = v.placa;
    document.getElementById('dModelo').value = v.modelo;
    document.getElementById('dDataHora').value = formatarDataHora(v.data_hora);
    document.getElementById('dMotivo').value = v.motivo;
    document.getElementById('dEndereco').value = v.endereco;
    abrirModal('modalDados');
}


// filtro

// alterna entre a aba situacao e data
function trocarAba(aba) {
    document.getElementById('abaSituacao').classList.toggle('ativo', aba == 'situacao');
    document.getElementById('abaData').classList.toggle('ativo', aba == 'data');
    document.getElementById('painelSituacao').style.display = aba == 'situacao' ? 'block' : 'none';
    document.getElementById('painelData').style.display = aba == 'data' ? 'block' : 'none';
}

function aplicarFiltro() {
    filtroSituacoes = [];
    let marcados = document.querySelectorAll('input[name="filtroSituacao"]:checked');
    for (let i = 0; i < marcados.length; i++) {
        filtroSituacoes.push(marcados[i].value);
    }
    filtroDe = document.getElementById('dataDe').value;
    filtroAte = document.getElementById('dataAte').value;

    // mostra oque esta filtrado acima da tabela
    let partes = [];
    if (filtroSituacoes.length > 0) partes.push(filtroSituacoes.join(', '));
    if (filtroDe) partes.push('de ' + formatarData(filtroDe));
    if (filtroAte) partes.push('até ' + formatarData(filtroAte));

    let aviso = document.getElementById('filtroAtivo');
    if (partes.length > 0) {
        aviso.innerHTML = 'Filtrando por: <strong>' + partes.join(' | ') + '</strong><a onclick="limparFiltro()">limpar</a>';
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
    document.getElementById('dataDe').value = '';
    document.getElementById('dataAte').value = '';
    aplicarFiltro();
}


// inicio
if (usuario) {
    carregarVistorias();
}
