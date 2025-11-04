# MedInventory Frontend - Terraform Infrastructure

Este diretório contém a infraestrutura como código (IaC) usando Terraform para o frontend do MedInventory na Azure.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Terraform](https://www.terraform.io/downloads) >= 1.0
- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/) >= 18
- [Yarn](https://yarnpkg.com/)

## Arquitetura da Infraestrutura

A infraestrutura do frontend inclui:

```
MedInventory Frontend Infrastructure
├── Resource Group (compartilhado com backend)
├── Container Registry (ACR) - Frontend
│   └── medinventory-frontend:latest
├── App Service Plan (Linux)
└── App Service (Frontend)
    ├── Managed Identity
    └── Role Assignments (AcrPull)
```

### Recursos Criados

1. **Azure Container Registry (ACR)**: Armazenamento privado para imagens Docker do frontend
2. **App Service Plan**: Plano de hospedagem para o App Service
3. **App Service**: Aplicação web React hospedada
4. **Storage Account**: Armazenamento para logs e dados
5. **Role Assignments**: Permissões para pull/push de imagens

## Início Rápido

### 1. Login no Azure

```bash
az login
```

### 2. Criar Infraestrutura

```bash
cd infrastructure/terraform
chmod +x create.sh
./create.sh dev
```

Isso irá:
- Inicializar o Terraform
- Validar a configuração
- Criar um plano de execução
- Solicitar confirmação
- Criar todos os recursos na Azure

### 3. Fazer Deploy da Aplicação

```bash
chmod +x deploy.sh
./deploy.sh dev
```

Isso irá:
- Instalar dependências
- Fazer build da aplicação React
- Construir imagem Docker
- Fazer push para o ACR
- Reiniciar o App Service

### 4. Iniciar/Reiniciar Aplicação

```bash
chmod +x start.sh
./start.sh dev
```

### 5. Destruir Infraestrutura

```bash
chmod +x destroy.sh
./destroy.sh dev
```

**ATENÇÃO**: Isso irá deletar TODOS os recursos! Não pode ser desfeito!

## Estrutura de Arquivos

```
infrastructure/terraform/
├── main.tf              # Configuração principal e provider
├── variables.tf         # Variáveis de entrada
├── container.tf         # ACR e Service Plan
├── app-service.tf       # App Service configuration
├── iam.tf              # Role assignments e permissões
├── outputs.tf          # Outputs importantes
├── .gitignore          # Arquivos ignorados pelo git
├── create.sh           # Script para criar infraestrutura
├── deploy.sh           # Script para deploy da aplicação
├── start.sh            # Script para iniciar/reiniciar
└── destroy.sh          # Script para destruir infraestrutura
```

## Configuração de Variáveis

### Variáveis Principais

Edite `variables.tf` ou passe via linha de comando:

```bash
terraform apply \
  -var="environment=prod" \
  -var="backend_api_url=https://api.medinventory.com" \
  -var="app_service_sku=P1V2"
```

### Variáveis Disponíveis

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `project_name` | Nome do projeto | `medinventory` |
| `resource_group_name` | Nome do Resource Group existente | `medinventory-rg` |
| `location` | Região Azure | `Mexico Central` |
| `environment` | Ambiente (dev/staging/prod) | `dev` |
| `app_service_sku` | SKU do App Service | `B1` |
| `backend_api_url` | URL da API backend | `""` |
| `sp_object_id` | Object ID do Service Principal | `""` |

## Ambientes

### Development (dev)
```bash
./create.sh dev
```
- SKU: B1 (Basic)
- Recursos mínimos
- Custos reduzidos

### Staging
```bash
./create.sh staging
```
- SKU: B2 ou superior
- Configuração intermediária

### Production (prod)
```bash
./create.sh prod
```
- SKU: P1V2 ou superior recomendado
- Alta disponibilidade
- Performance otimizada

## Segurança e Secrets

### Secrets Necessários (GitHub Actions)

Configure no GitHub: **Settings → Secrets and variables → Actions**

1. **AZURE_CREDENTIALS**: Credenciais do Service Principal
   ```bash
   az ad sp create-for-rbac --name "medinventory-frontend-github" \
     --role contributor \
     --scopes /subscriptions/{subscription-id}/resourceGroups/medinventory-rg \
     --sdk-auth
   ```

2. **SP_OBJECT_ID**: Object ID do Service Principal
   ```bash
   az ad sp show --id {app-id} --query id -o tsv
   ```

### Outputs Sensíveis

Para ver outputs sensíveis:

```bash
cd infrastructure/terraform

# ACR Admin Username
terraform output -raw frontend_container_registry_admin_username

# ACR Admin Password
terraform output -raw frontend_container_registry_admin_password
```

## GitHub Actions Workflows

### 1. Terraform Create Infrastructure
**Arquivo**: `.github/workflows/terraform-create.yml`

Cria toda a infraestrutura na Azure.

**Quando usar**:
- Primeira vez configurando o projeto
- Criar novo ambiente (dev/staging/prod)

**Como usar**:
1. Vá em **Actions** → **Terraform Create Frontend Infrastructure**
2. Clique em **Run workflow**
3. Selecione o ambiente
4. Digite "CREATE" para confirmar
5. Execute

### 2. Docker Build and Push
**Arquivo**: `.github/workflows/docker-build-push.yml`

Faz build e push da imagem Docker para o ACR.

**Triggers**:
- Push em `main` ou `develop`
- Pull Request
- Manual (workflow_dispatch)

**Como usar manualmente**:
1. Vá em **Actions** → **Docker Build and Push Frontend**
2. Clique em **Run workflow**
3. Selecione ambiente e tag
4. Execute

### 3. Terraform Start Application
**Arquivo**: `.github/workflows/terraform-start.yml`

Reinicia o App Service e verifica saúde.

**Como usar**:
1. Vá em **Actions** → **Terraform Start Frontend Application**
2. Clique em **Run workflow**
3. Selecione o ambiente
4. Execute

### 4. Terraform Destroy Infrastructure
**Arquivo**: `.github/workflows/terraform-destroy.yml`

Destrói toda a infraestrutura do frontend.

**Como usar**:
1. Vá em **Actions** → **Terraform Destroy Frontend Infrastructure**
2. Clique em **Run workflow**
3. Selecione o ambiente
4. Digite "DESTROY" para confirmar
5. Digite o nome do ambiente novamente
6. Execute

**CUIDADO**: Esta ação é irreversível!

## Comandos Úteis do Azure CLI

### Ver logs da aplicação
```bash
az webapp log tail \
  --name medinventory-frontend-app-dev \
  --resource-group medinventory-rg
```

### Ver configurações do App Service
```bash
az webapp config appsettings list \
  --name medinventory-frontend-app-dev \
  --resource-group medinventory-rg
```

### Atualizar variável de ambiente
```bash
az webapp config appsettings set \
  --name medinventory-frontend-app-dev \
  --resource-group medinventory-rg \
  --settings REACT_APP_API_URL="https://api.medinventory.com"
```

### Reiniciar App Service
```bash
az webapp restart \
  --name medinventory-frontend-app-dev \
  --resource-group medinventory-rg
```

### Listar imagens no ACR
```bash
az acr repository list \
  --name medinventoryacrfrontdev \
  --output table

az acr repository show-tags \
  --name medinventoryacrfrontdev \
  --repository medinventory-frontend \
  --output table
```

### Login no ACR localmente
```bash
az acr login --name medinventoryacrfrontdev
```

### Pull de imagem do ACR
```bash
docker pull medinventoryacrfrontdev.azurecr.io/medinventory-frontend:latest
```

## Troubleshooting

### Problema: Aplicação não inicia

**Solução 1**: Verificar logs
```bash
az webapp log tail --name medinventory-frontend-app-dev --resource-group medinventory-rg
```

**Solução 2**: Verificar se a imagem existe
```bash
az acr repository show-tags --name medinventoryacrfrontdev --repository medinventory-frontend
```

**Solução 3**: Reiniciar App Service
```bash
az webapp restart --name medinventory-frontend-app-dev --resource-group medinventory-rg
```

### Problema: Erro de permissão no ACR

**Solução**: Verificar role assignments
```bash
az role assignment list \
  --scope /subscriptions/{subscription-id}/resourceGroups/medinventory-rg/providers/Microsoft.ContainerRegistry/registries/medinventoryacrfrontdev
```

### Problema: Terraform state locked

**Solução**: Forçar unlock (use com cuidado!)
```bash
terraform force-unlock <LOCK_ID>
```

### Problema: Resource Group não encontrado

**Solução**: O Resource Group deve ser criado primeiro pela infraestrutura do backend. Verifique se ele existe:
```bash
az group show --name medinventory-rg
```

## Estimativa de Custos

### Environment: Development (dev)
- **App Service Plan B1**: ~$13/mês
- **Container Registry Basic**: ~$5/mês
- **Storage Account**: ~$1/mês
- **Total estimado**: ~$19/mês

### Environment: Production (prod)
- **App Service Plan P1V2**: ~$74/mês
- **Container Registry Basic**: ~$5/mês
- **Storage Account**: ~$2/mês
- **Total estimado**: ~$81/mês

*Valores aproximados para a região Mexico Central, sujeitos a alteração.*

## Recursos Adicionais

- [Documentação Terraform Azure](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure App Service](https://docs.microsoft.com/azure/app-service/)
- [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/)
- [Azure CLI Reference](https://docs.microsoft.com/cli/azure/)

## Suporte

Para problemas ou dúvidas:

1. Verifique os logs: `az webapp log tail`
2. Consulte a documentação acima
3. Abra uma issue no repositório
4. Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ pela equipe MedInventory**
