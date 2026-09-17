package com.examly.springapp.dto;

public class LoginResponse {

    private String token;
    private String tokenType = "Bearer";
    private String username;

    public LoginResponse() {
    }

    public LoginResponse(String token) {
        this.token = token;
    }

    public LoginResponse(String token, String username) {
        this.token = token;
        this.username = username;
    }

    public LoginResponse(String token, String tokenType, String username) {
        this.token = token;
        this.tokenType = tokenType;
        this.username = username;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
