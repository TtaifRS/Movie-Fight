const deBounce = (func, delay = 1000) => {
    let timerOutId;
    return (...args) => {
        if (timerOutId) {
            clearTimeout(timerOutId)
        }
        timerOutId = setTimeout(() => {
            func.apply(null, args)
        }, delay);
    }
}