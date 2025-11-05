# Linux Web App para Frontend
resource "azurerm_linux_web_app" "frontend" {
  name                = "${var.project_name}-frontend-app-${var.environment}"
  resource_group_name = data.azurerm_resource_group.main.name
  location            = azurerm_service_plan.frontend.location
  service_plan_id     = azurerm_service_plan.frontend.id

  site_config {
    always_on = var.app_service_sku != "F1" # Free tier doesn't support always_on
    
    application_stack {
      docker_image_name   = "${azurerm_container_registry.frontend.login_server}/${var.project_name}-frontend:latest"
      docker_registry_url = "https://${azurerm_container_registry.frontend.login_server}"
    }

    # CORS configuration for API communication
    cors {
      allowed_origins = [
        "https://${var.project_name}-app-${var.environment}.azurewebsites.net",
        "http://localhost:3000"
      ]
      support_credentials = true
    }
  }

  app_settings = {
    # Backend API URL (será configurado depois que o backend estiver rodando)
    REACT_APP_API_URL = var.backend_api_url != "" ? var.backend_api_url : "https://${var.project_name}-app-${var.environment}.azurewebsites.net"
    
    # Application configuration
    NODE_ENV = var.environment
    PORT     = "3000"
    
    # ACR credentials (using admin account)
    DOCKER_REGISTRY_SERVER_URL      = "https://${azurerm_container_registry.frontend.login_server}"
    DOCKER_REGISTRY_SERVER_USERNAME = azurerm_container_registry.frontend.admin_username
    DOCKER_REGISTRY_SERVER_PASSWORD = azurerm_container_registry.frontend.admin_password
    DOCKER_ENABLE_CI                = "true"
    
    # Enable logging
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = "false"
    WEBSITES_CONTAINER_START_TIME_LIMIT = "1800"
    
    # Disable ARR Affinity for better performance
    WEBSITES_PORT = "3000"
  }

  logs {
    detailed_error_messages = true
    failed_request_tracing  = true
    
    application_logs {
      file_system_level = "Information"
    }
    
    http_logs {
      file_system {
        retention_in_days = 7
        retention_in_mb   = 35
      }
    }
  }

  tags = merge(var.tags, {
    Component = "Frontend-WebApp"
  })
}
