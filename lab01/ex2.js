class Funcionario{
    #nome;
    #numeroRestanteDeFerias;

    constructor(nome){
        this.#nome = nome;
        this.#numeroRestanteDeFerias = 20;
    }

    getNome(){return this.#nome;}
    setNome(nome){this.#nome = nome;}
    getNumeroRestanteDeFerias(){return this.#numeroRestanteDeFerias;}
    setNumeroRestanteDeFerias(numeroRestanteDeFerias){this.#numeroRestanteDeFerias = numeroRestanteDeFerias;}

    tirarFerias(dias) {
        if (dias <= 0) {
            return false;
        }

        const diasNoCiclo = dias % 20; // 30/20 define um ciclo completo, ou algo do genêro, e o resto é o que sobra para o próximo ciclo.

        if (diasNoCiclo == 0) {
            this.#numeroRestanteDeFerias = 20;
        } else {
            this.#numeroRestanteDeFerias = 20 - diasNoCiclo;
        }

        return true;
    }

    toString(){
        return `Nome: ${this.#nome}, Férias restantes: ${this.#numeroRestanteDeFerias}`;
    }
}

class Medico extends Funcionario{
    #cpf;

    constructor(nome, cpf){
        super(nome);
        this.#cpf = cpf;
    }
}

class Enfermeira extends Funcionario{
    #certificados;

    constructor(nome, certificados){
        super(nome);
        this.certificados = certificados;
    }

    adicionarCertificado(certificado){
        this.certificados.push(certificado);
    }
}

class Main{
    static main(){

        let medico = new Medico('Maria', '987.654.321-00');
        medico.tirarFerias(5);
        console.log(medico.toString());

        let enfermeira = new Enfermeira('Ana', ['Certificado Qualquer']);
        enfermeira.tirarFerias(10);
        console.log(enfermeira.toString());

        // Exemplo com quem estourou as ferias restantes
        let medico2 = new Medico('João', '123.456.789-00');
        medico2.tirarFerias(30);
        console.log(medico2.toString());
    }
}

Main.main();