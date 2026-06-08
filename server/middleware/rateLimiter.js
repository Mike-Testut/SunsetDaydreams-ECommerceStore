
const requests = {}

const rateLimiter = (req, res, next) => {
    const ip = req.ip;
    const now = Date.now()

    if(!requests[ip]){
        requests[ip] = [];
    }

    requests[ip]= requests[ip].filter(
        (timestamp)=> now - timestamp <60000
    );

    requests[ip].push(now);
    if(requests[ip].length>10){
        return res.status(429).send("Too many requests");
    }
    next()
}

export default rateLimiter;