# Documentação das APIs - Sistema de Progressões

Este documento descreve as rotas expostas pelo backend Django/DRF do projeto `2024-2-Sistema-de-Pendencias`.

## Base URL

Em desenvolvimento local ou Docker Compose:

```txt
http://localhost:8000/
```

Prefixos principais:

- `/session/`: autenticação, emissão e renovação de tokens.
- `/api/`: recursos do Sistema de Progressões.
- `/hub/`: rotas auxiliares que consultam o sistema base/hub.
- `/admin/`: Django Admin.

## Autenticação

A API usa JWT em cookies HTTP only:

- `access_token`: cookie de autenticação usado pela maioria das rotas.
- `refresh_token`: cookie usado em `/session/tokens/refresh/`.

O middleware de permissões lê os nomes dos cookies configurados no `settings.py` via `SIMPLE_JWT`:

```python
SIMPLE_JWT = {
    "AUTH_COOKIE": "access_token",        # nome do cookie de acesso
    "AUTH_COOKIE_REFRESH": "refresh_token",  # nome do cookie de refresh
}
```

Rotas protegidas usam `@has_permissions([...])`. Quando o token está ausente, inválido ou expirado, a resposta esperada é `401`. Quando o token é válido, mas não possui permissão suficiente, a resposta esperada é `403`.

## Parâmetros comuns

- `retorno`: lista de campos que devem ser retornados. Vários serializers exigem esse parâmetro em rotas de detalhe/listagem.
- `busca`: texto de busca/filtro usado em listagens.
- `cursor`: cursor usado por listagens que paginam incrementalmente.
- `formato`: formato usado por alguns formatadores de PED/PPT.
- `params[]`: lista de filtros usada nas listagens de aluno.

Exemplo:

```http
GET /api/peds/integrado/listar/?busca=matematica&cursor=0&retorno=id,status,aluno&formato=card
```

## Modalidades

As rotas com `<modalidade>` alternam entre os modelos de Integrado e ProEJA. No código, as modalidades esperadas são usadas para selecionar serializers/models específicos de `integrado` ou `proeja`.

## Respostas de erro comuns

| Status | Quando ocorre |
| --- | --- |
| `400` | Dados inválidos, campos obrigatórios ausentes ou erro de validação. |
| `401` | Usuário não autenticado ou token inválido/expirado. |
| `403` | Usuário autenticado sem permissão ou acesso negado por regra de negócio. |
| `404` | Recurso não encontrado. |
| `500` | Erro interno não tratado. |

## Sessão

| Método | Rota | Descrição | Auth |
| --- | --- | --- | --- |
| `GET` | `/session/tokens/?user=<uuid>` | Emite `access_token` e `refresh_token` para o usuário informado e retorna os dados do usuário. | Não |
| `GET` | `/session/tokens/refresh/` | Renova o `access_token` usando o cookie `refresh_token`. | Cookie `refresh_token` |
| `POST` | `/session/logout/` | Remove os cookies de sessão. | Não |

### `GET /session/tokens/`

Query params:

- `user`: UUID do usuário.

Resposta `200`: dados do usuário e cookies `access_token`/`refresh_token` gravados na resposta.

### `GET /session/tokens/refresh/`

Resposta `200`:

```json
{ "message": "Token renovado com sucesso" }
```

### `POST /session/logout/`

Resposta `200`: encerra a sessão removendo os cookies.

## Sessão do usuário

| Método | Rota | Descrição | Permissões |
| --- | --- | --- | --- |
| `GET` | `/api/sessao/` | Retorna os dados do usuário autenticado pelo cookie `access_token`. | Token válido |

## Usuários

| Método | Rota | Descrição | Permissões |
| --- | --- | --- | --- |
| `POST` | `/api/usuarios/cadastrar/` | Cadastra usuário local vinculado a um grupo. | `add_usuario`, `view_group` |
| `GET` | `/api/usuarios/listar/perfil/<perfil>/` | Lista usuários filtrados por perfil. | `view_usuario`, `view_group` |
| `GET` | `/api/usuarios/listar/grupo/<grupo>/` | Lista usuários filtrados por grupo. | `view_usuario` |
| `GET` | `/api/usuarios/<usuario_id>/` | Retorna detalhes de um usuário. | `view_usuario`, `view_group` |
| `PUT` | `/api/usuarios/<usuario_id>/editar/` | Edita grupo/dados locais de um usuário. | `change_usuario`, `view_group` |

