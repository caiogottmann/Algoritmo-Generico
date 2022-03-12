const GERACOES = 20;
const INDIVIDUOS = 30;
const TAXA_CROSSOVER = 0.7;
const TAXA_MUTACAO = 0.01;
const LIMITE_INFERIOR = -10;
const LIMITE_SUPERIOR = 10;
const TAMANHO_BINARIO = 5;

function aptidao(x) {
  return Math.pow(x, 2) - 3 * x + 4;
}

class Individuo {
  constructor(x, aptidao, percSelecao) {
    this.valor = x;
    this.cromossomo = convertToBinary(x);
    this.aptidao = aptidao;
    this.percSelecao = percSelecao;
  }

  setCromossomo(cromossomo) {
    this.cromossomo = cromossomo;
  }

  setvalorByBinario(binario) {
    this.valor = conversorBinarioToDecimal(binario);
  }
}

function conversorBinarioToDecimal(binario) {
  let dec = 0;
  let evidencyBit = binario.shift();
  for (let c = 0; c < binario.length; c++) {
    dec += Math.pow(2, c) * binario[binario.length - c - 1]; //calcula para pegar do último ao primeiro
  }

  if (evidencyBit == 1) dec *= -1;

  binario.unshift(evidencyBit);

  return dec;
}

function convertToBinary(number) {
  let num = Math.abs(number);
  let binary = (num % 2).toString();
  while (num > 1) {
    num = parseInt(num / 2);
    binary = (num % 2) + binary;
  }
  binary = binary.padStart(4, "0");
  if (number >= 0) binary = `0${binary}`;
  else binary = `1${binary}`;
  //console.log(binary.split(""));
  // console.log(binary);
  return binary.split("");
}

function novaPopulacao(populacao) {
  populacao = selecao(populacao);

  // console.log("seg", populacao);
  //this.numPopulacoes++;

  const sumFx = populacao.reduce(
    (previousValue, currentValue) =>
      previousValue +
      aptidao(conversorBinarioToDecimal(currentValue.cromossomo)),
    0
  );

  // Calculo da probabilidade
  let val = 0;
  const novapop = [];

  for (const individuo of populacao) {
    val = conversorBinarioToDecimal(individuo.cromossomo);
    novapop.push(new Individuo(val, aptidao(val), aptidao(val) / sumFx));
  }

  novapop.sort((a, b) => b.aptidao - a.aptidao);

  return novapop;
}

function getMelhor(populacao, index1, index2) {
  if (populacao[index1].aptidao >= populacao[index2].aptidao)
    return populacao[index1];
  else return populacao[index2];
}

function gerarPopulacao() {
  //numPopulacoes++;
  let populacao = [];
  const valores = [];
  let totalFn = 0;
  for (let index = 0; index < INDIVIDUOS; index++) {
    const valorAux = Math.floor(
      Math.random() * (LIMITE_SUPERIOR - LIMITE_INFERIOR) + LIMITE_INFERIOR
    );
    totalFn += aptidao(valorAux);
    valores.push(valorAux);
  }

  for (let i = 0; i < valores.length; i++) {
    populacao.push(
      new Individuo(
        valores[i],
        aptidao(valores[i]),
        aptidao(valores[i]) / totalFn
      )
    );
  }

  populacao.sort((a, b) => b.aptidao - a.aptidao);

  return populacao;
}

function crossover(pai, mae) {
  let filho1 = pai;
  let filho2 = mae;
  if (Math.random() <= TAXA_CROSSOVER) {
    console.log("CROSSOVER");
    // let filho1 = ["1", "8", "8", "8", "8"];
    // let filho2 = ["0", "1", "0", "0", "7"];
    // const index = Math.floor(Math.random() * (TAMANHO_BINARIO - 1) + 1);

    const index = Math.floor(Math.random() * (TAMANHO_BINARIO - 1));
    const sliceCross1 = filho1.slice(index);
    const sliceCross2 = [...filho2].slice(index);

    filho2.splice(index, TAMANHO_BINARIO);
    filho2 = filho2.concat(sliceCross1);
    // filho2;

    filho1.splice(index, TAMANHO_BINARIO);
    filho1 = filho1.concat(sliceCross2);
  }
  return { filho1, filho2 };
}

