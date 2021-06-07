import axios from "./axios";

const checkStatus = response => {
    if (response.statusText === "OK" || response.statusText === "Created") {
        return response
    }
    // convert non-2xx HTTP responses into errors
    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error)
}

export const getColumnById = (id) =>
    axios.get("/columns/" + id).then(checkStatus)

export const pushCardMappingsToColumn = (colId, cardIds) =>
    axios.patch("/columns/" + colId, {cardIds: cardIds}).then(checkStatus)

export const getColumns = () =>
    axios.get("/columns").then(checkStatus)

export const getColumnOrder = () =>
    axios.get("/columnOrder").then(checkStatus)

const pushColumnIntoOrder = (colId) =>
    getColumnOrder().then(res => {
        const columnOrder = [...res.data[0]["column"]]
        columnOrder.push(colId)
        setColumnOrder(columnOrder)
    })

export const createColumn = (title) =>
    axios.post("/columns", {title: title, cardIds: []})
        .then(checkStatus)
        .then(res => pushColumnIntoOrder(res.data.id))

export const setColumnOrder = (order) =>
    axios.patch("/columnOrder/order", {column: order}).then(checkStatus)

export const getCards = () =>
    axios.get("/cards").then(checkStatus)

const createCardColumnMappings = (cardId, colId) =>
    getColumnById(colId)
        .then(res => {
            return res.data.cardIds
        })
        .then(cardIds => {
            cardIds.push(cardId)
            return cardIds
        })

export const createCard = (cardTitle, colId) =>
    axios.post("/cards", {title: cardTitle})
        .then(checkStatus)
        .then(res => createCardColumnMappings(res.data.id, colId))
        .then(cardColumnMappings => pushCardMappingsToColumn(colId, cardColumnMappings))

export const deleteCard = (colId, cardId) =>
    /* column has a foreign key card id that must be deleted first */
    getColumnById(colId)
        .then(res => res.data.cardIds)
        .then(res => {
            let difference = res.filter(x => !cardId.includes(x))
            pushCardMappingsToColumn(colId, difference)
            axios.delete("/cards/" + cardId)
        })

export const editCardContent = (cardId, cardTitle) =>
    axios.patch("/cards/" + cardId, {title: cardTitle}).then(checkStatus)

export const markCardAsDone = (cardId) =>
    axios.patch("/cards/" + cardId, {status: "DONE"}).then(checkStatus)

