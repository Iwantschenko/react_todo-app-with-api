/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { useEffect, useRef, useState } from 'react';

import './styles/todoapp.scss';

import { Todo } from './types/Todo';

import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { FilterType } from './types/FilterType';
import { todosService, USER_ID } from './api/todos';

import { TodoItem } from './components/TodoItem';
import { ErrorMessages } from './types/ErrorMessages';
import classNames from 'classnames';
import { TodoInput } from './components/TodoInput/TodoInput';

export const App = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);

  const currentInputElementRef = useRef<HTMLInputElement | null>(null);
  const [currentFilter, setCurrentFilter] = useState(FilterType.All);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null);
  const [isRemoveAllComplited, setIsRemoveAllComplited] = useState(false);

  const getFilteredTodos = () => {
    switch (currentFilter) {
      case FilterType.Active:
        return todoList.filter(todo => todo.completed === false);
      case FilterType.Completed:
        return todoList.filter(todo => todo.completed === true);
      default:
        return todoList;
    }
  };

  const getActiveTodoCount = () => {
    return todoList.filter(todo => todo.completed === false).length;
  };

  const hasComplitedTodos = () => {
    if (todoList.length === 0) {
      return true;
    }

    return todoList.some(todo => todo.completed === true);
  };

  const isToggleAll = () => {
    return todoList.every(todo => todo.completed);
  };

  const handleSetInputElement = (newInputElement: HTMLInputElement | null) => {
    currentInputElementRef.current = newInputElement;
  };

  const callFocus = () => {
    setTimeout(() => {
      currentInputElementRef.current?.focus();
    }, 0);
  };

  const onAddTodo = async (title: string) => {
    if (title === '') {
      setErrorMessage(ErrorMessages.emptyTitleError);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title: title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({ ...newTodo });

    try {
      const requestResult = await todosService.add(newTodo);

      setTempTodo(null);
      setTodoList(current => [...current, requestResult]);
    } catch {
      setTempTodo(null);
      throw new Error();
    } finally {
      callFocus();
    }
  };

  const onRemoveTodo = async (todoToRemove: Todo) => {
    try {
      await todosService.remove(todoToRemove);
      setTodoList(prev => prev.filter(todo => todo.id !== todoToRemove.id));
    } catch {
      setErrorMessage(ErrorMessages.deleteError);
    }
  };

  const removeAllComplited = async () => {
    setIsRemoveAllComplited(true);
    const complitedTodo = todoList.filter(todo => todo.completed);

    await Promise.allSettled(complitedTodo.map(todo => onRemoveTodo(todo)));

    setIsRemoveAllComplited(false);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await todosService.getAll();

        setTodoList(todos);
      } catch {
        setErrorMessage(ErrorMessages.getError);
      }
    };

    fetchTodos();
    callFocus();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: isToggleAll(),
            })}
            data-cy="ToggleAllButton"
          />
          <TodoInput
            onAddTodo={onAddTodo}
            setCurrentInputElement={handleSetInputElement}
          />
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          {todoList && (
            <TodoList
              todoList={getFilteredTodos()}
              onRemoveItem={onRemoveTodo}
              isRemoveAllComplited={isRemoveAllComplited}
            />
          )}
          {tempTodo && (
            <TodoItem key={tempTodo.id} todo={tempTodo} requestType="POST" />
          )}
        </section>

        {todoList.length !== 0 && (
          <>
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {getActiveTodoCount() + ' items left'}
              </span>
              <TodoFilter
                selectedFilter={currentFilter}
                onFilterChange={newFilter => setCurrentFilter(newFilter)}
              />
              <button
                onClick={() => removeAllComplited()}
                type="button"
                className="todoapp__clear-completed"
                disabled={!hasComplitedTodos()}
                data-cy="ClearCompletedButton"
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        removeError={() => setErrorMessage(null)}
      />
    </div>
  );
};
