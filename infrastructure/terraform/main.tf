terraform {
  backend "azurerm" {
    resource_group_name  = "medinventory-rg"
    storage_account_name = "medinventorystorage"
    container_name       = "tfstate"
    key                  = "frontend_tfstate"
  }
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

# Use existing Resource Group (created by backend infrastructure)
data "azurerm_resource_group" "main" {
  name = var.resource_group_name
}

# Use existing Storage Account (created by backend infrastructure)
data "azurerm_storage_account" "main" {
  name                = "${replace(var.project_name, "-", "")}storage"
  resource_group_name = data.azurerm_resource_group.main.name
}
