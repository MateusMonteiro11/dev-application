const ProcessarMensagem = (mensagem, callback) => callback(mensagem);

const mensagem = "*** Atenção: Sistema instável ***"; // Mensagem repassada

const callback = (mensagem) => {
  console.log(`Saída: ${mensagem}`); // Junta as duas strings e exibe a mensagem final
}

const calculocaracteres = (mensagem) => {
  const quantidadeCaracteres = mensagem.length;
    console.log(`Quantidade de caracteres: ${quantidadeCaracteres}`); // Exibe a quantidade de caracteres da mensagem
}

const tipomensagem = (mensagem) => { // Se a mensagem é maiúscula ou minúscula
    if (mensagem == mensagem.toUpperCase()) {
        console.log("Mensagem em caixa alta: tudo maiúscula");
    }
    else if (mensagem == mensagem.toLowerCase()) {
        console.log("Mensagem em caixa baixa: tudo minúscula");
    }
    else {
        console.log("Mensagem mista: contém maiúsculas e minúsculas");
    }
}

ProcessarMensagem(mensagem, callback);
ProcessarMensagem(mensagem, calculocaracteres);
ProcessarMensagem(mensagem, tipomensagem);