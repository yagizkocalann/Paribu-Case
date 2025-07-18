Feature: Get Products with Access Token

    Background:
        Given the login endpoint is available
        When I send a login request with username "emilys" and password "emilyspass"
        Then the login response status should be 200
        And if successful, I store the access token

    Scenario Outline: Retrieve products with valid access token and limit
        Given the products endpoint is available
        When I send a GET request to products endpoint with limit <limit>
        Then the products response status should be 200
        And the response should contain <limit> number of products

        Examples:
            | limit |
            | 5     |
            | 10    |
            | 20    |