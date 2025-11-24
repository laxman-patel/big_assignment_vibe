resource "google_sql_database_instance" "main" {
  name             = "clickstream-db-instance"
  database_version = "POSTGRES_13"
  region           = var.region

  settings {
    tier = "db-f1-micro"
  }

  deletion_protection  = "false"
}

resource "google_sql_database" "database" {
  name     = "clickstream"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "users" {
  name     = "postgres"
  instance = google_sql_database_instance.main.name
  password = "postgres_password_123"
}