function torneio(populacao) {
  const indexEscolha1 = Math.floor(Math.random() * INDIVIDUOS);
  let indexEscolha2 = 0;
  do {
    indexEscolha2 = Math.floor(Math.random() * INDIVIDUOS);
  } while (indexEscolha1 === indexEscolha2);

  const melhor = getMelhor(populacao, indexEscolha1, indexEscolha2);
  return melhor;
}

function mutacao(param1) {
  let result = [];
  //Necessário passar um individuo para o método

  for (let i = 0; i < param1.length; i++) {
    if (Math.random() <= TAXA_MUTACAO) {
      console.log("MUTACAO");
      if (param1[i] == "1") {
        result.push("0");
      } else result.push("1");
    } else result.push(param1[i]);
  }

  return result;
}

function checkValores(filho1, filho2) {
  return (
    !(
      conversorBinarioToDecimal(filho1.cromossomo) >= -10 &&
      conversorBinarioToDecimal(filho1.cromossomo) <= 10
    ) ||
    !(
      conversorBinarioToDecimal(filho2.cromossomo) >= -10 &&
      conversorBinarioToDecimal(filho2.cromossomo) <= 10
    )
  );
}

function selecao(populacao) {
  const pai = torneio(populacao);
  let mae = torneio(populacao);
  const filho1 = Object.assign(Object.create(Object.getPrototypeOf(pai)), pai);
  const filho2 = Object.assign(Object.create(Object.getPrototypeOf(mae)), mae);
  let cromossomo;
  do {
    cromossomo = crossover([...pai.cromossomo], [...mae.cromossomo]);
    filho1.setCromossomo(mutacao(cromossomo.filho1));
    filho2.setCromossomo(mutacao(cromossomo.filho2));
  } while (checkValores(filho1, filho2));
  return [...populacao].slice(0, INDIVIDUOS - 2).concat(filho1, filho2);
}

function exec() {
  let n = 1;

  let arrayPopulation = [];
  let populacao = gerarPopulacao();
  arrayPopulation.push(populacao);
  //console.log('1', arrayPopulation[n - 1])

  do {
    populacao = novaPopulacao(arrayPopulation[n - 1]);
    arrayPopulation.push(populacao);
    renderTable(arrayPopulation[n - 1], n);
    n++;
    // console.log(n, arrayPopulation[n - 1])
    // console.log(n);
  } while (n < GERACOES);
  renderTable(arrayPopulation[n - 1], n);
  console.log("fim", arrayPopulation);
}

exec();

function renderTable(array, n) {
  let divMaster = document.querySelector("#myDynamicTable");
  // console.log(divMaster);

  //retornar uma div

  divMaster.appendChild(createTableWithData(array, n));
}

function createTableWithData(array, n) {
  let table = document.createElement("table");
  let caption = document.createElement("caption");
  caption.innerHTML = `Geração ${n}`;
  table.appendChild(caption);
  table.style.border = "2px solid black";
  table.appendChild(headTable());

  let tbody = document.createElement("tbody");
  array.forEach((element, index) => {
    tbody.appendChild(createTableWithInformation(element, index));
  });
  table.appendChild(tbody);

  return table;
}

function headTable() {
  let tr = document.createElement("tr");

  let th = document.createElement("th");
  th.innerHTML = "Individuo";
  let th2 = document.createElement("th");
  th2.innerHTML = "Valor";
  let th3 = document.createElement("th");
  th3.innerHTML = "F(x)";
  let th4 = document.createElement("th");
  th4.innerHTML = "Cromossomo";

  tr.appendChild(th);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);

  return tr;
}

function createTableWithInformation(element, index) {
  let tr = document.createElement("tr");
  let td = document.createElement("td");
  let td2 = document.createElement("td");
  let td3 = document.createElement("td");
  let td4 = document.createElement("td");

  td.innerHTML = `I${index + 1}`;
  td2.innerHTML = element.valor;
  td3.innerHTML = element.aptidao;
  td4.innerHTML = element.cromossomo.join("");

  tr.appendChild(td);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);

  return tr;
}

renderTable();
