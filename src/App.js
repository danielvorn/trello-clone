import {DragDropContext, Droppable} from "react-beautiful-dnd"
import React, {useEffect, useState} from "react"
import Column from "./components/Column"
import Nav from "./components/Nav"
import * as client from "./client"
import "./App.css"

const App = () => {
  const [cards, setCards] = useState([])
  const [columns, setColumns] = useState([])
  const [columnOrder, setColumnOrder] = useState([])

  const deleteCardFromState = (colId, cardId) => {
    const columnsCopy = [...columns]

    const findColumnCorrespondingToCardId = () =>
        columnsCopy.filter((column) => column.id === colId)[0]

    const removeCardIdFromColumn = (column) => {
      const newCardIds = column.cardIds.filter((cId) => cId !== cardId)
      return {...column, cardIds: newCardIds}
    }

    const columnOfCardId = findColumnCorrespondingToCardId()
    const newColumn = removeCardIdFromColumn(columnOfCardId)
    const foundIndex = columnsCopy.findIndex(column => column.id === colId)

    if (foundIndex >= 0) columnsCopy[foundIndex] = newColumn

    setColumns(columnsCopy)

    /** now remove card from state **/
    const cardsCopy = [...cards]
    const newCards = cardsCopy.filter((card) => card.id !== cardId)
    setCards(newCards)
  }

  const editCardState = (cardId, cardContent) => {
    const cardCopy = [...cards]
    const foundIndex = cardCopy.findIndex(card => card.id === cardId)

    if (foundIndex >= 0) cardCopy[foundIndex]["title"] = cardContent

    setCards(cardCopy)
  }

  const createCardState = (cardTitle, colId) => {
    /** first create card **/
    const cardsCopy = [...cards]
    const uniqueId = '_' + Math.random().toString(36).substr(2, 9)
    cardsCopy.push({id: uniqueId, title: cardTitle})
    setCards(cardsCopy)

    /** now add card to column **/
    const columnsCopy = [...columns]
    const foundIndex = columnsCopy.findIndex(col => col.id === colId)
    columnsCopy[foundIndex].cardIds.push(uniqueId)
    setColumns(columnsCopy)
  }

  const markCardAsDoneState = (cardId) => {
    const cardsCopy = [...cards]
    const foundIndex = cardsCopy.findIndex(card => card.id === cardId)
    if (foundIndex >= 0) cardsCopy[foundIndex].status = "DONE"
    setCards(cardsCopy)
  }

  const createColumnState = (colTitle) => {
    const columnsCopy = [...columns]
    const columnOrderCopy = [...columnOrder]
    const uniqueId = '_' + Math.random().toString(36).substr(2, 9)
    const column = {"id": uniqueId, "title": colTitle, "cardIds": []}

    columnsCopy.push(column)
    setColumns(columnsCopy)
    columnOrderCopy.push(uniqueId)
    setColumnOrder(columnOrderCopy)
  }

  const fetchCards = () => {
    client.getCards()
        .then(res => setCards(res.data))
        .catch(err => console.log(err))
  }
  const fetchColumns = () => {
    client.getColumns()
        .then(res => setColumns(res.data))
        .catch(err => console.log(err))
  }
  const fetchColumnOrder = () => {
    client.getColumnOrder()
        .then(res => setColumnOrder(res.data[0]["column"]))
        .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchCards()
    fetchColumns()
    fetchColumnOrder()
  }, [])

  const onDragEnd = result => {
    const {destination, source, draggableId, type} = result

    //If there is no destination
    if (!destination) {
      return
    }

    //If source and destination is the same
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    //If you"re dragging columns
    if (type === "column") {
      const newColumnOrder = [...columnOrder]
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)
      client.setColumnOrder(newColumnOrder)
      setColumnOrder(newColumnOrder)
      return
    }

    //Anything below this happens if you"re dragging cards
    const [start] = columns.filter(column => column.id === source.droppableId)
    const [finish] = columns.filter(column => column.id === destination.droppableId)

    //If dropped inside the same column
    if (start === finish) {
      const newCardIds = Array.from(start.cardIds)
      newCardIds.splice(source.index, 1)
      newCardIds.splice(destination.index, 0, draggableId)

      let newColumn = [...columns]
      const index = newColumn.findIndex(x => x.id === start.id)
      newColumn[index].cardIds = newCardIds
      client.pushCardMappingsToColumn(columns[index].id, newCardIds)
      setColumns(newColumn)
      return
    }

    //If dropped in a different column
    const startCardIds = Array.from(start.cardIds)
    startCardIds.splice(source.index, 1)
    const newStart = {
      ...start,
      cardIds: startCardIds
    }

    const finishCardIds = Array.from(finish.cardIds)
    finishCardIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      cardIds: finishCardIds
    }

    let newColumn = [...columns]
    const newStartIndex = newColumn.findIndex(col => col.id === newStart.id)
    const newFinishIndex = newColumn.findIndex(col => col.id === newFinish.id)
    newColumn[newStartIndex] = newStart
    newColumn[newFinishIndex] = newFinish

    client.pushCardMappingsToColumn(newColumn[newStartIndex].id, newStart.cardIds)
    client.pushCardMappingsToColumn(newColumn[newFinishIndex].id, newFinish.cardIds)

    setColumns(newColumn)
  }

  if (cards?.length === 0 || columnOrder?.length === 0 || columns?.length === 0)
    return (<span>Loading...</span>)

  return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Nav createColumnState={createColumnState}/>
        <div className="board">
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {(provided) => (
                <div className="app-container"
                     {...provided.droppableProps}
                     ref={provided.innerRef}>
                  {columnOrder.map((id, index) => {
                    const [column] = columns.filter(col => col?.id === id)
                    const myCards = column?.cardIds
                        .map(cardId => {
                          const [card] = cards.filter(card => card?.id === cardId)
                          return card
                        })

                    return <Column key={column?.id}
                                   updateCardStateAfterEdit={editCardState}
                                   createCardState={createCardState}
                                   column={column} cards={myCards} index={index}
                                   deleteCardFromState={deleteCardFromState}
                                   markCardAsDoneState={markCardAsDoneState}
                    />
                  })}
                  {provided.placeholder}
                </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
  )
}

export default App