# Role assignment for the Frontend Web App to pull images from Frontend ACR
resource "azurerm_role_assignment" "frontend_acrpull_role" {
  scope                = azurerm_container_registry.frontend.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_linux_web_app.frontend.identity[0].principal_id
  depends_on = [
    azurerm_linux_web_app.frontend
  ]
}

# Role assignment for GitHub Actions Service Principal to push images to Frontend ACR
resource "azurerm_role_assignment" "github_actions_frontend_acrpush" {
  count                = var.sp_object_id != "" ? 1 : 0
  scope                = azurerm_container_registry.frontend.id
  role_definition_name = "AcrPush"
  principal_id         = var.sp_object_id
  depends_on = [
    azurerm_container_registry.frontend
  ]
}
