# Outputs importantes para uso posterior
output "resource_group_name" {
  description = "Name of the resource group"
  value       = data.azurerm_resource_group.main.name
}

output "frontend_app_service_url" {
  description = "URL of the frontend application"
  value       = "https://${azurerm_linux_web_app.frontend.default_hostname}"
}

output "frontend_app_service_name" {
  description = "Name of the frontend App Service"
  value       = azurerm_linux_web_app.frontend.name
}

output "frontend_container_registry_login_server" {
  description = "Login server URL for the frontend container registry"
  value       = azurerm_container_registry.frontend.login_server
}

output "frontend_container_registry_name" {
  description = "Name of the frontend container registry"
  value       = azurerm_container_registry.frontend.name
}

output "frontend_container_registry_admin_username" {
  description = "Admin username for the frontend container registry"
  value       = azurerm_container_registry.frontend.admin_username
  sensitive   = true
}

output "frontend_container_registry_admin_password" {
  description = "Admin password for the frontend container registry"
  value       = azurerm_container_registry.frontend.admin_password
  sensitive   = true
}

output "frontend_app_service_identity_principal_id" {
  description = "Principal ID of the frontend App Service managed identity"
  value       = azurerm_linux_web_app.frontend.identity[0].principal_id
}

output "storage_account_name" {
  description = "Name of the shared storage account"
  value       = data.azurerm_storage_account.main.name
}
