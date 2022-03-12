const GERACOES = 5
const INDIVIDUOS = 4
const TAXA_CROSSOVER = 0.7
const TAXA_MUTACAO = 0.5
const LIMITE_INFERIOR = -10
const LIMITE_SUPERIOR = 10
const TAMANHO_BINARIO = 5

function aptidao(x) {
  return Math.pow(x, 2) + 3 * x + 4
}

class Individuo {
  constructor(x, aptidao, percSelecao) {
    this.valor = x
    this.cromossomo = this.convertToBinary(x)
    this.aptidao = aptidao
    this.percSelecao = percSelecao
  }

  convertToBinary(number) {
    let num = Math.abs(number)
    let binary = (num % 2).toString()
    while (num > 1) {
      num = parseInt(num / 2)
      binary = (num % 2) + binary
    }
    binary = binary.padStart(4, '0')
    if (number >= 0) binary = `0${binary}`
    else binary = `1${binary}`
    //console.log(binary.split(""));
    // console.log(binary);
    return binary.split('')
  }
}

function conversorBinarioToDecimal(binario) {
  let dec = 0
  let evidencyBit = binario.shift()
  for (let c = 0; c < binario.length; c++) {
    dec += Math.pow(2, c) * binario[binario.length - c - 1] //calcula para pegar do último ao primeiro
  }

  if (evidencyBit == 0) {
    dec = dec * -1
  }
  binario.unshift(evidencyBit)

  return dec
}

function novaPopulacao(populacao) {
  populacao = selecao(populacao)
  let totalFn = 0

  populacao.map((individuo) => {
    individuo.valor = conversorBinarioToDecimal(individuo.cromossomo)
    individuo.aptidao = aptidao(individuo.valor)
  })

  // Calculo da probabilidade
  let sumFx = 0
  populacao.map((e) => {
    sumFx += e.valor
  })

  populacao.map((e) => {
    e.percSelecao = e.valor / sumFx
  })

  populacao.sort((a, b) => b.percSelecao - a.percSelecao)

  return populacao
}

function getMelhor(populacao, index1, index2) {
  if (populacao[index1].aptidao >= populacao[index2].aptidao)
    return populacao[index1]
  else return populacao[index2]
}

function gerarPopulacao() {
  //numPopulacoes++;
  let populacao = []
  const valores = []
  let totalFn = 0
  for (let index = 0; index < INDIVIDUOS; index++) {
    const valorAux = Math.floor(
      Math.random() * (LIMITE_SUPERIOR - LIMITE_INFERIOR) + LIMITE_INFERIOR,
    )
    totalFn += aptidao(valorAux)
    valores.push(valorAux)
  }

  for (let i = 0; i < valores.length; i++) {
    populacao.push(
      new Individuo(
        valores[i],
        aptidao(valores[i]),
        aptidao(valores[i]) / totalFn,
      ),
    )
  }

  populacao.sort((a, b) => b.percSelecao - a.percSelecao)

  return populacao
}

function crossover(pai, mae) {
  let filho1 = pai
  let filho2 = mae
  // if (Math.random() <= TAXA_CROSSOVER) {
  const index = Math.floor(Math.random() * TAMANHO_BINARIO + 1)
  // const arrayAux = filho1.slice(0, 2);
  //console.log("filho1", filho1);
  // console.log("arrayAux", arrayAux);
  // }
  return { filho1, filho2 }
}

function torneio(populacao) {
  const indexEscolha1 = Math.floor(Math.random() * INDIVIDUOS)
  let indexEscolha2 = 0
  do {
    indexEscolha2 = Math.floor(Math.random() * INDIVIDUOS)
  } while (indexEscolha1 === indexEscolha2)

  return getMelhor(populacao, indexEscolha1, indexEscolha2)
}

function mutacao(param1) {
  let result = []
  //Necessário passar um individuo para o método
  for (let i = 0; i < param1.cromossomo.length; i++) {
    if (Math.random() <= 0.01) {
      if (param1.cromossomo[i] == '1') {
        result.push('0')
      } else result.push('1')
    } else result.push(param1.cromossomo[i])
  }

  return result
}

function selecao(populacao) {
  const pai = torneio(populacao)
  let mae = {}
  do {
    mae = torneio(populacao)
  } while (pai == mae)

  const { filho1, filho2 } = crossover(pai, mae)
  filho1.cromossomo = mutacao(filho1)
  filho2.cromossomo = mutacao(filho2)
  //console.log('Filhos modificados',filho1.cromossomo, filho2.cromossomo)
  return [pai, mae, filho1, filho2]
}

function exec() {
  let n = 1

  let arrayPopulation = []
  let populacao = gerarPopulacao(arrayPopulation)
  arrayPopulation.push(populacao)
  console.log(arrayPopulation[n - 1])

  do {
    populacao = novaPopulacao(arrayPopulation[n - 1])
    arrayPopulation.push(populacao)
    n++
    console.log(arrayPopulation[n - 1])
    console.log(n)
  } while (n < GERACOES)
}

exec()
