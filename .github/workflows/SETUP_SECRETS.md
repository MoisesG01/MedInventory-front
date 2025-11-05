# GitHub Actions - Configuração de Secrets# GitHub Actions - Configuração de Secrets



Este documento explica como configurar os secrets necessários para os workflows do GitHub Actions.Este documento explica como configurar os secrets necessários para os workflows do GitHub Actions.



## 🔐 Secret Necessário## Secrets Necessários



### AZURE_CREDENTIALS### 1. AZURE_CREDENTIALS



Credenciais do Azure Service Principal para autenticação.Credenciais do Azure Service Principal para autenticação.



#### Como criar:#### Como criar:



```bash```bash

# 1. Login no Azure# 1. Login no Azure

az loginaz login



# 2. Obter seu Subscription ID# 2. Obter seu Subscription ID

az account show --query id -o tsvaz account show --query id -o tsv



# 3. Criar o Service Principal (use // no Git Bash para evitar conversão de path)# 3. Criar o Service Principal

az ad sp create-for-rbac \az ad sp create-for-rbac \

  --name "medinventory-frontend-github" \  --name "medinventory-frontend-github" \

  --role contributor \  --role contributor \

  --scopes //subscriptions/{SUBSCRIPTION_ID}  --scopes /subscriptions/{SUBSCRIPTION_ID}/resourceGroups/medinventory-rg \

```  --sdk-auth

```

O comando acima retornará um JSON. Você precisa **converter** para o formato aceito pelo GitHub Actions.

O comando acima retornará um JSON. **Copie todo o JSON** e adicione como secret `AZURE_CREDENTIALS`.

#### Formato retornado:

```jsonExemplo do JSON:

{```json

  "appId": "b00aa8ed-4390-4c91-af8a-d6e365bc1376",{

  "displayName": "medinventory-frontend-github",  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",

  "password": "Eav8Q~qmXmdao0ayWTj7C46UwfTaM1u_YajN0aBo",  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",

  "tenant": "cf72e2bd-7a2b-4783-bdeb-39d57b07f76f"  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",

}  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",

```  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",

  "resourceManagerEndpointUrl": "https://management.azure.com/",

#### Formato necessário (converta manualmente):  "activeDirectoryGraphResourceId": "https://graph.windows.net/",

```json  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",

{  "galleryEndpointUrl": "https://gallery.azure.com/",

  "clientId": "b00aa8ed-4390-4c91-af8a-d6e365bc1376",  "managementEndpointUrl": "https://management.core.windows.net/"

  "clientSecret": "Eav8Q~qmXmdao0ayWTj7C46UwfTaM1u_YajN0aBo",}

  "subscriptionId": "aa625ef9-d257-43e2-91b3-b0755aeab146",```

  "tenantId": "cf72e2bd-7a2b-4783-bdeb-39d57b07f76f"

}### 2. SP_OBJECT_ID

```

Object ID do Service Principal criado acima.

**Mapeamento:**

- `appId` → `clientId`#### Como obter:

- `password` → `clientSecret`

- `tenant` → `tenantId````bash

- Adicione seu `subscriptionId` manualmente (obtenha com `az account show --query id -o tsv`)# Usando o clientId do JSON acima

az ad sp show --id {CLIENT_ID} --query id -o tsv

## 📝 Como Adicionar Secrets no GitHub```



1. Vá para o repositório no GitHubCopie o ID retornado e adicione como secret `SP_OBJECT_ID`.

2. Clique em **Settings**

3. No menu lateral, clique em **Secrets and variables** → **Actions**## Como Adicionar Secrets no GitHub

4. Clique em **New repository secret**

5. Nome: `AZURE_CREDENTIALS`1. Vá para o repositório no GitHub

6. Value: Cole o JSON **convertido** acima2. Clique em **Settings**

7. Clique em **Add secret**3. No menu lateral, clique em **Secrets and variables** → **Actions**

4. Clique em **New repository secret**

## ✅ Verificar Configuração5. Adicione o nome e valor do secret

6. Clique em **Add secret**

Após adicionar o secret:

