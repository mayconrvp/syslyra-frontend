<template>
  <v-container>
    <v-card>
      <v-toolbar color="cyan" dark>
        <v-toolbar-title>Cadastro de Turmas</v-toolbar-title>

        <v-spacer></v-spacer>
        <template v-slot:extension> </template>
      </v-toolbar>

      <v-form>
        <v-card>
          <v-container>
            <v-text-field
              v-model="descricao"
              placeholder="Turma de Trompete 3"
              :error-messages="descricaoErrors"
              :counter="60"
              label="Turma"
              @change="$v.descricao.$touch()"
            ></v-text-field>

            <v-row>
              <v-col cols="7" class="d-flex">
                <v-autocomplete
                  v-model="curso"
                  :items="cursos"
                  placeholder="Escolha o curso referente à turma que deseja cadastrar. Ex.: Trompete Iniciante"
                  item-value="id"
                  item-text="nome"
                  :menu-props="{ bottom: true, offsetY: true }"
                  clearable
                  :error-messages="cursoErrors"
                  label="Curso"
                  @change="$v.curso.$touch()"
                ></v-autocomplete>
              </v-col>
              <v-col class="mt-2" cols="2">
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      v-bind="attrs"
                      @click="novoCurso"
                      v-on="on"
                    >
                      <v-icon>mdi-plus-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Novo curso</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  v-model="dataInicio"
                  label="Data de Início"
                  :error-messages="dataErrors"
                  @change="$v.dataInicio.$touch()"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="horario"
                  placeholder="07:00"
                  v-mask="['##:##']"
                  :error-messages="horarioErrors"
                  :counter="5"
                  label="Horário"
                  @change="$v.horario.$touch()"
                ></v-text-field>
              </v-col>
              <!-- <v-col cols="12" sm="6" class="d-flex">
                
              </v-col> -->
            </v-row>

            <v-chip label>Dias de aula</v-chip>
            <v-row>
              <v-checkbox
                class="mx-3"
                v-model="selected"
                label="Segunda"
                value="Segunda"
              ></v-checkbox>
              <v-checkbox
                class="mx-3"
                v-model="selected"
                label="Terça"
                value="Terça"
              ></v-checkbox>
              <v-checkbox
                class="mx-3"
                v-model="selected"
                label="Quarta"
                value="Quarta"
              ></v-checkbox>
              <v-checkbox
                class="mx-3"
                v-model="selected"
                label="Quinta"
                value="Quinta"
              ></v-checkbox>
              <v-checkbox
                class="mx-3"
                v-model="selected"
                label="Sexta"
                value="Sexta"
              ></v-checkbox>
            </v-row>
          </v-container>
        </v-card>

        <v-card>
          <v-container>
            <v-btn
              v-if="this.id"
              primary
              type="submit"
              color="success"
              @click.prevent="atualizaDadosGerais"
            >
              Atualizar
            </v-btn>
            <v-btn
              v-else
              type="submit"
              v-show="!this.id"
              color="success"
              class="mr-4"
              @click.prevent="grava"
            >
              Salvar
            </v-btn>
            <v-btn color="red accent-1" class="mx-4" @click="cancelar">
              Cancelar
            </v-btn>
            <v-btn
              v-show="this.id"
              color="warning"
              class="mr-4"
              @click="finalizar"
            >
              Finalizar turma
            </v-btn>
          </v-container>
        </v-card>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
// import { required } from "vuelidate/lib/validators"
import { mask } from "vue-the-mask";

import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    curso: { required },
    descricao: { required },
    horario: { required },
    dataInicio: { required },
  },

  directives: { mask },

  data() {
    return {
      id: this.$route.params.id,
      idCurso: "",
      descricao: "",
      horario: "",
      cursos: [],
      curso: "",
      selected: [],
      dataInicio: "",
      diasUteis: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    };
  },
  created() {
    if (this.id) {
      this.$http.get(`turmas/${this.id}`).then((response) => {
        console.log(response.data);
        this.descricao = response.data.descricao;
        this.horario = response.data.horario;
        this.curso = response.data.idCurso;
        this.selected = response.data.dias.split(",");
        this.dataInicio = response.data.dataInicio;
      });
    }
    this.$http.get("cursos/").then((response) => {
      this.cursos = response.data;
    });
  },

  computed: {
    descricaoErrors() {
      const errors = [];
      if (!this.$v.descricao.$dirty) return errors;
      !this.$v.descricao.required &&
        errors.push("Descrição da turma é obrigatória");
      return errors;
    },
    cursoErrors() {
      const errors = [];
      if (!this.$v.curso.$dirty) return errors;
      !this.$v.curso.required && errors.push("Curso é obrigatório.");
      return errors;
    },
    horarioErrors() {
      const errors = [];
      if (!this.$v.horario.$dirty) return errors;
      !this.$v.horario.required && errors.push("Horário é obrigatório");
      return errors;
    },
    dataErrors() {
      const errors = [];
      if (!this.$v.dataInicio.$dirty) return errors;
      !this.$v.dataInicio.required && errors.push("Data é obrigatória");
      this.$v.dataInicio.$invalid && errors.push("Data inválida");
      return errors;
    },
  },

  methods: {
    grava() {
      if (!this.$v.$invalid) {
        let data = {
          descricao: this.descricao,
          idCurso: this.curso,
          horario: this.horario,
          dias: this.selected.toString(),
          dataInicio: this.dataInicio,
        };

        this.$http
          .post("turmas", data)
          .then(() => {
            this.$toast.fire("Turma cadastrada com sucesso", "", "success");

            this.$router.push({ name: "Turma" });
          })
          .catch(() => {
            this.$toast.fire(
              "Não foi possível cadastrar a turma.",
              "",
              "error"
            );
          });
      } else {
        this.$v.$touch();
      }
    },
    novoCurso() {
      this.$router.push(`/CadCursos`);
    },
    atualizaDadosGerais() {
      if (!this.$v.$invalid) {
        let data = {
          descricao: this.descricao,
          idCurso: this.curso,
          horario: this.horario,
          dias: this.selected.toString(),
          dataInicio: this.dataInicio,
        };
        console.log(data.idCurso);
        this.$http
          .put(`/turmas/${this.id}`, data)
          .then((response) => {
            console.log(response);
            this.$toast.fire("Atualizado com sucesso", "", "success");
            this.$router.push("/turmas");
          })
          .catch((err) => {
            console.log(err);
            this.$toast.fire("Erro ao atualizar", err, "error");
          });
      } else {
        this.$v.$touch();
      }
    },

    limpar() {
      this.descricao = "";
      this.dias = "";
      this.horario = "";
      this.curso = "";
    },
    cancelar() {
      this.$router.push("/turmas");
    },
    finalizar() {
      this.$swal({
        title: "Você tem certeza?",
        text: "Deseja realmente finalizar a turma selecionada? Ao ser encerrada, esta turma não aparecerá mais na listagem de turmas.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$http
            .get(`turmas/close/${this.id}`)
            .then((res) => {
              console.log(res.data);
              this.$swal(
                "Turma finalizada.",
                "Finalização de turma efetuada com sucesso.",
                "success"
              );
              this.$router.push("/turmas");
            })
            .catch((err) => {
              this.$toast.fire(
                "Não foi possivel efetuar a finalização da turma.",
                "",
                "error"
              );
              console.log(err);
            });
        }
      });
    },
  },
};
</script>

<style></style>
