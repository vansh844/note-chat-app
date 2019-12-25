const socket=io()

//Elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $locationButton= document.querySelector('#send-location')
const $messages=document.querySelector('#messages')

//template
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//Options
const {username, room}= Qs.parse(location.search, {ignoreQueryPrefix:true})

const autoscroll=()=>{
    //New Message element
    const $newMessage=$messages.lastElementChild

    //Height of the new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight= $newMessage.offsetHeight+newMessageMargin

    //Visible height
    const visibleHeight=$messages.offsetHeight

    //Height of messages container
    const containerHeight=$messages.scrollHeight

    // How far have I scrolled
    const scrollOffset=$messages.scrollTop+visibleHeight

    if(containerHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop=$messages.scrollHeight
    }
}

socket.on('locationMessage', (message)=>{
    console.log(message)
    const html=Mustache.render(locationTemplate, {
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('message', (message)=>{
    console.log(message)
    const html=Mustache.render(messageTemplate, {
        username:message.username,
        message: message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

document.querySelector('#message-form').addEventListener('submit', (event)=>{
    //preventing full page refresh
    event.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message=event.target.elements.message.value
    socket.emit('sendMessage', message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('The message was recieved')
    })
})

document.querySelector('#send-location').addEventListener('click',()=>{
    $locationButton.setAttribute('disabled', 'disabled')
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $locationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})

socket.on('roomData', ({room, users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})

socket.emit('join', {username, room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})