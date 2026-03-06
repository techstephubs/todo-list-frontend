#!/bin/bash
# Instruções do GitHub - primeiro push
# Execute no terminal: cd /Users/fernandogoulart/project/todo-list-frontend && bash setup-repo.sh

set -e
cd "$(dirname "$0")"

echo "# todo-list-frontend" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/techstephubs/todo-list-frontend.git
git push -u origin main

echo ""
echo "Repositório enviado. Para criar a branch develop:"
echo "  git checkout -b develop"
echo "  git push -u origin develop"