Payload de criação/edição, campos principais:

```json
{
  "id": "uuid-do-usuario",
  "group": "uuid-do-grupo"
}
```

Query params frequentes em listagens:

- `busca`: busca textual.
- `retorno`: campos de retorno.
- `cursor`: paginação incremental.

## Grupos

| Método | Rota | Descrição | Permissões |
| --- | --- | --- | --- |
| `POST` | `/api/grupos/cadastrar/` | Cria grupo e vincula permissões. | `add_group` |
| `GET` | `/api/grupos/listar/` | Lista grupos. | `view_group` |
| `GET` | `/api/grupos/<grupo_id>/` | Retorna detalhes de um grupo. | `view_group` |
| `PUT/PATCH` | `/api/grupos/<grupo_id>/editar/` | Edita nome e permissões do grupo. | `change_group` |

Payload principal:

```json
{
  "name": "Professor",
  "addPermissoes": [{ "id": "uuid-da-permissao" }],
  "remPermissoes": [{ "id": "uuid-da-permissao" }]
}
```

Query params:

- `param`: filtro textual na listagem.
- `retorno`: campos retornados pelo serializer.

## Permissões

| Método | Rota | Descrição | Permissões |
| --- | --- | --- | --- |
| `GET` | `/api/permissoes/listar/` | Lista permissões. | `view_permission` |
| `GET` | `/api/permissoes/listar/<grupo_id>/` | Lista permissões vinculadas ao grupo. | `view_permission` |
| `GET` | `/api/permissoes/listar/<grupo_id>/nao_vinculadas/` | Lista permissões ainda não vinculadas ao grupo. | `view_group`, `view_permission` |

Query params:

- `retorno`: campos de retorno.

## PPT

| Método | Rota | Descrição | Permissões |
| --- | --- | --- | --- |
| `POST` | `/api/ppts/cadastrar/` | Cadastra uma PPT. | `add_ppt` |
| `GET` | `/api/ppts/listar/` | Lista PPTs. | `view_ppt` |
| `GET` | `/api/ppts/listar/coordenador/` | Lista PPTs do coordenador autenticado. | `view_ppt` |
| `GET` | `/api/ppts/listar/aluno/` | Lista PPTs do aluno autenticado. | `view_ppt` |
| `GET` | `/api/ppts/listar/CRE/` | Lista PPTs para CRE. | `view_ppt` |
| `GET` | `/api/ppts/<ppt_id>/` | Retorna detalhes de uma PPT. | `view_ppt` |
| `PUT` | `/api/ppts/<ppt_id>/editar/status/` | Altera status, situação ou nota final da PPT. | `change_ppt` |

Payload principal de cadastro:

```json
{
  "aluno": "uuid-do-aluno",
  "professor_disciplina": "uuid-do-professor-da-disciplina",
  "professor_ppt": "uuid-do-professor-da-progressao",
  "disciplina": "uuid-da-disciplina",
  "curso": "uuid-do-curso",
  "turma_atual": "uuid-da-turma-atual",
  "turma_progressao": "uuid-da-turma-progressao"
}
```

Payload para alterar status:

```json
{
  "status": "Em andamento",
  "nota_final": 8.5
}
```

Query params frequentes:

- `busca`, `cursor`, `formato`, `retorno`, `params[]`.

## PED

