import http from "./http.js";

const getLeds =  () => http.get('leds/' )


const changeState =  (id) =>  http.post(`leds/${id}`);
const getPatterns =  () =>  http.get(`patterns/`);
const repeatPatterns =  () =>  http.get(`patterns?repeat=true`);

const sendPatternsResponse =  (patternsResponse) =>  http.post(`patterns/`,{patternsResponse});
const resetGame =  () =>  http.patch(`reset/`)

/* const getContact =  (id) =>  http.get(`contacts/${id}`,{headers: authHeader()});


const updateContact = (id,contact) => http.put(`contacts/${id}`,contact,{headers: authHeader()})

const deleteContact = (id) => http.delete(`contacts/${id}`,{headers: authHeader()}) */
export  {
    getLeds,
    changeState,
    getPatterns,
    sendPatternsResponse,
    resetGame,
    repeatPatterns
/*     getContact,
    createContact,
    updateContact,
    deleteContact  */
}