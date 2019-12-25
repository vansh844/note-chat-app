const users=[]

//addUser, removeUser, getUser, getUsersInRoom

const addUser=({id, username, room})=>{
    //clean data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate the data
    if(!username || !room){
        return{
            error:'Username and room is required'
        }
    }

    //check for existing user
    const existingUser=users.find((user)=>{
        return user.room===room &&user.username===username
    })

    //validate Username
    if(existingUser){
        return {
            error:'Username already exists'
        }
    }

    //Store user
    const user={id, username, room}
    users.push(user)
    return {user}
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })

    if(index !==-1){
        return users.splice(index, 1)[0]
    }
}

const getUser=(id)=>{
    const user=users.find((user)=>{
        return user.id===id
    })

    return user
}

const getUsersInRoom=(room)=>{
    const usersIn=users.filter((user)=>{
        return user.room===room
    })

    return usersIn
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}