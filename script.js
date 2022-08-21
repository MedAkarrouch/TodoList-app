'use strict';

const clearAllBtn = document.querySelector('.options__clear-all');
const clearCompletedBtn = document.querySelector('.options__clear-completed');
const clearCompletedBtnMobile = document.querySelector(
  '.clear-completed-Mobile'
);
const clearAllBtnMobile = document.querySelector('.clear-all-Mobile');
const optionsRight = document.querySelector('.items');
const optionsLeft = document.querySelector('.options');
const note = document.querySelector('.todo__note');

const todoContent = document.querySelector('.todo__content');
const modeBtn = document.getElementById('mode');
const imgCon = document.querySelector('.img-container');
const checkBtns = document.querySelectorAll(
  '.todo__check:not(.todo__check--form)'
);
const list = document.querySelector('.todo__list');
const items = document.querySelectorAll('.todo__item');

const labelItemsNbr = document.querySelector('.items-nbr');
const labelItemsCompletedNbr = document.querySelector('.completed-nbr');
const labelItemsIncompletedNbr = document.querySelector('.incompleted--nbr');

const labelItemsNbrMobile = document.querySelector('.todo__left--nbr');
const labelItemsCompletedNbrMobile = document.querySelector(
  '.todo__completed--nbr'
);
const labelItemsIncompletedNbrMobile = document.querySelector(
  '.todo__incompleted--nbr'
);

const input = document.getElementById('input');
// display the saved mode
const displaymode = JSON.parse(localStorage.getItem('mode'));
if (!displaymode) {
  localStorage.setItem('mode', JSON.stringify('dark'));
} else if (displaymode === 'light') {
  document.documentElement.classList.add('light');
}

//functions
function displaylocalStorage(option = 'all') {
  list.innerHTML = '';
  const todosArr = localStorage.getItem('todos')
    ? JSON.parse(localStorage.getItem('todos'))
    : null;
  if (!todosArr) {
    removeUI();
    UpdateNumbers();
    return;
  }
  showUI();
  const todosFiltered =
    option === 'all' ? todosArr : todosArr.filter(todo => todo[option]);
  todosFiltered.forEach(todo => {
    const item = document.createElement('li');
    const attr = document.createAttribute('data-id');
    attr.value = todo.id;
    item.setAttributeNode(attr);
    const attrFilter = document.createAttribute('data-filter');
    attrFilter.value = todo.completed ? 'completed' : 'incompleted';
    item.setAttributeNode(attrFilter);

    item.classList = 'todo__item';
    item.draggable = true;
    const button = document.createElement('button');
    button.innerHTML = `<img src="images/icon-check.svg" alt="">`;
    button.classList = 'todo__check';
    todo.completed && button.classList.add('checked');
    item.innerHTML = `
            <p class="todo__text" contentEditable ="false">${todo.todo}</p>
            <div class="todo__icons">
            <ion-icon class="todo__edit" name="create-outline"></ion-icon>
            <ion-icon class="todo__cross" name="trash-outline"></ion-icon>
            </div>`;
    item.prepend(button);
    list.append(item);
  });
  UpdateNumbers();
}
displaylocalStorage();
function UpdateNumbers() {
  if (localStorage.getItem('todos')) {
    const todos = JSON.parse(localStorage.getItem('todos'));
    let nbr = 0,
      nbrC = 0,
      nbrI = 0;
    todos.forEach(todo => {
      labelItemsNbrMobile.textContent = labelItemsNbr.textContent = ++nbr;
      labelItemsCompletedNbrMobile.textContent =
        labelItemsCompletedNbr.textContent = todo.completed ? ++nbrC : nbrC;
      labelItemsIncompletedNbrMobile.textContent =
        labelItemsIncompletedNbr.textContent = todo.incompleted ? ++nbrI : nbrI;
    });
  } else {
    labelItemsNbrMobile.textContent =
      labelItemsCompletedNbrMobile.textContent =
      labelItemsIncompletedNbrMobile.textContent =
      labelItemsNbr.textContent =
      labelItemsCompletedNbr.textContent =
      labelItemsIncompletedNbr.textContent =
        0;
  }
}
function showUI() {
  optionsLeft.classList.add('show');
  optionsRight.classList.add('show');
  todoContent.classList.add('show');
  note.classList.add('show');
}
function removeUI() {
  optionsLeft.classList.remove('show');
  optionsRight.classList.remove('show');
  todoContent.classList.remove('show');
  note.classList.remove('show');
}
function clearAll(e) {
  e.preventDefault();
  localStorage.removeItem('todos');
  displaylocalStorage();
}

