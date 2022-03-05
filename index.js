const GERACOES = 5;
const INDIVIDUOS = 4;
const TAXA_CROSSOVER = 0.6;
const TAXA_MUTACAO = 0.01;
const LIMITE_INFERIOR = -10;
const LIMITE_SUPERIOR = 10;

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
    this.size = INDIVIDUOS;
    this.geracoes = GERACOES;
    this.numPopulacoes = -1;
    this.crossover = TAXA_CROSSOVER;
    this.mutacao = TAXA_MUTACAO;
    this.limiteInferior = LIMITE_INFERIOR;
    this.limiteSuperior = LIMITE_SUPERIOR;
    this.populacao = [];

    this.gerarPopulacao();
    this.torneio();
    //
  }

  gerarPopulacao() {
    this.numPopulacoes++;
    const valores = [];
    let totalFn = 0;
    for (let index = 0; index < this.size; index++) {
      const valorAux = Math.floor(
        Math.random() * (this.limiteSuperior - this.limiteInferior) +
          this.limiteInferior
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

  selecao() {
    const populacaoAux = [...this.populacao[this.numPopulacoes]];
    // if(Math.random())
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
    //Verificar para saber como pegar os dois pelo torneio

    console.log("iha", this.populacao[this.numPopulacoes]);
    const indexEscolha1 = Math.floor(Math.random() * this.size);
    let indexEscolha2 = 0;
    do {
      indexEscolha2 = Math.floor(Math.random() * this.size);
    } while (indexEscolha1 === indexEscolha2);

    console.log(indexEscolha1);
    console.log(indexEscolha2);
    // console.log(
    //   this.populacao[this.numPopulacoes].find(
    //     (individuo) => percEscolha >= individuo.percSelecao
    //   )
    // );
    console.log("best", this.getMelhor(indexEscolha1, indexEscolha2));
    return this.getMelhor(indexEscolha1, indexEscolha2);
  }
}

new Genetico();
