import tasks from './tasks.js';

(function(arrOfTasks) {
  // state for new tasks
  let state = [];

  // array to object
  const objOfTasks = tasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  // Elements UI
  const listSection = document.querySelector('.tasks-list-section');
  const listContainer = document.querySelector('.list-group');

  const form = document.forms['addTask'];
  const formSection = document.querySelector('.form-section');
  const inputTitle = form.elements['title'];
  const inputBody = form.elements['body'];
  // counts of "li"
  const listLi = document.querySelector('.list-group');

  // interface buttons
  function isButton(btnName, btnText, ...btnClass) {
    btnName = document.createElement('button');
    btnName.textContent = btnText;
    btnName.classList.add('button', ...btnClass);

    return btnName;
  }

  // test on empty array == non tasks
  isNoTasks(objOfTasks);

  // Events
  form.addEventListener('submit', onFormSubmitHandler);
  listContainer.addEventListener('click', onDeleteHandler);
  listContainer.addEventListener('click', onCompleteTaskHandler);

  // First render
  renderAllTasks(objOfTasks);

  function renderAllTasks(tasksList) {
    if (!tasksList) {
      console.error('Передайте список задач');
      return;
    }

    const fragment = document.createDocumentFragment();

    Object.values(tasksList).forEach(task => {
      const li = listItemTemplate(task);

      fragment.appendChild(li);
    });

    listContainer.appendChild(fragment);

    // add complete buttons
    makeCompleteButtons();
  }

  function listItemTemplate({ _id, title, body, completed } = {}) {
    const li = document.createElement('li');

    li.classList.add('list-group-item', 'd-flex', 'align-items-center', 'flex-wrap', 'mt-2');
    li.setAttribute('data-task-id', _id);

    const span = document.createElement('span');
    span.textContent = title;
    span.style.fontWeight = 'bold';

    const deleteBtn = isButton('deleteBtn', 'Delete task', 'is-danger', 'is-rounded', 'delete-btn');

    const article = document.createElement('p');
    article.textContent = body;
    article.classList.add('mt-2', 'w-100', 'task-body');

    // изменить цвет текста, если задача выполнена
    if (completed) {
      article.classList.add('has-text-success');
    }

    // const completeBtn = document.createElement('button');
    // completeBtn.textContent = 'Complete task';
    // completeBtn.classList.add('button', 'is-success', 'is-rounded', 'is-pulled-right', 'complete-btn');

    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.appendChild(article);
    // li.appendChild(completeBtn);
    li.appendChild(
      isButton('completeBtn', 'Complete task', 'is-success', 'is-rounded', 'is-pulled-right', 'complete-btn')
    );

    return li;
  }

  function onFormSubmitHandler(event) {
    event.preventDefault();

    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;

    if (!titleValue || !bodyValue) {
      alert('Введите задачу и её название');
      return;
    }

    const task = createNewTask(titleValue, bodyValue);

    setState(task);

    removeRenderedNoTasks();

    const listItem = listItemTemplate(task);
    listContainer.insertAdjacentElement('afterbegin', listItem);

    form.reset;
  }

  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      completed: false,
      _id: `task-${Math.random()}`,
    };

    objOfTasks[newTask._id] = newTask;

    return { ...newTask };
  }

  // ==== Mark task is completed ====
  function completeTask(id) {
    objOfTasks[id].completed = !objOfTasks[id].completed;
  }

  function onCompleteTaskHandler({ target }) {
    if (target.classList.contains('complete-btn')) {
      const parent = target.closest('[data-task-id]');
      const id = parent.dataset.taskId;
      const taskBody = parent.querySelector('.task-body');

      completeTask(id);

      objOfTasks[id].completed
        ? taskBody.setAttribute('style', 'color:#48c774!important')
        : taskBody.setAttribute('style', '');
    }
  }

  // ==== Delete task ==== //
  function deleteTask(id) {
    const { title } = objOfTasks[id];
    const isConfirm = confirm(`Вы уверены, что хотите удалить задачу: ${title}`);

    if (!isConfirm) {
      return isConfirm;
    }

    delete objOfTasks[id];

    isNoTasks(objOfTasks);

    return isConfirm;
  }

  function deleteTaskFromHtml(confirmed, element) {
    if (!confirmed) {
      return;
    }
    element.remove();
  }

  function onDeleteHandler({ target }) {
    if (target.classList.contains('delete-btn')) {
      const parent = target.closest('[data-task-id]');
      const id = parent.dataset.taskId;
      const confirmed = deleteTask(id);

      deleteTaskFromHtml(confirmed, parent);
    }
  }

  // ===== Work with state ===== //
  function setState(task) {
    const newObjOfTasks = { ...objOfTasks };

    return { objOfTasks: newObjOfTasks };
  }

  // ======= No Tasks ======= //
  // check that the array of tasks is empty
  function isNoTasks(arrOfTasks) {
    // determine how many properties in an object
    const length = Object.keys(arrOfTasks).length;

    if (length === 0) {
      renderNoTasks();
      // delete filed group complete buttons
      removeCompleteButtons();
    }
  }

  // layout component noTasks
  function layoutNoTasks() {
    const noTasks = document.createElement('div');
    noTasks.classList.add('section', 'no-tasks');
    const divContainer = `
      <div class="container">
        У вас нет задач
      </div>
    `;
    noTasks.insertAdjacentHTML('afterbegin', divContainer);

    return noTasks;
  }

  function renderNoTasks() {
    formSection.after(layoutNoTasks());
  }

  function removeRenderedNoTasks() {
    const body = document.querySelector('body');
    const noTasks = body.querySelector('.no-tasks');

    if (noTasks === null) {
      return;
    }
    noTasks.parentNode.removeChild(noTasks);

    // while (noTasks.length > 0) {
    //   noTasks[0].parentNode.removeChild(noTasks[0]);
    // }

    return noTasks;
  }

  // ===== Show complete or not incomplete tasks ==== //
  function layoutButtons() {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('container', 'show-complete-tasks');

    const buttonField = document.createElement('div');
    // buttonField.classList.add('field', 'is-grouped');
    buttonField.classList.add('field', 'is-grouped');

    buttonsContainer.appendChild(buttonField);

    const buttonComplete = isButton(
      'completeBtn',
      'Complete tasks',
      'is-success',
      'is-outlined',
      'is-rounded',
      'complete-btn'
    );
    const buttonIncomplete = isButton(
      'incompleteBtn',
      'Incomplete tasks',
      'is-info',
      'is-outlined',
      'is-rounded',
      'incomplete-btn'
    );

    buttonField.appendChild(buttonComplete);
    buttonField.appendChild(buttonIncomplete);

    buttonsContainer.appendChild(buttonField);

    return buttonsContainer;
  }

  function makeCompleteButtons() {
    listSection.prepend(layoutButtons());
  }

  function removeCompleteButtons() {
    const showCompleteTasks = listSection.querySelector('.show-complete-tasks');

    showCompleteTasks.parentNode.removeChild(showCompleteTasks);
  }

  console.log('objOfTasks', objOfTasks);
})(tasks);
