Feature: Markets Page Buy Calculation

    Background:
        Given I navigate to the Paribu homepage

    Scenario: Calculate total price for FAN filtered crypto
        When I close the cookie notice
        And I go to the Markets page
        And I filter the list by FAN
        And I change the price change timeframe to 12 hours
        And I click the third cryptocurrency on the list
        And I input the current price into the Unit Price field
        And I input "5" into the Quantity field
        Then I should see the correct total price calculated