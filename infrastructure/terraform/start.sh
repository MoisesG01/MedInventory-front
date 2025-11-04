#!/bin/bash

# Script para iniciar/atualizar a aplicação frontend sem rebuild completo
# Uso: ./start.sh [environment]

set -e

ENVIRONMENT=${1:-dev}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR"

echo "==========================================="
echo "  MedInventory Frontend - Start/Update"
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
APP_SERVICE_NAME=$(terraform output -raw frontend_app_service_name)
APP_SERVICE_URL=$(terraform output -raw frontend_app_service_url)
ACR_LOGIN_SERVER=$(terraform output -raw frontend_container_registry_login_server)

echo "  • App Service: $APP_SERVICE_NAME"
echo "  • URL: $APP_SERVICE_URL"
echo ""

# Verificar se a imagem existe no ACR
echo "Verificando imagem no ACR..."
ACR_NAME=$(terraform output -raw frontend_container_registry_name)

if az acr repository show --name "$ACR_NAME" --repository medinventory-frontend &> /dev/null; then
    echo "Imagem encontrada no ACR"
    
    # Listar tags disponíveis
    echo ""
    echo "Tags disponíveis:"
    az acr repository show-tags --name "$ACR_NAME" --repository medinventory-frontend --output table
    echo ""
else
    echo "Nenhuma imagem encontrada no ACR."
    echo "   Execute './deploy.sh $ENVIRONMENT' para fazer o primeiro deploy."
    exit 1
fi

# Perguntar se deseja reiniciar
echo "Deseja reiniciar o App Service? (y/N)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "Reiniciando App Service..."
    az webapp restart --name "$APP_SERVICE_NAME" --resource-group "medinventory-rg"
    
    echo ""
    echo "Aguardando aplicação inicializar (30 segundos)..."
    sleep 30
    
    # Verificar status
    echo "Verificando status..."
    if curl -f -s -o /dev/null "$APP_SERVICE_URL"; then
        echo "Aplicação está online!"
    else
        echo "Aplicação pode estar inicializando..."
    fi
    
    echo ""
    echo "============================================"
    echo "    Aplicação reiniciada!"
    echo "============================================"
    echo ""
    echo "URL: $APP_SERVICE_URL"
    echo ""
    echo "Ver logs:"
    echo "   az webapp log tail --name $APP_SERVICE_NAME --resource-group medinventory-rg"
    echo ""
else
    echo ""
    echo "ℹInformações da aplicação:"
    echo "   • URL: $APP_SERVICE_URL"
    echo "   • Imagem: $ACR_LOGIN_SERVER/medinventory-frontend:latest"
    echo ""
    echo "Comandos úteis:"
    echo "   # Ver logs"
    echo "   az webapp log tail --name $APP_SERVICE_NAME --resource-group medinventory-rg"
    echo ""
    echo "   # Ver configurações"
    echo "   az webapp config appsettings list --name $APP_SERVICE_NAME --resource-group medinventory-rg"
    echo ""
    echo "   # Reiniciar manualmente"
    echo "   az webapp restart --name $APP_SERVICE_NAME --resource-group medinventory-rg"
    echo ""
fi
