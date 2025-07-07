class Todo {
  constructor(data, selector, handleCheck, handleDelete) {
    this._data = data;
    this._completed = data.completed || false;
    this._name = data.name;
    this._date = data.date;
    this._id = data.id || crypto.randomUUID();
    this._selector = selector;
    this._handleCheck = handleCheck;
    this._handleDelete = handleDelete;
  }

  _setEventListeners() {
    if (this._todoDeleteBtn) {
      this._todoDeleteBtn.addEventListener("click", () => {
        this._handleDelete(this._completed);
        this._remove();
      });
    }

    this._todoCheckboxEl.addEventListener("click", () => {
      this._toggleCompleted();
    });
  }

  _generateCheckboxEl() {
    this._todoCheckboxEl = this._todoElement.querySelector(".todo__completed");
    this._todoLabel = this._todoElement.querySelector(".todo__label");

    this._todoCheckboxEl.checked = this._completed;
    this._todoCheckboxEl.id = `todo-${this._id}`;
    this._todoLabel.setAttribute("for", `todo-${this._id}`);
  }

  _toggleCompleted() {
    this._completed = !this._completed;
    this._handleCheck(this._completed);
  }

  _remove() {
    this._todoElement.remove();
  }

  getView() {
    this._templateElement = document.querySelector(this._selector);
    if (!this._templateElement) {
      console.error("Template not found:", this._selector);
      return document.createElement("li");
    }

    this._todoElement = this._templateElement.content
      .querySelector(".todo")
      .cloneNode(true);

    const todoNameEl = this._todoElement.querySelector(".todo__name");
    const todoDate = this._todoElement.querySelector(".todo__date");
    this._todoDeleteBtn = this._todoElement.querySelector(".todo__delete-btn");

    todoNameEl.textContent = this._name;

    const dueDate = new Date(this._date);
    if (!isNaN(dueDate)) {
      todoDate.textContent = `Due: ${dueDate.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}`;
    } else {
      todoDate.textContent = "";
    }

    this._generateCheckboxEl();
    this._setEventListeners();

    return this._todoElement;
  }
}

export default Todo;
