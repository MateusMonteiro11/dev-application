class Data{
    #dia;
    #mes;
    #ano;

    constructor(dia, mes, ano){
        this.#dia = dia;
        this.#mes = mes;
        this.#ano = ano;
    }

    getdia(){return this.#dia;}
    setdia(dia){this.#dia = dia;}
    getmes(){return this.#mes;}
    setmes(mes){this.#mes = mes;}
    getano(){return this.#ano;}
    setano(ano){this.#ano = ano;}

    toString(){
        return `${this.#dia}/${this.#mes}/${this.#ano}`;
    }
}

class Pessoa{
    #nome;
    #cpf;
    #nascimento;

    constructor(nome, cpf, nascimento){
        this.#nome = nome;
        this.#cpf = cpf;
        this.#nascimento = nascimento;
    }
    
    getnome(){return this.nome;}
    setnome(nome){this.nome = nome;}
    getcpf(){return this.cpf;}
    setcpf(cpf){this.cpf = cpf;}

    toString(){
        return `Nome: ${this.#nome}, CPF: ${this.#cpf}, Nascimento: ${this.#nascimento.toString()}`;
    }
}

class Funcionario extends Pessoa{
    #admissao;
    #salario;

    constructor(nome, cpf, nascimento, admissao, salario){
        super(nome, cpf, nascimento);
        this.#admissao = admissao;
        this.#salario = salario;
    }

    getadmissao(){return this.#admissao;}
    setadmissao(admissao){this.#admissao = admissao;}
    getsalario(){return this.#salario;}
    setsalario(salario){this.#salario = salario;}

    toString(){
        return `${super.toString()}, Admissão: ${this.#admissao.toString()}, Salário: ${this.#salario}`;
    }
}

class Gerente extends Funcionario{
    #departamento;
    #promocaoGerente;

    constructor(nome, cpf, nascimento, admissao, salario, departamento, promocaoGerente){
        super(nome, cpf, nascimento, admissao, salario);
        this.#departamento = departamento;
        this.#promocaoGerente = promocaoGerente;
    }

    getdepartamento(){return this.#departamento;}
    setdepartamento(departamento){this.#departamento = departamento;}
    getpromocaoGerente(){return this.#promocaoGerente;}
    setpromocaoGerente(promocaoGerente){this.#promocaoGerente = promocaoGerente;}

    toString(){
        return `${super.toString()}, Departamento: ${this.#departamento}, Promoção Gerente: ${this.#promocaoGerente.toString()}`;
    }
}

class Main{
    static main(){
        const nascimento = new Data(1, 5, 2000);
        const promocaoGerente = new Data(4, 6, 2022);
        const admissao = new Data(25, 10, 2020);

        const pessoa = new Pessoa('João', '123.456.789-00', nascimento);
        const funcionario = new Funcionario('Maria', '987.654.321-00', nascimento, admissao, 5500.34);
        const gerente = new Gerente('Ana', '456.789.123-00', nascimento, admissao, 18340.50, 1, promocaoGerente);

        console.log("Funcionario: " + funcionario.toString());
        console.log("Pessoa: " + pessoa.toString());
        console.log("Gerente: " + gerente.toString());
    }
}

Main.main();