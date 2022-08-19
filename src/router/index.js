import Vue from 'vue'
import VueRouter from 'vue-router'
import ListAlunos from "../views/Alunos/ListAlunos.vue";
import CadastroAlunos from "../views/Alunos/CadastroAlunos.vue";
import VisualizaAluno from "../views/Alunos/VisualizaAluno.vue";
import SelectEscolas from "../views/Escolas/SelectEscolas.vue";
//import ListAlunos from "../views/Alunos/ListAlunos.vue";
import CadastroEnderecos from "../views/Enderecos/CadastroEnderecos.vue";
import CadastroResponsaveis from "../views/Responsaveis/CadastroResponsaveis.vue";
import ListCursos from "../views/Cursos/ListCursos.vue";
import CadastroCursos from "../views/Cursos/CadastroCursos.vue";
import ListTurmas from "../views/Turmas/ListTurmas.vue";
import CadastroTurmas from "../views/Turmas/CadastroTurmas.vue";
import ListEscolas from "../views/Escolas/ListEscolas.vue";
import CadastroEscolas from "../views/Escolas/CadastroEscolas.vue";
import ListInstrumentos from "../views/Instrumentos/ListInstrumentos.vue";
import CadastroInstrumentos from "../views/Instrumentos/CadastroInstrumentos.vue";
import ListMatriculas from "../views/Matriculas/ListMatriculas.vue";
import CadastroMatriculas from "../views/Matriculas/CadastroMatriculas.vue";
import ListMatriculasPorAluno from "../views/Matriculas/ListMatriculasPorAluno.vue";
import VisualizaMatricula from "../views/Matriculas/VisualizaMatricula.vue";
import ListFuncionarios from "../views/Funcionarios/ListFuncionarios.vue";
import CadastroFuncionarios from "../views/Funcionarios/CadastroFuncionarios.vue";
import VisualizaFuncionario from "../views/Funcionarios/VisualizaFuncionario.vue";

import ListAulas from "../views/Aulas/ListAulas.vue";
import SelectAulasTurma from "../views/Aulas/SelectAulasTurma.vue";
import CadastroAulas from "../views/Aulas/CadastroAulas.vue";
import VisualizaAula from "../views/Aulas/VisualizaAula.vue";
//import FrequeciaAula from "../views/Aulas/Frequencia/FrequenciaAula.vue";
import ListUsuarios from "../views/Usuarios/ListUsuarios.vue";
import CadastroUsuarios from "../views/Usuarios/CadastroUsuarios.vue";
import ListEmprestimos from "../views/Emprestimos/ListEmprestimos.vue";
import CadastroEmprestimos from "../views/Emprestimos/CadastroEmprestimos.vue";
import VisualizaEmprestimo from "../views/Emprestimos/VisualizaEmprestimos.vue";
import RelatEmprestimos from "../views/Emprestimos/RelatEmprestimos.vue";
import RelatorioAulas from "../views/Aulas/RelatAulas.vue";
import RelatorioInstrumentos from "../views/Instrumentos/RelatInstrumentos.vue";
import RelatorioAlunos from "../views/Alunos/RelatAlunos.vue";
import Login from '../views/Login/Login.vue'
import Inicial from '../views/Inicial/Inicial.vue'