### Secrets a adicionar:

1. Vá em **Settings** → **Secrets and variables** → **Actions**

2. Você deve ver `AZURE_CREDENTIALS` listado| Nome | Valor | Descrição |

3. O valor não será exibido por segurança (isso é normal)|------|-------|-----------|

| `AZURE_CREDENTIALS` | JSON completo do Service Principal | Credenciais Azure |

## 🚀 Executar Workflows| `SP_OBJECT_ID` | Object ID do Service Principal | ID para role assignments |



Após configurar o secret, você pode executar os workflows:## Verificar Configuração



### 1. Criar InfraestruturaApós adicionar os secrets, você pode verificar se estão configurados:

- Vá em **Actions** → **Terraform Create Frontend Infrastructure**

- Clique em **Run workflow**1. Vá em **Settings** → **Secrets and variables** → **Actions**

- Selecione o ambiente (dev/staging/prod)2. Você deve ver os secrets listados (valores não serão exibidos por segurança)

- Digite "CREATE" para confirmar

- Execute## Executar Workflows



### 2. Build e Push DockerApós configurar os secrets, você pode executar os workflows:

- Vá em **Actions** → **Docker Build and Push Frontend**

- Clique em **Run workflow**### 1. Criar Infraestrutura

- Selecione o ambiente e tag- Vá em **Actions** → **Terraform Create Frontend Infrastructure**

- Execute- Clique em **Run workflow**

- Selecione o ambiente (dev/staging/prod)

### 3. Iniciar Aplicação- Digite "CREATE" para confirmar

- Vá em **Actions** → **Terraform Start Frontend Application**- Execute

- Clique em **Run workflow**

- Selecione o ambiente### 2. Build e Push Docker

- Execute- Vá em **Actions** → **Docker Build and Push Frontend**

- Clique em **Run workflow**

## 🔍 Troubleshooting- Selecione o ambiente e tag

- Execute

### Erro: "Context access might be invalid: AZURE_CREDENTIALS"

### 3. Iniciar Aplicação

Isso é apenas um aviso do linter. Se o secret está configurado corretamente no GitHub, o workflow funcionará.- Vá em **Actions** → **Terraform Start Frontend Application**

- Clique em **Run workflow**

### Erro: "Login failed"- Selecione o ambiente

- Execute

Verifique se:

1. O JSON do `AZURE_CREDENTIALS` está no formato correto (com `clientId`, `clientSecret`, `subscriptionId`, `tenantId`)## Troubleshooting

2. O Service Principal tem permissões de `Contributor` na subscription

3. A subscription está ativa### Erro: "Context access might be invalid"



### Erro: "Resource Group not found"Isso é apenas um aviso do linter. Se os secrets estão configurados corretamente no GitHub, o workflow funcionará.



O Resource Group `medinventory-rg` deve existir antes. Ele é criado pela infraestrutura do backend. Certifique-se de que o backend foi deployado primeiro.### Erro: "Login failed"



### Erro: "AuthorizationFailed" ao criar role assignmentsVerifique se:

1. O JSON do `AZURE_CREDENTIALS` está completo e válido

Isso é normal em contas Azure for Students. A solução já foi implementada: usamos o **admin do ACR** em vez de Managed Identity com role assignments.2. O Service Principal tem permissões na subscription

3. A subscription está ativa

## 📚 Recursos

### Erro: "Resource Group not found"

- [Azure Service Principal](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals)

- [GitHub Secrets](https://docs.github.com/actions/security-guides/encrypted-secrets)O Resource Group deve existir antes. Ele é criado pela infraestrutura do backend. Certifique-se de que o backend foi deployado primeiro.

- [Azure Login Action](https://github.com/Azure/login)

## Recursos

---

- [Azure Service Principal](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals)

**Importante**: Nunca commite secrets ou credenciais no repositório!- [GitHub Secrets](https://docs.github.com/actions/security-guides/encrypted-secrets)

- [Azure Login Action](https://github.com/Azure/login)

---

**Importante**: Nunca commite secrets ou credenciais no repositório!
