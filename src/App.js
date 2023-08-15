import { useEffect, useState } from "react";
import { PostItem } from "./PostItem";
import { useDebounce } from "./usehooks";
import { useSelector, useDispatch } from "react-redux";

function App() {
  const base = useSelector((state) => state.base);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
  const searchQuery = useSelector((state) => state.searchQuery);

  const valueSearch = useDebounce(searchQuery, 2000);

  const handleSearchQuery = ({ target }) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: target.value });
  };

  const sortTodoFlag = useSelector((state) => state.sortTodoFlag);

  const sortTodos = () => {
    dispatch({ type: "SET_SORT_TODO_FLAG" });
  };

  useEffect(() => {
    fetch(
      sortTodoFlag
        ? `${base}?_sort=title&_order=asc`
        : `${base}?q=${valueSearch}`
    )
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: "SET_DATA", payload: data });
      });
  }, [valueSearch, sortTodoFlag, data]);

  const createTask = async (payload) => {
    const response = await fetch(base, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const post = await response.json();

    const newPost = data;
    newPost.push(post);
    console.log(newPost);
    dispatch({
      type: "SET_DATA",
      payload: newPost,
    });
  };
  const removeTask = async (id) => {
    await fetch(`${base}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const newData = data.filter((post) => post.id !== id);

    dispatch({
      type: "SET_DATA",
      payload: newData,
    });
  };
  const updatePost = async (id, payload) => {
    const postItemIndex = data.findIndex((post) => post.id === id);
    const postItem = data.find((post) => post.id === id);

    if (postItemIndex !== -1) {
      const response = await fetch(`${base}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...postItem, title: payload }),
      });
      const updatePost = await response.json();

      const copyData = data.slice();
      copyData[postItemIndex] = updatePost;
      dispatch({
        type: "SET_DATA",
        payload: copyData,
      });
    }
  };

  return (
    <div>
      <input
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearchQuery}
      />
      <button onClick={sortTodos}>Сортировать</button>
      <ul>
        {data.length > 0 ? (
          <div>
            {data.map((post) => (
              <PostItem
                key={post.id}
                {...post}
                handleDelete={removeTask}
                handleUpdate={updatePost}
              />
            ))}
          </div>
        ) : (
          <h1>Постов нет</h1>
        )}
      </ul>
      <button
        onClick={() =>
          createTask({
            title: "Новая заметка",
            completed: false,
          })
        }
      >
        Отправить Пост
      </button>
    </div>
  );
}

export default App;
