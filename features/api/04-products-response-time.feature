

Feature: Response Time Validation for Products Endpoint

    Scenario: Response time exceeds acceptable limit
        Given the products endpoint with delay parameter is available
        When I send a GET request to products endpoint with delay 5000
        Then the response time should be greater than 2000 milliseconds

    Scenario: Response time is within acceptable limit
        Given the products endpoint with delay parameter is available
        When I send a GET request to products endpoint with delay 20
        Then the response time should be less than or equal to 2000 milliseconds