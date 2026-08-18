class Funcionario{
    #nome;
    #numeroRestanteDeFerias;
    #cpf;

    constructor(nome, numeroRestanteDeFerias, cpf){
        this.#nome = nome;
        this.#numeroRestanteDeFerias = numeroRestanteDeFerias;
        this.#cpf = cpf;
    }

    getNome(){
        return this.#nome;
    }
    setNome(nome){
        this.#nome = nome;
    }
    getNumeroRestanteDeFerias(){
        return this.#numeroRestanteDeFerias;
    }
    setNumeroRestanteDeFerias(numeroRestanteDeFerias){
        this.#numeroRestanteDeFerias = numeroRestanteDeFerias;
    }
    getCpf(){
        return this.#cpf;
    }
    setCpf(cpf){
        this.#cpf = cpf;
    }

    tirarFerias(dias){
        if(this.#numeroRestanteDeFerias >= dias){
            this.#numeroRestanteDeFerias -= dias;
            console.log('Ferias tiradas com sucesso');
        } else {
            console.log('Numero de ferias insuficiente');
        }
    }
}

class Medico extends Funcionario{
    constructor(nome, numeroRestanteDeFerias, cpf){
        super(nome, numeroRestanteDeFerias, cpf);
    }
}

class Enfermeira extends Funcionario{
    constructor(nome, numeroRestanteDeFerias, cpf, certificados){
        super(nome, numeroRestanteDeFerias, cpf);
        this.certificados = certificados;
    }

    adicionarCertificado(certificado){
        this.certificados.push(certificado);
    }
}

class Main{
    static main(){
        let funcionario = new Funcionario('João', 20, '123.456.789-00');
        console.log(funcionario);

        let medico = new Medico('Maria', 20, '987.654.321-00');
        medico.tirarFerias(5);
        console.log(medico.getNumeroRestanteDeFerias());

        let enfermeira = new Enfermeira('Ana', 20, '456.789.123-00', ['Certificado 1']);
        enfermeira.tirarFerias(10);
        console.log(enfermeira.getNumeroRestanteDeFerias());
    }
}

Main.main();