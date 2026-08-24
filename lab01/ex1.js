// Exemplo de Videogame como função

// function Videogame(marca, nControles, tipoMidia){
//     this.marca = marca;
//     this.nControles = nControles;
//     this.tipoMidia = tipoMidia;
// }

// var playstation = new VideoGame('Sony', 2, 'CD');
// console.log(playstation);


// Exemplo de Videogame como classe

class VideoGame{
    constructor(marca, nControles, tipoMidia){
        this.marca = marca;
        this.nControles = nControles;
        this.tipoMidia = tipoMidia;
    }

    ligar(estado){
        this.ligado = estado;
        console.log(this.marca + (estado ? " Ligado! " : " Desligado! "));
    }

    jogar(){
        if(this.ligado){
            console.log('Jogando no ' + this.marca);
        } else {
            console.log('O ' + this.marca + ' está desligado');
        }
    }


    SalvarJogo(jogo){
        if(this.ligado){
            console.log('Salvando jogo ' + jogo + ' no ' + this.marca);
        } else {
            console.log('O ' + this.marca + ' está desligado');
        }
    }
}

var playstation = new VideoGame('Sony', 2, 'CD');
playstation.jogar();
playstation.ligar(true);
playstation.jogar();
playstation.SalvarJogo('God of War');
playstation.ligar(false);
playstation.SalvarJogo('God of War');