import { useRef, useState } from 'react';

interface Props {
  onAddTodo: (title: string) => void;
  setCurrentInputElement: (input: HTMLInputElement | null) => void;
}

export const TodoInput: React.FC<Props> = ({
  onAddTodo,
  setCurrentInputElement: setInputElement,
}) => {
  const inputElement = useRef<HTMLInputElement>(null);
  const [isRequestPending, setIsRequestPending] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInputElement(inputElement.current);

    const inputText = inputElement.current?.value.trim() || '';

    try {
      setIsRequestPending(true);
      await onAddTodo(inputText);

      if (inputElement.current) {
        inputElement.current.value = '';
      }
    } catch {
    } finally {
      setIsRequestPending(false);
    }
  };

  const onClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    setInputElement(event.currentTarget);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onClick={onClick}
          disabled={isRequestPending}
          ref={inputElement}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </>
  );
};
