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

    newMessageBox.outerHTML = `
    <div class="ui segment" style="top: ${messageTop}px">
      <p>${user}: ${message}</p>
    </div>`

    setTimeout(() => {
      newMessageBox.remove()
    }, 30000)
  })
})()
