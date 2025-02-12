interface Board {
  columns: Map<TypedColumn, Column>;
}

type TypedColumn = "todo" | "inprogress" | "done";
interface Column {
  id: TypedColumn;
  todos: Todo[];
}
// defined this structure based on the response that you will get back from appwrite
interface Todo {
  $id: string;
  $createdAt: string;
  title: string;
  status: TypedColumn;
  image?: Image;
}
interface Image {
  bucketId: string;
  fieldId: string;
}
