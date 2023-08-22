class AgregarTurno {
  constructor() {
    this.nombre = document.getElementById("nombreInput");
    this.numCelular = document.getElementById("numTelInput");
    this.motivo = document.getElementById("motivoInput");
    this.fecha = document.getElementById("fechaInput");
    this.horario = document.getElementById("horaInput");
    this.contenedorTurnos = this.cargarLocalStorage();
    this.enviarTurnos();
  }

  agregarTurno(e) {
    e.preventDefault();
    const DateTime = luxon.DateTime;
    const obtenerFecha = luxon.DateTime.fromISO(this.fecha.value);
    let fechaParseada = obtenerFecha.setLocale("es").toFormat("dd-LLLL");
    if (
      this.nombre.value.trim() === "" ||
      fechaParseada.trim() === "" ||
      this.horario.value.trim() === "" ||
      this.motivo.value.trim() === "---" ||
      this.numCelular.value.trim() === ""
    ) {
      this.swalFireError("Hay campos vacios!");
      return;
    } else if (
      this.contenedorTurnos.some(
        (turno) =>
          turno.fecha == fechaParseada && turno.hora == this.horario.value
      )
    ) {
      this.swalFireError("Ya hay un turno asignado en este dia y horario!");
      return;
    } else {
      this.contenedorTurnos.push({
        nombre: this.nombre.value,
        celular: this.numCelular.value,
        motivo: this.motivo.value,
        fecha: fechaParseada,
        hora: this.horario.value,
      });
      Toastify({
        text: "Turno guardado con exito!",
        duration: 2000,
        style: {
          background: "#2ECC71",
        },
        offset: {
          y: 70,
        },
      }).showToast();
      this.guardarStorage(this.contenedorTurnos);
      this.nombre.value = "";
      this.fecha.value = "";
      this.horario.value = "";
      this.motivo.value = "---";
      this.numCelular.value = "";
    }
  }

  swalFireError(mensajeDeError) {
    Swal.fire({
      title: "Error!",
      text: mensajeDeError,
      icon: "error",
    });
  }

  cargarLocalStorage() {
    const turnos_en_JSON = localStorage.getItem("listaDeTurnos");
    return turnos_en_JSON ? JSON.parse(turnos_en_JSON) : [];
  }

  guardarStorage(turnos) {
    let turnos_en_JSON = JSON.stringify(turnos);
    localStorage.setItem("listaDeTurnos", turnos_en_JSON);
  }

  enviarTurnos() {
    let btnEnviar = document.getElementById("enviarTurno");
    btnEnviar.addEventListener("click", (e) => {
      this.agregarTurno(e);
    });
  }
}

const agregadoDeTurnos = new AgregarTurno();
