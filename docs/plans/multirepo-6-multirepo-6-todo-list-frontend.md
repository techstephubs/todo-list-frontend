# Technical Plan: MULTIREPO-6

## Summary
Implementar autenticação ponta a ponta com tela de login no Angular e endpoint seguro de login no backend Python, incluindo validações de formulário, geração de JWT, persistência de sessão e controles de segurança (CORS e rate limiting).
Sub-task focus: MULTIREPO-6 -  Implementação de Tela de Login (Angular + Python)
Apply only changes needed for this sub-task. Avoid duplicating unrelated scope.
No prior sub-task dependency context.

## Complexity: high

## Estimated Hours: 14

## Steps

### 1. Implementar UI da tela de login no Angular
Substituir a tela inicial padrão do app por formulário de login centralizado com campos de usuário/e-mail e senha, toggle de visibilidade da senha, botão "Entrar" e link "Esqueci minha senha". Manter o botão desabilitado enquanto o formulário estiver inválido e refletir estado de carregamento no botão durante chamada da API.
Scoped to sub-task MULTIREPO-6:  Implementação de Tela de Login (Angular + Python).
Files: [Todo-list-frontend] src/app/app.component.html, [Todo-list-frontend] src/app/app.component.css, [Todo-list-frontend] src/app/app.component.ts

### 2. Consolidar escopo e contrato técnico de autenticação
Classificar a issue como feature full-stack (UI + API) e transformar requisitos em contrato técnico: payload `{ username, password }`, respostas de sucesso/erro, claims obrigatórias (`sub`, `iat`, `exp`), estratégia de persistência de sessão e redirecionamento para dashboard. Validar que não há evidência de composição i18n para as mensagens de login no catálogo fornecido, então as mensagens devem ser tratadas no fluxo de componente.
Scoped to sub-task MULTIREPO-6:  Implementação de Tela de Login (Angular + Python).
Files: [Todo-list-frontend] src/app/app.routes.ts, [todo-list-backend] app/api/v1/endpoints/auth.py, [todo-list-backend] app/schemas/auth.py, [Todo-list-frontend] package-lock.json, [todo-list-backend] app/api/deps.py

## Risks
- Ambiguidade de política de armazenamento do token (HttpOnly cookie vs LocalStorage) pode gerar retrabalho de integração frontend/backend.
- Rate limiting mal calibrado pode bloquear usuários legítimos ou não mitigar brute force adequadamente.
- Mudanças em segurança/JWT podem quebrar compatibilidade com testes existentes e rotas protegidas.
- Sem alinhamento de contratos de erro (401/500), o frontend pode exibir mensagens inconsistentes.

## Acceptance Criteria
- [ ] Tela de login exibe formulário centralizado com usuário/e-mail, senha com toggle, botão Entrar e link Esqueci minha senha.
- [ ] Botão Entrar permanece desabilitado enquanto campos obrigatórios não forem válidos e exibe loading durante requisição.
- [ ] Frontend mostra feedback claro para 401 (credenciais inválidas) e 500 (erro de servidor).
- [ ] Endpoint `POST /api/v1/auth/login` retorna 200 com JWT válido em sucesso e 401 para credenciais incorretas.
- [ ] JWT emitido contém claims `sub`, `iat` e `exp`, com expiração configurável.
- [ ] Senhas são validadas por hash seguro (bcrypt/argon2), nunca em texto plano.
- [ ] CORS permite apenas origens configuradas e login possui proteção contra brute force por rate limiting.
- [ ] Após login bem-sucedido, usuário é redirecionado para dashboard e sessão autenticada persiste após refresh quando token válido.