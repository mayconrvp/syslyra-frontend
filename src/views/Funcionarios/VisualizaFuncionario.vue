<template>
  <v-container>
    <v-card class="mt-5">
      <v-form @submit.prevent="grava()">
        <v-card>
          <v-container>
            <div class="my-3">
              <h2>Visualização de funcionário</h2>
            </div>
            <v-row>
              <v-col>
                <v-text-field v-model="nome" label="Nome" outlined readonly>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="cpf"
                  label="CPF"
                  outlined
                  readonly
                  v-mask="['###.###.###-##']"
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="dataNascimento"
                  label="Data de Nascimento"
                  type="date"
                  outlined
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="email" label="Email" outlined readonly>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="telefone"
                  label="Telefone"
                  outlined
                  readonly
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-textarea
                  v-model="cargo"
                  label="Cargo"
                  outlined
                  readonly
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card>
          <v-container>
            <v-btn color="red accent-1" class="mr-4" @click="cancelar">
              Voltar
            </v-btn>
          </v-container>
        </v-card>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      nome: "",
      cargo: "",
      dataNascimento: "",
      email: "",
      cpf: "",
      telefone: "",
    };
  },
  created() {
    this.getListagem();
  },

  computed: {},

  methods: {
    cancelar() {
      this.$router.push(`/funcionarios`);
    },
    getListagem() {
      this.$http.get(`/funcionarios/${this.id}`).then((response) => {
        this.nome = response.data.nome;
        this.dataNascimento = this.formataDataBR(response.data.dataNascimento);
        this.cargo = response.data.cargo;
        this.cpf = response.data.cpf;
        this.email = response.data.email;
        this.telefone = response.data.telefone;
      });
    },
    formataDataBR(value) {
      let data = new Date(value);
      let dia = String(data.getDate()).padStart(2, "0");
      let mes = String(data.getMonth() + 1).padStart(2, "0");
      let ano = data.getFullYear();
      return `${ano}-${mes}-${dia}`;
    },
  },
};
</script>

<style></style>
