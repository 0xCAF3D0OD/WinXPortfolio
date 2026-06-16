# Define required providers
terraform {
  # Ensure the use of a compatible Terraform version
  required_version = ">= 0.14.0"
  required_providers {
    # Define OpenStack terraform provider
    openstack = {
      source  = "terraform-provider-openstack/openstack"
      version = "~> 2.0.0"
    }
  }
}

# Configure the OpenStack Provider
provider "openstack" {
  auth_url    = "https://api.pub1.infomaniak.cloud/identity"
  region      = "dc3-a"
  user_name   = "PCU-XXXXXXX" # TODO: changeme
  tenant_name = "PCP-XXXXXXX" # TODO: changeme
  password    = "your_password" # TODO: changeme
}
