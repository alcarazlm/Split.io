import React, { useState } from "react";
import './DndPage.css';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from 'uuid';
import { Card, Grid, Typography, Button } from '@material-ui/core';
import {
  HashRouter, Route, Switch, Redirect, Link
} from 'react-router-dom';

const itemsFromBackend = [
  { id: uuid(), content: "Cheeseburger" },
  { id: uuid(), content: "Cheese Pizza" },
  { id: uuid(), content: "Vanilla Ice Cream" },
  { id: uuid(), content: "French Fries" },
  { id: uuid(), content: "Chili Cheese Dog" },
  { id: uuid(), content: "Large Soda" },
];

const columnsFromBackend = {
  [uuid()]: {
    name: "Menu Items",
    items: itemsFromBackend
  },
  [uuid()]: {
    name: "Robert",
    items: []
  },
  [uuid()]: {
    name: "Luis",
    items: []
  },
  [uuid()]: {
    name: "Josh",
    items: []
  },
  [uuid()]: {
    name: "Karen",
    items: []
  }
};

const onDragEnd = (result, taskColumns, setTaskColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = taskColumns[source.droppableId];
    const destColumn = taskColumns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setTaskColumns({
      ...taskColumns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = taskColumns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setTaskColumns({
      ...taskColumns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};
function DndPage() {
  const [taskColumns, setTaskColumns] = useState(columnsFromBackend);
  return (
    <div className="context-wrapper">
      <DragDropContext
        onDragEnd={result => onDragEnd(result, taskColumns, setTaskColumns)}
      >
        {Object.entries(taskColumns).map(([columnId, column], index) => {
          return (
            <div className="column-wrap" key={columnId}>
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div className="dropbox"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "#eee"
                            : "#ddd"

                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={`${item.id}`}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div className="dragbox"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{

                                      backgroundColor: snapshot.isDragging
                                        ? "#929292"
                                        : "#454545",
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>

      <Link to="/pay" >
        <button> Let's Split! </button>
      </Link>

    </div >
  );
}

export default DndPage;