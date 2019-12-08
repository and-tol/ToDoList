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
  const listContainer = document.querySelector('.tasks-list-section .list-group');

  const form = document.forms['addTask'];
  const formSection = document.querySelector('.form-section');
  const inputTitle = form.elements['title'];
  const inputBody = form.elements['body'];
  // counts of "li"
  const listLi = document.querySelector('.list-group');

  // test on empty array == non tasks
  isNoTasks(objOfTasks);

  // Events
  form.addEventListener('submit', onFormSubmitHandler);
  listContainer.addEventListener('click', onDeleteHandler);
  listContainer.addEventListener('click', onCompleteTaskHandler);

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
  }

  function listItemTemplate({ _id, title, body, completed } = {}) {
    const li = document.createElement('li');

    li.classList.add('list-group-item', 'd-flex', 'align-items-center', 'flex-wrap', 'mt-2');
    li.setAttribute('data-task-id', _id);

    const span = document.createElement('span');
    span.textContent = title;
    span.style.fontWeight = 'bold';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete task';
    deleteBtn.classList.add('button', 'is-danger', 'is-rounded', 'ml-auto', 'delete-btn');

    const article = document.createElement('p');
    article.textContent = body;
    article.classList.add('mt-2', 'w-100');
    // изменить цвет текста, если задача выполнена
    if (completed) {
      article.classList.add('has-text-success');
    }

    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Complete task';
    completeBtn.classList.add('button', 'is-success', 'is-rounded', 'is-pulled-right', 'complete-btn');

    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.appendChild(article);
    li.appendChild(completeBtn);

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

      completeTask(id);
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

    // isNoTasks(objOfTasks);
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
    const length = Object.keys(arrOfTasks).length;

    if (!length) {
      renderNoTasks();
      // layoutNoTasks();
    }
    removeNoTasks();
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

  function removeNoTasks() {
    // layoutNoTasks().parentNode.removeChild(layoutNoTasks());
    // const body = document.querySelector('body');
    // const noTasks = body.querySelector('.no-tasks');
    // return noTasks;
  }
  console.log(removeNoTasks());

  console.log('objOfTasks', objOfTasks);
})(tasks);
