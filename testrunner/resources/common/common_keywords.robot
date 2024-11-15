*** Settings ***
Library        SeleniumLibrary

*** Variables ***
${URL}    http://172.16.19.194:50002/iportalweb/iRetail@1

*** Keywords ***
Launch Application
    Open Browser    ${URL}    edge
    Maximize Browser Window  # Optional: To maximize the browser window
    Sleep    30s