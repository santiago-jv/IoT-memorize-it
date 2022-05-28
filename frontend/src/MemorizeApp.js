import React, { useEffect, useState } from 'react'
import { getLeds, getPatterns, repeatPatterns, resetGame, sendPatternsResponse } from './services/leds-http'
import Swal from 'sweetalert2'

function MemorizeApp() {
    const [leds, setLeds] = useState([])
    const [patterns, setPatterns] = useState([])
    const [patternsResponse, setPatternsResponse] = useState([])
    const [isDisabled, setIsDisabled] = useState(false)
    const [roundStarted, setRoundStarted] = useState(false)
    const [round, setRound] = useState(null)
    const [repeats, setRepeats] = useState(2)
    const renderLeds = async () => {
        const response = await getLeds()
        setLeds(response.data.leds)
        setRound(response.data.round)
    }
    const retrievePatterns = async (event) => {
        setRoundStarted(true)
        setIsDisabled(true)
        const response = await getPatterns()
        setPatterns(response.data.patterns)
        setIsDisabled(false)

    }
    const replayPatterns = async (event) => {
        resetValues()
        setRepeats(repeats-1)
        setIsDisabled(true)
        const response = await repeatPatterns()
        setPatterns(response.data.patterns)
        setIsDisabled(false)

    }
    const resetValues = () => {
        setPatternsResponse([])
        setPatterns([])
        setRoundStarted(false)
        
    }
    const addItem = async (id) => {

        if (!isDisabled && patterns.length > 0) {
            if (patternsResponse.length === patterns.length - 1) {
                const newPatterns = [...patternsResponse, id]
                setPatternsResponse(newPatterns)
                try {
                    const response = await sendPatternsResponse(newPatterns)
                    setRound(response.data.round)

                    Swal.fire({
                        icon: 'success',
                        title: 'Round passed',
                        showConfirmButton: true,
                    })
                } catch (error) {
                    Swal.fire({

                        icon: 'error',
                        title: 'Incorrect patterns',
                        showConfirmButton: true,
                    })
                    setRepeats(2)
                    setRound(0)
                }
                resetValues()
            }
            else if (patternsResponse.length < patterns.length) {
                const newPatternsResponse = [...patternsResponse, id]
                setPatternsResponse(newPatternsResponse)
                if ((newPatternsResponse.at(-1) !== patterns[newPatternsResponse.length - 1])) {
                    console.log("entra")
                    Swal.fire({

                        icon: 'error',
                        title: 'Incorrect Patterns',
                        showConfirmButton: true,
                    })
                    setRepeats(2)
                    await resetGame()
                    resetValues()

                }
            }
        }

    }
    useEffect(() => {
        renderLeds()

    }, [])

    return (
        <>
            {leds.length > 0 && (<div className="main-container mx-auto card p-4 mt-5">
                <h1 className='text-center my-4'>Welcome to Memorize it!</h1>
                <div className="col-5 mx-auto d-flex  mb-5 mt-2">
                    <button disabled={isDisabled || roundStarted} onClick={retrievePatterns} className="d-block mx-1 btn btn-success mx-auto d-block">Start Round</button>
                    <button disabled={isDisabled || !roundStarted || repeats <= 0} onClick={replayPatterns} className="d-block mx-1 btn btn-primary mx-auto d-block ">Repeat Pattern</button>
                </div>

                <div className='row d-flex justify-content-center'>

                    {leds.map(led => (

                        <div className='col-md-2 d-flex flex-column align-items-center justify-content-center' key={led.id}>
                            <div className='circle' onClick={() => addItem(led.id)} style={{ backgroundColor: led.hexadecimal }}>

                            </div>
                            <h5 className='text-center'>{led.color}</h5>
                        </div>
                    ))}

                </div>
                {patternsResponse.length > 0 && (
                    <div className='row'>
                        <h2 className="text-center">Your answers</h2>
                        <div className='mt-4 d-flex justify-content-center'>
                            {patternsResponse.map((id, index) => (

                                <div className='circle mx-1' style={{ backgroundColor: leds[id].hexadecimal }} key={index}>


                                </div>
                            ))}
                        </div>
                    </div>

                )}
                <div className="mt-4">
                    <h5>Rounds passed: {round}</h5>
                    <h5>Chance to repeat: {repeats}</h5>

                </div>
            </div>)}
        </>
    )
}

export default MemorizeApp