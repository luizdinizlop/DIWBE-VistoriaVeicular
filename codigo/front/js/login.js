

let tipoEscolhido = 'avaliador'; // RECONSTRUÍDO: valor inicial

// RECONSTRUÍDO: seletor Avaliador / Operador (igual ao do cadastro.js)
function escolherTipo(tipo) {
    tipoEscolhido = tipo;
    document.getElementById('btnAvaliador').classList.toggle('ativo', tipo == 'avaliador');
    document.getElementById('btnOperador').classList.toggle('ativo', tipo == 'operador');
}

// Envio do login
document.getElementById('formLogin').addEventListener('submit', function (evento) {
    evento.preventDefault();

    let dados = {
        email: document.getElementById('email').value.trim().toLowerCase(),
        senha: document.getElementById('senha').value,
        tipo: tipoEscolhido
    };

    api('/login', 'POST', dados)
        .then(function (usuario) {
            salvarUsuario(usuario);
            // Cada tipo vai para a sua área
            if (usuario.tipo == 'operador') {
                window.location.href = 'operador.html';
            } else {
                window.location.href = 'avaliador.html';
            }
        })
        .catch(function (e) {
            let erro = document.getElementById('erro');
            erro.innerText = e.message;
            erro.style.display = 'block';
        });
});

// Quem clicou em "Área do Operador" na página inicial já chega com o botão marcado
escolherTipo(getParametro('tipo') || 'avaliador');
