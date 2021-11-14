// parody of jQuery because funny

export const $ = {
    get: (id) => {
        return document.getElementById(id)
    },
    css: (id, style) => {
        document.getElementById(id).style = style
    }
}