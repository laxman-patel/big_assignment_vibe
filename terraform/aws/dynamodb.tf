resource "aws_dynamodb_table" "products" {
  name           = "ProductsTable"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "ProductId"

  attribute {
    name = "ProductId"
    type = "S"
  }

  tags = {
    Name = "clickstream-products"
  }
}

resource "aws_dynamodb_table" "product_stats" {
  name           = "ProductStats"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "ProductId"

  attribute {
    name = "ProductId"
    type = "S"
  }

  tags = {
    Name = "clickstream-product-stats"
  }
}
