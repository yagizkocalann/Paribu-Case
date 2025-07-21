Feature: Update and Delete Product

    Scenario: Update and then delete a product
        Given the login endpoint is available
        When I send a login request with username "emilys" and password "emilyspass"
        Then the login response status should be 200
        And if successful, I store the access token

        Given the products modification endpoint is available
        When I fetch the first product
        And I update the name of the product to "Updated Product Name"
        Then I should receive a 200 response
        And the product name should be updated to "Updated Product Name"

        When I delete the updated product
        Then I should receive a 200 response
        And the delete response should match the deleted product