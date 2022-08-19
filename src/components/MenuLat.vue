<template>
  <span>
    <v-list-item>
      <v-list-item-content>
        <router-link to="/home"
          ><v-list-item-title class="text-h6">
            <h3 style="color: gray">SysLyra</h3>
          </v-list-item-title></router-link
        >
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item
        class="ml-3"
        v-for="(relat, i) in menuslivres"
        :key="i"
        :to="relat.to"
        link
      >
        <v-list-item-icon>
          <v-icon v-text="relat.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-title v-text="relat.title"></v-list-item-title>
      </v-list-item>
      <v-list-group :value="false" no-action>
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon v-text="iconAdd"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Cadastros</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          class="ml-3"
          v-for="(cadastro, i) in cadastros"
          :key="i"
          :to="cadastro.to"
          link
        >
          <v-list-item-title v-text="cadastro.title"></v-list-item-title>

          <v-list-item-icon>
            <v-icon v-text="cadastro.icon"></v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-group>

      <v-list-group :value="false" no-action>
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon v-text="iconAdjust"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Pedagógico</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          class="ml-3"
          v-for="(pedag, i) in pedagogicos"
          :key="i"
          :to="pedag.to"
          link
        >
          <v-list-item-title v-text="pedag.title"></v-list-item-title>

          <v-list-item-icon>
            <v-icon v-text="pedag.icon"></v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-group>

      <v-list-group :value="false" no-action>
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon v-text="iconRelat"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Relatórios</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          class="ml-3"
          v-for="(relat, i) in relatorios"
          :key="i"
          :to="relat.to"
          link
        >
          <v-list-item-title v-text="relat.title"></v-list-item-title>

          <v-list-item-icon>
            <v-icon v-text="relat.icon"></v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-group>

      <!-- <v-list-item v-for="(config, i) in configuracoes" :key="item.title" link>
        <template>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </template>
      </v-list-item> -->
    </v-list>
  </span>
</template>

<script>
export default {
  data: () => ({
    iconAdd: "mdi-plus",
    iconAdjust: "mdi-adjust",
    iconConfig: "mdi-cog",
    iconRelat: "mdi-book-open-page-variant",
    drawer: null,
    items: [{ title: "Configurações", icon: "mdi-cog" }],
    cadastros: [
      { title: "Curso", icon: "mdi-clipboard-plus-outline ", to: "/cursos" },
      { title: "Turma", icon: "mdi-account-supervisor-circle ", to: "/turmas" },
      { title: "Escolas", icon: "mdi-school", to: "/escolas" },
      {
        title: "Instrumentos",
        icon: "mdi-guitar-acoustic ",
        to: "/instrumentos",
      },
    ],
    menuslivres: [
      { title: "Alunos", icon: "mdi-account", to: "/alunos" },
      {
        title: "Funcionários",
        icon: "mdi-card-plus-outline",
        to: "/funcionarios",
      },
      {
        title: "Empréstimos",
        icon: "mdi-book",
        to: "/emprestimos",
      },
      {
        title: "Usuários",
        icon: "mdi-account-circle-outline ",
        to: "/usuarios",
      },
    ],
    pedagogicos: [
      { title: "Aulas", icon: "mdi-book-music-outline", to: "/aulas" },
      { title: "Matrículas", icon: "mdi-account-plus", to: "/matriculas" },
    ],

    relatorios: [
      {
        title: "Aulas",
        icon: "mdi-book-music-outline",
        to: "/aulas/rel",
      },
      {
        title: "Empréstimos",
        icon: "mdi-book",
        to: "/emprestimo/rel",
      },
      {
        title: "Instrumentos",
        icon: "mdi-guitar-acoustic",
        to: "/instrumentos/rel",
      },
      {
        title: "Alunos",
        icon: "mdi-account-group",
        to: "/aluno/rel",
      },
    ],

    right: null,
  }),
};
</script>

<style scoped>
a:hover {
  background-color: darkgray;
  transition: 0.2s;
}
</style>