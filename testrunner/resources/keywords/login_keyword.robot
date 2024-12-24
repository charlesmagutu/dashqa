*** Settings ***
Library        SeleniumLibrary

*** Keywords ***
Enter Username
    [Arguments]    ${username}
    Input Text    id=mat-input-0    ${username}
Enter Password
    [Arguments]    ${password}
    Input Text    id=mat-input-1    ${password}

Click Login Button
    Click Button    xpath=/html/body/app-root/app-main-layout/div[3]/ng-component/div/div/div/div/form/fieldset[1]/div[2]/div[3]/button/span
