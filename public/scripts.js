const floodButton = document.getElementById('floodButton');
const port = 3000
floodButton.onclick = () => {
    const code = document.getElementById('code').value
    const name = document.getElementById('names').value
    const amount = document.getElementById('amount').value
    const pin = document.getElementById('code').value
    if(pin != '' && code != '' && name !='' && amount != ''){
        fetch(`${location.origin}/api/v1/gimkit/flood`,{
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                name: name,
                code: code,
                amount: amount,
                pin: pin
            }),
            method:'post'
        })
        .catch(error =>{ 
            console.log(error)
        })
        alert('BETA\nattempting to flood')
    }else{
        alert('One or more values undefined')
    }
   
}