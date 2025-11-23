resource "google_dataproc_cluster" "flink_cluster" {
  name   = "clickstream-flink-cluster"
  region = var.region

  cluster_config {
    master_config {
      num_instances = 1
      machine_type  = "n1-standard-2"
      disk_config {
        boot_disk_size_gb = 30
      }
    }

    worker_config {
      num_instances = 2
      machine_type  = "n1-standard-2"
      disk_config {
        boot_disk_size_gb = 30
      }
    }

    software_config {
      image_version = "2.0-debian10"
      optional_components = ["FLINK"]
    }
  }
}

variable "region" {
  type = string
}
