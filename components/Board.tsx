"use client";

import React, { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { useBoardStore } from "@/store/BoardStore";
import Column from "./Column";

function Board() {
  const board = useBoardStore((state) => state.board);
  const getBoard = useBoardStore((state) => state.getBoard);
  const setBoardState = useBoardStore((state) => state.setBoardState);
  const updateTodoInDB = useBoardStore((state) => state.updateTodoInDB);

  useEffect(() => {
    getBoard();
  }, [getBoard]);
  console.log("yayyy", Array.from(board.columns.entries()));

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    console.log("destination", destination);
    console.log(source);
    console.log(type);

    //Check if the user draged the card outside of board
    if (!destination) return;

    //Handle a column drag
    if (type === "column") {
      //make an array from the board column entry so we are converting key value pairs to an array
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({ ...board, columns: rearrangedColumns });
    }

    //this step is needed as the indexes are stored as numbers 0,1,2... instead of IDs with the DND Library
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };
    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };
    console.log(startCol, "startCol");
    console.log(finishCol);
    //if for whatever reason we dont get the start col or finsh col then we basically return
    if (!startCol || !finishCol) return;
    //if we drag and drop at the same location the jsut return
    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      //same column task drag
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);
      setBoardState({ ...board, columns: newColumns });
    } else {
      //if task is dragged to another column
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });
      updateTodoInDB(todoMoved, finishCol.id);
      setBoardState({ ...board, columns: newColumns });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
