#!/bin/bash

# Script para fazer deploy da aplicação frontend após mudanças no código
# Uso: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-dev}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "==========================================="
echo "  MedInventory Frontend Deployment"
echo "  Environment: $ENVIRONMENT"
echo "==========================================="
echo ""

# Verificar se a infraestrutura existe
cd "$TERRAFORM_DIR"
if [ ! -f "terraform.tfstate" ]; then
    echo "Infraestrutura não encontrada. Execute './create.sh' primeiro."
    exit 1
fi

# Obter informações da infraestrutura
echo "Obtendo informações da infraestrutura..."
ACR_LOGIN_SERVER=$(terraform output -raw frontend_container_registry_login_server)
ACR_NAME=$(terraform output -raw frontend_container_registry_name)
ACR_USERNAME=$(terraform output -raw frontend_container_registry_admin_username)
ACR_PASSWORD=$(terraform output -raw frontend_container_registry_admin_password)
APP_SERVICE_NAME=$(terraform output -raw frontend_app_service_name)
APP_SERVICE_URL=$(terraform output -raw frontend_app_service_url)

echo "  • ACR: $ACR_LOGIN_SERVER"
echo "  • App Service: $APP_SERVICE_NAME"
echo ""

# Navegar para o diretório raiz do projeto
cd "$PROJECT_ROOT"

# Instalar dependências
echo "Instalando dependências..."
yarn install --frozen-lockfile
echo ""

# Build da aplicação
echo "Construindo aplicação..."
yarn build
echo "Build concluído!"
echo ""

# Construir imagem Docker
echo "Construindo imagem Docker..."
docker build -t "medinventory-frontend:$ENVIRONMENT" .
echo "Imagem criada!"
echo ""

# Marcar imagem para o ACR
echo "Marcando imagem para o ACR..."
docker tag "medinventory-frontend:$ENVIRONMENT" "$ACR_LOGIN_SERVER/medinventory-frontend:latest"
docker tag "medinventory-frontend:$ENVIRONMENT" "$ACR_LOGIN_SERVER/medinventory-frontend:$ENVIRONMENT"
echo ""

# Login no ACR
echo "Fazendo login no ACR..."
echo "$ACR_PASSWORD" | docker login "$ACR_LOGIN_SERVER" -u "$ACR_USERNAME" --password-stdin
echo "Login realizado!"
echo ""

# Enviar imagem para o ACR
echo "Enviando imagem para o ACR..."
docker push "$ACR_LOGIN_SERVER/medinventory-frontend:latest"
docker push "$ACR_LOGIN_SERVER/medinventory-frontend:$ENVIRONMENT"
echo "Imagem enviada!"
echo ""

# Reiniciar App Service
echo "Reiniciando App Service..."
az webapp restart --name "$APP_SERVICE_NAME" --resource-group "medinventory-rg"
echo ""

# Aguardar aplicação inicializar
echo "Aguardando aplicação inicializar (30 segundos)..."
sleep 30

# Verificar se a aplicação está funcionando
echo "Verificando status da aplicação..."
for i in {1..5}; do
    if curl -f -s -o /dev/null "$APP_SERVICE_URL"; then
        echo "Aplicação está funcionando!"
        echo ""
        echo "============================================"
        echo "    Deploy concluído com sucesso!"
        echo "============================================"
        echo ""
        echo "Acesse sua aplicação:"
        echo "   $APP_SERVICE_URL"
        echo ""
        echo "Ver logs:"
        echo "   az webapp log tail --name $APP_SERVICE_NAME --resource-group medinventory-rg"
        echo ""
        exit 0
    else
        if [ $i -eq 5 ]; then
            echo "Aplicação pode estar inicializando ainda."
            echo ""
            echo "Verifique os logs:"
            echo "   az webapp log tail --name $APP_SERVICE_NAME --resource-group medinventory-rg"
            echo ""
            echo "Ou acesse: $APP_SERVICE_URL"
        else
            echo "  Tentativa $i/5 - aguardando mais 20 segundos..."
            sleep 20
        fi
    fi
done

echo ""
echo "Deploy finalizado!"
