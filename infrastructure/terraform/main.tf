terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Usar o Resource Group existente do backend
data "azurerm_resource_group" "main" {
  name = var.resource_group_name
}

# Storage account para logs (opcional, mas bom ter)
resource "azurerm_storage_account" "frontend" {
  name                     = "${replace(var.project_name, "-", "")}frontstorage"
  resource_group_name      = data.azurerm_resource_group.main.name
  location                 = data.azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = var.tags
}
