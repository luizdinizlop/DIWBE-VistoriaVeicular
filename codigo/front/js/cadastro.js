

let tipoEscolhido = 'avaliador'; // RECONSTRUÍDO: valor inicial

// Seletor Avaliador / Operador
function escolherTipo(tipo) {
    tipoEscolhido = tipo;
    document.getElementById('btnAvaliador').classList.toggle('ativo', tipo == 'avaliador');
    document.getElementById('btnOperador').classList.toggle('ativo', tipo == 'operador');
}

// RECONSTRUÍDO: mostra a mensagem na div #erro
function mostrarErro(mensagem) {
    let erro = document.getElementById('erro');
    erro.innerText = mensagem;
    erro.style.display = 'block';
}

// Envio do cadastro
document.getElementById('formCadastro').addEventListener('submit', function (evento) {
    evento.preventDefault(); // não recarrega a página

    let usuario = {
        nome: document.getElementById('nome').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        senha: document.getElementById('senha').value,
        tipo: tipoEscolhido
    };
    let confirmarSenha = document.getElementById('confirmarSenha').value;

    if (usuario.senha != confirmarSenha) {
        return mostrarErro('As senhas não conferem.');
    }

    api('/usuarios', 'POST', usuario)
        .then(function (usuarioSalvo) {
            mostrarAviso('Cadastro realizado! Faça o login.');
            setTimeout(function () {
                window.location.href = 'login.html?tipo=' + usuarioSalvo.tipo;
            }, 1200);
        })
        .catch(function (e) {
            mostrarErro(e.message);
        });
});
