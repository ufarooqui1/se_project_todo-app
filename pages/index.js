import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";

const addTodoButton = document.querySelector(".button_action_add");
const addTodoForm = document.forms["add-todo-form"];

const todoCounter = new TodoCounter(initialTodos, ".counter__text");

function handleCheck(completed) {
  todoCounter.updateCompleted(completed);
}

function handleDelete(completed) {
  if (completed) {
    todoCounter.updateCompleted(false);
  }
  todoCounter.updateTotal(false);
}

const section = new Section({
  items: initialTodos,
  renderer: (item) => {
    const todo = new Todo(item, "#todo-template", handleCheck, handleDelete);
    section.addItem(todo.getView());
  },
  containerSelector: ".todos__list",
});

section.renderItems();

const addTodoPopup = new PopupWithForm({
  popupSelector: "#add-todo-popup",

  handleFormSubmit: (inputValues) => {
    const { name, date } = inputValues;

    // Create a date object and adjust for timezone
    const parsedDate = new Date(date);
    parsedDate.setMinutes(
      parsedDate.getMinutes() + parsedDate.getTimezoneOffset()
    );

    const id = uuidv4();
    const values = { name, date: parsedDate, id };

    const todoElement = new Todo(
      values,
      "#todo-template",
      handleCheck,
      handleDelete
    ).getView();

    section.addItem(todoElement);
    todoCounter.updateTotal(true);

    newFormValidator.resetValidation();
    addTodoPopup.close();
  },
});
addTodoPopup.setEventListeners();

addTodoButton.addEventListener("click", () => {
  addTodoPopup.open();
});

const newFormValidator = new FormValidator(addTodoForm, validationConfig);
newFormValidator.enableValidation();
