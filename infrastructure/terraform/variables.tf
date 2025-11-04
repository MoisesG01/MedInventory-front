variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "medinventory"
}

variable "resource_group_name" {
  description = "Name of the existing resource group (from backend infrastructure)"
  type        = string
  default     = "medinventory-rg"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "Mexico Central"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "app_service_sku" {
  description = "App Service SKU for frontend"
  type        = string
  default     = "B1"  # Basic tier
}

variable "backend_api_url" {
  description = "URL of the backend API"
  type        = string
  default     = ""  # Will be set during deployment
}

variable "sp_object_id" {
  description = "Object ID of the GitHub Actions Service Principal (for ACR push permissions)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default = {
    Project     = "MedInventory"
    Component   = "Frontend"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }
}
