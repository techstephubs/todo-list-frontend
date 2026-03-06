# Criar repositório no GitHub (techstephubs/todo-list-frontend)

O repositório remoto ainda não existe. Siga estes passos:

## 1. Criar o repositório no GitHub

1. Acesse **https://github.com/organizations/techstephubs/repositories/new** (ou **https://github.com/new** se for na sua conta).
2. **Repository name:** `todo-list-frontend`
3. **Description (opcional):** Frontend Angular - Todo List
4. Escolha **Public** ou **Private**.
5. **Não** marque "Add a README file", "Add .gitignore" nem "Choose a license" (o projeto já tem esses arquivos).
6. Clique em **Create repository**.

## 2. Enviar as branches main e develop

No terminal, na pasta do projeto:

```bash
command git push -u origin main
command git push -u origin develop
```

(Use `command git` se no seu ambiente o `git` estiver com alias que quebra o commit.)

## 3. (Opcional) Definir develop como branch padrão

Se quiser que **develop** seja a branch padrão no GitHub:

1. No repositório: **Settings** → **General** → **Default branch**.
2. Troque de `main` para `develop` e salve.

Depois disso, o projeto estará sincronizado com **main** e **develop** no techstephubs/todo-list-frontend.
