resource "google_pubsub_topic" "topic" {
  name = "clickstream-topic"
}

resource "google_pubsub_subscription" "subscription" {
  name  = "clickstream-subscription"
  topic = google_pubsub_topic.topic.name

  ack_deadline_seconds = 20
}
