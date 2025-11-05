# Role assignment for the Web App to pull images from ACR
# NOTE: These role assignments must be created/deleted manually or by someone with User Access Administrator role
# Azure Student accounts don't have permission to manage role assignments via Terraform
# 
# Manual commands to create (run after infrastructure is created):
# APP_PRINCIPAL_ID=$(az webapp identity show --name medinventory-frontend-app-dev --resource-group medinventory-rg --query principalId -o tsv)
# ACR_ID=$(az acr show --name medinventoryacrfrontdev --resource-group medinventory-rg --query id -o tsv)
# az role assignment create --assignee $APP_PRINCIPAL_ID --role AcrPull --scope $ACR_ID
# az role assignment create --assignee 83071f7f-b85a-4795-ab43-e4a39b3a8dab --role AcrPush --scope $ACR_ID
#
# resource "azurerm_role_assignment" "acrpull_role" {
#   scope                = azurerm_container_registry.frontend.id
#   role_definition_name = "AcrPull"
#   principal_id         = azurerm_linux_web_app.frontend.identity[0].principal_id
#   depends_on = [
#     azurerm_linux_web_app.frontend
#   ]
# }

# resource "azurerm_role_assignment" "github_actions_acrpush" {
#   count                = var.sp_object_id != "" ? 1 : 0
#   scope                = azurerm_container_registry.frontend.id
#   role_definition_name = "AcrPush"
#   principal_id         = var.sp_object_id
#   depends_on = [
#     azurerm_container_registry.frontend
#   ]
# }
