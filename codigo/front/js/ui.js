function mostrarTela(id) {
    document.querySelectorAll('.tela').forEach(function (tela) {
        tela.classList.remove('ativa');
    });
    document.getElementById(id).classList.add('ativa');
    window.scrollTo(0, 0);
}


function mostrarMensagem(texto, tipo) {
    const div = document.getElementById("mensagem");

    div.className = tipo;
    div.innerText = texto;

    setTimeout(function () {
        div.innerText = "";
        div.className = "";
    }, 3000);
}


function mostrarSelo(situacao) {
    const textos = {
        aprovado:  "Aprovado",
        reprovado: "Reprovado",
        pendente:  "Pendente",
        ressalvas: "Com ressalvas",
        cancelado: "Cancelado",
        perdida:   "Perdida",
        concluida: "Concluída",
        embreve:   "Em breve"
    };

    return `<span class="selo ${situacao}">${textos[situacao]}</span>`;
}


function mostrarVazio(idTbody, colunas, texto) {
    document.getElementById(idTbody).innerHTML =
        `<tr><td colspan="${colunas}">${texto}</td></tr>`;
}


// 5) Tela de detalhe: coloca placa, modelo e características
function preencherDetalhe(veiculo) {
    document.getElementById("detPlaca").innerText  = veiculo.placa;
    document.getElementById("detModelo").innerText = veiculo.modelo;

    const lista = document.getElementById("detCaracteristicas");
    lista.innerHTML = "";

    veiculo.caracteristicas.forEach(function (item) {
        lista.innerHTML += `<li>${item}</li>`;
    });
}

