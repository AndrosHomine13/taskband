const addBtn = document.getElementById("addTask");
const taskNameInput = document.getElementById("taskName");
const categorySelect = document.getElementById("categorySelect");
const pulsera = document.getElementById("pulsera");
const taskList = document.getElementById("taskList");

let maxTask = 5;
let currentTask = [];

const categoryColors = {
    urgent: "red",
    personal: "blue",
    study: "green"
};

const categoryNames = {
    urgent: "Urgente",
    personal: "Personal",
    study: "Estudio"
}

addBtn.addEventListener("click", () => {
    const name = taskNameInput.value.trim();
    const category = categorySelect.value;

    if (!name || !category) {
        alert("Por favor escribe una tarea y selecciona una categoría.");
        return;
    }

    if (currentTask.length >= maxTask) {
        alert("Ya alcanzaste el máximo de 5 tareas.");
        return;
    }

    const color = categoryColors[category];
    const label = categoryNames[category];
    const task = { name, color, label };
    currentTask.push(task);

    //Crear tarea en la lista
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.innerHTML = `
        <span>${name} (${label})</span>
        <button class="complete-btn">Hecho</button>
    `;
    taskList.appendChild(taskDiv);

    //Bead
    const bead = document.createElement("div");
    bead.classList.add("bead");
    bead.style.background = color;
    bead.setAttribute("draggable", "true");
    bead.setAttribute("data-name", name);
    pulsera.appendChild(bead);

    taskNameInput.value = "";
    categorySelect.value = "";

    // Completar tarea
    const completeBtn = taskDiv.querySelector(".complete-btn");
    completeBtn.addEventListener("click", () => {
        bead.classList.add("completed");

        setTimeout(() => {
            bead.style.transform = "translateY(0) scale(0)";
            bead.style.opacity = "0";
        }, 1000);

        setTimeout(() => {
            bead.remove();
            taskDiv.remove();
            currentTask = currentTask.filter(t => t.name !== name)
        }, 1800);
    });

    // Arrastrar y cambiar posición
    bead.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", bead.dataset.name);
        bead.style.opacity = "0.5";
    })

    bead.addEventListener("dragend", () => {
        bead.style.opacity = "1";
    });

    pulsera.addEventListener("dragover", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".bead[style*='opacity: 0.5']");
        const afterElement = getDragAfterElement(pulsera, e.clientX);
        if (afterElement == null) {
            pulsera.appendChild(dragging);
        } else {
            pulsera.insertBefore(dragging, afterElement);
        }
    });

    function getDragAfterElement(container, x) {
        const draggableElements = [...container.querySelectorAll(".bead:not([style*='opacity: 0.5']")];
        return draggableElements.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = x - box.left - box.width / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            { offset: Number.NEGATIVE_INFINITY }
        ).element;
    }
});