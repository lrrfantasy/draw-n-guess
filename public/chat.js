(function () {

  const socket = io.connect()

  const usernameMatch = location.search.match(/[\?&]username=([^\?&]*)/)
  if (usernameMatch && usernameMatch[1]) {
    socket.emit('login', usernameMatch[1])
  } else {
    document.querySelector('.login').className += ' show'
  }

  document.querySelector('.chat form')
    .addEventListener('submit', (event) => {
      event.preventDefault()
      const message = event.target.message.value
      if (message) {
        socket.emit('chat', message)
        event.target.message.value = ""
      }
    })

  const messages = document.querySelector('.messages')

  socket.on('chat', (user, message) => {
    const newMessageBox = document.createElement('div')
    messages.appendChild(newMessageBox)

    const windowHeight = window.innerHeight

    const messageTop = Math.random() * (windowHeight - 200)
    const flyTime = Math.random() * 20 + 5

    newMessageBox.outerHTML = `
    <div class="message" style="top: ${messageTop}px; animation-duration: ${flyTime}s;">
      <img class="nyan" src="nyan.gif"></img>
      <span>${user}: ${message}</span>
    </div>`

    setTimeout(() => {
      newMessageBox.remove()
    }, 30000)
  })
})()
