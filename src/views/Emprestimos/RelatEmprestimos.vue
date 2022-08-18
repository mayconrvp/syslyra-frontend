<template>
  <v-container>
    <div class="topo my-5 ml-3">
      <h2>Relatório de Empréstimos</h2>
      <div>
        <v-btn @click="gerarPDF" elevation="2" color="success" class="btn"
          >Gerar PDF</v-btn
        >
      </div>
    </div>
    <!-- <pre>{{ $v }}</pre> -->
    <v-row>
      <v-col cols="3">
        <v-text-field
          v-model="dataInicio"
          label="Data Inicial"
          :error-messages="dataInicioErrors"
          @change="$v.dataInicio.$touch()"
          type="date"
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="dataFim"
          label="Data Final"
          :error-messages="dataFimErrors"
          @change="$v.dataFim.$touch()"
          type="date"
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-btn color="primary" outlined class="mt-3 mx-1" @click="filtrar()"
          >Filtrar</v-btn
        >
        <v-btn outlined class="mt-3 mx-1" @click="limpar()">Limpar</v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="emprestimos"
      :items-per-page="20"
      class="elevation-1"
    >
      <template v-slot:item.dataEmprestimo="{ item }">
        <span>{{ item.dataEmprestimo | formataDataBR }}</span>
      </template>
      <template v-slot:item.dataDevolucao="{ item }">
        <span v-if="item.dataDevolucao">{{
          item.dataDevolucao | formataDataBR
        }}</span>
        <span v-else class="red--text font-italic caption">Não definido</span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon color="error" @click="gerarPdfEmprestimoAluno(item)"
          >mdi-file-pdf-box
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { maxLength, minLength } from "vuelidate/lib/validators";
export default {
  filters: {
    formataDataEUA(date) {
      let data = new Date(date);
      let dia = String(data.getDate()).padStart(2, "0");
      let mes = String(data.getMonth() + 1).padStart(2, "0");
      let ano = data.getFullYear();
      return `${ano}-${mes}-${dia}`;
    },
    formataDataBR(date) {
      let data = new Date(date);
      let dia = String(data.getDate()).padStart(2, "0");
      let mes = String(data.getMonth() + 1).padStart(2, "0");
      let ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;
    },
  },
  validations: {
    dataInicio: {
      minLength: minLength(10),
      maxLength: maxLength(10),
    },
    dataFim: {
      minLength: minLength(10),
      maxLength: maxLength(10),
    },
  },

  data() {
    return {
      headers: [
        { text: "Id", value: "id", sortable: true },
        { text: "Data de Empréstimo", value: "dataEmprestimo" },
        { text: "Data de Devolução", value: "dataDevolucao" },
        { text: "Aluno", value: "Aluno.nome" },
        { text: "Instrumento", value: "Instrumento.descricao" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      emprestimos: [],
      dataInicio: "",
      dataFim: "",
    };
  },
  created() {
    this.getListagem();
  },
  methods: {
    getListagem() {
      this.$http.get("/emprestimos").then((response) => {
        this.emprestimos = response.data;
        console.log(this.emprestimos);
      });
      console.log(this.emprestimos);
    },
    gerarPDF() {
      if (this.dataInicio && this.dataFim) {
        this.$http
          .get("/emprestimos/rel")
          .then((response) => {
            this.$toast.fire("PDF Gerado com sucesso", "", "success");
            window.open(
              `http://localhost:3000/emprestimos/data/rel/${this.dataInicio}/${this.dataFim}`
            );
            console.log(response);
          })
          .catch(() => {
            this.$toast.fire("Erro ao gerar PDF", "", "error");
          });
      }
      this.$http
        .get("/emprestimos/rel")
        .then((response) => {
          this.$toast.fire("PDF Gerado com sucesso", "", "success");
          window.open("http://localhost:3000/emprestimos/rel");
          console.log(response);
        })
        .catch(() => {
          this.$toast.fire("Erro ao gerar PDF", "", "error");
        });
    },
    gerarPdfEmprestimoAluno(emprestimo) {
      if (emprestimo) {
        this.$http
          .get("/emprestimos/rel")
          .then((response) => {
            this.$toast.fire("PDF Gerado com sucesso", "", "success");
            window.open(
              `http://localhost:3000/emprestimos/aluno/rel/${emprestimo.id}/`
            );
            console.log(response);
          })
          .catch(() => {
            this.$toast.fire("Erro ao gerar PDF", "", "error");
          });
      }
    },
    limpar() {
      this.dataInicio = "";
      this.dataFim = "";
      this.getListagem();
    },
    filtrar() {
      if (!this.dataInicio || !this.dataFim) {
        return this.$toast.fire(
          "ATENÇÃO",
          "Preencha os campos de data corretamente",
          "info"
        );
      }
      if (!this.$v.$invalid) {
        console.log(this.dataInicio, this.dataFim);
        this.$http
          .get(
            `/emprestimos/dataIni/${this.dataInicio}/dataFim/${this.dataFim}`
          )
          .then((response) => {
            console.log(response.data);
            this.emprestimos = response.data;
          })
          .catch(() => {
            this.$toast.fire("Sem resultados");
          });
      } else {
        this.$v.$touch();
      }
    },
  },

  computed: {
    dataInicioErrors() {
      const errors = [];
      if (!this.$v.dataInicio.$dirty) return errors;
      this.$v.dataInicio.$invalid && errors.push("Data inválida");
      !this.$v.dataInicio.maxLength && errors.push("Data inicial inválida");
      !this.$v.dataInicio.minLength && errors.push("Data inicial inválida");
      return errors;
    },
    dataFimErrors() {
      const errors = [];
      if (!this.$v.dataFim.$dirty) return errors;
      this.$v.dataFim.$invalid && errors.push("Data inválida");
      !this.$v.dataFim.maxLength && errors.push("Data inicial inválida");
      !this.$v.dataFim.minLength && errors.push("Data inicial inválida");
      return errors;
    },
  },
};
</script>

<style>
.controle {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 1.2em;
  margin-bottom: 20px;
  gap: 10px;
}

a {
  text-decoration: none;
}

.topo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
