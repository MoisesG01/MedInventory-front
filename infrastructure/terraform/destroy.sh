#!/bin/bash

# Script para destruir a infraestrutura do Frontend do MedInventory
# Uso: ./destroy.sh [environment]

set -e

ENVIRONMENT=${1:-dev}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR"

echo "==========================================="
echo "  MedInventory Frontend Infrastructure"
echo "  DESTROY - Environment: $ENVIRONMENT"
echo "==========================================="
echo ""

# Verificar se o Terraform está instalado
if ! command -v terraform &> /dev/null; then
    echo "Terraform não está instalado."
    exit 1
fi

# Verificar se a infraestrutura existe
cd "$TERRAFORM_DIR"
if [ ! -f "terraform.tfstate" ]; then
    echo "Infraestrutura não encontrada. Nada para destruir."
    exit 0
fi

# Verificar se está logado no Azure
if ! az account show &> /dev/null; then
    echo "Fazendo login no Azure..."
    az login
fi

echo "  ATENÇÃO  "
echo ""
echo "Esta ação irá destruir TODOS os recursos do frontend:"
echo ""
echo "  • Container Registry (ACR) - todas as imagens serão perdidas"
echo "  • App Service - aplicação será removida"
echo "  • App Service Plan"
echo "  • Storage Account"
echo "  • Role assignments"
echo ""
echo "  O Resource Group principal NÃO será removido (compartilhado com backend)"
echo ""
echo "============================================"
echo "  Esta ação NÃO PODE SER DESFEITA!"
echo "============================================"
echo ""
echo "Digite 'DESTROY' para confirmar a destruição:"
read -r response

if [[ "$response" != "DESTROY" ]]; then
    echo "Operação cancelada."
    exit 0
fi

echo ""
echo "Digite o nome do ambiente novamente para confirmar ($ENVIRONMENT):"
read -r env_confirm

if [[ "$env_confirm" != "$ENVIRONMENT" ]]; then
    echo "Confirmação de ambiente incorreta. Operação cancelada."
    exit 0
fi

echo ""
echo "Recursos que serão destruídos:"
terraform state list
echo ""

echo "Criando plano de destruição..."
terraform plan -destroy -var="environment=$ENVIRONMENT" -out="destroy.tfplan"
echo ""

echo "ÚLTIMA CHANCE! Deseja continuar? (yes/no)"
read -r final_confirm

if [[ "$final_confirm" != "yes" ]]; then
    echo "Operação cancelada."
    rm -f destroy.tfplan
    exit 0
fi

echo ""
echo "Destruindo infraestrutura..."
terraform apply "destroy.tfplan"

echo ""
echo "Limpando arquivos temporários..."
rm -f destroy.tfplan
rm -f terraform.tfstate*
rm -f tfplan
rm -rf .terraform/
rm -rf .terraform.lock.hcl

echo ""
echo "============================================"
echo "    Infraestrutura destruída com sucesso!"
echo "============================================"
echo ""
echo "Recursos removidos:"
echo "  ✓ Frontend Container Registry"
echo "  ✓ Frontend App Service"
echo "  ✓ Frontend Service Plan"
echo "  ✓ Frontend Storage Account"
echo "  ✓ Role Assignments"
echo ""
echo "Nota: O Resource Group principal foi mantido (usado pelo backend)"
echo ""
echo "Para recriar a infraestrutura, execute:"
echo "  ./create.sh $ENVIRONMENT"
echo ""
echo "Processo de destruição concluído!"
