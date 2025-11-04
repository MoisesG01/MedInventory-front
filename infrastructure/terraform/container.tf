# Azure Container Registry para Frontend
resource "azurerm_container_registry" "frontend" {
  name                = "${replace(var.project_name, "-", "")}acrfront${var.environment}"
  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = merge(var.tags, {
    Component = "Frontend-ACR"
  })
}

# App Service Plan para Frontend
resource "azurerm_service_plan" "frontend" {
  name                = "${var.project_name}-frontend-asp-${var.environment}"
  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = var.app_service_sku

  tags = merge(var.tags, {
    Component = "Frontend-ServicePlan"
  })
}
