let cells = [],
  states = [],
  initialStates = [],
  finalStates = [],
  transitions = [],
  type = "",
  errorCount = 0;

/**
 * Compiles the current automaton.
 * this function is called everytime a change is
 * made in the drawing
 */
function compileAutomaton() {

  cells = editor.graph.getModel().cells;
  states = [];
  initialStates = [];
  finalStates = [];
  transitions = [];
  type = "Deterministic finite automaton";
  errorCount = 0;

  removePreviousMessages();

  for (const [key, cell] of Object.entries(cells)) {
    if (cell.style !== undefined)
      if (cell.style.includes("State")) 
        compileState(cell);
      else if (cell.style.includes("Transition")) 
        compileTransition(cell);
      else 
        continue;
    else 
        continue;
  }
  console.log(cells);
  updateCurrentAutomatonInfo();
}

/**
 * Removes the previous messages
 */
function removePreviousMessages() {
  document.getElementById("messages").textContent = "";
 }

/**
 * Compiles the current cell in the iteration
 * @param {mxCell} cell
 */
function compileState(cell) {

    if(cell.style.includes('FinalState'))
        finalStates.push(cell.value);
    else if(cell.style.includes('InitialState'))
        initialStates.push(cell.value);
   
    states.push(cell.value);

    if(cell.edges != null)
      for (let i = 0; i < cell.edges.length; i++) 
        for (let j = 0; j < cell.edges.length; j++)
            if(cell.edges[i].id != cell.edges[j].id && 
              cell.edges[i].value == cell.edges[j].value && 
              cell.edges[i].source == cell.id && 
              cell.edges[j].source == cell.id) 
              type = 'Nondeterministic finite automaton';
      
      
     
    // Adicionar erro caso o automato não tenha estado final

    // Adicionar erro caso o automato não tenha estado inicial

    // Adicionar erro caso exista algum estado inalcançável 

}

/**
 * Compiles the current transition in the iteration
 * @param {mxCell} cell
 */
function compileTransition(cell) {
    transitions.push(cell.value);

    if(cell.target == null || cell.source == null){
        createErrorMessage('Transition not connected to two states', cell.value);
        errorCount++;
    }
}

/**
 * Creates a error message to be show at the console
 * @param {string} text
 */
function createErrorMessage(text, name) {
  message = document.createElement("div");
  message.innerHTML =
    '<a href="#" class="list-group-item list-group-item-action py-3 lh-tight error-message">' +
    '<div class="d-flex w-100 align-items-center justify-content-between">' +
    '<strong class="mb-1"> '+
    name +
    "</strong>" +
    '<i style="color: #dc3545; font-size: larger;" class="bi bi-exclamation-triangle"></i>' +
    "</div>" +
    '<div class="col-10 mb-1 small">' +
    text +
    "</div>" +
    "</a>";
  document.getElementById("messages").appendChild(message.firstChild);
}


/**
 * Update the following information in front end:
 * Type, States, final states, initial states, transitions, errorCount
 */
function updateCurrentAutomatonInfo() {
  document.getElementById("type").textContent = type;
  document.getElementById("states").textContent = states;
  document.getElementById("transitions").textContent = transitions;
  document.getElementById("initial-states").textContent = initialStates;
  document.getElementById("final-states").textContent = finalStates;
  document.getElementById("errors-count").textContent = errorCount;
  if(errorCount == 0){
      message = document.createElement("div");
      message.innerHTML = '<a href="#" class="list-group-item list-group-item-action py-3 lh-tight error-message" style="border-color: #198754;"><div style="text-align: center;" class="w-100 align-items-center justify-content-between"><strong class="mb-1">None <i style="color: #198754; font-size: larger;" class="bi bi-check"></i></strong></div></a>';
      document.getElementById("messages").appendChild(message);
      document.getElementById('errors').style.color = '#198754';
    }
  else
    document.getElementById('errors').style.color = '#dc3545';
}
