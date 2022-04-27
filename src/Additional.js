export const haveCollision = (A, B) => {
    const poinstA = [
        { x: A.x, y: A.y },
        { x: A.x + A.width, y: A.y },
        { x: A.x, y: A.y + A.height },
        { x: A.x + A.width, y: A.y + A.height },
    ]

    const poinstB = [
        { x: B.x, y: B.y },
        { x: B.x + B.width, y: B.y },
        { x: B.x, y: B.y + B.height },
        { x: B.x + B.width, y: B.y + B.height },
    ]

    for (const { x, y } of poinstA) {
        const condition = B.x < x && x < B.x + B.width && B.y < y && y < B.y + B.height;
        if (condition) return true
    }

    for (const { x, y } of poinstB) {
        const condition = A.x < x && x < A.x + A.width && A.y < y && y < A.y + A.height;
        if (condition) return true
    }

    return false
}

export const getRandomFrom = (...array) => {
    const index = Math.floor(Math.random() * array.length);
    return array[index]
}

export const reloadPage = (timer) => {
    return setTimeout(() => document.location.reload(), timer)
}