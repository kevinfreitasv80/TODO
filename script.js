const API = "http://localhost:3000/tasks";

let tarefas = [];

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");

let filtroAtual = "todas";

async function carregarTarefas() {

    const resposta = await fetch(API);

    tarefas = await resposta.json();

    renderizarTarefas();

}

async function adicionarTarefa(){

    const texto = taskInput.value.trim();

    if(!texto){
        alert("Digite uma tarefa");
        return;
    }

    await fetch(API,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            texto
        })
    });

    taskInput.value="";

    carregarTarefas();

}

async function removerTarefa(id){

    await fetch(`${API}/${id}`,{
        method:"DELETE"
    });

    carregarTarefas();

}

async function toggleConcluida(id){

    const tarefa = tarefas.find(t=>t.id===id);

    tarefa.concluida=!tarefa.concluida;

    await fetch(`${API}/${id}`,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(tarefa)

    });

    carregarTarefas();

}

function renderizarTarefas(){

    taskList.innerHTML="";

    let lista= tarefas;

    if(filtroAtual==="ativas")
        lista = tarefas.filter(t=>!t.concluida);

    if(filtroAtual==="concluidas")
        lista = tarefas.filter(t=>t.concluida);

    lista.forEach(tarefa=>{

        const li=document.createElement("li");

        li.className="task-item";

        if(tarefa.concluida)
            li.classList.add("concluida");

        const checkbox=document.createElement("input");

        checkbox.type="checkbox";

        checkbox.checked=tarefa.concluida;

        checkbox.onclick=()=>toggleConcluida(tarefa.id);

        const span=document.createElement("span");

        span.textContent=tarefa.texto;

        span.className="task-text";

        const btn=document.createElement("button");

        btn.textContent="X";

        btn.className="remove-btn";

        btn.onclick=()=>removerTarefa(tarefa.id);

        li.appendChild(checkbox);

        li.appendChild(span);

        li.appendChild(btn);

        taskList.appendChild(li);

    });

}

addBtn.onclick=adicionarTarefa;

taskInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter")
        adicionarTarefa();

});

filterBtns.forEach(btn=>{

    btn.onclick=()=>{

        filtroAtual=btn.dataset.filter;

        filterBtns.forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

        renderizarTarefas();

    }

});

carregarTarefas();