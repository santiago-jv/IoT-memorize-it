import five from "johnny-five";
import express from "express";
const server = express();
import cors from 'cors';
import randomInteger  from 'random-int';
server.use(express.json())
server.use(cors())


const board = new five.Board({
    port:'COM3',
    debug:true
});

let leds = []
let patterns = []
let round = 0
board.on("ready", function() {
    leds.push({
        object:new five.Led(13),
        isActive:false,
        id:0,
        color:'Red',
        hexadecimal:'#fa0707'
    })
    leds.push({
        object:new five.Led(12),
        isActive:false,
        id:1,
        color:'Green',
        hexadecimal:'#33cc33'
    })
    leds.push({
        object:new five.Led(11),
        isActive:false,
        id:2,
        color:'Yellow',
        hexadecimal:'#ffff00'
    })

});

function ledsToJson() {
    return  leds.map(led => {
        return  {
            id:led.id,
            color:led.color,
            isActive:led.isActive,
            hexadecimal:led.hexadecimal,
        }
    })
}
server.get('/leds', (request, response) => {    
    return response.status(200).json({
        leds:ledsToJson(leds),
        round
    })
 
})
async function showPatternsInArduino(leds) {
    for (const item of patterns) {
        await (new Promise((resolve, reject) => {
            leds[item].object.on()

            board.wait(1000, ()=> {
                leds[item].object.off()
                setTimeout(()=> {
                    resolve()
                }, 500)
            })
        }))
    }
}
server.get('/patterns', async (request, response) => {
    const {repeat} = request.query
    if(repeat) {
        await showPatternsInArduino(leds)
        return response.status(200).json({
            patterns
        }) 
    }
    const ledIndex = randomInteger(0,leds.length - 1)
    patterns.push(ledIndex);
    
 

    await showPatternsInArduino(leds)


    return response.status(200).json({
        patterns,
        round
    })
 
})

server.post('/patterns', (request, response) => {
    
    const {patternsResponse} = request.body

    for (let index = 0; index < patterns.length; index++) {
        const item = patterns[index];

        const itemResponse = patternsResponse[index];
        if(item !== itemResponse) {
            patterns = []
            round = 0
            return response.status(400).json({
                message: 'Invalid pattern'
            })
        }
    }
    round++
    return response.status(200).json({
        message: 'Valid patterns', 
        round
    })
   

 
})

server.patch('/reset', (request, response) => {

    patterns = []
    return response.status(200).json({
        message:'Reset successfully'
    })
 
})

board.on('ready', ()=> {
    server.listen(8080)
});