| Método | Rota | Descrição | Permissões |
| --- | --- | --- | --- |
| `POST` | `/api/peds/<modalidade>/cadastrar/` | Cadastra PED na modalidade informada. | `add_pedintegrado`, `add_pedproeja` |
| `GET` | `/api/peds/<modalidade>/listar/` | Lista PEDs por modalidade. | `view_pedintegrado`, `view_pedproeja` |
| `GET` | `/api/peds/<modalidade>/listar/professor/` | Lista PEDs do professor autenticado. | `view_pedintegrado`, `view_pedproeja` |
| `GET` | `/api/peds/<modalidade>/listar/coordenador/` | Lista PEDs do coordenador autenticado. | `view_pedintegrado`, `view_pedproeja` |
| `GET` | `/api/peds/listar/aluno/` | Lista PEDs do aluno autenticado. | `view_pedintegrado`, `view_pedproeja` |
| `GET` | `/api/peds/<modalidade>/<ped_id>/` | Retorna detalhes de uma PED. | `view_pedintegrado`, `view_pedproeja` |
| `PUT/PATCH` | `/api/peds/<modalidade>/<ped_id>/editar/` | Edita uma PED. | `change_pedintegrado`, `change_pedproeja` |
| `PUT/PATCH` | `/api/peds/<modalidade>/<ped_id>/editar/status/` | Altera status da PED. | `change_pedintegrado`, `change_pedproeja` |

Campos comuns de PED:

```json
{
  "aluno": "uuid-do-aluno",
  "professor_disciplina": "uuid-do-professor-da-disciplina",
  "professor_ped": "uuid-do-professor-da-ped",
  "disciplina": "uuid-da-disciplina",
  "curso": "uuid-do-curso",
  "periodo_letivo": "uuid-do-periodo-letivo",
  "status": "Criada",
  "data_inicio": "2026-01-01T00:00:00Z",
  "data_final": "2026-03-01T00:00:00Z",
  "nota_final": null,
  "situacao": "Em avaliação",
  "observacao": "Texto opcional"
}
```

Campos específicos:

- Integrado: `trimestre_recuperar`, `serie_progressao`, `turma_atual`.
- ProEJA: `ano_semestre_reprov`.

Query params frequentes:

- `busca`, `cursor`, `formato`, `retorno`, `params[]`.

## Plano de estudos

| Método | Rota | Descrição | Permissões |
| --- | --- | --- | --- |
| `POST` | `/api/plano-estudos/<modalidade>/cadastrar/` | Cadastra plano de estudos para uma PED. | `add_planoestudosintegrado`, `add_planoestudosproeja` |
| `GET` | `/api/plano-estudos/<modalidade>/<plano_estudos_id>/` | Retorna detalhes e arquivo do plano. | `view_planoestudosintegrado`, `view_planoestudosproeja` |
| `PUT` | `/api/plano-estudos/<modalidade>/<plano_estudos_id>/editar/` | Edita plano de estudos. | `change_planoestudosintegrado`, `change_planoestudosproeja` |

Payload principal:

```json
{
  "ped": "uuid-da-ped",
  "campus": "Restinga",
  "forma_oferta": "Integrado",
  "turno": "Manhã",
  "parecer_pedagogico": "Texto do parecer",
  "drive_id": "id-do-arquivo-no-drive"
}
```

As respostas de criação/edição incluem `plano` com dados do arquivo gerado/recuperado.

## Atividades

| Método | Rota | Descrição | Permissões |
| --- | --- | --- | --- |
| `POST` | `/api/atividades/<modalidade>/cadastrar/` | Cadastra atividade. | `add_atividadeintegrado`, `add_atividadeproeja` |
| `GET` | `/api/atividades/<modalidade>/` | Lista atividades da modalidade. | `view_atividadeintegrado`, `view_atividadeproeja` |
| `GET` | `/api/atividades/<modalidade>/<atividade_id>/` | Retorna detalhes de uma atividade. | `view_atividadeintegrado`, `view_atividadeproeja` |
| `PUT` | `/api/atividades/<modalidade>/<atividade_id>/editar/` | Edita atividade. | `change_atividadeintegrado`, `change_atividadeproeja` |

Payload principal:

```json
{
  "titulo": "Lista de exercícios",
  "descricao": "Resolver as questões indicadas",
  "drive_id": "id-do-arquivo-no-drive"
}
```

A criação/edição pode receber arquivo via multipart, conforme uso do service de arquivos/Drive.

## Plano de atividades / avaliações

