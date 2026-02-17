<template>
  <div class="home-view">
    <div class="card">
      <h2>Verificador de Afectados</h2>
      <p class="subtitle">Compruebe si su vehículo está dentro del periodo del Cártel de Coches (2006-2013)</p>

      <div class="form-container">
        <SelectField id="marca" label="Marca del coche" v-model="form.marca" :options="marcasOptions" placeholder="Seleccione la marca" />

        <div class="grid-2">
          <SelectField id="anio" label="Año de compra" v-model="form.anio" :options="aniosOptions" placeholder="Año" />

          <SelectField id="mes" label="Mes de compra" v-model="form.mes" :options="mesesOptions" placeholder="Mes" />
        </div>

        <ButtonPrimary text="Comprobar Vehículo" @click="verificar" style="margin-top: 1rem" />
      </div>

      <div v-if="resultado !== null" class="result-box" :class="resultado.clase">
        <h3>{{ resultado.titulo }}</h3>
        <p>{{ resultado.mensaje }}</p>

        <ButtonPrimary v-if="resultado.esAfectado" text="Iniciar Registro de Reclamación" @click="irARegistro" class="btn-register" />
      </div>
    </div>

    <ModalConfirm
      :show="showModal"
      message="Vas a ser redirigido al formulario de registro para introducir tus datos personales y los del vehículo. ¿Deseas continuar?"
      @confirm-result="handleModalResult"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import SelectField from "../components/reutilizables/SelectField.vue";
import ButtonPrimary from "../components/reutilizables/ButtonPrimary.vue";
import ModalConfirm from "../components/reutilizables/ModalConfirm.vue";

const router = useRouter();
const showModal = ref(false);
const resultado = ref(null);

const form = reactive({
  marca: "",
  anio: "",
  mes: "",
});

const marcasOptions = [
  { value: "porsche", label: "Porsche" },
  { value: "seat", label: "Seat" },
  { value: "volkswagen", label: "Volkswagen" },
  { value: "audi", label: "Audi" },
  { value: "skoda", label: "Skoda" },
  { value: "hyundai", label: "Hyundai" },
  { value: "chevrolet", label: "Chevrolet" },
  { value: "nissan", label: "Nissan" },
  { value: "mercedes", label: "Mercedes Benz" },
  { value: "lexus", label: "Lexus" },
  { value: "toyota", label: "Toyota" },
  { value: "honda", label: "Honda" },
  { value: "volvo", label: "Volvo" },
  { value: "peugeot", label: "Peugeot" },
  { value: "citroen", label: "Citroën" },
  { value: "opel", label: "Opel" },
  { value: "fiat", label: "Fiat" },
  { value: "alfa", label: "Alfa Romeo" },
  { value: "lancia", label: "Lancia" },
  { value: "chrysler", label: "Chrysler" },
  { value: "jeep", label: "Jeep" },
  { value: "dodge", label: "Dodge" },
  { value: "ford", label: "Ford" },
  { value: "mitsubishi", label: "Mitsubishi" },
  { value: "bmw", label: "BMW" },
  { value: "kia", label: "Kia" },
  { value: "mazda", label: "Mazda" },
  { value: "renault", label: "Renault" },
  { value: "landrover", label: "Land Rover" },
];

const aniosOptions = Array.from({ length: 11 }, (_, i) => ({
  value: 2006 + i,
  label: (2006 + i).toString(),
}));

const mesesOptions = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

const verificar = () => {
  if (!form.marca || !form.anio || !form.mes) {
    alert("Por favor, rellene todos los campos.");
    return;
  }

  const anio = parseInt(form.anio);
  const mes = parseInt(form.mes);

  const inicioAfectado = anio > 2006 || (anio === 2006 && mes >= 2);
  const finAfectado = anio < 2013 || (anio === 2013 && mes <= 8);

  if (inicioAfectado && finAfectado) {
    resultado.value = {
      esAfectado: true,
      titulo: "¡Vehículo Afectado!",
      mensaje: "Su vehículo se encuentra dentro del rango de fechas del cártel. Tiene derecho a reclamar.",
      clase: "success",
    };
  } else {
    resultado.value = {
      esAfectado: false,
      titulo: "No Afectado",
      mensaje: "Según los datos introducidos, su vehículo no forma parte de las reclamaciones vigentes.",
      clase: "error",
    };
  }
};

const irARegistro = () => {
  showModal.value = true;
};

const handleModalResult = (confirmed) => {
  showModal.value = false;
  if (confirmed) {
    router.push("/registro-cliente");
  }
};
</script>

<style scoped>
.home-view {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-align: center;
}
.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.result-box {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.result-box.success {
  background-color: #f0fff4;
  border: 1px solid #c6f6d5;
  color: #276749;
}

.result-box.error {
  background-color: #fff5f5;
  border: 1px solid #fed7d7;
  color: #9b2c2c;
}

.btn-register {
  margin-top: 1.5rem;
  background-color: #2c3e50; /* Diferente color para resaltar */
}

.btn-register:hover {
  background-color: #1a252f;
}
</style>
