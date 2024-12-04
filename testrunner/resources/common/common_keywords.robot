*** Settings ***
Library        SeleniumLibrary

*** Variables ***
${URL}    https://condabu.com

*** Keywords ***
Launch Application
    Open Browser    ${URL}    headlesschrome
    Maximize Browser Window  # Optional: To maximize the browser window
    Sleep    30s