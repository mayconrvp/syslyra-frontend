<template>
  <v-container>
    <v-card class="my-5 py-5">
      <v-row justify="center" class="mt-5">
        <v-col cols="10">
          <v-alert dense text border="left" type="success">
            Bem Vindo ao sistema gerencial da banda e escola musical Lyra Carlos
            Gomes.
            <br />
            Utilize os menus laterais para realizar os cadastros gerenciais e
            realizar os registros e acessar os relatórios.
          </v-alert>
        </v-col>
      </v-row>
      <v-row class="espacaLinha">
        <v-col cols="6">
          <v-card class="mx-auto" max-width="344">
            <v-list-item three-line>
              <v-list-item-content>
                <div class="text-overline mb-4">CADASTRAR ALUNOS</div>
                <v-list-item-subtitle
                  >Realize aqui o cadastro de alunos e integrantes da
                  banda</v-list-item-subtitle
                >
              </v-list-item-content>

              <div class="my-2">
                <v-btn
                  color="indigo"
                  fab
                  dark
                  large
                  @click="carregar('alunos')"
                >
                  <v-icon>mdi-account-circle</v-icon>
                </v-btn>
              </div>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card class="mx-auto" max-width="344">
            <v-list-item three-line>
              <v-list-item-content>
                <div class="text-overline mb-4">CADASTRAR FUNCIONÁRIOS</div>
                <v-list-item-subtitle
                  >Realize aqui o cadastro dos colaboradores e
                  funcionários</v-list-item-subtitle
                >
              </v-list-item-content>

              <div class="my-2">
                <v-btn
                  color="indigo"
                  fab
                  dark
                  large
                  @click="carregar('funcionarios')"
                >
                  <v-icon>mdi-account-supervisor-circle</v-icon>
                </v-btn>
              </div>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="espacaLinha">
        <v-col cols="6">
          <v-card class="mx-auto" max-width="344">
            <v-list-item three-line>
              <v-list-item-content>
                <div class="text-overline mb-4">CADASTRAR TURMAS</div>
                <v-list-item-subtitle
                  >Realize aqui o cadastro de turmas da
                  escola</v-list-item-subtitle
                >
              </v-list-item-content>

              <div class="my-2">
                <v-btn
                  color="indigo"
                  fab
                  dark
                  large
                  @click="carregar('turmas')"
                >
                  <v-icon>mdi-google-classroom </v-icon>
                </v-btn>
              </div>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card class="mx-auto" max-width="344">
            <v-list-item three-line>
              <v-list-item-content>
                <div class="text-overline mb-4">REGISTRAR AULAS</div>
                <v-list-item-subtitle
                  >Realize aqui o registro de aulas e de frequência dos
                  alunos</v-list-item-subtitle
                >
              </v-list-item-content>

              <div class="my-2">
                <v-btn color="indigo" fab dark large @click="carregar('aulas')">
                  <v-icon>mdi-notebook-plus </v-icon>
                </v-btn>
              </div>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    carregar(nome) {
      this.$router.push(`/${nome}`);
    },
  },
};
</script>

<style>
.espacaLinha {
  margin: 30px 0;
}
</style>