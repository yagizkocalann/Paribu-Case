Feature: Login Service

  Background:
    Given the login endpoint is available

  Scenario Outline: Login with <type> credentials
    When I send a login request with username "<username>" and password "<password>"
    Then I should receive a <status> response
    Then if successful, I store the access token

    Examples:
      | type    | username  | password     | status |
      | valid   | emilys    | emilyspass   | 200    |
      | valid   | michaelw  | michaelwpass | 200    |
      | invalid | emilys    | wrongpass    | 400    |
      | invalid | wronguser | emilyspass   | 400    |