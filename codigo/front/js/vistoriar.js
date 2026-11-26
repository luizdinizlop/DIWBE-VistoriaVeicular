
// vistoriar - avaliador
// adiciona as informacoes da vistoria


const usuario = exigirLogin('avaliador');
const vistoriaId = parseInt(getParametro('id'));

let fotos = [];          // fotos já salvas desta vistoria
let posicaoAtual = '';   // posição clicada (Frente, Traseira...)
let imagemNova = null;   // foto escolhida no modal (em base64)


// dados da vistoria

function carregarVistoria() {
    api('/vistorias/' + vistoriaId).then(function (v) {
        // vistoria ja finalizada ou cancelada
        if (v.situacao != 'Pendente') {
            window.location.href = 'vistoria.html?id=' + vistoriaId;
            return;
        }
        document.getElementById('placa').innerText = v.placa;
        document.getElementById('modelo').innerText = v.modelo;
    }).catch(function (e) {
        mostrarAviso(e.message, true);
    });
}


// fotos

function carregarFotos() {
    api('/vistorias/' + vistoriaId + '/fotos').then(function (lista) {
        fotos = lista;
        montarGrade();
    });
}

function buscarFoto(posicao) {
    return fotos.find(function (f) { return f.posicao == posicao; });
}

// monta os 8 quadros da foto
function montarGrade() {
    let html = '';
    for (let i = 0; i < POSICOES.length; i++) {
        let posicao = POSICOES[i];
        let foto = buscarFoto(posicao);
        if (foto) {
            html += '<div class="foto-slot editavel com-foto" onclick="abrirFoto(\'' + posicao + '\')">' +
                    '<img src="' + foto.imagem + '" alt="' + posicao + '">' +
                    '<span class="selo-ok">&#10003;</span>' +
                    '<div class="rotulo">' + posicao + '</div></div>';
        } else {
            html += '<div class="foto-slot editavel" onclick="abrirFoto(\'' + posicao + '\')">' +
                    '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>' +
                    '<div class="rotulo">' + posicao + '</div></div>';
        }
    }
    document.getElementById('gradeFotos').innerHTML = html;
}

function abrirFoto(posicao) {
    posicaoAtual = posicao;
    imagemNova = null;
    document.getElementById('tituloFoto').innerText = posicao;
    document.getElementById('arquivoFoto').value = '';

    // se ja tem foto nessa posicao, mostra ela
    let foto = buscarFoto(posicao);
    mostrarPrevia(foto ? foto.imagem : null);
    abrirModal('modalFoto');
}

function mostrarPrevia(imagem) {
    let previa = document.getElementById('previaFoto');
    if (imagem) {
        previa.src = imagem;
        previa.style.display = 'block';
    } else {
        previa.removeAttribute('src');
        previa.style.display = 'none';
    }
}

// le a foto escolhida e ajusta o tamanho dela antes de enviar
// 1024px ja sao suficientes
function carregarPrevia() {
    let arquivo = document.getElementById('arquivoFoto').files[0];
    if (!arquivo) return;

    let leitor = new FileReader();
    leitor.onload = function () {
        let img = new Image();
        img.onload = function () {
            let maximo = 1024;
            let escala = Math.min(1, maximo / Math.max(img.width, img.height));
            let canvas = document.createElement('canvas');
            canvas.width = img.width * escala;
            canvas.height = img.height * escala;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            imagemNova = canvas.toDataURL('image/jpeg', 0.8);
            mostrarPrevia(imagemNova);
        };
        img.src = leitor.result;
    };
    leitor.readAsDataURL(arquivo);
}

function salvarFoto() {
    if (!imagemNova) {
        return mostrarAviso('Escolha uma foto primeiro.', true);
    }
    let foto = { vistoria_id: vistoriaId, posicao: posicaoAtual, imagem: imagemNova };

    api('/fotos', 'POST', foto).then(function () {
        fecharModal('modalFoto');
        mostrarAviso('Foto salva: ' + posicaoAtual);
        carregarFotos();
    }).catch(function (e) {
        mostrarAviso(e.message, true);
    });
}


// caracteristicas

function carregarCaracteristicas() {
    api('/vistorias/' + vistoriaId + '/caracteristicas').then(function (lista) {
        let html = '';
        for (let i = 0; i < lista.length; i++) {
            html += '<li>' + escapar(lista[i].descricao) +
                    '<button class="btn btn-perigo btn-icone" title="Excluir" onclick="excluirCaracteristica(' + lista[i].id + ')">&times;</button></li>';
        }
        if (html == '') {
            html = '<p class="lista-vazia">Nenhuma característica apontada até agora.</p>';
        }
        document.getElementById('listaCaracteristicas').innerHTML = html;
    });
}

function abrirCaracteristica() {
    document.getElementById('formCaracteristica').reset();
    abrirModal('modalCaracteristica');
    document.getElementById('descricao').focus();
}

document.getElementById('formCaracteristica').addEventListener('submit', function (evento) {
    evento.preventDefault();
    let caracteristica = {
        vistoria_id: vistoriaId,
        descricao: document.getElementById('descricao').value.trim()
    };

    api('/caracteristicas', 'POST', caracteristica).then(function () {
        fecharModal('modalCaracteristica');
        carregarCaracteristicas();
    });
});

function excluirCaracteristica(id) {
    confirmar('Tem certeza de que quer excluir este item?', 'Excluir', function () {
        api('/caracteristicas/' + id, 'DELETE').then(function () {
            mostrarAviso('Característica excluída.');
            carregarCaracteristicas();
        });
    });
}


// finalizar

function finalizar() {
    let marcado = document.querySelector('input[name="resultado"]:checked');
    if (!marcado) {
        return mostrarAviso('Escolha o resultado da vistoria.', true);
    }

    let salvar = function () {
        api('/vistorias', 'PUT', { id: vistoriaId, situacao: marcado.value }).then(function () {
            mostrarAviso('Vistoria finalizada: ' + marcado.value);
            setTimeout(function () {
                window.location.href = 'avaliador.html';
            }, 1200);
        });
    };

    // avisa se ainda faltam fotos
    let faltam = POSICOES.length - fotos.length;
    fecharModal('modalResultado');
    if (faltam > 0) {
        confirmar('Ainda faltam ' + faltam + ' foto(s). Finalizar mesmo assim?', 'Finalizar', salvar);
    } else {
        salvar();
    }
}


// inicio
if (usuario) {
    carregarVistoria();
    carregarFotos();
    carregarCaracteristicas();
}
