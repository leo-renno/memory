// Criação da variáveis de estado do jogo

let flippedCards = [] //Array que armazena as cartas viradas (sempre terá no máximo duas)
let machtedPairs = 0 // Variável de contador de pares encontrados
let attemps = 0 //Variável de contador de tentativas
let isCheckingPair = false //Trava o jogo enquanto verifica o par ou esconde as cartes.

//Array com todas as cartas (emojis) do jogo
const cardItems = [
  { id: 1, content: "🚀", matched: false}, //cada uma destas linhas representa um objeto, que por sua vez representa um carta.
  { id: 2, content: "🚀", matched: false},
  { id: 3, content: "😎", matched: false},
  { id: 4, content: "😎", matched: false},
  { id: 5, content: "🕹", matched: false},
  { id: 6, content: "🕹", matched: false},
  { id: 7, content: "🕰", matched: false},
  { id: 8, content: "🕰", matched: false},
  { id: 9, content: "🏰", matched: false},
  { id: 10, content: "🏰", matched: false},
  { id: 11, content: "⚓️", matched: false},
  { id: 12, content: "⚓️", matched: false},
  { id: 13, content: "🎸", matched: false},
  { id: 14, content: "🎸", matched: false},
  { id: 15, content: "🎲", matched: false},
  { id: 16, content: "🎲", matched: false},
]

function shuffleCards(array) { //CRIA a PRIMEIRA função, responsável por EMBARALHAR AS CARTAS
  //const aleatory = Math.random() > 0.5 ? 1 : -1 //com este método, o programa sempre vai gerar um número entre 0 e 1. Ao acrescentar ao Math.random o IF ternário, eu consigo fazer com que o programa escolha aleatoriamente entre 1 e -1
  //console.log(aleatory) //Notar que o conteúdo desta constante foi colocada como conteúdo do Arrow na constante seguinte!
  const shuffled = array.sort(() => (Math.random() > 0.5 ? 1 : -1)) //Se o valor no Arrow for positivo, o número será acrescentado depois, se negativo será acrescentado antes
  return shuffled
}

function createCard(card) { //Cria a TERCEIRA função, responsável por CRIAR AS CARTAS
  const cardElement = document.createElement("div") //com esta constante são REcriadas as 16 div's que foram apagadas do arquivo.html
  cardElement.className = "card" //com esta operação, é REvinculada a estas 16 div's a estilização já feita no arquivo .css 
  

  const emoji = document.createElement("span") //com esta constante são REcriados os span's referentes aos emojis, que foram apagados nos passos anteriores do arquivo.html
  emoji.className = "card-emoji" //com esta operação é aproveitada a estilização já realizada no arquivo .css
  emoji.textContent = card.content //este "content" aqui já foi adicionado, quando criamos o array com os 16 emojis. Notar que há 3 valores para cada emoji neste array: id, content e matched. É justamente este content que é recuperado aqui
  cardElement.appendChild(emoji) // adiciona o emoji (elemento span) dentro do cardElement (elemento div)

  cardElement.addEventListener("click", () => handleCardClick(cardElement, card)) //Adiciona o evento de click na cart, associando-os.

  return cardElement
}

function renderCards() { //Cria a SEGUNDA função, responsável por RENDERIZAR AS CARTAS
  const deck = document.getElementById("deck") // constante que pega a div id=deck
  deck.innerHTML = "" //comando que garante que dentro desta div não há ainda nenhum conteúdo.
  
  const cards = shuffleCards(cardItems) //EXECUTA a função
  cards.forEach((item) => {
    const cardElement = createCard(item) //recebe o elemento criado no interior da tarefa de renderizar o elemento
    deck.appendChild(cardElement)

  });
}

function handleCardClick(cardElement, card) { //Cria a QUARTA função, responsável por virar a carta e mostrar o conteúdo oculto (o emoji)
  if (
    isCheckingPair //tarefa de ignorar o clique enquanto verifica o par
    
    || //operador de "ou"
    
    cardElement.classList.contains("revealed") //tarefa de ignorar o clique se a carta já está virada
  ) {
    return
  }
  
  cardElement.classList.add("revealed") //a classe revealed já está criada no arquivo.css. Nós vinculamos aqui esta classe à função de revelar.
  
  
  flippedCards.push({ cardElement, card}) //adiciona o array (já criado no início) à quarta função.

  if (flippedCards.length === 2) { //função que verifica quando duas cartas estão viradas
    isCheckingPair = true // atualiza para verdadeiro, para sinalizar que verificaremos o par
    attemps++ //Incrementa (no caso, atualiza) o contador de tentativas
    const [firstCard, secondCard] = flippedCards //processo de desestruturar: construir um array idêntico a uma variável já criada, mas cujos itens se encontrem descritos. Este processo será usado para comparar os dois itens (as duas cartas)
    
    if (firstCard.card.content === secondCard.card.content) { //estrutura if, para comparar as duas variáveis recém criadas.
      machtedPairs++ //Incrementa (no caso, atualiza) o contador de pares encontrados
      
      cardItems.forEach(item => { // marcar as cartas como matched (encontradas). Com isso será possível colocar uma mensagem de parabéns ao finalizar o jogo.
        if(item.content === firstCard.card.content) // aqui, só comparamos com o conteúdo do primeiro, pois no IF anterior, já definimos que o conteúdo do primeiro é igual ao conteúdo do segundo.
          item.matched = true
      })

      flippedCards = [] //limpa o array de cartas viradas
      isCheckingPair = false //libera a próxima rodada
      updateStats() //atualiza o placar

      const toFind = cardItems.find((item) => item.matched === false) //verifica se há itens a serem encontrados
      
      if (!toFind) { // "!" sinal de negação, no caso "se não encontrar nenhum item falso para matched"
        alert("Parabéns, você encontrou todos os pares!") //Não havendo mais itens, a frase é gerada.
      }

    } else {
      setTimeout(() => { //propriedade que atrasa no tempo estabelecido a segunda carta a ser escondida novamente.
        firstCard.cardElement.classList.remove("revealed") //remove a classe de revelada à carta virada. Com isso, o programa não precisa ser resetado a cada duas cartas viradas que não formarem um par.
        secondCard.cardElement.classList.remove("revealed")
        
        flippedCards = [] //esvazia (reseta) o array de cartas viradas, para poder liberar uma nova rodada
        isCheckingPair = false
        updateStats() //chama a função de atualizar o status do jogo. Ela se posiciona dentro da estrutura IF que verifica se virou 2 cartas
        
      }, 1000) //o valor aqui de 700 está em milesegundos (tempo em que a segunda carta ficará exposta)
    }
  } 
}

function updateStats() { //cria a QUINTA função, que controlará o status do jogo
  document.getElementById("stats").textContent = `${machtedPairs} acertos de ${attemps} tentativas`
}

function resetGame() { //cria a SEXTA função, que reinicia o jogo
  flippedCards = []
  machtedPairs = 0
  attemps = 0
  isCheckingPair = false

  cardItems.forEach((card) => (card.matched = false)) //Desmarca todas as cartas

  renderCards() //renderiza novamente as cartas
  updateStats() //reseta o placar
}

function initGame() {
  renderCards() //EXECUTA a função

  document.getElementById("restart").addEventListener("click", resetGame) //Adiciona o evento de reiniciar o jogo no botão
}
initGame()