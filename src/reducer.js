export const initialState = {
  data: [""],
  searchQuery: "",
  sortTodoFlag: false,
  base: "http://localhost:3005/todos",
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: payload };
    case "SET_SORT_TODO_FLAG":
      return { ...state, sortTodoFlag: !state.sortTodoFlag };
    case "SET_DATA":
      return { ...state, data: payload };
    case "VALUE_SEARCH":
      return { ...state, base: payload };
    case "SORT":
      return { ...state, base: payload };

    default:
      return state;
  }
};
