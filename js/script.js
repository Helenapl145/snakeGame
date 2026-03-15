const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d")

const audio = new Audio("../assets/audio.mp3")

const score = document.querySelector(".score-value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

let direction, loopId

const size = 30

const initialPosition = {x: 0, y: 0}
let snake = [initialPosition]

const randomNumber = (max, min) => {
  return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size)
  return Math.round(number / size) * size
 }

const randomColor = () => {
  const red = randomNumber(0, 255)
  const green = randomNumber(0, 255)
  const blue = randomNumber(0, 255)

  return `rgb(${red}, ${green}, ${blue})`
}

const incrementScore = () => {
  score.innerText = +score.innerText + 10

}

const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor()
}

const drawSnake = () => {
  ctx.fillStyle = "#ddd"
  ctx.fillRect(snake[0].x, snake[0].y, size, size)

  snake.forEach((position, index) => {
    if (index == snake.length - 1) {
        ctx.fillStyle = "blue"
    }
    ctx.fillRect(position.x, position.y, size, size)
  })
}

const drawGrid = () => {
  ctx.lineWidth = 1
  ctx.strokeStyle = "#191919"

  for(let i = 30; i < canvas.width; i +=30){
    ctx.beginPath()
     ctx.lineTo(i, 0)
     ctx.lineTo(i, 600)

    ctx.stroke()

    ctx.beginPath()
    ctx.lineTo(0, i)
    ctx.lineTo(600, i)

    ctx.stroke()
  }


}

const drawFood = () => {
  const {x, y, color} = food

  ctx.shadowColor = color
  ctx.shadowBlur = 4
  ctx.fillStyle = color
  ctx.fillRect(x, y, size, size)
  ctx.shadowBlur = 0
}

const moveSnake = () => {
  if(!direction) return

  const head = snake[snake.length - 1]

  snake.shift()

  switch (direction) {
    case "right": 
      snake.push({x: head.x + size, y:head.y})
      break
    case "left":
      snake.push({x: head.x - size, y:head.y})
      break
    case "up":
      snake.push({x: head.x, y:head.y - size})
      break
    case "down":
      snake.push({x: head.x, y:head.y + size})
      break
    
} 
}

const checkEat = () => {
  const head = snake[snake.length - 1]
  

  if(head.x == food.x && head.y == food.y){
    snake.push(head)
    audio.play()
    incrementScore()
    let x = randomPosition()
    let y = randomPosition()

    while (snake.find ((position) => position.x == x && position.y == y)) { 
         x = randomPosition()
        y = randomPosition()
    }

    food.x = x
    food.y = y
    food.color = randomColor()
  }
}

const gameOver = () => {
  direction = undefined

  menu.style.display = "flex"
  finalScore.innerText = score.innerText
}

const checkCollision = () => {
 const head = snake[snake.length - 1]
 const canvasLimit = canvas.width - size
 const neckIndex = snake.length - 2

 const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

const selfCollision = snake.find((position, index) => {
  return index < neckIndex && position.x == head.x && position.y == head.y
})

 if(wallCollision || selfCollision) {
  gameOver()
 }
}

const gameLoop = () => {
  clearInterval(loopId)
  ctx.clearRect(0,0, 600, 600)

  drawGrid()
  drawFood()
  moveSnake() 
  drawSnake()
  checkEat()
  checkCollision()

  loopId = setTimeout(() => {
    gameLoop()
  }, 300)
}

document.addEventListener("keydown", ({key}) => {
  
  if(key == "ArrowRight" && direction !== "left") {
    direction = "right"
  }
  if(key == "ArrowLeft" && direction !== "right") {
    direction = "left"
  }
  if(key == "ArrowUp" && direction !== "down") {
    direction = "up"
  } 
  if(key == "ArrowDown" && direction !== "up") {
    direction = "down"
  }
 
 })


buttonPlay.addEventListener("click", () => { 
  score.innerText = "00"
  menu.style.display = "none"

  snake = [initialPosition]
})


gameLoop()



