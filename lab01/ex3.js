let nome = "Mateus"; // Escopo global
let sobrenome = "Monteiro"; // Escopo global


function ola(nome, sobrenome) {
    console.log(`Olá, ${nome} ${sobrenome}, eu sou uma função!`);
}

var ola2 = (nome, sobrenome) => {
    console.log(`Olá, ${nome} ${sobrenome}, eu também sou uma função!`);
}

ola(nome, sobrenome);
ola2(nome, sobrenome);