function clearCmpBtn(e) {
  e.preventDefault();
  let localArr = localStorage.getItem('todos')
    ? JSON.parse(localStorage.getItem('todos'))
    : null;
  localArr = localArr.filter(todo => todo.incompleted);
  if (localArr.length === 0) {
    localStorage.removeItem('todos');
  } else {
    localStorage.setItem('todos', JSON.stringify(localArr));
  }
  displaylocalStorage();
}

function create_AddTodo(value) {
  const itemsNbr = localStorage.getItem('todos')
    ? +JSON.parse(localStorage.getItem('todos'))[
        JSON.parse(localStorage.getItem('todos')).length - 1
      ].id + 1
    : 0;
  input.value = '';
  input.blur();
  // Add to Local Storage
  const obj = {
    id: itemsNbr,
    todo: value,
    completed: false,
    incompleted: true,
  };
  const storedArr = localStorage.getItem('todos')
    ? JSON.parse(localStorage.getItem('todos'))
    : [];
  storedArr.push(obj);
  localStorage.setItem('todos', JSON.stringify(storedArr));
  // ********************
  // ********
  const type = document.querySelector('.active')?.id;

  displaylocalStorage(type ? type : 'all');
}

// Event Handelers
input.addEventListener('keydown', e => {
  // checking if the Enter key is pressed
  if (e.key === 'Enter' && input.value) {
    const value = input.value;
    create_AddTodo(value);
  }
  //
});
// ************************************************
// color Mode
modeBtn.addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
  if (document.documentElement.classList.contains('light')) {
    localStorage.setItem('mode', JSON.stringify('light'));
  } else {
    localStorage.setItem('mode', JSON.stringify('dark'));
  }
});
// ***************************************
// Drag and Reorder Items
list.addEventListener('dragstart', e => {
  e.target.classList.add('dragging');
  if (document.documentElement.classList.contains('light'))
    e.target.classList.add('dragging-light');
  else e.target.classList.add('dragging-dark');
});
list.addEventListener('dragend', e => {
  e.target.classList.remove('dragging');
  e.target.classList.remove('dragging-light');
  e.target.classList.remove('dragging-dark');
});
list.addEventListener('dragenter', e => {
  e.preventDefault();
});
list.addEventListener('dragover', e => {
  e.preventDefault();
  // console.log('drag over');
  const afterEle = getAfterEle(e.clientY);
  const draggable = document.querySelector('.dragging');
  if (afterEle) {
    list.insertBefore(draggable, afterEle);
  } else {
    list.appendChild(draggable);
  }
});
function getAfterEle(y) {
  const elements = Array.from(
    document.querySelectorAll('.todo__item:not(.dragging)')
  );
  return elements.reduce(
    (closest, ele) => {
      const offset =
        y -
        (ele.getBoundingClientRect().y +
          ele.getBoundingClientRect().height / 2);
      if (offset < 0 && offset > closest.offset) {
        return { offset, ele };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY, ele: null }
  ).ele;
}
// ***************************************************************************************************
todoContent.addEventListener('click', e => {
  const classes = Array.from(e.target.classList);
  if (classes.includes('todo__filter')) {
    const id = e.target.id;
    list.innerHTML = '';
    // id=all
    document.querySelector('.active')?.classList.remove('active');
    e.target.classList.add('active');
    if (id === 'all') {
      displaylocalStorage();
      //
    }
    // id=completed
    if (id === 'completed') {
      const todosArr = localStorage.getItem('todos')
        ? JSON.parse(localStorage.getItem('todos'))
        : null;
      if (!todosArr) {
        return;
      }
      displaylocalStorage('completed');
    }
    // id=incompleted
    if (id === 'incompleted') {
      const todosArr = localStorage.getItem('todos')
        ? JSON.parse(localStorage.getItem('todos'))
        : null;
      if (!todosArr) {
        return;
      }
      displaylocalStorage('incompleted');
    }
    UpdateNumbers();
  }
  /*    ********************              */
  if (classes.includes('todo__cross')) {
    const ele = e.target.parentElement.parentElement;
    let arr = JSON.parse(localStorage.getItem('todos')).filter(
      todo => todo.id != ele.dataset.id
    );
    arr.length
      ? localStorage.setItem('todos', JSON.stringify(arr))
      : localStorage.removeItem('todos');
    displaylocalStorage();
  }
  // ******************
  if (classes.includes('todo__edit')) {
    const liEle = e.target.parentElement.parentElement;
    if (liEle.classList.contains('editing')) {
      liEle.classList.remove('editing');

      const id = liEle.dataset.id;
      const prg = liEle.querySelector('.todo__text');
      prg.contentEditable = false;
      prg.classList.remove('focus');
      prg.blur();

      let arr = JSON.parse(localStorage.getItem('todos')).map(todo => {
        if (todo.id == id) {
          todo.todo = prg.textContent;
        }
        return todo;
      });
      // console.log(prg.textContent);
      localStorage.setItem('todos', JSON.stringify(arr));
      displaylocalStorage();
    } else {
      liEle.classList.add('editing');
      const prg = liEle.querySelector('.todo__text');
      prg.contentEditable = true;
      prg.classList.add('focus');
      prg.focus();
      // The hardest one
      if (document.addEventListener('click', handle));
      function handle(e) {
        // console.log(e.target);
        if (
          e.target.classList[0] !== 'todo__edit' &&
          e.target.classList[1] !== 'focus'
        ) {
          liEle.classList.remove('editing');
          const id = liEle.dataset.id;
          let arr = JSON.parse(localStorage.getItem('todos')).map(todo => {
            if (todo.id == id) {
              todo.todo = prg.textContent;
            }
            return todo;
          });
          document.removeEventListener('click', handle);
          localStorage.setItem('todos', JSON.stringify(arr));
          displaylocalStorage();
        }
      }
    }
  }
  // ************************
  if (Array.from(e.target.parentElement.classList).includes('todo__check')) {
    const currentFilter = document.querySelector('.active');

    e.target.parentElement.classList.toggle('checked');
    const ele = e.target.parentElement.parentElement.dataset;

    ele.filter = ele.filter === 'incompleted' ? 'completed' : 'incompleted';
    if (localStorage.getItem('todos')) {
      let todos = JSON.parse(localStorage.getItem('todos'));
      todos = todos.map(todo => {
        if (ele.id == todo.id) {
          todo.completed = !todo.completed;
          todo.incompleted = !todo.incompleted;
        }
        return todo;
      });
      localStorage.setItem('todos', JSON.stringify(todos));
    }
    if (currentFilter) {
      displaylocalStorage(currentFilter.id);
    } else {
      displaylocalStorage();
    }

    UpdateNumbers();
  }
  if (classes.includes('todo__check')) {
    const currentFilter = document.querySelector('.active');
    // console.log(currentFilter.id);
    e.target.classList.toggle('checked');
    const ele = e.target.parentElement.dataset;
    ele.filter = ele.filter === 'incompleted' ? 'completed' : 'incompleted';
    if (localStorage.getItem('todos')) {
      let todos = JSON.parse(localStorage.getItem('todos'));
      todos = todos.map(todo => {
        if (ele.id == todo.id) {
          todo.completed = !todo.completed;
          todo.incompleted = !todo.incompleted;
        }
        return todo;
      });
      localStorage.setItem('todos', JSON.stringify(todos));
    }
    if (currentFilter) {
      displaylocalStorage(currentFilter.id);
    } else {
      displaylocalStorage();
    }
    UpdateNumbers();
  }
  /*    ********************              */
});

// CLEAR BTNS
// Desktop
clearAllBtn.addEventListener('click', clearAll);
clearCompletedBtn.addEventListener('click', clearCmpBtn);
// Mobile
clearAllBtnMobile.addEventListener('click', clearAll);
clearCompletedBtnMobile.addEventListener('click', clearCmpBtn);
