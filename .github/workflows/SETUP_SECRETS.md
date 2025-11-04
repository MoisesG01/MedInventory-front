# GitHub Actions - Configuração de Secrets

Este documento explica como configurar os secrets necessários para os workflows do GitHub Actions.

## Secrets Necessários

### 1. AZURE_CREDENTIALS

Credenciais do Azure Service Principal para autenticação.

#### Como criar:

```bash
# 1. Login no Azure
az login

# 2. Obter seu Subscription ID
az account show --query id -o tsv

# 3. Criar o Service Principal
az ad sp create-for-rbac \
  --name "medinventory-frontend-github" \
  --role contributor \
  --scopes /subscriptions/{SUBSCRIPTION_ID}/resourceGroups/medinventory-rg \
  --sdk-auth
```

O comando acima retornará um JSON. **Copie todo o JSON** e adicione como secret `AZURE_CREDENTIALS`.

Exemplo do JSON:
```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

### 2. SP_OBJECT_ID

Object ID do Service Principal criado acima.

#### Como obter:

```bash
# Usando o clientId do JSON acima
az ad sp show --id {CLIENT_ID} --query id -o tsv
```

Copie o ID retornado e adicione como secret `SP_OBJECT_ID`.

## Como Adicionar Secrets no GitHub

1. Vá para o repositório no GitHub
2. Clique em **Settings**
3. No menu lateral, clique em **Secrets and variables** → **Actions**
4. Clique em **New repository secret**
5. Adicione o nome e valor do secret
6. Clique em **Add secret**

### Secrets a adicionar:

| Nome | Valor | Descrição |
|------|-------|-----------|
| `AZURE_CREDENTIALS` | JSON completo do Service Principal | Credenciais Azure |
| `SP_OBJECT_ID` | Object ID do Service Principal | ID para role assignments |

## Verificar Configuração

Após adicionar os secrets, você pode verificar se estão configurados:

1. Vá em **Settings** → **Secrets and variables** → **Actions**
2. Você deve ver os secrets listados (valores não serão exibidos por segurança)

## Executar Workflows

Após configurar os secrets, você pode executar os workflows:

### 1. Criar Infraestrutura
- Vá em **Actions** → **Terraform Create Frontend Infrastructure**
- Clique em **Run workflow**
- Selecione o ambiente (dev/staging/prod)
- Digite "CREATE" para confirmar
- Execute

### 2. Build e Push Docker
- Vá em **Actions** → **Docker Build and Push Frontend**
- Clique em **Run workflow**
- Selecione o ambiente e tag
- Execute

### 3. Iniciar Aplicação
- Vá em **Actions** → **Terraform Start Frontend Application**
- Clique em **Run workflow**
- Selecione o ambiente
- Execute

## Troubleshooting

### Erro: "Context access might be invalid"

Isso é apenas um aviso do linter. Se os secrets estão configurados corretamente no GitHub, o workflow funcionará.

### Erro: "Login failed"

Verifique se:
1. O JSON do `AZURE_CREDENTIALS` está completo e válido
2. O Service Principal tem permissões na subscription
3. A subscription está ativa

### Erro: "Resource Group not found"

O Resource Group deve existir antes. Ele é criado pela infraestrutura do backend. Certifique-se de que o backend foi deployado primeiro.

## Recursos

- [Azure Service Principal](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals)
- [GitHub Secrets](https://docs.github.com/actions/security-guides/encrypted-secrets)
- [Azure Login Action](https://github.com/Azure/login)

---

**Importante**: Nunca commite secrets ou credenciais no repositório!
