Feature: Login

    Scenario: Display error for invalid login credentials
        Given I open the Paribu homepage for login
        When I dismiss the cookie banner on login page
        And I click the Login button
        And I enter an invalid mobile number and password
        And I click the Submit button
        Then I should see an error message saying "Girdiğiniz bilgileri kontrol"