import provedor from '../store/provedor';
import http from '../plugins/axios';
//import App from '../App.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: "/home",
    name: "Inicial",
    component: Inicial,
    menu: true
  },
  {
    path: "/alunos",
    name: "Aluno",
    component: ListAlunos,
    menu: true,
    meta: {
      publica: true
    }
  },
  {
    path: "/CadAlunos",
    name: "CadAluno",
    component: CadastroAlunos,
    menu: false
  },
  {
    path: "/cadAlunos/:id",
    name: "AlteraAluno",
    component: CadastroAlunos,
    menu: false
  },
  {
    path: "/alunos/:id",
    name: "VisualizarAluno",
    component: VisualizaAluno,
    menu: false
  },
  {
    path: "/CadEnderecos/:idAluno",
    name: "CadEndereco",
    component: CadastroEnderecos,
    menu: false
  },
  {
    path: "/CadEnderecos/edit/:idEndereco/alu/:idAluno",
    name: "AlteraEndereco",
    component: CadastroEnderecos,
    menu: false
  },
  {
    path: "/CadResponsaveis/:idAluno",
    name: "CadResponsavel",
    component: CadastroResponsaveis,
    menu: false
  },
  {
    path: "/CadResponsaveis/edit/:idResponsavel/alu/:idAluno",
    name: "AlteraResponsavel",
    component: CadastroResponsaveis,
    menu: false
  },
  {
    path: "/SelectEscolas/alu/:idAluno",
    name: "SelectEscola",
    component: SelectEscolas,
    menu: false
  },
  {
    path: "/SelectEscolas/esc/:idEscola/alu/:idAluno",
    name: "SelectEscola",
    component: SelectEscolas,
    menu: false
  },
  {
    path: "/cursos",
    name: "Curso",
    component: ListCursos,
    menu: true
  },
  {
    path: "/CadCursos",
    name: "CadCurso",
    component: CadastroCursos,
    menu: false
  },
  {
    path: "/cadCursos/:id",
    name: "AlteraCurso",
    component: CadastroCursos,
    menu: false
  },
  {
    path: "/turmas",
    name: "Turma",
    component: ListTurmas,
    menu: true
  },
  {
    path: "/CadTurmas",
    name: "CadTurma",
    component: CadastroTurmas,
    menu: false
  },
  {
    path: "/cadTurmas/:id",
    name: "AlteraTurma",
    component: CadastroTurmas,
    menu: false
  },
  {
    path: "/escolas",
    name: "Escola",
    component: ListEscolas,
    menu: true
  },
  
  {
    path: "/CadEscolas",
    name: "CadEscola",
    component: CadastroEscolas,
    menu: false
  },
  {
    path: "/cadEscolas/:id",
    name: "AlteraEscola",
    component: CadastroEscolas,
    menu: false
  },
  {
    path: "/instrumentos",
    name: "Instrumento",
    component: ListInstrumentos,
    menu: true
  },
  {
    path: "/CadInstrumentos",
    name: "CadInstrumento",
    component: CadastroInstrumentos,
    menu: false
  },
  {
    path: "/cadInstrumentos/:id",
    name: "AlteraInstrumento",
    component: CadastroInstrumentos,
    menu: false
  },
  {
    path: "/matriculas",
    name: "Matricula",
    component: ListMatriculas,
    menu: true
  },
  //Listar todas as matriculas de um determinado aluno
  {
    path: "/MatriculaAluno/:idAluno/matricula/",
    name: "MatriculasPorAluno",
    component: ListMatriculasPorAluno,
    menu: false
  },
  //listar uma matricula de um aluno
  {
    path: "/MatriculaAluno/:idAluno/matricula/:idMatricula",
    name: "VisualizarMatricula",
    component: VisualizaMatricula,
    menu: false
  },
  {
    path: "/CadMatricula/:idAluno/matricula/",
    name: "CadMatricula",
    component: CadastroMatriculas,
    menu: false
  },
  {
    path: "/CadMatricula/:idAluno/matricula/:idMatricula",
    name: "AlteraMatricula",
    component: CadastroMatriculas,
    menu: false
  },

  {
    path: "/funcionarios",
    name: "Funcionario",
    component: ListFuncionarios,
    menu: true
  },
  {
    path: "/cadFuncionarios",
    name: "CadFuncionario",
    component: CadastroFuncionarios,
    menu: false
  },
  {
    path: "/cadFuncionarios/:id",
    name: "AlteraFuncionario",
    component: CadastroFuncionarios,
    menu: false
  },
  {
    path: "/funcionarios/:id",
    name: "VisualizarFuncionario",
    component: VisualizaFuncionario,
    menu: false
  },
  {
    path: "/aulas",
    name: "SelectAulasTurma",
    component: SelectAulasTurma,
    menu: true
  },

  {
    path: "/aulas/turma/:idTurma",
    name: "Aula",
    component: ListAulas,
    menu: true
  },
  {
    path: "/cadAulas/turma/:idTurma",
    name: "CadAula",
    component: CadastroAulas,
    menu: false
  },
  {
    path: "/cadAulas/:idAula/turma/:idTurma",
    name: "AlteraAula",
    component: CadastroAulas,
    menu: false
  },
  //listar uma aula de um turma
  {
    path: "/aulas/:idAula/turma/:idTurma",
    name: "VisualizarAula",
    component: VisualizaAula,
    menu: false
  },

 

  // {
  //   path: "/avaliacoes",
  //   name: "Avaliacao",
  //   component: ListAvaliacoes,
  //   menu: true
  // },
  // {
  //   path: "/CadAvaliacoes",
  //   name: "CadAvaliacao",
  //   component: CadastroAvaliacoes,
  //   menu: false
  // },
  // {
  //   path: "/cadAvaliacoes/:id",
  //   name: "AlteraAvaliacao",
  //   component: CadastroAvaliacoes,
  //   menu: false
  // },
////////////-------NIVEIS-------//////////////
  {
    path: "/usuarios",
    name: "Usuario",
    component: ListUsuarios,
    menu: true
  },
  {
    path: "/CadUsuarios",
    name: "CadUsuario",
    component: CadastroUsuarios,
    menu: false
  },
  {
    path: "/CadUsuarios/:id",
    name: "AlteraUsuario",
    component: CadastroUsuarios,
    menu: false
  },


  /////////-----Emprestimos-----/////////
  {
    path: "/emprestimos",
    name: "Emprestimo",
    component: ListEmprestimos,
    menu: true
  },
  {
    path: "/CadEmprestimos",
    name: "CadEmprestimo",
    component: CadastroEmprestimos,
    menu: false
  },
  {
    path: "/CadEmprestimos/:id",
    name: "AlteraEmprestimo",
    component: CadastroEmprestimos,
    menu: false
  },
  {
    path: "/emprestimos/:id",
    name: "VisualizaEmprestimo",
    component: VisualizaEmprestimo,
    menu: false
  },
//--------------RELATORIOS---------------//
{
  path: "/instrumentos/rel",
  name: "RelatorioInstrumentos",
  component: RelatorioInstrumentos,
  menu: true
},
{
  path: "/emprestimo/rel",
  name: "RelatEmprestimos",
  component: RelatEmprestimos,
  menu: false
},
  {
    path: "/aulas/rel",
    name: "RelatorioAulas",
    component: RelatorioAulas,
    menu: true
  },
  {
    path: "/aluno/rel",
    name: "RelatorioAlunos",
    component: RelatorioAlunos,
    menu: true
  },
  {
    path: "/login/",
    name: "Login",
    component: Login,
    menu: false,
    meta: {
      publica: true
    }
  },
  
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

router.beforeEach((routeTo, routeFrom, next) => {
  if (routeTo.name == 'Login'){
    return next({path: '/home'})
  }
  if(!routeTo.meta.publica){
    http
    .get("/")
    .then(() => {
    })
    .catch((err) => {
      if (
        err.response.status == 401 ||
        err.response.data.message == "Token está invalido"
        ) {
          console.log(err);
          provedor.commit("DESLOGAR_USUARIO");
          return next({path: '/login'})
        }
      });
    }
  next();
})

export default router
