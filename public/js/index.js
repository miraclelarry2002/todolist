var time = new Date().getHours()

if (time > 17){
    document.body.style.backgroundImage = "linear-gradient(-60deg, #00DCB0, #00856a)"
}else{
    document.body.style.backgroundImage = "linear-gradient(-60deg, #00856a, #00DCB0)"
}