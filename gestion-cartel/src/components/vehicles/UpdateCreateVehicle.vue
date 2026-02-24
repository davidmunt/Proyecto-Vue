<template>
  <div class="form-card">
    <div class="form-header">
      <h3>{{ editData ? "Editar Vehículo" : "Nuevo Vehículo" }}</h3>
      <p>Complete los datos técnicos del coche afectado.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="grid-form">
      <div class="row">
        <div class="field">
          <InputText
            id="matricula"
            label="Matrícula"
            v-model="formData.matricula"
            placeholder="0000XXX"
            :class="{ 'input-error': errors.matricula }"
          />
          <span v-if="errors.matricula" class="error-msg">{{ errors.matricula }}</span>
        </div>

        <SelectField id="marca" label="Marca" v-model="formData.marca" :options="marcasOptions" placeholder="Seleccione Marca" />
      </div>

      <div class="row">
        <SelectField
          id="modelo"
          label="Modelo"
          v-model="formData.modelo"
          :options="modelosOptions"
          :disabled="!formData.marca"
          :placeholder="formData.marca ? 'Seleccione Modelo' : 'Primero elija marca'"
        />
      </div>

      <InputText id="anyo" label="Año Matriculación" type="number" v-model.number="formData.anyo_matriculacion" placeholder="Ej: 2010" />

      <div class="row">
        <InputText id="color" label="Color" v-model="formData.color" placeholder="Ej: Blanco" />
        <SelectField id="puertas" label="Nº Puertas" v-model.number="formData.puertas" :options="puertasOptions" placeholder="Seleccione" />
      </div>

      <div class="full-width">
        <label for="obs" class="label-obs">Observaciones</label>
        <textarea id="obs" v-model="formData.observaciones" rows="3" class="base-textarea" placeholder="Detalles adicionales..."></textarea>
      </div>

      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="btn-cancel">Cancelar</button>
        <ButtonPrimary
          :text="vehiclesStore.loading ? 'Guardando...' : 'Guardar Vehículo'"
          type="submit"
          :disabled="vehiclesStore.loading"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed, watch } from "vue";
import { useVehiclesStore } from "../../store/vehicles";
import { useAuthStore } from "../../store/auth";
import InputText from "../reutilizables/InputText.vue";
import SelectField from "../reutilizables/SelectField.vue";
import ButtonPrimary from "../reutilizables/ButtonPrimary.vue";

const MARCAS_AFECTADAS = {
  Seat: ["Ibiza", "Leon", "Altea", "Alhambra"],
  Volkswagen: ["Golf", "Passat", "Polo", "Tiguan"],
  Renault: ["Megane", "Clio", "Laguna", "Scenic"],
  Opel: ["Corsa", "Astra", "Insignia", "Zafira"],
  Ford: ["Focus", "Fiesta", "Mondeo", "Kuga"],
  Peugeot: ["207", "208", "307", "308", "508"],
  Citroen: ["C3", "C4", "C5", "Berlingo"],
  Audi: ["A1", "A3", "A4", "A6"],
};

const props = defineProps({
  editData: { type: Object, default: null },
});

const emit = defineEmits(["cancel", "saved"]);

const vehiclesStore = useVehiclesStore();
const authStore = useAuthStore();
const errors = reactive({ matricula: "" });

const formData = reactive({
  matricula: "",
  marca: "",
  modelo: "",
  anyo_matriculacion: 0,
  color: "",
  puertas: 0,
  observaciones: "",
});

const puertasOptions = [
  { value: 3, label: "3 puertas" },
  { value: 5, label: "5 puertas" },
];

const marcasOptions = computed(() => {
  return Object.keys(MARCAS_AFECTADAS).map((marca) => ({
    value: marca,
    label: marca,
  }));
});

const modelosOptions = computed(() => {
  const marcaSeleccionada = formData.marca;
  if (!marcaSeleccionada || !MARCAS_AFECTADAS[marcaSeleccionada]) {
    return [];
  }
  return MARCAS_AFECTADAS[marcaSeleccionada].map((modelo) => ({
    value: modelo,
    label: modelo,
  }));
});

watch(
  () => formData.marca,
  () => {
    formData.modelo = "";
  },
);

onMounted(() => {
  if (props.editData) {
    Object.assign(formData, props.editData);
  }
});

const validate = () => {
  const matriculaRegex = /^\d{4}[B-DF-HJ-NP-TV-Z]{3}$/i;
  if (!matriculaRegex.test(formData.matricula)) {
    errors.matricula = "Formato inválido (Ej: 1234BBB)";
    return false;
  }
  errors.matricula = "";
  return true;
};

const handleSubmit = async () => {
  if (!validate()) return;

  const payload = { vehiculo: { ...formData } };

  let result;
  if (props.editData) {
    result = await vehiclesStore.updateVehicle(props.editData._id, payload, authStore.user.id);
  } else {
    result = await vehiclesStore.createVehicle(payload, authStore.user.id);
  }

  if (result.success) {
    emit("saved");
  } else {
    alert(result.error || "Ocurrió un error");
  }
};
</script>

<style scoped>
.form-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
}
.form-header {
  margin-bottom: 2rem;
}
.grid-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.label-obs {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.base-textarea {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.75rem;
  font-family: inherit;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
.btn-cancel {
  background: #eee;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
.error-msg {
  color: #ef4444;
  font-size: 0.8rem;
}
.input-error {
  border-color: #ef4444 !important;
}
</style>
