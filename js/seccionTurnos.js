class GestionDeTurnos {
  constructor() {
    this.contenedorTurnos = [];
    this.agregarLista = document.getElementById("turnosContainer");
    this.btnRellenar = document.getElementById("btnRellenarTabla");
    this.btnBorrarTodo = document.getElementById("borrarTodo");
    this.inputBuscador = document.getElementById("buscadorTurnos");
    this.motivoBuscador = document.getElementById("motivoBuscador");
    this.buscadorFechas = document.getElementById("buscadorFechas");
    this.iniciar();
  }

  iniciar() {
    this.mostrarTurno();
    this.buscarPorNombre();
    this.buscarPorMotivo();
    this.buscarPorFecha();
    this.btnRellenar.addEventListener("click", () => this.rellenarTabla());
    this.btnBorrarTodo.addEventListener("click", () => this.eliminarTodos());
  }

  async mostrarTurno() {
    this.contenedorTurnos = await this.extraerStorage();
    this.renderizarTurnos();
  }

  async extraerStorage() {
    const listaTurnosJSON = localStorage.getItem("listaDeTurnos");
    return listaTurnosJSON ? JSON.parse(listaTurnosJSON) : [];
  }

  async guardarStorage() {
    try {
      const turnos_en_JSON = JSON.stringify(this.contenedorTurnos);
      localStorage.setItem("listaDeTurnos", turnos_en_JSON);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async eliminarTurno(turnoParaEliminar) {
    try {
      const i = this.contenedorTurnos.indexOf(turnoParaEliminar);
      if (i !== -1) {
        this.contenedorTurnos.splice(i, 1);
        await this.guardarStorage();
        this.renderizarTurnos();
        this.showToastRojo(`Turno de ${turnoParaEliminar.nombre} eliminado`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async eliminarTodos() {
    try {
      this.contenedorTurnos = [];
      localStorage.clear();
      this.renderizarTurnos();
      this.showToastRojo("Todos los turnos eliminados con exito!");
    } catch (error) {
      console.error("Error al eliminar todos los turnos:", error);
    }
  }

  showToastRojo(mensaje) {
    Toastify({
      text: mensaje,
      duration: 2000,
      style: {
        background: "#8B0000",
      },
      offset: {
        y: 70,
      },
    }).showToast();
  }

  swalFireCarga(mensaje) {
    let timerInterval;
    Swal.fire({
      title: mensaje,
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        timerInterval = setInterval(() => {
          Swal.getTimerLeft();
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
        this.renderizarTurnos();
      },
    });
  }

  renderizarTurnos() {
    this.agregarLista.innerHTML = "";
    this.contenedorTurnos.forEach((turno) => {
      this.agregarLista.innerHTML += `
        <tr>
          <td>${turno.nombre}</td>
          <td>${turno.celular}</td>
          <td>${turno.motivo}</td>
          <td>${turno.fecha}</td>
          <td>${turno.hora}</td>
          <td><button id="btnEliminarTd${turno.hora}" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button></td>
        </tr>`;
    });
    this.contenedorTurnos.forEach((turnoParaEliminar) => {
      const btnEliminar = document.getElementById(
        `btnEliminarTd${turnoParaEliminar.hora}`
      );
      btnEliminar.addEventListener("click", () => {
        this.eliminarTurno(turnoParaEliminar);
      });
    });
  }

  async rellenarTabla() {
    try {
      const resp = await fetch("../apiSimulada.json");
      const data = await resp.json();
      this.contenedorTurnos.push(...data);
      await this.guardarStorage();
      this.swalFireCarga("Cargando Turnos...");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  buscarPorNombre() {
    this.inputBuscador.addEventListener("input", () => {
      const valueInput = this.inputBuscador.value.toLowerCase();
      this.extraerStorage()
        .then((turnos) => {
          const encontrarNombres = turnos.filter((turno) =>
            turno.nombre.toLowerCase().includes(valueInput)
          );
          this.contenedorTurnos = encontrarNombres;
          this.renderizarTurnos();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }

  buscarPorMotivo() {
    this.motivoBuscador.addEventListener("change", () => {
      const valueMotivo = this.motivoBuscador.value;
      this.extraerStorage()
        .then((turnos) => {
          if (valueMotivo === "---") {
            this.contenedorTurnos = turnos;
          } else {
            const encontrarMotivos = turnos.filter((turno) =>
              turno.motivo.includes(valueMotivo)
            );
            this.contenedorTurnos = encontrarMotivos;
          }
          this.renderizarTurnos();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }

  buscarPorFecha() {
    this.buscadorFechas.addEventListener("input", () => {
      const DateTime = luxon.DateTime;
      const obtenerFecha = luxon.DateTime.fromISO(this.buscadorFechas.value);
      let fechaParseada = obtenerFecha.setLocale("es").toFormat("dd-LLLL");
      this.extraerStorage()
        .then((turnos) => {
          if (this.buscadorFechas.value === "") {
            this.contenedorTurnos = turnos;
          } else {
            const encontrarFechas = turnos.filter((turno) =>
              turno.fecha.includes(fechaParseada)
            );
            this.contenedorTurnos = encontrarFechas;
          }
          this.renderizarTurnos();
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    });
  }
}

const seccionTurnos = new GestionDeTurnos();
