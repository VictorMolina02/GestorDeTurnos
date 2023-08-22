class AgregarTurno {
  constructor() {
    this.nombre = document.getElementById("nombreInput");
    this.numCelular = document.getElementById("numTelInput");
    this.motivo = document.getElementById("motivoInput");
    this.fecha = document.getElementById("fechaInput");
    this.horario = document.getElementById("horaInput");
    this.contenedorTurnos = this.cargarLocalStorage();
    this.mantenerInfo();
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
  mantenerInfo() {
    let valoresAlmacenados = {
      nombre: localStorage.getItem("valueNombre"),
      numCelular: localStorage.getItem("valueNumCelular"),
      motivo: localStorage.getItem("valueMotivo"),
      fecha: localStorage.getItem("valueFecha"),
      horario: localStorage.getItem("valueHorario"),
    };
    if (valoresAlmacenados.nombre) {
      this.nombre.value = valoresAlmacenados.nombre;
    }
    if (valoresAlmacenados.numCelular) {
      this.numCelular.value = valoresAlmacenados.numCelular;
    }
    if (valoresAlmacenados.motivo) {
      this.motivo.value = valoresAlmacenados.motivo;
    }
    if (valoresAlmacenados.fecha) {
      this.fecha.value = valoresAlmacenados.fecha;
    }
    if (valoresAlmacenados.horario) {
      this.horario.value = valoresAlmacenados.horario;
    }
    this.nombre.addEventListener("input", () => {
      localStorage.setItem("valueNombre", this.nombre.value);
    });
    this.numCelular.addEventListener("input", () => {
      localStorage.setItem("valueNumCelular", this.numCelular.value);
    });
    this.motivo.addEventListener("input", () => {
      localStorage.setItem("valueMotivo", this.motivo.value);
    });
    this.fecha.addEventListener("input", () => {
      localStorage.setItem("valueFecha", this.fecha.value);
    });
    this.horario.addEventListener("input", () => {
      localStorage.setItem("valueHorario", this.horario.value);
    });
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
      localStorage.removeItem("valueNombre");
      localStorage.removeItem("valueNumCelular");
      localStorage.removeItem("valueMotivo");
      localStorage.removeItem("valueFecha");
      localStorage.removeItem("valueHorario");
    });
  }
}

const agregadoDeTurnos = new AgregarTurno();
