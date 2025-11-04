#!/bin/bash

# Script para criar a infraestrutura do Frontend do MedInventory na Azure
# Uso: ./create.sh [environment]

set -e

ENVIRONMENT=${1:-dev}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR"

echo "==========================================="
echo "  MedInventory Frontend Infrastructure"
echo "  Creating infrastructure for: $ENVIRONMENT"
echo "==========================================="
echo ""

# Verificar se o Terraform está instalado
if ! command -v terraform &> /dev/null; then
    echo "Terraform não está instalado. Instale o Terraform primeiro."
    echo "   https://www.terraform.io/downloads"
    exit 1
fi

# Verificar se o Azure CLI está instalado
if ! command -v az &> /dev/null; then
    echo "Azure CLI não está instalado. Instale o Azure CLI primeiro."
    echo "   https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

# Verificar se está logado no Azure
if ! az account show &> /dev/null; then
    echo "Fazendo login no Azure..."
    az login
fi

echo "Informações da conta Azure:"
az account show --query "{subscriptionId:id, tenantId:tenantId, name:name}" -o table
echo ""

# Navegar para o diretório do Terraform
cd "$TERRAFORM_DIR"

# Inicializar o Terraform
echo "📦 Inicializando Terraform..."
echo "   Backend: Azure Storage (medinventorystorage/tfstate/frontend_tfstate)"
terraform init
echo ""

# Validar a configuração
echo "Validando configuração..."
terraform validate
if [ $? -eq 0 ]; then
    echo "Configuração válida!"
else
    echo "Erro na validação da configuração!"
    exit 1
fi
echo ""

# Planejar a implantação
echo "Criando plano de execução..."
terraform plan -var="environment=$ENVIRONMENT" -out="tfplan"
echo ""

# Confirmar implantação
echo "ATENÇÃO: Isso criará recursos na Azure que podem gerar custos!"
echo ""
echo "Recursos que serão criados:"
echo "  • Container Registry (ACR) para imagens do frontend"
echo "  • App Service Plan (Linux)"
echo "  • App Service para hospedar o frontend"
echo "  • Storage Account para logs"
echo "  • Role assignments para permissões"
echo ""
echo "Deseja aplicar as mudanças? (y/N)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "Aplicando mudanças..."
    terraform apply "tfplan"
    
    echo ""
    echo "============================================"
    echo "  Infraestrutura criada com sucesso!"
    echo "============================================"
    echo ""
    echo "Informações importantes:"
    echo "  • URL do Frontend: $(terraform output -raw frontend_app_service_url)"
    echo "  • Registry ACR: $(terraform output -raw frontend_container_registry_login_server)"
    echo "  • App Service: $(terraform output -raw frontend_app_service_name)"
    echo ""
    echo "Para obter credenciais sensíveis, execute:"
    echo "  terraform output -raw frontend_container_registry_admin_username"
    echo "  terraform output -raw frontend_container_registry_admin_password"
    echo ""
    echo "Próximos passos:"
    echo "  1. Configure a variável REACT_APP_API_URL com a URL do backend"
    echo "  2. Execute './deploy.sh $ENVIRONMENT' para fazer deploy da aplicação"
    echo "  3. Ou use o GitHub Actions para CI/CD automatizado"
    echo ""
else
    echo "Implantação cancelada."
    rm -f tfplan
    exit 0
fi

rm -f tfplan
echo "Processo concluído!"
