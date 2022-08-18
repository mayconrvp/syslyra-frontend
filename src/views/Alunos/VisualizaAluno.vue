<template>
  <v-container>
    <v-card class="mt-5">
      <v-form @submit.prevent="grava()">
        <v-card>
          <v-container>
            <div class="my-3">
              <h2>Visualização de Aluno</h2>
            </div>
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="nome" label="Nome" outlined readonly>
                </v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="dataNascimento"
                  type="date"
                  label="Data de Nascimento"
                  outlined
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="3">
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
              <v-col cols="3">
                <v-text-field v-model="email" label="Email" outlined readonly>
                </v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="turno"
                  label="Turno"
                  outlined
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="cpf"
                  label="CPF"
                  outlined
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-if="this.idResponsavel != null"
                  v-model="responsavel"
                  readonly
                  label="Responsável"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-if="this.idResponsavel"
                  v-model="telefoneResp"
                  readonly
                  label="Contato do responsável"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>

            <v-row v-if="this.idEscola">
              <v-col cols="4">
                <v-text-field
                  v-model="escola"
                  readonly
                  label="Escola"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row v-if="this.idEndereco">
              <v-col>
                <v-text-field readonly label="Endereço" v-model="endereco">
                </v-text-field>
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
      idEndereco: "",
      idEscola: "",
      idResponsavel: "",

      nome: "",
      dataNascimento: "",
      telefone: "",
      email: "",
      turno: "",
      cpf: "",
      estado: "",
      cidade: "",
      bairro: "",
      cep: "",
      numero: "",
      complemento: "",
      logradouro: "",
      escola: "",

      responsavel: "",
      telefoneResp: "",
      emailResp: "",
      endCompleto: this.montaEndereco(),
    };
  },
  created() {
    this.getListagem();
  },

  computed: {},

  methods: {
    cancelar() {
      this.$router.push(`/alunos`);
    },
    getListagem() {
      this.$http.get(`alunos/${this.id}`).then((response) => {
        this.nome = response.data.nome;
        this.dataNascimento = response.data.dataNascimento;
        this.turno = response.data.turno;
        this.telefone = response.data.telefone;
        this.email = response.data.email;
        this.cpf = response.data.cpf;
        this.idEndereco = response.data.idEndereco;
        if (this.idEndereco) {
          this.logradouro = response.data.Endereco.logradouro;
          this.numero = response.data.Endereco.numero;
          this.bairro = response.data.Endereco.bairro;
          this.cidade = response.data.Endereco.cidade;
          this.estado = response.data.Endereco.Estado.uf;
          this.cep = response.data.Endereco.cep;
          this.endereco =
            this.logradouro +
            ", " +
            this.numero +
            ", " +
            this.bairro +
            ", " +
            this.cidade +
            "/" +
            this.estado +
            " - CEP: " +
            this.cep;
          console.log(this.endereco);
        }
        this.idResponsavel = response.data.idResponsavel;
        this.idEscola = response.data.idEscola;

        this.escola = response.data.idEscola ? response.data.Escola.nome : null;
        this.responsavel = response.data.idResponsavel
          ? response.data.Responsavei.responsavel
          : null;
        this.telefoneResp = response.data.idResponsavel
          ? response.data.Responsavei.telefone
          : null;
      });
    },
    formataDataBR(value) {
      let data = new Date(value);
      let dia = String(data.getDate()).padStart(2, "0");
      let mes = String(data.getMonth() + 1).padStart(2, "0");
      let ano = data.getFullYear();
      return `${ano}-${mes}-${dia}`;
    },

    montaEndereco() {
      let end =
        this.logradouro +
        ", " +
        this.bairro +
        ", " +
        this.cidade +
        ", " +
        this.estado;
      return end;
    },
  },
};
</script>

<style></style>
