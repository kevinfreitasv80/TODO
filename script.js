// Array para armazenar as tarefas
let tarefas = [];

// Seletores
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");

// Controle do filtro atual
let filtroAtual = "todas";

// Carregar tarefas do localStorage
function carregarTarefas() {
  const tarefasSalvas = localStorage.getItem("tarefas");

  if (tarefasSalvas) {
    tarefas = JSON.parse(tarefasSalvas);
  }
}

// Salvar tarefas no localStorage
function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Adicionar tarefa
function adicionarTarefa() {
  const texto = taskInput.value.trim();

  if (texto === "") {
    alert("Digite uma tarefa!");
    return;
  }

  const novaTarefa = {
    id: Date.now(),
    texto: texto,
    concluida: false,
  };

  tarefas.push(novaTarefa);
  salvarTarefas();

  taskInput.value = "";
  renderizarTarefas();
}

// Renderizar tarefas
function renderizarTarefas() {
  taskList.innerHTML = "";

  let tarefasFiltradas = tarefas;

  if (filtroAtual === "ativas") {
    tarefasFiltradas = tarefas.filter((tarefa) => !tarefa.concluida);
  }

  if (filtroAtual === "concluidas") {
    tarefasFiltradas = tarefas.filter((tarefa) => tarefa.concluida);
  }

  tarefasFiltradas.forEach((tarefa) => {
    const li = document.createElement("li");
    li.classList.add("task-item");

    if (tarefa.concluida) {
      li.classList.add("concluida");
    }

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefa.concluida;

    checkbox.addEventListener("click", () => {
      toggleConcluida(tarefa.id);
    });

    // Texto
    const span = document.createElement("span");
    span.textContent = tarefa.texto;
    span.classList.add("task-text");

    // Botão remover
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.classList.add("remove-btn");

    removeBtn.addEventListener("click", () => {
      removerTarefa(tarefa.id);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(removeBtn);

    taskList.appendChild(li);
  });
}

// Remover tarefa
function removerTarefa(id) {
  tarefas = tarefas.filter((tarefa) => tarefa.id !== id);
  salvarTarefas();
  renderizarTarefas();
}

// Alternar conclusão
function toggleConcluida(id) {
  tarefas = tarefas.map((tarefa) => {
    if (tarefa.id === id) {
      return {
        ...tarefa,
        concluida: !tarefa.concluida,
      };
    }
    return tarefa;
  });

  salvarTarefas();
  renderizarTarefas();
}

// Clique no botão adicionar
addBtn.addEventListener("click", adicionarTarefa);

// Enter para adicionar
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    adicionarTarefa();
  }
});

// Filtros
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filtroAtual = btn.dataset.filter;

    filterBtns.forEach((botao) => {
      botao.classList.remove("active");
    });

    btn.classList.add("active");

    renderizarTarefas();
  });
});

// Inicialização
carregarTarefas();
renderizarTarefas();
