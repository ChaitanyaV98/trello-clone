import { databases } from "@/appwrite";

export const getTodosGroupedByColumn = async () => {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
  );
  const todos = data.documents;
  //DATA TRANSFORMATION, we r taking the array response and transform it into map
  //NOTE: acc denotes that accumulator function
  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }
    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $creatdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      //get the image if it exists on the todo
      ...(todo.image && { image: JSON.parse(todo.image) }),
    });
    return acc;
  }, new Map<TypedColumn, Column>());
  console.log("Transformed data structure", columns);
  //if columns does not have inprogress, todo or done, add them with empty todos so we wil be always have the map of three
  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];
  for (const columnType of columnTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  }
  console.log("columns", columns);

  //sort column by columnTypes
  const sortedColumns = new Map(
    //ways to get array of key value pairs in array format array
    //1. [...columns.entries]
    //2. Array.from(columns.entries()

    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  );

  //   console.log("sortedColumns", sortedColumns);

  const board: Board = {
    columns: sortedColumns,
  };
  //   console.log(board);
  return board;
};
