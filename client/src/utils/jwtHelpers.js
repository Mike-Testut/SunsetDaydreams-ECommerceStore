export const decodeToken = (token) => {
    try{
        const payload = token.split('.')[1]
        const decoded = JSON.parse(atob(payload))
        return decoded
    } catch(err){
        console.log('Invalid token', err);
        return null
    }
}

export const isTokenExpired = (token) => {
    const decoded = decodeToken(token)
    if(!decoded || !decoded.exp) return true

    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
}