

const usuario = exigirLogin(); // sem argumento: aceita operador e avaliador
const vistoriaId = getParametro('id'); // RECONSTRUÍDO: id vem da URL (vistoria.html?id=5)

// Dados do agendamento e resultado
function carregarVistoria() {
    api('/vistorias/' + vistoriaId).then(function (v) {
        document.getElementById('placa').innerText = v.placa;
        document.getElementById('modelo').innerText = v.modelo;
        document.getElementById('dataHora').innerText = formatarDataHora(v.data_hora);
        document.getElementById('avaliador').innerText = v.avaliador_nome || '-';
        document.getElementById('motivo').innerText = v.motivo;
        document.getElementById('endereco').innerText = v.endereco;

        let resultado = document.getElementById('resultado');
        resultado.innerText = v.situacao;
        resultado.className = 'badge ' + classeSituacao(v.situacao);
    }).catch(function (e) {
        mostrarAviso(e.message, true);
    });
}

// Grade com as 8 fotos
function carregarFotos() {
    api('/vistorias/' + vistoriaId + '/fotos').then(function (fotos) {
        let html = '';
        for (let i = 0; i < POSICOES.length; i++) {
            let foto = fotos.find(function (f) { return f.posicao == POSICOES[i]; });
            if (foto) {
                html += '<div class="foto-slot com-foto"><img src="' + foto.imagem + '" alt="' + POSICOES[i] + '">' +
                    '<div class="rotulo">' + POSICOES[i] + '</div></div>';
            } else {
                html += '<div class="foto-slot"><div class="rotulo">' + POSICOES[i] + '</div></div>';
            }
        }
        document.getElementById('gradeFotos').innerHTML = html;
    });
}

// Lista de características
function carregarCaracteristicas() {
    api('/vistorias/' + vistoriaId + '/caracteristicas').then(function (lista) {
        let html = '';
        for (let i = 0; i < lista.length; i++) {
            html += '<li>' + escapar(lista[i].descricao) + '</li>';
        }
        if (html == '') {
            html = '<p class="lista-vazia">Nenhuma característica apontada.</p>';
        }
        document.getElementById('listaCaracteristicas').innerHTML = html;
    });
}

// RECONSTRUÍDO: início da página
if (usuario) {
    carregarVistoria();
    carregarFotos();
    carregarCaracteristicas();
}
