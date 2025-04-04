/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  onRemoveItem?: (todo: Todo) => void;
  onUpdateTodo?: (todo: Todo) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemoveItem = () => {},
  onUpdateTodo = () => {},
  isLoading,
}) => {
  // const inputElement = useRef<HTMLInputElement>(null);
  // const [isUpdating, setIsUpdating] = useState(false);

  const handleOnChangeCheckBox = () => {
    const newTodo = { ...todo };

    newTodo.completed = !todo.completed;
    onUpdateTodo(newTodo);
  };

  // const handleOnDoubleClick = () => {
  //   setIsUpdating(true);
  // };

  // const handleInputBlur = () => {
  //   setIsUpdating(false);
  //   onUpdateTodo(newTodo);
  // };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          onClick={() => handleOnChangeCheckBox()}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {/* {isUpdating ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      ) : ( */}
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      {/* )} */}

      <button
        onClick={() => onRemoveItem(todo)}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
