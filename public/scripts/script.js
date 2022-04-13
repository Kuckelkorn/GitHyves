let socket = io()
let messages = document.querySelector('#messages')
let form = document.querySelector('#form')
let input = document.querySelector('#input')
let username = document.querySelector('#username').value
let submit = document.querySelector('#submit')
let typing = document.querySelector('#typing')

submit.addEventListener('click', e => {
    e.preventDefault()

    if (input.value) {
        socket.emit('chat message', {
          message: input.value,
          date: new Date(),
          username: username
        })
        input.value = ''
    }
})

input.addEventListener('keypress', () => {
  socket.emit('typing', { username })
})

socket.on('chat message', data => {
  let item = document.createElement('div')
  item.innerHTML = `
  <div class="metadata">
    <span class="author">
    ${data.username == username ? 'You' : data.username}
    </span>
    <span class="date">${data.date}</span>
  </div>
  <p>${data.message}</p>
  `
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight)
})

socket.on('typing', data => {
  setTimeout(() => {
    typing.textContent = ''
  }, 3000)
  typing.textContent = data.username + ' is typing...'
})