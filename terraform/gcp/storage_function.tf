resource "google_storage_bucket" "uploads" {
  name          = "clickstream-student-uploads-${random_id.bucket_suffix.hex}"
  location      = "US"
  force_destroy = true
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

data "archive_file" "function_zip" {
  type        = "zip"
  source_file = "${path.module}/../../services/media-service/lambda_function.py"
  output_path = "${path.module}/function.zip"
}

resource "google_storage_bucket_object" "archive" {
  name   = "function.zip"
  bucket = google_storage_bucket.uploads.name
  source = data.archive_file.function_zip.output_path
}

resource "google_cloudfunctions_function" "function" {
  name        = "image-handler"
  description = "Image Handler Function"
  runtime     = "python39"

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.uploads.name
  source_archive_object = google_storage_bucket_object.archive.name
  trigger_http          = true
  entry_point           = "lambda_handler"
}

# IAM entry for all users to invoke the function
resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.function.project
  region         = google_cloudfunctions_function.function.region
  cloud_function = google_cloudfunctions_function.function.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}
