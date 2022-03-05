const GERACOES = 5;
const INDIVIDUOS = 4;
const TAXA_CROSSOVER = 0.7;
const TAXA_MUTACAO = 0.5;
const LIMITE_INFERIOR = -10;
const LIMITE_SUPERIOR = 10;
const TAMANHO_BINARIO = 5;

function aptidao(x) {
  return Math.pow(x, 2) + 3 * x + 4;
}

class Individuo {
  constructor(x, aptidao, percSelecao) {
    this.valor = x;
    this.cromossomo = this.convertToBinary(x);
    this.aptidao = aptidao;
    this.percSelecao = percSelecao;
  }

  convertToBinary(number) {
    let num = Math.abs(number);
    let binary = (num % 2).toString();
    while (num > 1) {
      num = parseInt(num / 2);
      binary = (num % 2) + binary;
    }
    binary = binary.padStart(4, "0");
    if (number >= 0) binary = `0${binary}`;
    else binary = `1${binary}`;
    console.log(binary.split(""));
    // console.log(binary);
    return binary.split("");
  }
}

class Genetico {
  constructor() {
    this.numPopulacoes = -1; // não é constante
    this.populacao = [];

    this.gerarPopulacao();
    this.torneio();
    this.selecao();
    console.log(this.mutacao(this.populacao[this.numPopulacoes][0]))
    conversorBinarioToDecimal('1000')
  }

  gerarPopulacao() {
    this.numPopulacoes++;
    const valores = [];
    let totalFn = 0;
    for (let index = 0; index < INDIVIDUOS; index++) {
      const valorAux = Math.floor(
        Math.random() * (LIMITE_SUPERIOR - LIMITE_INFERIOR) + LIMITE_INFERIOR
      );
      totalFn += aptidao(valorAux);
      valores.push(valorAux);
    }

    console.log("totalFn", totalFn);
    this.populacao.push(
      valores.map(
        (valor) =>
          new Individuo(valor, aptidao(valor), aptidao(valor) / totalFn)
      )
    );

    this.populacao[this.numPopulacoes].sort(
      (a, b) => b.percSelecao - a.percSelecao
    );
  }

  crossover(pai, mae) {
    let filho1 = pai;
    let filho2 = mae;
    // if (Math.random() <= TAXA_CROSSOVER) {
    const index = Math.floor(Math.random() * TAMANHO_BINARIO + 1);
    // const arrayAux = filho1.slice(0, 2);
    console.log("filho1", filho1);
    // console.log("arrayAux", arrayAux);
    // }
    return { filho1, filho2 };
  }

  selecao() {
    const populacaoAux = [...this.populacao[this.numPopulacoes]];
    const pai = this.torneio();
    const mae = this.torneio();
    const { filho1, filho2 } = this.crossover(pai, mae);
    //Mutacao sendo chamado daqui apenas para teste
    
  }

  getMelhor(index1, index2) {
    if (
      this.populacao[this.numPopulacoes][index1].aptidao >=
      this.populacao[this.numPopulacoes][index2].aptidao
    )
      return this.populacao[this.numPopulacoes][index1];
    else return this.populacao[this.numPopulacoes][index2];
  }

  torneio() {
    // console.log("iha", this.populacao[this.numPopulacoes]);
    const indexEscolha1 = Math.floor(Math.random() * INDIVIDUOS);
    let indexEscolha2 = 0;
    do {
      indexEscolha2 = Math.floor(Math.random() * INDIVIDUOS);
    } while (indexEscolha1 === indexEscolha2);

    // console.log(indexEscolha1);
    // console.log(indexEscolha2);
    // console.log(
    //   this.populacao[this.numPopulacoes].find(
    //     (individuo) => percEscolha >= individuo.percSelecao
    //   )
    // );
    // console.log("best", this.getMelhor(indexEscolha1, indexEscolha2));
    return this.getMelhor(indexEscolha1, indexEscolha2);
  }

  mutacao(param1) {
    let result = [];
    //Necessário passar um individuo para o método
    for (let i = 0; i < param1.cromossomo.length; i++) {
      if (Math.random() <= 0.01) {
        if (param1.cromossomo[i] == "1") {
          result.push("0")
        } else result.push("1")
      }else result.push(param1.cromossomo[i])
    }

    //param1.cromossomo = [...result];
    
    return result
  }
}

new Genetico();


function conversorBinarioToDecimal(binario){
  
  let dec = 0;
  for (let c = 0; c < binario.length; c++){
   console.log(Math.pow(2, c) * binario[binario.length - c - 1])
    dec += Math.pow(2, c) * binario[binario.length - c - 1]; //calcula para pegar do último ao primeiro
  }
  console.log(dec);
}