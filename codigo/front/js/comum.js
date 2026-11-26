

// ---------- Posições das fotos ----------
const POSICOES = ['Frente', 'Traseira', 'Lat. Direita', 'Lat. Esquerda',
    'Motor', 'Chassi', 'Triângulo', 'Macaco Hidráulico'];

// ---------- Sessão do usuário ----------
function salvarUsuario(usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
}

function getUsuario() {
    let texto = localStorage.getItem('usuario');
    if (texto) {
        return JSON.parse(texto);
    }
    return null;
}

function sair() {
    localStorage.removeItem('usuario');
    window.location.href = 'index.html';
}

// Protege a página: se não houver usuário (ou for de outro tipo), volta para o login
function exigirLogin(tipo) {
    let usuario = getUsuario();
    if (!usuario || (tipo && usuario.tipo != tipo)) {
        window.location.href = 'login.html' + (tipo ? '?tipo=' + tipo : '');
        return null;
    }
    let topo = document.getElementById('usuarioLogado');
    if (topo) {
        topo.innerHTML =
            '<div class="avatar">' + usuario.nome.charAt(0).toUpperCase() + '</div>' +
            '<div class="nome-completo"><strong>' + usuario.nome + '</strong><br>' +
            (usuario.tipo == 'operador' ? 'Operador' : 'Avaliador') + '</div>' +
            '<button class="btn btn-contorno btn-pequeno" onclick="sair()">Sair</button>';
    }
    return usuario;
}

// ---------- Datas ----------
// '2026-11-20 14:30:00' -> '20/11/2026'
function formatarData(texto) {
    if (!texto) return '-';
    let partes = texto.substring(0, 10).split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}

// RECONSTRUÍDO: '2026-11-20 14:30:00' -> '20/11/2026 às 14:30'
function formatarDataHora(texto) {
    if (!texto) return '-';
    return formatarData(texto) + ' às ' + texto.substring(11, 16);
}

// Data de hoje no formato do banco (AAAA-MM-DD)
function hojeTexto() {
    let d = new Date();
    let mes = String(d.getMonth() + 1).padStart(2, '0');
    let dia = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mes + '-' + dia;
}

// ---------- Situação (cores e regra do agendamento) ----------
// "Com ressalvas" -> "s-com-ressalvas"
function classeSituacao(situacao) {
    return 's-' + situacao.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // tira acentos
        .replace(/ /g, '-');
}

// RECONSTRUÍDO: devolve o HTML da etiqueta colorida
function badgeSituacao(situacao) {
    return '<span class="badge ' + classeSituacao(situacao) + '">' + situacao + '</span>';
}

// Situação do agendamento (visão do avaliador)
function situacaoAgendamento(vistoria) {
    if (vistoria.situacao != 'Pendente') {
        return 'Concluída';
    }
    let dia = vistoria.data_hora.substring(0, 10);
    let hoje = hojeTexto();
    if (dia > hoje) return 'Em breve';
    if (dia == hoje) return 'Pendente';
    return 'Perdida';
}

// ---------- Janelas (modais), confirmação e avisos ----------
function abrirModal(id) {
    document.getElementById(id).classList.add('aberto');
}

function fecharModal(id) {
    document.getElementById(id).classList.remove('aberto');
}

// Clicar no fundo escuro fecha a janela
document.addEventListener('click', function (evento) {
    if (evento.target.classList.contains('modal')) {
        evento.target.classList.remove('aberto');
    }
});

// Janela "Tem certeza...?"
function confirmar(mensagem, textoBotao, aoConfirmar) {
    document.getElementById('textoConfirmar').innerText = mensagem;
    let botao = document.getElementById('btnConfirmar');
    botao.innerText = textoBotao;
    botao.onclick = function () {
        fecharModal('modalConfirmar');
        aoConfirmar();
    };
    abrirModal('modalConfirmar');
}

// Aviso flutuante por 3 segundos
function mostrarAviso(mensagem, erro) {
    let aviso = document.getElementById('aviso');
    if (!aviso) return alert(mensagem);
    aviso.innerText = mensagem;
    aviso.className = 'aviso visivel' + (erro ? ' erro' : '');
    clearTimeout(aviso.timer);
    aviso.timer = setTimeout(function () {
        aviso.className = 'aviso';
    }, 3000);
}

// ---------- Comunicação com a API ----------
function api(url, metodo, dados) {
    let opcoes = { method: metodo || 'GET', headers: { 'Content-Type': 'application/json' } };
    if (dados) {
        opcoes.body = JSON.stringify(dados);
    }
    return fetch(url, opcoes)
        .then(function (resposta) {
            return resposta.json().then(function (json) {
                if (!resposta.ok) {
                    throw new Error(json.erro || 'Erro na requisição');
                }
                return json;
            });
        });
}

// ---------- Segurança e URL ----------
// Impede que texto digitado vire HTML
function escapar(texto) {
    let div = document.createElement('div');
    div.innerText = texto == null ? '' : texto;
    return div.innerHTML;
}

// RECONSTRUÍDO: em vistoria.html?id=5, getParametro('id') devolve '5'
function getParametro(nome) {
    return new URLSearchParams(window.location.search).get(nome);
}
