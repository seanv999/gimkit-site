//Server
const axios = require('axios')
const ws = require('ws')

const apiInfo = {
    infoFromCode:'https://www.gimkit.com/api/matchmaker/find-info-from-code',
    matchMaker:'https://www.gimkit.com/api/matchmaker/join'
};

const findRoomInfo = async roomCode => {
    const payload = {
        "code": String(roomCode),
    }
    const res = await axios.post(apiInfo.infoFromCode, payload)
        .catch(e=>{
            
        })
    return await res.data.roomId
}



const getIntent = async (name, code) => {

    const payload = {
        
        "clientType": `Gimkit ⁡‍⁤‍⁡‌‍⁢‍⁢‍⁡‌‍⁢⁡⁤‍‍‍⁡⁢‍⁢⁡‍‌‍‌‍⁡⁡⁡‍‍‌⁢⁡⁢⁡⁡⁡‍⁣‌‍‌⁡⁤‍‌‍⁡⁤⁡⁢⁡⁢⁡‍⁢‍‍⁢⁣⁡‌⁢‍⁣‌⁡‍⁣⁡‌⁡⁡⁢‍‌⁤⁢‍‌⁢⁡‍⁡⁡‍⁢‍⁢‌⁡⁢⁣⁡‌⁡⁤‍⁡⁡‌‍⁢⁣⁢⁡‍⁡⁣‍‍⁢⁡⁡‍‍⁡‌⁤⁡‌⁢⁡⁢‍⁡‌‍⁢‌⁢⁡‍‌⁢⁡⁢‌⁡‌⁢‍‍‍⁡⁣⁢‍‌‍⁡‍‌⁢‌⁢⁡⁡‌⁢⁣‌⁤⁢⁡‍‍⁡‍⁢⁡⁢⁡⁣⁡‌⁡‍⁡⁡⁣‍⁤⁢⁡⁢‍⁡⁤‌⁡⁤‌⁡⁡‍‍‍‍‍‌⁢⁡⁡‍‍⁢‌‍‌‍⁢‍⁢⁡⁡⁢⁡‌⁡‌⁡⁡‌‍⁡⁢‍‌⁡⁢‌‍⁣‍‌⁤⁡⁡‍⁡‍⁢‍⁣‍⁣⁤‌‍‍⁣⁡‌‍‌⁡⁢⁡⁤‍⁤⁡⁢⁡‌‍⁡⁢‍‍‍‌‍‍‌⁢‍⁢‍⁢‌⁡‍‌⁡‌⁤‍⁡Web Client V3.1`,
        "name": name,
        "roomId": await findRoomInfo(code)
    }
    const res = await axios.post(apiInfo.matchMaker, payload)
        .catch(e=>{
            
        })

    const r = await res.data
    return r
}




const join = async(code,playerName)  => {

    //get intentID
   try{
    const r = await getIntent(playerName, code)

    //get roomData
    const intentPayload = {
        "intentId": r.intentId
    }
    const server = `${r.serverUrl}/matchmake/joinById/${r.roomId}`
    
    const room = await axios.post(server, intentPayload)
        .catch(e=>{
            return false
        })
    const roomData = room.data

    //create socket
    const socketUri = `${r.serverUrl.replace('https', 'wss')}/${roomData.room.processId}/${roomData.room.roomId}?sessionId=${roomData.sessionId}`
    const socket = new ws(socketUri)

    socket.on('open',() => {
        console.log(`${playerName} Joined`)
    })
   }catch{
    console.log('ERROR')
   }
}






const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'))
app.use(express.json());
app.listen(port)

app.post('/api/v1/gimkit/flood', (req, res) => {
   
    console.log('Request recivef')
    const data = req.body

    try{
        const pin = data.pin
        const amount = data.amount
        const names = data.name

        for(i = 0;i< amount;i++){
            join(parseInt(pin), names)
        }
    }catch{
        console.log('Somthing went wrong')
    }
    res.send({
        success:true
    })
})
