Feature: Market Orders

    Background:
        Given I navigate to the Paribu homepage
        And I close the cookie notice
        And I go to the Markets page

    Scenario: Verify buy and sell form data for randomly selected positive market gain assets
        When I sort the cryptocurrencies by descending market price
        And I select 3 random green (positive gain) cryptocurrencies
        And I open the selected cryptocurrencies in new tabs

        And I switch to the first crypto tab
        And I click a first buy order on the first tab and verify the price input
        And I verify that the Sell tab is active in the Buy-Sell form
        And I verify corresponding input fields
        And I click a first sell order on the first tab and verify the price input

        And I switch to the second crypto tab
        And I click a first buy order on the second tab and verify the price input
        And I verify that the Sell tab is active in the Buy-Sell form
        And I verify corresponding input fields
        And I click a randfirstom sell order on the second tab and verify the price input

        And I switch to the third crypto tab
        And I click a first buy order on the third tab and verify the price input
        And I verify that the Sell tab is active in the Buy-Sell form
        And I verify corresponding input fields
        And I click a first sell order on the third tab and verify the price input