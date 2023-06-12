
module.exports.getdate = getdate
function getdate(){
    
var dDay = new Date().getDay()

return dDay
}

module.exports.getday = getday

function getday(){
    var options = {
        year:"numeric",
        weekday:"numeric",
        month:"long"
    }
    var date = new Date().toLocaleString("en-US",options)+", its Weekend"

    return date
}