| Método | Rota | Descrição | Permissões |
| --- | --- | --- | --- |
| `POST` | `/api/plano-atividades/<modalidade>/salvar/<ped_id>/` | Salva o plano de atividades/avaliações de uma PED. | `add_avaliacaoproeja`, `add_avaliacaointegrado`, `change_avaliacaoproeja`, `change_avaliacaointegrado` |
| `GET` | `/api/plano-atividades/<modalidade>/<ped_id>/` | Lista avaliações vinculadas à PED. | `view_avaliacaoproeja`, `view_avaliacaointegrado` |

Payload principal:

```json
[
  {
    "atividade": "uuid-da-atividade",
    "data_entrega": "2026-02-01T00:00:00Z",
    "status": "Não Avaliada",
    "nota": null
  }
]
```

## Acompanhamentos

| Método | Rota | Descrição | Permissões |
| --- | --- | --- | --- |
| `POST` | `/api/acompanhamentos/<modalidade>/cadastrar/` | Cadastra acompanhamento/observação. | `add_acompanhamentointegrado`, `add_acompanhamentoproeja` |
| `GET` | `/api/acompanhamentos/<modalidade>/<ped_id>/listar/` | Lista acompanhamentos de uma PED. | `view_acompanhamentointegrado`, `view_acompanhamentoproeja` |
| `PUT` | `/api/acompanhamentos/<modalidade>/<acompanhamento_id>/editar/` | Edita acompanhamento. | `change_acompanhamentointegrado`, `change_acompanhamentoproeja` |

Payload principal:

```json
{
  "ped": "uuid-da-ped",
  "parecer": "Texto do acompanhamento",
  "status": "Informativo"
}
```

O backend define o autor com base no usuário autenticado.

## Formulário de encerramento

| Método | Rota | Descrição | Permissões |
| --- | --- | --- | --- |
| `POST` | `/api/form-encerramento/<modalidade>/cadastrar/<ped_id>/` | Cadastra formulário de encerramento. | `add_formencerramentointegrado`, `add_formencerramentoproeja` |
| `GET` | `/api/form-encerramento/<modalidade>/<form_encerramento_id>/` | Retorna detalhes e arquivo do formulário. | `view_formencerramentointegrado`, `view_formencerramentoproeja` |
| `PUT` | `/api/form-encerramento/<modalidade>/<form_encerramento_id>/editar/` | Edita formulário de encerramento. | `change_formencerramentointegrado`, `change_formencerramentoproeja` |

Payload principal:

```json
{
  "parecer_final": "Texto final",
  "drive_id": "id-do-arquivo-no-drive",
  "atividades": ["uuid-da-atividade"],
  "nota": 8.5
}
```

As respostas de criação/edição incluem `form` com dados do arquivo gerado/recuperado.

## Hub tools

Estas rotas encapsulam chamadas ao sistema base (`BASE_SYSTEM_URL`) usando a credencial `API_KEY` no cookie `system`.

| Método | Rota | Descrição | Query params repassados |
| --- | --- | --- | --- |
| `GET` | `/hub/usuarios/get/perfil/<perfil>/` | Busca usuários do sistema base por perfil. | `busca`, `ativo`, `retorno`, `pagina` |
| `GET` | `/hub/cursos/get/` | Lista cursos do sistema base. | `busca`, `categoria`, `retorno` |
| `GET` | `/hub/cursos/get/<curso_id>/curriculo/` | Lista disciplinas/currículo de um curso. | `busca`, `retorno` |
| `GET` | `/hub/calendarios/get/` | Lista calendários do sistema base. | `busca`, `status`, `retorno` |

## Observações de integração

- O frontend usa `REACT_APP_BASE_API_URL` para chamar o backend.
- O login redireciona para `REACT_APP_HUB_FRONTEND/session?system=<REACT_APP_SYSTEM_ID>`.
- Algumas rotas dependem de dados externos do sistema base/hub, como usuário, curso, disciplina, turma e calendário.
- Operações com plano de estudos, atividades e formulário de encerramento podem depender das credenciais do Google Drive configuradas em `backend/credentials/`.
