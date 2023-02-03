class Color {
    bot = null
    constructor(token = process.env['color_token'], options = { polling: true }){
        console.log(token, options)
        this.bot = {token: token, ...options}
    }
    #checkRGB(text){
        let match = (/rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/.exec(text))
        return (match?.length > 0 ? match.slice(1,4) : null)
    }
    #checkHEX(text){
        let match = (/#([a-fA-F0-9]{3,6}$)/.exec(text))
        return (match?.length > 0 ? match : null)
    }
    #checkHSL(text){
        let match = (/hsl\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)/.exec(text) || /hsl\((\d{1,3}),([0-1]*\.?\d{0,4}),([0-1]*\.?\d{0,4})/.exec(text))
        return (match?.length > 0 ? match.slice(1,4) : null)
    }
    #checkHSV(text){
        let match = (/hsv\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)/.exec(text) || /hsv\((\d{1,3}),([0-1]*\.?\d{0,4}),([0-1]*\.?\d{0,4})/.exec(text))
        return (match?.length > 0 ? match.slice(1,4) : null)
    }
    validateColor(text){
        obj = { 
            hex: this.#checkHEX(text), 
            rgb: this.#checkRGB(text), 
            hsl: this.#checkHSL(text), 
            hsv: this.#checkHSV(text), 
            text: text, 
            valid: false 
        }
        obj.valid = ( match.hex || match.hsl || match.hsv || match.rgb ) != null
    }
}
module.exports = {
    Color
};