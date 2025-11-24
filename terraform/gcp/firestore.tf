resource "google_firestore_database" "database" {
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"
}

resource "google_firestore_document" "product" {
  database    = google_firestore_database.database.name
  collection  = "products"
  document_id = "sample-product"
  fields      = "{\"productId\":{\"stringValue\":\"123\"}}"
}
