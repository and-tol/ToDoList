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
  isNoTasks(tasks);

  // Events
  form.addEventListener('submit', onFormSubmitHandler);
  listContainer.addEventListener('click', onDeleteHandler);

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

  function listItemTemplate({ _id, title, body } = {}) {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'align-items-center', 'flex-wrap', 'mt-2');

    li.setAttribute('data-task-id', _id);

    const span = document.createElement('span');
    span.textContent = title;
    span.style.fontWeight = 'bold';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete task';
    deleteBtn.classList.add('btn', 'btn-danger', 'ml-auto', 'delete-btn');

    const article = document.createElement('p');
    article.textContent = body;
    article.classList.add('mt-2', 'w-100');

    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.appendChild(article);

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
    console.log('state', state);

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

  // ==== Delete task ==== //
  function deleteTask(id) {
    const { title } = objOfTasks[id];
    const isConfirm = confirm(`Вы уверены, что хотите удалить задачу: ${title}`);

    if (!isConfirm) {
      return isConfirm;
    }

    delete objOfTasks[id];

    return isConfirm;
  }

  function deleteTaskFromHtml(confirmed, element) {
    if (!confirmed) {
      return;
    }
    element.remove();
    console.log('tasks', tasks);
    isNoTasks(state);
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
    return (state = [...state, task]);
  }

  // ======= No Tasks ======= //
  // check that the array of tasks is empty
  function isNoTasks(arrOfTasks) {
    if (!arrOfTasks.length) {
      renderNoTasks();
    }
    // return null;
  }

  // layot conponent noTasks
  function layoutNoTasks() {
    const noTasks = `
      <div class="section">
        <div class="container">
          У вас нет актуальных задач
        </div>
      </div>
    `;

    return noTasks;
  }

  function renderNoTasks() {
    formSection.insertAdjacentHTML('afterend', layoutNoTasks());
  }
})(tasks);
