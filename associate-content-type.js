var content = function (type){
        console.log(type)
        var text;
        switch(type) {
            case '.html':
                text = "text/html"
                break;
            case '.css':
                text = "text/css"
                break;
            case '.js':
                text = "text/javascript"
                break;
            case '.png':
                text = "image/png"
                break;
            case '.jpg':
                text = "image/jpg"
                break;
            default:
                text = ""
        }
        return text;
}
module.exports = content;