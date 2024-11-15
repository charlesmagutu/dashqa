*** Settings ***
Library    SeleniumLibrary
Library    ../../../utils/ReportListener.py

Resource    ../../../resources/common/common_keywords.robot
Resource    ../../../resources/Login/login_keyword.robot
*** Test Cases ***
Customer can use pesalini whether the Customer Coop Bank application with valid Username and Password
    [Tags]    Login    Smoke
    [Documentation]    This test case verifies that a user can log in with valid credentials.
    Launch Application
    Enter Username    CIRUNGU
    Enter Password    1234
    Click Login Button
    Page Should Contain    OTP Verification